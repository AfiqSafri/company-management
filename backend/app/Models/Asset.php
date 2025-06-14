<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Asset extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'asset_code',
        'name',
        'description',
        'category',
        'type', // 'movable' or 'immovable'
        'classification', // 'harta_modal' or 'inventori'
        'acquisition_date',
        'acquisition_cost',
        'current_value',
        'condition',
        'location',
        'responsible_person',
        'supplier',
        'warranty_expiry',
        'serial_number',
        'model',
        'brand',
        'specifications',
        'image_path',
        'qr_code',
        'status', // 'active', 'maintenance', 'disposed', 'lost'
        'mosque_id',
        'created_by',
        'updated_by'
    ];

    protected $casts = [
        'acquisition_date' => 'date',
        'warranty_expiry' => 'date',
        'acquisition_cost' => 'decimal:2',
        'current_value' => 'decimal:2',
        'specifications' => 'json'
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

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Generate unique asset code
    public static function generateAssetCode($mosqueId, $category)
    {
        $mosque = Mosque::find($mosqueId);
        $prefix = strtoupper(substr($mosque->name, 0, 3));
        $categoryCode = strtoupper(substr($category, 0, 2));
        $year = date('Y');
        
        $lastAsset = self::where('mosque_id', $mosqueId)
            ->where('asset_code', 'like', "{$prefix}-{$categoryCode}-{$year}-%")
            ->orderBy('asset_code', 'desc')
            ->first();
            
        $sequence = 1;
        if ($lastAsset) {
            $lastSequence = (int) substr($lastAsset->asset_code, -4);
            $sequence = $lastSequence + 1;
        }
        
        return sprintf('%s-%s-%s-%04d', $prefix, $categoryCode, $year, $sequence);
    }

    // Check if asset requires annual inspection
    public function requiresInspection()
    {
        return $this->classification === 'harta_modal' && 
               $this->acquisition_cost >= 1000;
    }

    // Calculate depreciation
    public function calculateDepreciation()
    {
        $yearsOwned = now()->diffInYears($this->acquisition_date);
        $depreciationRate = $this->getDepreciationRate();
        
        return $this->acquisition_cost * ($depreciationRate / 100) * $yearsOwned;
    }

    private function getDepreciationRate()
    {
        // Based on asset category - simplified example
        $rates = [
            'furniture' => 10,
            'equipment' => 15,
            'vehicle' => 20,
            'building' => 2,
            'land' => 0
        ];
        
        return $rates[$this->category] ?? 10;
    }
}
