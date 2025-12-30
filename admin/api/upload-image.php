<?php
header('Content-Type: application/json');
require_once '../config/db.php';

// Mock Auth
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No image uploaded']);
        exit;
    }

    $file = $_FILES['image'];
    $category = $_POST['category'] ?? 'uploads'; // e.g., 'hero', 'departments'
    $allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    $maxSize = 2 * 1024 * 1024; // 2MB

    // Validation
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, WEBP allowed.']);
        exit;
    }
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'File too large. Max 2MB.']);
        exit;
    }

    // Path Construction
    $uploadDir = '../../assets/' . preg_replace('/[^a-zA-Z0-9_-]/', '', $category) . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    // Secure Filename
    $filename = uniqid() . '-' . basename($file['name']); // Prevent overwrites
    $targetPath = $uploadDir . $filename;

    // Relative Path for Frontend
    $publicPath = 'assets/' . $category . '/' . $filename;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        // Optional: Insert into DB media_assets table
        // $stmt = $pdo->prepare("INSERT INTO media_assets (filename, file_path, file_type) VALUES (?, ?, ?)");
        // $stmt->execute([$filename, $publicPath, $file['type']]);

        echo json_encode([
            'success' => true,
            'path' => $publicPath,
            'message' => 'Image uploaded successfully'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file']);
    }
}
?>