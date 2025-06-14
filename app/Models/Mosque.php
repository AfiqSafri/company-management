<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mosque extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'address',
        'postcode',
        'city',
        'state',
        'phone',
        'email',
        'registration_number',
        'waqf_registration',
        'committee_chairman',
        'controlling_officer',
        'asset_officer',
        'assistant_asset_officer',
        'established_date',
        'land_area',
        'building_area',
        'is_active',
    ];

    protected $casts = [
        'established_date' => 'date',
        'land_area' => 'decimal:2',
        'building_area' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function assets()
    {
        return $this->hasMany(Asset::class);
    }
}
