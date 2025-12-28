<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../admin/config/db.php';

try {
    $today = date('Y-m-d');

    // Select offers that are active AND (start_date is null/past) AND (end_date is null/future)
    $sql = "SELECT id, title, description, price, branch, image_path, start_date, end_date 
            FROM offers 
            WHERE is_active = 1 
            AND (start_date IS NULL OR start_date <= :today)
            AND (end_date IS NULL OR end_date >= :today)
            ORDER BY id DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute(['today' => $today]);
    $offers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'data' => $offers
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error'
    ]);
}
?>