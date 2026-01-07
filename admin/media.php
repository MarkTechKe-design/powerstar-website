<?php
require_once 'includes/header.php';

$jsonFile = __DIR__ . '/../data/media.json';

/* ---------- LOAD JSON ---------- */
$data = file_exists($jsonFile)
    ? json_decode(file_get_contents($jsonFile), true)
    : ['hero' => [], 'posts' => []];

$posts = $data['posts'] ?? [];

/* ---------- SAVE JSON (ATOMIC) ---------- */
function saveJson(array $data, string $jsonFile) {
    $tmp = $jsonFile . '.tmp';
    file_put_contents(
        $tmp,
        json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
    );
    rename($tmp, $jsonFile);
}

/* ---------- DELETE ---------- */
if (isset($_GET['delete'])) {
    $id = (int) $_GET['delete'];
    $data['posts'] = array_values(array_filter($posts, fn($p) => $p['id'] !== $id));
    saveJson($data, $jsonFile);
    header('Location: media.php');
    exit;
}

/* ---------- EDIT MODE ---------- */
$editMode = false;
$post = null;

if (isset($_GET['edit'])) {
    $editMode = true;
    $id = (int) $_GET['edit'];
    foreach ($posts as $p) {
        if ($p['id'] === $id) {
            $post = $p;
            break;
        }
    }
}

/* ---------- ADD / UPDATE ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title']);
    $date = trim($_POST['date']);
    $category = trim($_POST['category']);
    $summary = trim($_POST['summary']);

    $external_link = trim($_POST['external_link']);
    $external_link = $external_link !== '' ? $external_link : null;

    $platform = trim($_POST['platform']);
    $platform = $platform !== '' ? $platform : null;

    $featured = isset($_POST['featured']);
    $active = isset($_POST['active']);

    $imagePath = $editMode ? $post['image'] : null;

    /* ---------- IMAGE UPLOAD ---------- */
    if (!empty($_FILES['image']['name']) && $_FILES['image']['error'] === 0) {
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];

        if (in_array($ext, $allowed)) {
            $filename = uniqid('media_') . '.' . $ext;
            $targetDir = __DIR__ . '/../assets/';
            if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);
            move_uploaded_file($_FILES['image']['tmp_name'], $targetDir . $filename);
            $imagePath = 'assets/' . $filename;
        }
    }

    if ($editMode) {
        foreach ($data['posts'] as &$p) {
            if ($p['id'] === $post['id']) {
                $p = [
                    'id' => $p['id'],
                    'title' => $title,
                    'date' => $date,
                    'category' => $category,
                    'image' => $imagePath,
                    'summary' => $summary,
                    'external_link' => $external_link,
                    'platform' => $platform,
                    'featured' => $featured,
                    'active' => $active
                ];
                break;
            }
        }
    } else {
        $newId = empty($posts) ? 1 : max(array_column($posts, 'id')) + 1;
        $data['posts'][] = [
            'id' => $newId,
            'title' => $title,
            'date' => $date,
            'category' => $category,
            'image' => $imagePath,
            'summary' => $summary,
            'external_link' => $external_link,
            'platform' => $platform,
            'featured' => $featured,
            'active' => $active
        ];
    }

    saveJson($data, $jsonFile);
    header('Location: media.php');
    exit;
}
?>

<div class="page-header">
    <h1 class="page-title">Media & News</h1>
    <a href="media.php?action=add" class="btn btn-primary">Add Post</a>
</div>

<?php if (!isset($_GET['action']) && !$editMode): ?>
<div class="card">
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($posts as $p): ?>
            <tr>
                <td><?= htmlspecialchars($p['title']) ?></td>
                <td><?= htmlspecialchars($p['category']) ?></td>
                <td><?= htmlspecialchars($p['date']) ?></td>
                <td><?= $p['active'] ? 'Active' : 'Inactive' ?></td>
                <td>
                    <a href="media.php?edit=<?= $p['id'] ?>" class="btn btn-secondary">Edit</a>
                    <a href="media.php?delete=<?= $p['id'] ?>" class="btn btn-danger"
                       onclick="return confirm('Delete this post?')">Delete</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<?php else: ?>
<div class="card" style="max-width: 800px;">
<form method="POST" enctype="multipart/form-data">
    <label>Title</label>
    <input name="title" value="<?= $editMode ? htmlspecialchars($post['title']) : '' ?>" required>

    <label>Date</label>
    <input name="date" value="<?= $editMode ? htmlspecialchars($post['date']) : '' ?>" required>

    <label>Category</label>
    <input name="category" value="<?= $editMode ? htmlspecialchars($post['category']) : '' ?>" required>

    <label>Summary</label>
    <textarea name="summary"><?= $editMode ? htmlspecialchars($post['summary']) : '' ?></textarea>

    <label>External Link</label>
    <input name="external_link" value="<?= $editMode ? htmlspecialchars($post['external_link'] ?? '') : '' ?>">

    <label>Platform</label>
    <input name="platform" value="<?= $editMode ? htmlspecialchars($post['platform'] ?? '') : '' ?>">

    <label>Image</label>
    <input type="file" name="image">

    <label><input type="checkbox" name="featured" <?= $editMode && $post['featured'] ? 'checked' : '' ?>> Featured</label>
    <label><input type="checkbox" name="active" <?= !$editMode || $post['active'] ? 'checked' : '' ?>> Active</label>

    <button type="submit" class="btn btn-primary">Save</button>
    <a href="media.php" class="btn btn-secondary">Cancel</a>
</form>
</div>
<?php endif; ?>
