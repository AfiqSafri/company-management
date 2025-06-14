<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImmovableAsset extends Model
{
    use HasFactory;

    protected $fillable = [
        'mosque_id',
        'no_hak_milik',
        'jenis_bangunan',
        'keluasan_meter_persegi',
        'keluasan_kaki_persegi',
        'alamat_penuh',
        'tarikh_pemilikan',
        'cara_diperoleh', // Pembelian, Wakaf, Hibah
        'nilai_tanah',
        'nilai_bangunan',
        'dokumen_geran',
        'lokasi_simpanan_dokumen',
        'catatan',
        'created_by'
    ];

    protected $casts = [
        'tarikh_pemilikan' => 'date',
        'keluasan_meter_persegi' => 'decimal:2',
        'keluasan_kaki_persegi' => 'decimal:2',
        'nilai_tanah' => 'decimal:2',
        'nilai_bangunan' => 'decimal:2'
    ];

    public function mosque()
    {
        return $this->belongsTo(Mosque::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
