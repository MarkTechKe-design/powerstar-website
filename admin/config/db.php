<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'powerstar_db');
define('DB_USER', 'powerstar_admin');
define('DB_PASS', 'SecurePass123!'); // CHANGE THIS IN PRODUCTION
define('DB_CHARSET', 'utf8mb4');

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
} catch (\PDOException $e) {
    // Log error securely, do not output details in production
    error_log($e->getMessage());
    die("Database connection failed. Please contact support.");
}
?>