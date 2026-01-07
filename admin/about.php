<?php
require_once 'includes/header.php';

$jsonFile = __DIR__ . '/../data/about.json';

/* ===============================
   LOAD JSON
================================ */
$data = file_exists($jsonFile)
    ? json_decode(file_get_contents($jsonFile), true)
    : [];

/* ===============================
   SAVE JSON (ATOMIC)
================================ */
function saveAbout(array $data, string $jsonFile) {
    $tmp = $jsonFile . '.tmp';
    file_put_contents(
        $tmp,
        json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
    );
    rename($tmp, $jsonFile);
}

/* ===============================
   HANDLE SAVE
================================ */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Intro
    $data['intro']['title']   = trim($_POST['intro_title']);
    $data['intro']['content'] = trim($_POST['intro_content']);

    // Strategic Compass
    $data['strategic_compass']['mission']['title']   = trim($_POST['mission_title']);
    $data['strategic_compass']['mission']['content'] = trim($_POST['mission_content']);

    $data['strategic_compass']['vision']['title']   = trim($_POST['vision_title']);
    $data['strategic_compass']['vision']['content'] = trim($_POST['vision_content']);

    $data['strategic_compass']['quality_policy']['title']
        = trim($_POST['quality_title']);
    $data['strategic_compass']['quality_policy']['content']
        = trim($_POST['quality_content']);

    // Growth & Vision
    $data['growth_vision']['title']   = trim($_POST['growth_title']);
    $data['growth_vision']['content'] = trim($_POST['growth_content']);

    /* IMAGE UPLOAD */
    if (!empty($_FILES['growth_image']['name']) && $_FILES['growth_image']['error'] === 0) {
        $ext = strtolower(pathinfo($_FILES['growth_image']['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];

        if (in_array($ext, $allowed)) {
            $filename = uniqid('growth_') . '.' . $ext;
            $dir = __DIR__ . '/../assets/about/';
            if (!is_dir($dir)) mkdir($dir, 0755, true);
            move_uploaded_file($_FILES['growth_image']['tmp_name'], $dir . $filename);
            $data['growth_vision']['image'] = 'assets/about/' . $filename;
        }
    }

    saveAbout($data, $jsonFile);
    header('Location: about.php');
    exit;
}
?>

<div class="page-header">
    <h1 class="page-title">About Page Content</h1>
</div>

<div class="card" style="max-width: 900px;">
<form method="POST" enctype="multipart/form-data">

    <h3>Intro Section</h3>
    <label>Title</label>
    <input name="intro_title"
           value="<?= htmlspecialchars($data['intro']['title'] ?? '') ?>" required>

    <label>Content</label>
    <textarea name="intro_content" rows="4" required><?= htmlspecialchars($data['intro']['content'] ?? '') ?></textarea>

    <hr>

    <h3>Strategic Compass</h3>

    <label>Mission Title</label>
    <input name="mission_title"
           value="<?= htmlspecialchars($data['strategic_compass']['mission']['title'] ?? '') ?>" required>

    <label>Mission Content</label>
    <textarea name="mission_content" rows="3" required><?= htmlspecialchars($data['strategic_compass']['mission']['content'] ?? '') ?></textarea>

    <label>Vision Title</label>
    <input name="vision_title"
           value="<?= htmlspecialchars($data['strategic_compass']['vision']['title'] ?? '') ?>" required>

    <label>Vision Content</label>
    <textarea name="vision_content" rows="3" required><?= htmlspecialchars($data['strategic_compass']['vision']['content'] ?? '') ?></textarea>

    <label>Quality Policy Title</label>
    <input name="quality_title"
           value="<?= htmlspecialchars($data['strategic_compass']['quality_policy']['title'] ?? '') ?>" required>

    <label>Quality Policy Content</label>
    <textarea name="quality_content" rows="3" required><?= htmlspecialchars($data['strategic_compass']['quality_policy']['content'] ?? '') ?></textarea>

    <hr>

    <h3>Growth & Future Vision</h3>

    <label>Title</label>
    <input name="growth_title"
           value="<?= htmlspecialchars($data['growth_vision']['title'] ?? '') ?>" required>

    <label>Content</label>
    <textarea name="growth_content" rows="4" required><?= htmlspecialchars($data['growth_vision']['content'] ?? '') ?></textarea>

    <label>Image</label>
    <input type="file" name="growth_image">
    <?php if (!empty($data['growth_vision']['image'])): ?>
        <small>Current: <?= $data['growth_vision']['image'] ?></small>
    <?php endif; ?>

    <br><br>
    <button type="submit" class="btn btn-primary">Save About Content</button>

</form>
</div>
