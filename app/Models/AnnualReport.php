<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnualReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'mosque_id',
        'tahun_laporan',
        'jumlah_harta_modal_kuantiti',
        'jumlah_harta_modal_nilai',
        'jumlah_inventori_kuantiti', 
        'jumlah_inventori_nilai',
        'jumlah_pelupusan_kuantiti',
        'jumlah_pelupusan_nilai',
        'jumlah_hapus_kira_kuantiti',
        'jumlah_hapus_kira_nilai',
        'jumlah_keseluruhan_kuantiti',
        'jumlah_keseluruhan_nilai',
        'tarikh_laporan',
        'disediakan_oleh',
        'disemak_oleh',
        'status'
    ];

    protected $casts = [
        'tarikh_laporan' => 'date',
        'jumlah_harta_modal_nilai' => 'decimal:2',
        'jumlah_inventori_nilai' => 'decimal:2',
        'jumlah_pelupusan_nilai' => 'decimal:2',
        'jumlah_hapus_kira_nilai' => 'decimal:2',
        'jumlah_keseluruhan_nilai' => 'decimal:2'
    ];

    public function mosque()
    {
        return $this->belongsTo(Mosque::class);
    }

    public function preparedBy()
    {
        return $this->belongsTo(User::class, 'disediakan_oleh');
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'disemak_oleh');
    }

    // Calculate totals: JUMLAH ASET = (Harta Modal + Inventori) - Pelupusan - Hapus Kira
    public function calculateTotals()
    {
        $this->jumlah_keseluruhan_kuantiti = 
            $this->jumlah_harta_modal_kuantiti + 
            $this->jumlah_inventori_kuantiti - 
            $this->jumlah_pelupusan_kuantiti - 
            $this->jumlah_hapus_kira_kuantiti;

        $this->jumlah_keseluruhan_nilai = 
            $this->jumlah_harta_modal_nilai + 
            $this->jumlah_inventori_nilai - 
            $this->jumlah_pelupusan_nilai - 
            $this->jumlah_hapus_kira_nilai;
    }
}
