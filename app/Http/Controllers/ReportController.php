<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetDisposal;
use App\Models\AssetLoss;
use App\Models\MaintenanceRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function dashboard()
    {
        $mosqueId = auth()->user()->mosque_id;

        $totalAssets = Asset::where('mosque_id', $mosqueId)->count();
        $totalValue = Asset::where('mosque_id', $mosqueId)->sum('current_value');
        $activeAssets = Asset::where('mosque_id', $mosqueId)->where('status', 'active')->count();
        
        $maintenanceRequired = MaintenanceRecord::whereHas('asset', function($q) use ($mosqueId) {
            $q->where('mosque_id', $mosqueId);
        })->where('status', 'scheduled')->count();
        
        $disposalPending = AssetDisposal::whereHas('asset', function($q) use ($mosqueId) {
            $q->where('mosque_id', $mosqueId);
        })->where('status', 'pending')->count();
        
        $lossReported = AssetLoss::whereHas('asset', function($q) use ($mosqueId) {
            $q->where('mosque_id', $mosqueId);
        })->whereIn('status', ['reported', 'investigating'])->count();

        $assetsByCategory = Asset::where('mosque_id', $mosqueId)
            ->select('category', DB::raw('count(*) as count'), DB::raw('sum(current_value) as value'))
            ->groupBy('category')
            ->get();

        $upcomingMaintenance = MaintenanceRecord::with('asset')
            ->whereHas('asset', function($q) use ($mosqueId) {
                $q->where('mosque_id', $mosqueId);
            })
            ->where('status', 'scheduled')
            ->where('scheduled_date', '>=', now())
            ->orderBy('scheduled_date')
            ->limit(5)
            ->get();

        $recentActivities = collect([
            // Recent asset additions
            ...Asset::where('mosque_id', $mosqueId)
                ->latest()
                ->limit(3)
                ->get()
                ->map(function($asset) {
                    return [
                        'id' => $asset->id,
                        'type' => 'Asset Added',
                        'description' => "New asset registered: {$asset->name}",
                        'date' => $asset->created_at->format('Y-m-d'),
                        'user' => $asset->creator->name ?? 'System'
                    ];
                }),
            
            // Recent losses
            ...AssetLoss::with(['asset', 'reportedBy'])
                ->whereHas('asset', function($q) use ($mosqueId) {
                    $q->where('mosque_id', $mosqueId);
                })
                ->latest()
                ->limit(2)
                ->get()
                ->map(function($loss) {
                    return [
                        'id' => $loss->id,
                        'type' => 'Loss Reported',
                        'description' => "Asset loss reported: {$loss->asset->name}",
                        'date' => $loss->created_at->format('Y-m-d'),
                        'user' => $loss->reportedBy->name ?? 'System'
                    ];
                })
        ])->sortByDesc('date')->take(5)->values();

        return response()->json([
            'totalAssets' => $totalAssets,
            'totalValue' => $totalValue,
            'activeAssets' => $activeAssets,
            'maintenanceRequired' => $maintenanceRequired,
            'disposalPending' => $disposalPending,
            'lossReported' => $lossReported,
            'assetsByCategory' => $assetsByCategory,
            'upcomingMaintenance' => $upcomingMaintenance,
            'recentActivities' => $recentActivities
        ]);
    }

    public function assetSummary(Request $request)
    {
        $mosqueId = auth()->user()->mosque_id;
        $year = $request->get('year', date('Y'));

        $summary = Asset::where('mosque_id', $mosqueId)
            ->whereYear('created_at', $year)
            ->select(
                'category',
                DB::raw('count(*) as count'),
                DB::raw('sum(current_value) as value'),
                DB::raw('(sum(current_value) * 100.0 / (select sum(current_value) from assets where mosque_id = ' . $mosqueId . ' and year(created_at) = ' . $year . ')) as percentage')
            )
            ->groupBy('category')
            ->get();

        return response()->json($summary);
    }
}
