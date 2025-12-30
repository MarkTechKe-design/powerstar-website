-- Powerstar Supermarkets Database Schema

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'editor') DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_sections (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section_key VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'hero', 'contact'
    content_json JSON NOT NULL, -- Flexible storage for section fields
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS slides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_path VARCHAR(255) NOT NULL,
    title VARCHAR(100),
    subtitle VARCHAR(255),
    btn_text VARCHAR(50),
    btn_link VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'bakery'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_path VARCHAR(255) NOT NULL,
    link VARCHAR(255),
    sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    image_path VARCHAR(255),
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS media_assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(50), -- jpg, png, etc.
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial Data Seeding
INSERT INTO site_sections (section_key, content_json) VALUES 
('general', '{"company_name": "Powerstar Supermarkets", "founded_year": "2001", "tagline": "Freshness & Value You Can Trust"}'),
('contact', '{"phone": "+254 700 000 000", "email": "info@powerstar.co.ke", "address": "Nairobi, Kenya"}');
