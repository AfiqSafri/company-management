<?php

namespace App\Http\Controllers;

use App\Models\AssetMovement;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AssetMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = AssetMovement::with(['asset'])
            ->whereHas('asset', function($q) {
                $q->where('mosque_id', auth()->user()->mosque_id);
            });

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $movements = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($movements);
    }

    // BR-AMS 004: Borang Pinjaman/Pergerakan Aset
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'asset_id' => 'required|exists:assets,id',
            'nama_pemohon' => 'required|string',
            'jawatan' => 'required|string',
            'tujuan' => 'required|string',
            'tarikh_pinjam' => 'required|date',
            'lokasi_tujuan' => 'required|string',
            'catatan' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $asset = Asset::findOrFail($request->asset_id);
        
        if ($asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Tidak dibenarkan'], 403);
        }

        $data = $validator->validated();
        $data['lokasi_asal'] = $asset->penempatan;
        $data['created_by'] = auth()->id();
        $data['status'] = 'dipinjam';

        $movement = AssetMovement::create($data);

        // Update asset location temporarily
        $asset->update(['penempatan' => $data['lokasi_tujuan']]);

        return response()->json([
            'message' => 'Borang pinjaman aset berjaya direkodkan',
            'movement' => $movement->load('asset')
        ], 201);
    }

    // Return borrowed asset
    public function returnAsset(Request $request, $id)
    {
        $movement = AssetMovement::findOrFail($id);

        if ($movement->asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Tidak dibenarkan'], 403);
        }

        $movement->update([
            'tarikh_pulang' => now(),
            'status' => 'dipulang',
            'catatan' => $movement->catatan . "\nDipulangkan pada: " . now()->format('d/m/Y H:i')
        ]);

        // Return asset to original location
        $movement->asset->update(['penempatan' => $movement->lokasi_asal]);

        return response()->json([
            'message' => 'Aset berjaya dipulangkan',
            'movement' => $movement->load('asset')
        ]);
    }

    public function show($id)
    {
        $movement = AssetMovement::with('asset')->findOrFail($id);

        if ($movement->asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Tidak dibenarkan'], 403);
        }

        return response()->json($movement);
    }
}
