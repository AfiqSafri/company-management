<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetLoss extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'kuantiti_hilang',
        'tarikh_hilang',
        'tarikh_ditemui_hilang',
        'lokasi_hilang',
        'keadaan_kehilangan',
        'laporan_polis',
        'no_laporan_polis',
        'tarikh_laporan_polis',
        'nilai_kerugian',
        'tindakan_diambil',
        'kelulusan_jawatankuasa',
        'tarikh_kelulusan',
        'status',
        'reported_by'
    ];

    protected $casts = [
        'tarikh_hilang' => 'date',
        'tarikh_ditemui_hilang' => 'date',
        'tarikh_laporan_polis' => 'date',
        'tarikh_kelulusan' => 'date',
        'nilai_kerugian' => 'decimal:2',
        'kuantiti_hilang' => 'integer',
        'laporan_polis' => 'boolean',
        'kelulusan_jawatankuasa' => 'boolean'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function reportedBy()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
}
