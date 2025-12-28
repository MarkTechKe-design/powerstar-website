<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../admin/config/db.php';

try {
    $category = isset($_GET['category']) ? $_GET['category'] : null;

    $sql = "SELECT id, file_path, caption, category, created_at FROM media WHERE is_published = 1";
    if ($category) {
        $sql .= " AND category = :cat";
    }
    $sql .= " ORDER BY id DESC";

    $stmt = $pdo->prepare($sql);
    if ($category) {
        $stmt->execute(['cat' => $category]);
    } else {
        $stmt->execute();
    }

    $media = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $media
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error'
    ]);
}
?>