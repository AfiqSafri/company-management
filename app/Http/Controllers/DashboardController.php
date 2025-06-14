<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetInspection;
use App\Models\MaintenanceRecord;
use App\Models\AssetMovement;
use App\Models\AssetDisposal;
use App\Models\AssetLoss;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function getStats()
    {
        $mosqueId = auth()->user()->mosque_id;

        // Basic asset counts
        $totalAset = Asset::where('mosque_id', $mosqueId)->count();
        $totalHartaModal = Asset::where('mosque_id', $mosqueId)->where('jenis_aset', 'HM')->count();
        $totalInventori = Asset::where('mosque_id', $mosqueId)->where('jenis_aset', 'I')->count();
        $totalNilaiAset = Asset::where('mosque_id', $mosqueId)->sum('harga_pembelian');

        // Status counts
        $asetAktif = Asset::where('mosque_id', $mosqueId)->where('status_aset', 'Aktif')->count();
        $asetPelupusan = Asset::where('mosque_id', $mosqueId)->where('status_aset', 'Pelupusan')->count();
        $asetHapusKira = Asset::where('mosque_id', $mosqueId)->where('status_aset', 'Hapus Kira')->count();

        // Pending actions
        $currentYear = date('Y');
        $pemeriksaanTertunggak = Asset::where('mosque_id', $mosqueId)
            ->where('status_aset', 'Aktif')
            ->whereDoesntHave('inspections', function($query) use ($currentYear) {
                $query->whereYear('tarikh_pemeriksaan', $currentYear);
            })
            ->count();

        $penyelenggaraanTertunggak = MaintenanceRecord::whereHas('asset', function($query) use ($mosqueId) {
                $query->where('mosque_id', $mosqueId);
            })
            ->where('tarikh_seterusnya', '<=', Carbon::now())
            ->where('status', '!=', 'completed')
            ->count();

        return response()->json([
            'total_aset' => $totalAset,
            'total_harta_modal' => $totalHartaModal,
            'total_inventori' => $totalInventori,
            'total_nilai_aset' => $totalNilaiAset,
            'aset_aktif' => $asetAktif,
            'aset_pelupusan' => $asetPelupusan,
            'aset_hapus_kira' => $asetHapusKira,
            'pemeriksaan_tertunggak' => $pemeriksaanTertunggak,
            'penyelenggaraan_tertunggak' => $penyelenggaraanTertunggak
        ]);
    }

    public function getRecentActivities()
    {
        $mosqueId = auth()->user()->mosque_id;
        $activities = [];

        // Recent asset registrations
        $recentAssets = Asset::where('mosque_id', $mosqueId)
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->with('creator')
            ->latest()
            ->take(5)
            ->get();

        foreach ($recentAssets as $asset) {
            $activities[] = [
                'id' => 'asset_' . $asset->id,
                'type' => 'asset_created',
                'description' => "Aset baharu didaftarkan: {$asset->keterangan_aset}",
                'date' => $asset->created_at,
                'user' => $asset->creator->name ?? 'Sistem'
            ];
        }

        // Recent asset movements
        $recentMovements = AssetMovement::whereHas('asset', function($query) use ($mosqueId) {
                $query->where('mosque_id', $mosqueId);
            })
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->with(['asset', 'creator'])
            ->latest()
            ->take(3)
            ->get();

        foreach ($recentMovements as $movement) {
            $activities[] = [
                'id' => 'movement_' . $movement->id,
                'type' => 'asset_moved',
                'description' => "Aset dipinjam: {$movement->asset->keterangan_aset} oleh {$movement->nama_pemohon}",
                'date' => $movement->created_at,
                'user' => $movement->creator->name ?? 'Sistem'
            ];
        }

        // Recent inspections
        $recentInspections = AssetInspection::whereHas('asset', function($query) use ($mosqueId) {
                $query->where('mosque_id', $mosqueId);
            })
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->with(['asset', 'creator'])
            ->latest()
            ->take(3)
            ->get();

        foreach ($recentInspections as $inspection) {
            $activities[] = [
                'id' => 'inspection_' . $inspection->id,
                'type' => 'inspection',
                'description' => "Pemeriksaan aset: {$inspection->asset->keterangan_aset} - Status {$inspection->status_fizikal}",
                'date' => $inspection->created_at,
                'user' => $inspection->pemeriksa
            ];
        }

        // Sort by date and limit
        usort($activities, function($a, $b) {
            return $b['date'] <=> $a['date'];
        });

        return response()->json(array_slice($activities, 0, 10));
    }
}
