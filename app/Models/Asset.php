<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nombor_siri_pendaftaran',
        'keterangan_aset',
        'cara_aset_diperoleh',
        'tarikh_pembelian',
        'harga_pembelian',
        'penempatan',
        'status_aset',
        'jenis_aset', // HM (Harta Modal ≥RM2000) / I (Inventori RM100-RM1999)
        'tahun_pembelian',
        'pegawai_penempatan',
        'jenama_model',
        'no_siri_pembekal',
        'tempoh_jaminan',
        'kategori',
        'dokumen_sokongan', // Path to supporting documents
        'mosque_id',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'tarikh_pembelian' => 'date',
        'harga_pembelian' => 'decimal:2',
        'tahun_pembelian' => 'integer'
    ];

    public function mosque()
    {
        return $this->belongsTo(Mosque::class);
    }

    public function maintenanceRecords()
    {
        return $this->hasMany(MaintenanceRecord::class);
    }

    public function movements()
    {
        return $this->hasMany(AssetMovement::class);
    }

    public function disposals()
    {
        return $this->hasMany(AssetDisposal::class);
    }

    public function losses()
    {
        return $this->hasMany(AssetLoss::class);
    }

    public function inspections()
    {
        return $this->hasMany(AssetInspection::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Generate Nombor Siri Pendaftaran: [Kod Masjid]/[Jenis Aset]/[Tahun]/[No. Urutan]
    public static function generateNomborSiriPendaftaran($mosqueId, $jenisAset, $tahun = null)
    {
        $mosque = Mosque::find($mosqueId);
        $kodMasjid = strtoupper(substr(str_replace(' ', '', $mosque->name), 0, 4));
        $tahun = $tahun ?? date('y');
        
        $lastAsset = self::where('mosque_id', $mosqueId)
            ->where('jenis_aset', $jenisAset)
            ->where('tahun_pembelian', '20' . $tahun)
            ->orderBy('nombor_siri_pendaftaran', 'desc')
            ->first();
            
        $sequence = 1;
        if ($lastAsset) {
            $parts = explode('/', $lastAsset->nombor_siri_pendaftaran);
            if (count($parts) >= 4) {
                $sequence = (int) end($parts) + 1;
            }
        }
        
        return sprintf('%s/%s/%s/%02d', $kodMasjid, $jenisAset, $tahun, $sequence);
    }

    // Determine asset type based on updated price thresholds
    public static function determineJenisAset($harga)
    {
        if ($harga >= 2000) {
            return 'HM'; // Harta Modal
        } elseif ($harga >= 100) {
            return 'I'; // Inventori
        } else {
            return null; // Below minimum threshold
        }
    }

    // Get cara aset diperoleh options
    public static function getCaraAsetDiperolehOptions()
    {
        return [
            'Pembelian' => 'Pembelian',
            'Sumbangan' => 'Sumbangan', 
            'Wakaf' => 'Wakaf',
            'Hibah' => 'Hibah'
        ];
    }

    // Get status aset options
    public static function getStatusAsetOptions()
    {
        return [
            'Aktif' => 'Aktif',
            'Pelupusan' => 'Pelupusan',
            'Hapus Kira' => 'Hapus Kira'
        ];
    }
}
