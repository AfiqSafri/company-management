-- Seed initial data for Mosque and Surau Asset Management System

USE mosque_asset_management;

-- Insert default asset categories
INSERT INTO asset_categories (name, code, description, depreciation_rate, useful_life_years) VALUES
('Furniture & Fittings', 'FUR', 'Tables, chairs, cabinets, and other furniture items', 10.00, 10),
('Office Equipment', 'OEQ', 'Computers, printers, scanners, and office machinery', 20.00, 5),
('Audio Visual Equipment', 'AVE', 'Sound systems, microphones, projectors, screens', 15.00, 7),
('Kitchen Equipment', 'KIT', 'Stoves, refrigerators, cooking utensils', 12.50, 8),
('Cleaning Equipment', 'CLE', 'Vacuum cleaners, floor polishers, cleaning tools', 20.00, 5),
('Air Conditioning', 'AIR', 'Air conditioning units and ventilation systems', 10.00, 10),
('Electrical Equipment', 'ELE', 'Generators, electrical panels, lighting fixtures', 8.00, 12),
('Vehicle', 'VEH', 'Cars, motorcycles, bicycles', 20.00, 5),
('Building', 'BLD', 'Main building structure and permanent fixtures', 2.00, 50),
('Land', 'LND', 'Land and property', 0.00, 999),
('Books & Publications', 'BOK', 'Religious books, magazines, educational materials', 25.00, 4),
('Sports Equipment', 'SPT', 'Sports and recreational equipment', 15.00, 7),
('Security Equipment', 'SEC', 'CCTV cameras, alarm systems, security devices', 12.50, 8),
('Garden Equipment', 'GAR', 'Lawn mowers, garden tools, irrigation systems', 15.00, 7),
('Others', 'OTH', 'Miscellaneous items not covered in other categories', 10.00, 10);

-- Insert sample mosque/surau
INSERT INTO mosques (
    name, 
    type, 
    address, 
    postcode, 
    city, 
    state, 
    phone, 
    email, 
    registration_number,
    committee_chairman,
    controlling_officer,
    asset_officer,
    established_date,
    land_area,
    building_area
) VALUES 
(
    'Masjid Al-Hidayah Shah Alam',
    'mosque',
    'Jalan Masjid 1, Seksyen 14',
    '40000',
    'Shah Alam',
    'Selangor',
    '03-55121234',
    'alhidayah@mosque.my',
    'REG-MSJ-2020-001',
    'Haji Ahmad bin Abdullah',
    'Ustaz Muhammad bin Ali',
    'Encik Siti Aminah binti Hassan',
    '2020-01-15',
    2500.00,
    800.00
),
(
    'Surau An-Nur Petaling Jaya',
    'surau',
    'Jalan SS2/24, SS2',
    '47300',
    'Petaling Jaya',
    'Selangor',
    '03-78765432',
    'annur@surau.my',
    'REG-SUR-2019-005',
    'Puan Fatimah binti Omar',
    'Ustaz Ibrahim bin Yusof',
    'Encik Ahmad bin Mahmud',
    '2019-06-10',
    500.00,
    200.00
);

-- Insert admin user
INSERT INTO users (
    name, 
    email, 
    password, 
    role, 
    mosque_id, 
    phone, 
    position,
    email_verified_at
) VALUES 
(
    'System Administrator',
    'admin@mosque-asset.my',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
    'admin',
    NULL,
    '03-12345678',
    'System Administrator',
    NOW()
),
(
    'Ustaz Muhammad bin Ali',
    'muhammad@alhidayah.my',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
    'controlling_officer',
    1,
    '03-55121234',
    'Controlling Officer',
    NOW()
),
(
    'Siti Aminah binti Hassan',
    'aminah@alhidayah.my',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
    'asset_officer',
    1,
    '03-55121235',
    'Asset Officer',
    NOW()
),
(
    'Ahmad bin Mahmud',
    'ahmad@annur.my',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password
    'asset_officer',
    2,
    '03-78765433',
    'Asset Officer',
    NOW()
);

-- Insert sample assets for Masjid Al-Hidayah
INSERT INTO assets (
    asset_code,
    name,
    description,
    category,
    type,
    classification,
    acquisition_date,
    acquisition_cost,
    current_value,
    condition,
    location,
    responsible_person,
    supplier,
    serial_number,
    model,
    brand,
    mosque_id,
    created_by
) VALUES 
(
    'ALH-FUR-2024-0001',
    'Prayer Hall Carpet',
    'Main prayer hall carpet - 20m x 15m',
    'furniture',
    'movable',
    'harta_modal',
    '2024-01-15',
    5500.00,
    5500.00,
    'excellent',
    'Main Prayer Hall',
    'Siti Aminah binti Hassan',
    'Carpet World Sdn Bhd',
    'CW-2024-001',
    'Premium Prayer Carpet',
    'Islamic Carpets',
    1,
    3
),
(
    'ALH-AVE-2024-0002',
    'Sound System',
    'Complete sound system with wireless microphones',
    'equipment',
    'movable',
    'harta_modal',
    '2024-02-01',
    3200.00,
    3200.00,
    'excellent',
    'Main Prayer Hall',
    'Siti Aminah binti Hassan',
    'Audio Tech Malaysia',
    'AT-SS-2024-001',
    'Professional PA System',
    'Yamaha',
    1,
    3
),
(
    'ALH-AIR-2024-0003',
    'Air Conditioning Unit - Main Hall',
    '5 HP split unit air conditioning system',
    'equipment',
    'movable',
    'harta_modal',
    '2024-01-20',
    4800.00,
    4800.00,
    'good',
    'Main Prayer Hall',
    'Siti Aminah binti Hassan',
    'Cool Air Systems',
    'CAS-AC-5HP-001',
    'Inverter Split Unit 5HP',
    'Daikin',
    1,
    3
),
(
    'ALH-FUR-2024-0004',
    'Office Desk Set',
    'Office desk with chair for administration',
    'furniture',
    'movable',
    'inventori',
    '2024-02-10',
    850.00,
    850.00,
    'good',
    'Administration Office',
    'Siti Aminah binti Hassan',
    'Office Furniture Mart',
    'OFM-DESK-001',
    'Executive Desk Set',
    'IKEA',
    1,
    3
),
(
    'ALH-KIT-2024-0005',
    'Commercial Refrigerator',
    'Double door refrigerator for kitchen use',
    'equipment',
    'movable',
    'harta_modal',
    '2024-03-01',
    2200.00,
    2200.00,
    'excellent',
    'Kitchen',
    'Siti Aminah binti Hassan',
    'Kitchen Equipment Supply',
    'KES-REF-2024-001',
    'Commercial Double Door',
    'Samsung',
    1,
    3
);

-- Insert sample assets for Surau An-Nur
INSERT INTO assets (
    asset_code,
    name,
    description,
    category,
    type,
    classification,
    acquisition_date,
    acquisition_cost,
    current_value,
    condition,
    location,
    responsible_person,
    supplier,
    serial_number,
    model,
    brand,
    mosque_id,
    created_by
) VALUES 
(
    'ANN-FUR-2024-0001',
    'Prayer Mats Set',
    'Set of 50 individual prayer mats',
    'furniture',
    'movable',
    'inventori',
    '2024-01-10',
    750.00,
    750.00,
    'good',
    'Prayer Area',
    'Ahmad bin Mahmud',
    'Islamic Supplies',
    'IS-MAT-SET-001',
    'Standard Prayer Mat',
    'Madinah Collection',
    2,
    4
),
(
    'ANN-AVE-2024-0002',
    'Portable Speaker System',
    'Wireless portable speaker for announcements',
    'equipment',
    'movable',
    'inventori',
    '2024-02-15',
    450.00,
    450.00,
    'excellent',
    'Prayer Area',
    'Ahmad bin Mahmud',
    'Electronics Store',
    'ES-SPEAKER-001',
    'Bluetooth Speaker Pro',
    'JBL',
    2,
    4
);

-- Insert sample maintenance records
INSERT INTO maintenance_records (
    asset_id,
    type,
    description,
    scheduled_date,
    completed_date,
    cost,
    vendor,
    status,
    priority,
    created_by
) VALUES 
(
    3, -- Air Conditioning Unit
    'preventive',
    'Regular servicing and filter cleaning',
    '2024-06-15',
    '2024-06-15',
    150.00,
    'Cool Air Services',
    'completed',
    'medium',
    3
),
(
    2, -- Sound System
    'corrective',
    'Replace faulty wireless microphone',
    '2024-05-20',
    '2024-05-22',
    280.00,
    'Audio Tech Malaysia',
    'completed',
    'high',
    3
),
(
    5, -- Commercial Refrigerator
    'preventive',
    'Annual maintenance and gas top-up',
    '2024-12-01',
    NULL,
    200.00,
    'Kitchen Equipment Services',
    'scheduled',
    'medium',
    3
);

-- Insert sample annual report
INSERT INTO annual_reports (
    mosque_id,
    report_year,
    total_assets_count,
    total_assets_value,
    harta_modal_count,
    harta_modal_value,
    inventori_count,
    inventori_value,
    new_acquisitions_count,
    new_acquisitions_value,
    maintenance_cost,
    status,
    prepared_by,
    submission_date
) VALUES 
(
    1, -- Masjid Al-Hidayah
    2024,
    5,
    16550.00,
    4,
    15700.00,
    1,
    850.00,
    5,
    16550.00,
    630.00,
    'draft',
    3,
    NULL
),
(
    2, -- Surau An-Nur
    2024,
    2,
    1200.00,
    0,
    0.00,
    2,
    1200.00,
    2,
    1200.00,
    0.00,
    'draft',
    4,
    NULL
);
