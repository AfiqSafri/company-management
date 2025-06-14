<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetDisposal extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'justifikasi_pelupusan',
        'kaedah_pelupusan',
        'tarikh_permohonan',
        'tarikh_pelupusan',
        'nama_syarikat_pelupus',
        'harga_jualan',
        'resit_jualan',
        'gambar_aset',
        'kelulusan_jawatankuasa',
        'tarikh_kelulusan',
        'catatan',
        'status',
        'requested_by',
        'approved_by'
    ];

    protected $casts = [
        'tarikh_permohonan' => 'date',
        'tarikh_pelupusan' => 'date',
        'tarikh_kelulusan' => 'date',
        'harga_jualan' => 'decimal:2',
        'kelulusan_jawatankuasa' => 'boolean'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function requestedBy()
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // 10 Justifikasi Pelupusan options
    public static function getJustifikasiOptions()
    {
        return [
            'rosak_tidak_boleh_dibaiki' => 'Rosak & tidak boleh dibaiki',
            'kos_pembaikan_tinggi' => 'Kos pembaikan terlalu tinggi',
            'teknologi_lapuk' => 'Teknologi lapuk',
            'tidak_diperlukan' => 'Tidak diperlukan lagi',
            'keselamatan' => 'Isu keselamatan',
            'tidak_ekonomik' => 'Tidak ekonomik untuk diselenggara',
            'ganti_dengan_baru' => 'Diganti dengan yang baru',
            'rosak_akibat_bencana' => 'Rosak akibat bencana alam',
            'habis_tempoh_guna' => 'Habis tempoh penggunaan',
            'lain_lain' => 'Lain-lain'
        ];
    }

    // Kaedah Pelupusan options
    public static function getKaedahPelupusanOptions()
    {
        return [
            'jual' => 'Jual',
            'derma' => 'Derma',
            'musnah' => 'Musnah',
            'tukar_beli' => 'Tukar Beli'
        ];
    }
}
