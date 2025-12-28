-- Powerstar Admin Panel Database Schema

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Offers Table
CREATE TABLE IF NOT EXISTS `offers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `price` DECIMAL(10, 2),
    `branch` VARCHAR(50),
    `image_path` VARCHAR(255),
    `is_active` TINYINT(1) DEFAULT 1,
    `start_date` DATE,
    `end_date` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sliders Table
CREATE TABLE IF NOT EXISTS `sliders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `headline` VARCHAR(100),
    `subheadline` VARCHAR(150),
    `cta_text` VARCHAR(50),
    `cta_link` VARCHAR(255),
    `image_path` VARCHAR(255) NOT NULL,
    `display_order` INT DEFAULT 0,
    `is_active` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Careers Table
CREATE TABLE IF NOT EXISTS `careers` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `job_title` VARCHAR(100) NOT NULL,
    `department` VARCHAR(50),
    `description` TEXT,
    `status` ENUM('Open', 'Closed') DEFAULT 'Open',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Media Table
CREATE TABLE IF NOT EXISTS `media` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `file_path` VARCHAR(255) NOT NULL,
    `caption` VARCHAR(100),
    `category` VARCHAR(50),
    `is_published` TINYINT(1) DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default Admin User (Password: admin123)
-- Hash generated using password_hash('admin123', PASSWORD_DEFAULT)
INSERT INTO `admins` (`username`, `password_hash`) VALUES 
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');
