<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetMovement extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'nama_pemohon',
        'jawatan',
        'tujuan',
        'tarikh_pinjam',
        'tarikh_pulang',
        'lokasi_asal',
        'lokasi_tujuan',
        'tandatangan_peminjam',
        'tandatangan_penyerah',
        'catatan',
        'status', // dipinjam, dipulang, lewat
        'created_by'
    ];

    protected $casts = [
        'tarikh_pinjam' => 'date',
        'tarikh_pulang' => 'date'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
