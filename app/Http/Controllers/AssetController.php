<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $query = Asset::with(['mosque', 'creator'])
            ->where('mosque_id', auth()->user()->mosque_id);

        // Filter by jenis aset (HM or I)
        if ($request->has('jenis_aset')) {
            $query->where('jenis_aset', $request->jenis_aset);
        }

        // Filter by status
        if ($request->has('status_aset')) {
            $query->where('status_aset', $request->status_aset);
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('keterangan_aset', 'like', "%{$search}%")
                  ->orWhere('nombor_siri_pendaftaran', 'like', "%{$search}%")
                  ->orWhere('penempatan', 'like', "%{$search}%");
            });
        }

        $assets = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($assets);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'keterangan_aset' => 'required|string',
            'cara_aset_diperoleh' => 'required|in:Pembelian,Sumbangan,Wakaf,Hibah',
            'tarikh_pembelian' => 'required|date',
            'harga_pembelian' => 'required|numeric|min:100', // Minimum RM100 for inventori
            'penempatan' => 'required|string',
            'pegawai_penempatan' => 'required|string',
            'kategori' => 'required|string',
            'jenama_model' => 'nullable|string',
            'no_siri_pembekal' => 'nullable|string',
            'tempoh_jaminan' => 'nullable|string',
            'dokumen_sokongan' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['mosque_id'] = auth()->user()->mosque_id;
        $data['created_by'] = auth()->id();
        $data['tahun_pembelian'] = date('Y', strtotime($data['tarikh_pembelian']));
        
        // Determine jenis aset based on updated price thresholds
        $data['jenis_aset'] = Asset::determineJenisAset($data['harga_pembelian']);
        
        if (!$data['jenis_aset']) {
            return response()->json(['error' => 'Harga aset terlalu rendah. Minimum RM100 untuk inventori.'], 422);
        }
        
        // Generate Nombor Siri Pendaftaran
        $data['nombor_siri_pendaftaran'] = Asset::generateNomborSiriPendaftaran(
            $data['mosque_id'], 
            $data['jenis_aset'],
            date('y', strtotime($data['tarikh_pembelian']))
        );

        // Handle document upload
        if ($request->hasFile('dokumen_sokongan')) {
            $dokumenPath = $request->file('dokumen_sokongan')->store('dokumen-sokongan', 'public');
            $data['dokumen_sokongan'] = $dokumenPath;
        }

        $asset = Asset::create($data);

        return response()->json([
            'message' => 'Aset berjaya didaftarkan',
            'asset' => $asset->load(['mosque', 'creator'])
        ], 201);
    }

    public function show($id)
    {
        $asset = Asset::with([
            'mosque', 
            'creator', 
            'maintenanceRecords', 
            'movements', 
            'disposals',
            'losses',
            'inspections'
        ])->findOrFail($id);

        if ($asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Tidak dibenarkan'], 403);
        }

        return response()->json($asset);
    }

    public function update(Request $request, $id)
    {
        $asset = Asset::findOrFail($id);

        if ($asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Tidak dibenarkan'], 403);
        }

        $validator = Validator::make($request->all(), [
            'keterangan_aset' => 'sometimes|required|string',
            'penempatan' => 'sometimes|required|string',
            'pegawai_penempatan' => 'sometimes|required|string',
            'status_aset' => 'sometimes|required|in:Aktif,Pelupusan,Hapus Kira',
            'jenama_model' => 'nullable|string',
            'tempoh_jaminan' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['updated_by'] = auth()->id();

        $asset->update($data);

        return response()->json([
            'message' => 'Aset berjaya dikemaskini',
            'asset' => $asset->load(['mosque', 'creator'])
        ]);
    }

    // Get assets by location (BR-AMS 003)
    public function getByLocation(Request $request)
    {
        $assets = Asset::where('mosque_id', auth()->user()->mosque_id)
            ->select('nombor_siri_pendaftaran', 'keterangan_aset', 'jenis_aset', 'tahun_pembelian', 'penempatan', 'pegawai_penempatan')
            ->orderBy('penempatan')
            ->orderBy('jenis_aset')
            ->get()
            ->groupBy('penempatan');

        return response()->json([
            'title' => 'BR-AMS 003: Senarai Aset Alih Mengikut Lokasi',
            'data' => $assets
        ]);
    }

    // Generate BR-AMS 001 report (Harta Modal ≥RM2,000)
    public function generateBRAMS001()
    {
        $assets = Asset::where('mosque_id', auth()->user()->mosque_id)
            ->where('jenis_aset', 'HM')
            ->where('status_aset', 'Aktif')
            ->orderBy('nombor_siri_pendaftaran')
            ->get();

        return response()->json([
            'title' => 'BR-AMS 001: Senarai Daftar Harta Modal',
            'description' => 'Untuk aset alih bernilai ≥RM2,000',
            'assets' => $assets,
            'total_kuantiti' => $assets->count(),
            'total_nilai' => $assets->sum('harga_pembelian')
        ]);
    }

    // Generate BR-AMS 002 report (Inventori RM100-RM1,999)
    public function generateBRAMS002()
    {
        $assets = Asset::where('mosque_id', auth()->user()->mosque_id)
            ->where('jenis_aset', 'I')
            ->where('status_aset', 'Aktif')
            ->orderBy('nombor_siri_pendaftaran')
            ->get();

        return response()->json([
            'title' => 'BR-AMS 002: Senarai Daftar Inventori',
            'description' => 'Untuk aset alih bernilai RM100–RM1,999',
            'assets' => $assets,
            'total_kuantiti' => $assets->count(),
            'total_nilai' => $assets->sum('harga_pembelian')
        ]);
    }
}
