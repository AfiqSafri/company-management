<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Mosque;
use App\Models\Asset;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create mosques
        $mosque1 = Mosque::create([
            'name' => 'Masjid Al-Hidayah Shah Alam',
            'type' => 'mosque',
            'address' => 'Jalan Masjid 1, Seksyen 14',
            'postcode' => '40000',
            'city' => 'Shah Alam',
            'state' => 'Selangor',
            'phone' => '03-55121234',
            'email' => 'alhidayah@mosque.my',
            'registration_number' => 'REG-MSJ-2020-001',
            'committee_chairman' => 'Haji Ahmad bin Abdullah',
            'controlling_officer' => 'Ustaz Muhammad bin Ali',
            'asset_officer' => 'Encik Siti Aminah binti Hassan',
            'established_date' => '2020-01-15',
            'land_area' => 2500.00,
            'building_area' => 800.00,
        ]);

        $mosque2 = Mosque::create([
            'name' => 'Surau An-Nur Petaling Jaya',
            'type' => 'surau',
            'address' => 'Jalan SS2/24, SS2',
            'postcode' => '47300',
            'city' => 'Petaling Jaya',
            'state' => 'Selangor',
            'phone' => '03-78765432',
            'email' => 'annur@surau.my',
            'registration_number' => 'REG-SUR-2019-005',
            'committee_chairman' => 'Puan Fatimah binti Omar',
            'controlling_officer' => 'Ustaz Ibrahim bin Yusof',
            'asset_officer' => 'Encik Ahmad bin Mahmud',
            'established_date' => '2019-06-10',
            'land_area' => 500.00,
            'building_area' => 200.00,
        ]);

        // Create users
        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@mosque-asset.my',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '03-12345678',
            'position' => 'System Administrator',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Ustaz Muhammad bin Ali',
            'email' => 'muhammad@alhidayah.my',
            'password' => Hash::make('password'),
            'role' => 'controlling_officer',
            'mosque_id' => $mosque1->id,
            'phone' => '03-55121234',
            'position' => 'Controlling Officer',
            'email_verified_at' => now(),
        ]);

        $assetOfficer = User::create([
            'name' => 'Siti Aminah binti Hassan',
            'email' => 'aminah@alhidayah.my',
            'password' => Hash::make('password'),
            'role' => 'asset_officer',
            'mosque_id' => $mosque1->id,
            'phone' => '03-55121235',
            'position' => 'Asset Officer',
            'email_verified_at' => now(),
        ]);

        User::create([
            'name' => 'Ahmad bin Mahmud',
            'email' => 'ahmad@annur.my',
            'password' => Hash::make('password'),
            'role' => 'asset_officer',
            'mosque_id' => $mosque2->id,
            'phone' => '03-78765433',
            'position' => 'Asset Officer',
            'email_verified_at' => now(),
        ]);

        // Create sample assets
        Asset::create([
            'asset_code' => 'ALH-FUR-2024-0001',
            'name' => 'Karpet Dewan Solat',
            'description' => 'Karpet dewan solat utama - 20m x 15m',
            'category' => 'furniture',
            'type' => 'movable',
            'classification' => 'harta_modal',
            'acquisition_date' => '2024-01-15',
            'acquisition_cost' => 5500.00,
            'current_value' => 5500.00,
            'quantity' => 1,
            'unit' => 'unit',
            'condition' => 'excellent',
            'location' => 'Dewan Solat Utama',
            'responsible_person' => 'Siti Aminah binti Hassan',
            'supplier' => 'Carpet World Sdn Bhd',
            'serial_number' => 'CW-2024-001',
            'model' => 'Premium Prayer Carpet',
            'brand' => 'Islamic Carpets',
            'mosque_id' => $mosque1->id,
            'created_by' => $assetOfficer->id,
        ]);

        Asset::create([
            'asset_code' => 'ALH-AVE-2024-0002',
            'name' => 'Sistem Bunyi',
            'description' => 'Sistem bunyi lengkap dengan mikrofon tanpa wayar',
            'category' => 'equipment',
            'type' => 'movable',
            'classification' => 'harta_modal',
            'acquisition_date' => '2024-02-01',
            'acquisition_cost' => 3200.00,
            'current_value' => 3200.00,
            'quantity' => 1,
            'unit' => 'set',
            'condition' => 'excellent',
            'location' => 'Dewan Solat Utama',
            'responsible_person' => 'Siti Aminah binti Hassan',
            'supplier' => 'Audio Tech Malaysia',
            'serial_number' => 'AT-SS-2024-001',
            'model' => 'Professional PA System',
            'brand' => 'Yamaha',
            'mosque_id' => $mosque1->id,
            'created_by' => $assetOfficer->id,
        ]);

        Asset::create([
            'asset_code' => 'ALH-FUR-2024-0003',
            'name' => 'Kerusi Plastik',
            'description' => 'Kerusi plastik untuk majlis dan aktiviti',
            'category' => 'furniture',
            'type' => 'movable',
            'classification' => 'inventori',
            'acquisition_date' => '2024-03-10',
            'acquisition_cost' => 1200.00,
            'current_value' => 1200.00,
            'quantity' => 50,
            'unit' => 'unit',
            'condition' => 'good',
            'location' => 'Stor Peralatan',
            'responsible_person' => 'Siti Aminah binti Hassan',
            'supplier' => 'Furniture Mart Sdn Bhd',
            'serial_number' => 'FM-CH-2024-001',
            'model' => 'Standard Plastic Chair',
            'brand' => 'Comfort Plus',
            'mosque_id' => $mosque1->id,
            'created_by' => $assetOfficer->id,
        ]);

        Asset::create([
            'asset_code' => 'ANR-EQP-2024-0001',
            'name' => 'Kipas Angin',
            'description' => 'Kipas angin dinding untuk ruang solat',
            'category' => 'equipment',
            'type' => 'movable',
            'classification' => 'inventori',
            'acquisition_date' => '2024-02-20',
            'acquisition_cost' => 800.00,
            'current_value' => 800.00,
            'quantity' => 4,
            'unit' => 'unit',
            'condition' => 'good',
            'location' => 'Ruang Solat',
            'responsible_person' => 'Ahmad bin Mahmud',
            'supplier' => 'Electrical Supply Co',
            'serial_number' => 'ESC-FAN-2024-001',
            'model' => 'Wall Mount Fan 16 inch',
            'brand' => 'Panasonic',
            'mosque_id' => $mosque2->id,
            'created_by' => 4,
        ]);

        Asset::create([
            'asset_code' => 'ANR-FUR-2024-0002',
            'name' => 'Almari Simpanan',
            'description' => 'Almari kayu untuk simpan peralatan masjid',
            'category' => 'furniture',
            'type' => 'movable',
            'classification' => 'inventori',
            'acquisition_date' => '2024-04-05',
            'acquisition_cost' => 1500.00,
            'current_value' => 1500.00,
            'quantity' => 2,
            'unit' => 'unit',
            'condition' => 'excellent',
            'location' => 'Bilik Stor',
            'responsible_person' => 'Ahmad bin Mahmud',
            'supplier' => 'Wood Craft Sdn Bhd',
            'serial_number' => 'WC-CAB-2024-001',
            'model' => 'Storage Cabinet 6ft',
            'brand' => 'Premium Wood',
            'mosque_id' => $mosque2->id,
            'created_by' => 4,
        ]);
    }
}
