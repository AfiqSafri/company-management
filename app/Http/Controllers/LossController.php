<?php

namespace App\Http\Controllers;

use App\Models\AssetLoss;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LossController extends Controller
{
    public function index(Request $request)
    {
        $query = AssetLoss::with(['asset', 'reportedBy', 'investigatedBy'])
            ->whereHas('asset', function($q) {
                $q->where('mosque_id', auth()->user()->mosque_id);
            });

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('loss_type')) {
            $query->where('loss_type', $request->loss_type);
        }

        $losses = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($losses);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'asset_id' => 'required|exists:assets,id',
            'quantity_lost' => 'required|integer|min:1',
            'loss_type' => 'required|in:theft,damage,natural_disaster,accident,missing,other',
            'loss_date' => 'required|date',
            'discovered_date' => 'required|date',
            'location_of_loss' => 'required|string',
            'circumstances' => 'required|string',
            'estimated_loss_value' => 'required|numeric|min:0',
            'police_report_number' => 'nullable|string',
            'police_report_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $asset = Asset::findOrFail($request->asset_id);
        
        if ($asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($request->quantity_lost > $asset->quantity) {
            return response()->json([
                'message' => 'Quantity lost cannot exceed available quantity'
            ], 422);
        }

        $data = $validator->validated();
        $data['reported_by'] = auth()->id();
        $data['status'] = 'reported';

        $loss = AssetLoss::create($data);

        // Update asset quantity and status
        $newQuantity = $asset->quantity - $loss->quantity_lost;
        
        if ($newQuantity <= 0) {
            $asset->update([
                'quantity' => 0,
                'status' => 'lost'
            ]);
        } else {
            $asset->update(['quantity' => $newQuantity]);
        }

        return response()->json([
            'message' => 'Loss reported successfully',
            'loss' => $loss->load(['asset', 'reportedBy'])
        ], 201);
    }

    public function show($id)
    {
        $loss = AssetLoss::with(['asset', 'reportedBy', 'investigatedBy'])
            ->findOrFail($id);

        if ($loss->asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($loss);
    }

    public function investigate(Request $request, $id)
    {
        $loss = AssetLoss::findOrFail($id);

        if ($loss->asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $loss->update([
            'status' => 'investigating',
            'investigated_by' => auth()->id(),
            'investigation_notes' => $request->investigation_notes
        ]);

        return response()->json([
            'message' => 'Investigation started',
            'loss' => $loss->load(['asset', 'reportedBy', 'investigatedBy'])
        ]);
    }

    public function resolve(Request $request, $id)
    {
        $loss = AssetLoss::findOrFail($id);

        if ($loss->asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'resolution_notes' => 'required|string',
            'insurance_claim_number' => 'nullable|string',
            'insurance_payout' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $loss->update([
            'status' => 'resolved',
            'investigation_notes' => $loss->investigation_notes . "\n\nResolution: " . $request->resolution_notes,
            'insurance_claim_number' => $request->insurance_claim_number,
            'insurance_payout' => $request->insurance_payout ?? 0,
        ]);

        return response()->json([
            'message' => 'Loss case resolved',
            'loss' => $loss->load(['asset', 'reportedBy', 'investigatedBy'])
        ]);
    }
}
