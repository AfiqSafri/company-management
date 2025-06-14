<?php

namespace App\Http\Controllers;

use App\Models\AssetDisposal;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DisposalController extends Controller
{
    public function index(Request $request)
    {
        $query = AssetDisposal::with(['asset', 'requestedBy', 'approvedBy'])
            ->whereHas('asset', function($q) {
                $q->where('mosque_id', auth()->user()->mosque_id);
            });

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $disposals = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($disposals);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'asset_id' => 'required|exists:assets,id',
            'quantity_disposed' => 'required|integer|min:1',
            'disposal_reason' => 'required|string',
            'disposal_method' => 'required|string',
            'justification' => 'required|string',
            'estimated_value' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $asset = Asset::findOrFail($request->asset_id);
        
        if ($asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($request->quantity_disposed > $asset->quantity) {
            return response()->json([
                'message' => 'Quantity disposed cannot exceed available quantity'
            ], 422);
        }

        $data = $validator->validated();
        $data['requested_by'] = auth()->id();
        $data['status'] = 'pending';

        $disposal = AssetDisposal::create($data);

        return response()->json([
            'message' => 'Disposal request submitted successfully',
            'disposal' => $disposal->load(['asset', 'requestedBy'])
        ], 201);
    }

    public function show($id)
    {
        $disposal = AssetDisposal::with(['asset', 'requestedBy', 'approvedBy'])
            ->findOrFail($id);

        if ($disposal->asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($disposal);
    }

    public function approve(Request $request, $id)
    {
        $disposal = AssetDisposal::findOrFail($id);

        if ($disposal->asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $disposal->update([
            'status' => 'approved',
            'approved_by' => auth()->id(),
            'approval_date' => now(),
            'approval_notes' => $request->approval_notes
        ]);

        // Update asset quantity
        $asset = $disposal->asset;
        $newQuantity = $asset->quantity - $disposal->quantity_disposed;
        
        if ($newQuantity <= 0) {
            $asset->update([
                'quantity' => 0,
                'status' => 'disposed'
            ]);
        } else {
            $asset->update(['quantity' => $newQuantity]);
        }

        return response()->json([
            'message' => 'Disposal approved successfully',
            'disposal' => $disposal->load(['asset', 'requestedBy', 'approvedBy'])
        ]);
    }

    public function reject(Request $request, $id)
    {
        $disposal = AssetDisposal::findOrFail($id);

        if ($disposal->asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $disposal->update([
            'status' => 'rejected',
            'approved_by' => auth()->id(),
            'approval_date' => now(),
            'approval_notes' => $request->approval_notes
        ]);

        return response()->json([
            'message' => 'Disposal rejected',
            'disposal' => $disposal->load(['asset', 'requestedBy', 'approvedBy'])
        ]);
    }
}
