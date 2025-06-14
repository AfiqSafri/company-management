<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $query = Asset::with(['mosque', 'creator'])
            ->where('mosque_id', auth()->user()->mosque_id);

        // Apply filters
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('asset_code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $assets = $query->paginate(15);

        return response()->json($assets);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'type' => 'required|in:movable,immovable',
            'classification' => 'required|in:harta_modal,inventori',
            'acquisition_date' => 'required|date',
            'acquisition_cost' => 'required|numeric|min:0',
            'condition' => 'required|string',
            'location' => 'required|string',
            'responsible_person' => 'required|string',
            'supplier' => 'nullable|string',
            'warranty_expiry' => 'nullable|date',
            'serial_number' => 'nullable|string',
            'model' => 'nullable|string',
            'brand' => 'nullable|string',
            'specifications' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['mosque_id'] = auth()->user()->mosque_id;
        $data['created_by'] = auth()->id();
        $data['current_value'] = $data['acquisition_cost'];
        $data['status'] = 'active';
        
        // Generate asset code
        $data['asset_code'] = Asset::generateAssetCode(
            $data['mosque_id'], 
            $data['category']
        );

        $asset = Asset::create($data);

        // Generate QR Code
        $qrCode = QrCode::format('png')->size(200)->generate(
            route('assets.show', $asset->id)
        );
        $qrPath = "qr-codes/{$asset->asset_code}.png";
        Storage::disk('public')->put($qrPath, $qrCode);
        $asset->update(['qr_code' => $qrPath]);

        return response()->json([
            'message' => 'Asset created successfully',
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
            'disposals'
        ])->findOrFail($id);

        // Check if user has access to this asset
        if ($asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($asset);
    }

    public function update(Request $request, $id)
    {
        $asset = Asset::findOrFail($id);

        // Check if user has access to this asset
        if ($asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'sometimes|required|string',
            'condition' => 'sometimes|required|string',
            'location' => 'sometimes|required|string',
            'responsible_person' => 'sometimes|required|string',
            'current_value' => 'sometimes|required|numeric|min:0',
            'specifications' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['updated_by'] = auth()->id();

        $asset->update($data);

        return response()->json([
            'message' => 'Asset updated successfully',
            'asset' => $asset->load(['mosque', 'creator'])
        ]);
    }

    public function destroy($id)
    {
        $asset = Asset::findOrFail($id);

        // Check if user has access to this asset
        if ($asset->mosque_id !== auth()->user()->mosque_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $asset->delete();

        return response()->json(['message' => 'Asset deleted successfully']);
    }

    public function moveAsset(Request $request, $id)
    {
        $asset = Asset::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'from_location' => 'required|string',
            'to_location' => 'required|string',
            'reason' => 'required|string',
            'moved_by' => 'required|string',
            'move_date' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create movement record
        AssetMovement::create([
            'asset_id' => $asset->id,
            'from_location' => $request->from_location,
            'to_location' => $request->to_location,
            'reason' => $request->reason,
            'moved_by' => $request->moved_by,
            'move_date' => $request->move_date,
            'created_by' => auth()->id()
        ]);

        // Update asset location
        $asset->update(['location' => $request->to_location]);

        return response()->json(['message' => 'Asset moved successfully']);
    }

    public function uploadImage(Request $request, $id)
    {
        $asset = Asset::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($asset->image_path) {
                Storage::disk('public')->delete($asset->image_path);
            }

            $imagePath = $request->file('image')->store('assets', 'public');
            $asset->update(['image_path' => $imagePath]);

            return response()->json([
                'message' => 'Image uploaded successfully',
                'image_url' => Storage::url($imagePath)
            ]);
        }

        return response()->json(['message' => 'No image uploaded'], 400);
    }

    public function generateQRCode($id)
    {
        $asset = Asset::findOrFail($id);

        if (!$asset->qr_code) {
            $qrCode = QrCode::format('png')->size(200)->generate(
                route('assets.show', $asset->id)
            );
            $qrPath = "qr-codes/{$asset->asset_code}.png";
            Storage::disk('public')->put($qrPath, $qrCode);
            $asset->update(['qr_code' => $qrPath]);
        }

        return response()->json([
            'qr_code_url' => Storage::url($asset->qr_code)
        ]);
    }

    public function getByCategory($category)
    {
        $assets = Asset::where('mosque_id', auth()->user()->mosque_id)
            ->where('category', $category)
            ->where('status', 'active')
            ->get();

        return response()->json($assets);
    }
}
