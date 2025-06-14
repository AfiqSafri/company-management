<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssetInspection extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'tarikh_pemeriksaan',
        'lokasi_mengikut_rekod',
        'lokasi_semasa_pemeriksaan',
        'status_fizikal', // A, B, C, D, E
        'catatan_keadaan',
        'tindakan_diperlukan',
        'pemeriksa', // Bendahari
        'tandatangan_pemeriksa',
        'created_by'
    ];

    protected $casts = [
        'tarikh_pemeriksaan' => 'date'
    ];

    public function asset()
    {
        return $this->belongsTo(Asset::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // Status Fizikal definitions from Page 19
    public static function getStatusFizikal()
    {
        return [
            'A' => 'Baik',
            'B' => 'Memuaskan', 
            'C' => 'Sederhana',
            'D' => 'Teruk',
            'E' => 'Hilang'
        ];
    }
}
