<?php
header('Content-Type: application/json');
require_once '../config/db.php';

// Mock Authentication Check (Replace with real session check)
session_start();
// if (!isset($_SESSION['user_id'])) { http_response_code(403); echo json_encode(['error' => 'Unauthorized']); exit; }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || !isset($input['type'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid input']);
        exit;
    }

    try {
        if ($input['type'] === 'site_content') {
            // Update Site Content (JSON file + DB)
            $newContent = $input['data']; // JSON object

            // 1. Update DB (Example for 'general' section)
            // In a real app, you'd loop through sections and update site_sections table
            // $stmt = $pdo->prepare("UPDATE site_sections SET content_json = ? WHERE section_key = ?");
            // $stmt->execute([json_encode($newContent['general']), 'general']);

            // 2. Write to JSON File (Source of Truth for Frontend)
            $jsonPath = '../../data/site-content.json';
            // Merge with existing to prevent data loss if partial update
            $currentJson = json_decode(file_get_contents($jsonPath), true);
            $mergedJson = array_replace_recursive($currentJson, $newContent);

            if (file_put_contents($jsonPath, json_encode($mergedJson, JSON_PRETTY_PRINT))) {
                echo json_encode(['success' => true, 'message' => 'Site content updated']);
            } else {
                throw new Exception('Failed to write JSON file');
            }
        } elseif ($input['type'] === 'slides') {
            // Update Slides
            $jsonPath = '../../data/slides.json';
            if (file_put_contents($jsonPath, json_encode($input['data'], JSON_PRETTY_PRINT))) {
                echo json_encode(['success' => true, 'message' => 'Slides updated']);
            } else {
                throw new Exception('Failed to write slides JSON');
            }
        } else {
            throw new Exception('Unknown update type');
        }

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>