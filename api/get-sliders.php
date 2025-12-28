<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../admin/config/db.php';

try {
    $stmt = $pdo->query("SELECT id, headline, subheadline, cta_text, cta_link, image_path, display_order FROM sliders WHERE is_active = 1 ORDER BY display_order ASC");
    $sliders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Normalize image paths if necessary (remove redundant admin/ prefix if stored that way, or ensure full path)
    // currently stored as 'admin/uploads/...' or 'uploads/...' depending on logic.
    // The previous sliders.php logic stored: 'admin/uploads/sliders/...' (relative to root)

    echo json_encode([
        'status' => 'success',
        'data' => $sliders
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error'
    ]);
}
?>