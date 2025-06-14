<?php

namespace App\Http\Controllers;

use App\Models\AssetInspection;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AssetInspectionController extends Controller
{
    public function index(Request $request)
    {
        $query = AssetInspection::with(['asset'])
            ->whereHas('asset', function($q) {
                $q->where('mosque_id', auth()->user()->mosque_id);
            });

        if ($request->has('tahun')) {
            $query->whereYear('tarikh_pemeriksaan', $request->tahun);
        }

        $inspections = $query->orderBy('tarikh_pemeriksaan', 'desc')->paginate(15);

        return response()->json($inspections);
    }

    // BR-AMS 005: Borang Pemeriksaan Aset (Annual audit by Bendahari)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'asset_id' => 'required|exists:assets,id',
            'tarikh_pemeriksaan' => 'required|date',
            'lokasi_semasa_pemeriksaan' => 'required|string',
            'status_fizikal' => 'required|in:A,B,C,D,E',
            'catatan_keadaan' => 'nullable|string',
            'tindakan_diperlukan' => 'nullable|string',
            'pemeriksa' => 'required|string' // Bendahari name
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $asset = Asset::findOrFail($request->asset_id);
        
        if ($asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Tidak dibenarkan'], 403);
        }

        $data = $validator->validated();
        $data['lokasi_mengikut_rekod'] = $asset->penempatan;
        $data['created_by'] = auth()->id();

        $inspection = AssetInspection::create($data);

        // Update asset location if different
        if ($data['lokasi_semasa_pemeriksaan'] !== $asset->penempatan) {
            $asset->update(['penempatan' => $data['lokasi_semasa_pemeriksaan']]);
        }

        // Update asset status if missing (E)
        if ($data['status_fizikal'] === 'E') {
            $asset->update(['status_aset' => 'Hapus Kira']);
        }

        return response()->json([
            'message' => 'Pemeriksaan aset berjaya direkodkan',
            'inspection' => $inspection->load('asset')
        ], 201);
    }

    public function show($id)
    {
        $inspection = AssetInspection::with('asset')->findOrFail($id);

        if ($inspection->asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Tidak dibenarkan'], 403);
        }

        return response()->json($inspection);
    }

    // Get inspection summary by status
    public function getInspectionSummary(Request $request)
    {
        $year = $request->get('tahun', date('Y'));
        
        $summary = AssetInspection::whereHas('asset', function($q) {
                $q->where('mosque_id', auth()->user()->mosque_id);
            })
            ->whereYear('tarikh_pemeriksaan', $year)
            ->selectRaw('status_fizikal, count(*) as jumlah')
            ->groupBy('status_fizikal')
            ->get();

        $statusLabels = AssetInspection::getStatusFizikal();
        
        $formattedSummary = $summary->map(function($item) use ($statusLabels) {
            return [
                'status' => $item->status_fizikal,
                'label' => $statusLabels[$item->status_fizikal],
                'jumlah' => $item->jumlah
            ];
        });

        return response()->json([
            'tahun' => $year,
            'summary' => $formattedSummary,
            'status_definitions' => $statusLabels
        ]);
    }
}
