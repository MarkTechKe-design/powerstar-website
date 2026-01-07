<?php
require_once 'includes/header.php';

$jsonFile = __DIR__ . '/../data/slides.json';

/* ---------- LOAD JSON ---------- */
$slides = file_exists($jsonFile)
    ? json_decode(file_get_contents($jsonFile), true)
    : [];

/* ---------- SAVE JSON (ATOMIC) ---------- */
function saveSlides(array $slides, string $jsonFile) {
    $tmp = $jsonFile . '.tmp';
    file_put_contents(
        $tmp,
        json_encode($slides, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
    );
    rename($tmp, $jsonFile);
}

/* ---------- DELETE ---------- */
if (isset($_GET['delete'])) {
    $id = (int) $_GET['delete'];
    $slides = array_values(array_filter($slides, fn($s) => $s['id'] !== $id));
    saveSlides($slides, $jsonFile);
    header('Location: sliders.php');
    exit;
}

/* ---------- EDIT MODE ---------- */
$editMode = false;
$slide = null;

if (isset($_GET['edit'])) {
    $editMode = true;
    $id = (int) $_GET['edit'];
    foreach ($slides as $s) {
        if ($s['id'] === $id) {
            $slide = $s;
            break;
        }
    }
}

/* ---------- ADD / UPDATE ---------- */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title']);
    $subtitle = trim($_POST['subtitle']);
    $button_text = trim($_POST['button_text']);
    $button_link = trim($_POST['button_link']);
    $active = isset($_POST['active']);

    $imagePath = $editMode ? $slide['image'] : null;

    /* ---------- IMAGE UPLOAD ---------- */
    if (!empty($_FILES['image']['name']) && $_FILES['image']['error'] === 0) {
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];

        if (in_array($ext, $allowed)) {
            $filename = uniqid('slide_') . '.' . $ext;
            $targetDir = __DIR__ . '/../assets/';
            if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);
            move_uploaded_file($_FILES['image']['tmp_name'], $targetDir . $filename);
            $imagePath = 'assets/' . $filename;
        }
    }

    if ($editMode) {
        foreach ($slides as &$s) {
            if ($s['id'] === $slide['id']) {
                $s = [
                    'id' => $s['id'],
                    'image' => $imagePath,
                    'title' => $title,
                    'subtitle' => $subtitle,
                    'button_text' => $button_text,
                    'button_link' => $button_link,
                    'active' => $active
                ];
                break;
            }
        }
    } else {
        $newId = empty($slides) ? 1 : max(array_column($slides, 'id')) + 1;
        $slides[] = [
            'id' => $newId,
            'image' => $imagePath,
            'title' => $title,
            'subtitle' => $subtitle,
            'button_text' => $button_text,
            'button_link' => $button_link,
            'active' => $active
        ];
    }

    saveSlides($slides, $jsonFile);
    header('Location: sliders.php');
    exit;
}
?>

<div class="page-header">
    <h1 class="page-title">Homepage Sliders</h1>
    <a href="sliders.php?action=add" class="btn btn-primary">Add Slide</a>
</div>

<?php if (!isset($_GET['action']) && !$editMode): ?>
<div class="card">
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Button</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($slides as $s): ?>
            <tr>
                <td><?= htmlspecialchars($s['title']) ?></td>
                <td><?= htmlspecialchars($s['button_text']) ?></td>
                <td><?= $s['active'] ? 'Active' : 'Inactive' ?></td>
                <td>
                    <a href="sliders.php?edit=<?= $s['id'] ?>" class="btn btn-secondary">Edit</a>
                    <a href="sliders.php?delete=<?= $s['id'] ?>" class="btn btn-danger"
                       onclick="return confirm('Delete this slide?')">Delete</a>
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
    <input name="title" value="<?= $editMode ? htmlspecialchars($slide['title']) : '' ?>" required>

    <label>Subtitle</label>
    <input name="subtitle" value="<?= $editMode ? htmlspecialchars($slide['subtitle']) : '' ?>" required>

    <label>Button Text</label>
    <input name="button_text" value="<?= $editMode ? htmlspecialchars($slide['button_text']) : '' ?>" required>

    <label>Button Link</label>
    <input name="button_link" value="<?= $editMode ? htmlspecialchars($slide['button_link']) : '' ?>" required>

    <label>Image</label>
    <input type="file" name="image">

    <label>
        <input type="checkbox" name="active" <?= !$editMode || $slide['active'] ? 'checked' : '' ?>>
        Active
    </label>

    <button type="submit" class="btn btn-primary">Save</button>
    <a href="sliders.php" class="btn btn-secondary">Cancel</a>
</form>
</div>
<?php endif; ?>
