-- Mosque and Surau Asset Management System Database Schema
-- Based on Garis Panduan Pengurusan Aset Masjid dan Surau Negeri Selangor 2023

-- Create database
CREATE DATABASE IF NOT EXISTS mosque_asset_management;
USE mosque_asset_management;

-- Users table for authentication and role management
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'committee', 'controlling_officer', 'asset_officer', 'assistant_asset_officer') NOT NULL DEFAULT 'committee',
    mosque_id BIGINT UNSIGNED,
    phone VARCHAR(20),
    position VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Mosques and Suraus table
CREATE TABLE mosques (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('mosque', 'surau') NOT NULL,
    address TEXT NOT NULL,
    postcode VARCHAR(10),
    city VARCHAR(100),
    state VARCHAR(50) DEFAULT 'Selangor',
    phone VARCHAR(20),
    email VARCHAR(255),
    registration_number VARCHAR(50),
    waqf_registration VARCHAR(50),
    committee_chairman VARCHAR(255),
    controlling_officer VARCHAR(255),
    asset_officer VARCHAR(255),
    assistant_asset_officer VARCHAR(255),
    established_date DATE,
    land_area DECIMAL(10,2),
    building_area DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Assets table - main asset registry
CREATE TABLE assets (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL, -- furniture, equipment, vehicle, building, land, etc.
    type ENUM('movable', 'immovable') NOT NULL, -- Alih, Tak Alih
    classification ENUM('harta_modal', 'inventori') NOT NULL, -- Based on RM1000 threshold
    acquisition_date DATE NOT NULL,
    acquisition_cost DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL,
    condition ENUM('excellent', 'good', 'fair', 'poor', 'needs_repair') NOT NULL,
    location VARCHAR(255) NOT NULL,
    responsible_person VARCHAR(255) NOT NULL,
    supplier VARCHAR(255),
    warranty_expiry DATE,
    serial_number VARCHAR(100),
    model VARCHAR(100),
    brand VARCHAR(100),
    specifications JSON,
    image_path VARCHAR(500),
    qr_code VARCHAR(500),
    status ENUM('active', 'maintenance', 'disposed', 'lost', 'written_off') DEFAULT 'active',
    mosque_id BIGINT UNSIGNED NOT NULL,
    created_by BIGINT UNSIGNED,
    updated_by BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (mosque_id) REFERENCES mosques(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_asset_code (asset_code),
    INDEX idx_mosque_category (mosque_id, category),
    INDEX idx_status (status),
    INDEX idx_classification (classification)
);

-- Asset movements table - BR-AMS 004
CREATE TABLE asset_movements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    asset_id BIGINT UNSIGNED NOT NULL,
    from_location VARCHAR(255) NOT NULL,
    to_location VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    moved_by VARCHAR(255) NOT NULL,
    move_date DATE NOT NULL,
    approved_by BIGINT UNSIGNED,
    approval_date TIMESTAMP NULL,
    notes TEXT,
    created_by BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_asset_date (asset_id, move_date)
);

-- Maintenance records table - BR-AMS 006
CREATE TABLE maintenance_records (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    asset_id BIGINT UNSIGNED NOT NULL,
    type ENUM('preventive', 'corrective', 'emergency') NOT NULL,
    description TEXT NOT NULL,
    scheduled_date DATE,
    completed_date DATE,
    cost DECIMAL(10,2) DEFAULT 0,
    vendor VARCHAR(255),
    technician VARCHAR(255),
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    notes TEXT,
    next_maintenance_date DATE,
    created_by BIGINT UNSIGNED,
    updated_by BIGINT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id),
    INDEX idx_asset_scheduled (asset_id, scheduled_date),
    INDEX idx_status_priority (status, priority)
);

-- Asset disposals table - BR-AMS 007, 008
CREATE TABLE asset_disposals (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    asset_id BIGINT UNSIGNED NOT NULL,
    disposal_reason ENUM(
        'obsolete_technology',
        'beyond_repair',
        'high_maintenance_cost',
        'no_longer_needed',
        'safety_hazard',
        'space_constraint',
        'upgrade_replacement',
        'end_of_life',
        'policy_change',
        'other'
    ) NOT NULL,
    disposal_method ENUM('sale', 'donation', 'destruction', 'trade_in', 'return_to_supplier') NOT NULL,
    justification TEXT NOT NULL,
    estimated_value DECIMAL(10,2),
    disposal_date DATE,
    recipient VARCHAR(255), -- For donations or sales
    disposal_cost DECIMAL(10,2) DEFAULT 0,
    proceeds DECIMAL(10,2) DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    requested_by BIGINT UNSIGNED,
    approved_by BIGINT UNSIGNED,
    approval_date TIMESTAMP NULL,
    approval_notes TEXT,
    disposal_certificate VARCHAR(500), -- File path for disposal certificate
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_status_date (status, disposal_date)
);

-- Asset losses table - BR-AMS 009
CREATE TABLE asset_losses (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    asset_id BIGINT UNSIGNED NOT NULL,
    loss_type ENUM('theft', 'damage', 'natural_disaster', 'accident', 'missing', 'other') NOT NULL,
    loss_date DATE NOT NULL,
    discovered_date DATE NOT NULL,
    location_of_loss VARCHAR(255),
    circumstances TEXT NOT NULL,
    police_report_number VARCHAR(100),
    police_report_date DATE,
    estimated_loss_value DECIMAL(15,2),
    insurance_claim_number VARCHAR(100),
    insurance_payout DECIMAL(15,2) DEFAULT 0,
    status ENUM('reported', 'investigating', 'resolved', 'written_off') DEFAULT 'reported',
    reported_by BIGINT UNSIGNED,
    investigated_by BIGINT UNSIGNED,
    investigation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(id),
    FOREIGN KEY (investigated_by) REFERENCES users(id),
    INDEX idx_loss_date (loss_date),
    INDEX idx_status (status)
);

-- Annual asset reports table - BR-AMS 010
CREATE TABLE annual_reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    mosque_id BIGINT UNSIGNED NOT NULL,
    report_year YEAR NOT NULL,
    total_assets_count INT DEFAULT 0,
    total_assets_value DECIMAL(20,2) DEFAULT 0,
    harta_modal_count INT DEFAULT 0,
    harta_modal_value DECIMAL(20,2) DEFAULT 0,
    inventori_count INT DEFAULT 0,
    inventori_value DECIMAL(20,2) DEFAULT 0,
    new_acquisitions_count INT DEFAULT 0,
    new_acquisitions_value DECIMAL(20,2) DEFAULT 0,
    disposals_count INT DEFAULT 0,
    disposals_value DECIMAL(20,2) DEFAULT 0,
    losses_count INT DEFAULT 0,
    losses_value DECIMAL(20,2) DEFAULT 0,
    maintenance_cost DECIMAL(15,2) DEFAULT 0,
    report_file_path VARCHAR(500),
    status ENUM('draft', 'submitted', 'approved') DEFAULT 'draft',
    prepared_by BIGINT UNSIGNED,
    approved_by BIGINT UNSIGNED,
    submission_date DATE,
    approval_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (mosque_id) REFERENCES mosques(id),
    FOREIGN KEY (prepared_by) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id),
    UNIQUE KEY unique_mosque_year (mosque_id, report_year),
    INDEX idx_year_status (report_year, status)
);

-- Asset categories lookup table
CREATE TABLE asset_categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    description TEXT,
    depreciation_rate DECIMAL(5,2) DEFAULT 10.00,
    useful_life_years INT DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_code (code),
    INDEX idx_active (is_active)
);

-- Asset valuations table for tracking value changes
CREATE TABLE asset_valuations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    asset_id BIGINT UNSIGNED NOT NULL,
    valuation_date DATE NOT NULL,
    previous_value DECIMAL(15,2) NOT NULL,
    new_value DECIMAL(15,2) NOT NULL,
    valuation_method ENUM('depreciation', 'revaluation', 'market_assessment', 'insurance_assessment') NOT NULL,
    reason TEXT,
    conducted_by VARCHAR(255),
    approved_by BIGINT UNSIGNED,
    supporting_documents VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_asset_date (asset_id, valuation_date)
);

-- System audit trail
CREATE TABLE audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT UNSIGNED,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_action (user_id, action),
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_created_at (created_at)
);

-- Add foreign key constraint for users.mosque_id
ALTER TABLE users ADD FOREIGN KEY (mosque_id) REFERENCES mosques(id);
