<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_id',
        'tarikh',
        'butiran_kerja',
        'jenis_penyelenggaraan', // Pencegahan, Pembaikan, Kecemasan
        'kos',
        'syarikat_vendor',
        'nama_juruteknik',
        'catatan',
        'tarikh_seterusnya',
        'created_by'
    ];

    protected $casts = [
        'tarikh' => 'date',
        'tarikh_seterusnya' => 'date',
        'kos' => 'decimal:2'
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
