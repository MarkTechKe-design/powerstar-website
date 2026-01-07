<?php
require_once 'includes/header.php';

$jsonFile = __DIR__ . '/../data/departments.json';

/* ===============================
   LOAD JSON
================================ */
$departments = file_exists($jsonFile)
    ? json_decode(file_get_contents($jsonFile), true)
    : [];

/* ===============================
   SAVE JSON (ATOMIC)
================================ */
function saveDepartments(array $departments, string $jsonFile) {
    $tmp = $jsonFile . '.tmp';
    file_put_contents(
        $tmp,
        json_encode($departments, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
    );
    rename($tmp, $jsonFile);
}

/* ===============================
   DELETE
================================ */
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $departments = array_values(array_filter($departments, fn($d) => $d['id'] !== $id));
    saveDepartments($departments, $jsonFile);
    header('Location: services.php');
    exit;
}

/* ===============================
   EDIT MODE
================================ */
$editMode = false;
$dept = null;

if (isset($_GET['edit'])) {
    $editMode = true;
    foreach ($departments as $d) {
        if ($d['id'] === $_GET['edit']) {
            $dept = $d;
            break;
        }
    }
}

/* ===============================
   ADD / UPDATE
================================ */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = trim($_POST['id']);
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);
    $icon = trim($_POST['icon']);
    $note = trim($_POST['note']);
    $onLanding = isset($_POST['onLanding']);
    $visible = isset($_POST['visible']);

    $imagePath = $editMode ? $dept['image'] : null;

    /* IMAGE UPLOAD */
    if (!empty($_FILES['image']['name']) && $_FILES['image']['error'] === 0) {
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];

        if (in_array($ext, $allowed)) {
            $filename = uniqid('dept_') . '.' . $ext;
            $targetDir = __DIR__ . '/../assets/';
            if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);
            move_uploaded_file($_FILES['image']['tmp_name'], $targetDir . $filename);
            $imagePath = 'assets/' . $filename;
        }
    }

    if ($editMode) {
        foreach ($departments as &$d) {
            if ($d['id'] === $dept['id']) {
                $d = [
                    'id' => $id,
                    'title' => $title,
                    'image' => $imagePath,
                    'description' => $description,
                    'icon' => $icon,
                    'note' => $note,
                    'onLanding' => $onLanding,
                    'visible' => $visible
                ];
                break;
            }
        }
    } else {
        $departments[] = [
            'id' => $id,
            'title' => $title,
            'image' => $imagePath,
            'description' => $description,
            'icon' => $icon,
            'note' => $note,
            'onLanding' => $onLanding,
            'visible' => $visible
        ];
    }

    saveDepartments($departments, $jsonFile);
    header('Location: services.php');
    exit;
}
?>

<div class="page-header">
    <h1 class="page-title">Departments</h1>
    <a href="services.php?action=add" class="btn btn-primary">Add Department</a>
</div>

<?php if (!isset($_GET['action']) && !$editMode): ?>
<div class="card">
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Landing</th>
                <th>Visible</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($departments as $d): ?>
            <tr>
                <td><?= htmlspecialchars($d['title']) ?></td>
                <td><?= $d['onLanding'] ? 'Yes' : 'No' ?></td>
                <td><?= $d['visible'] ? 'Yes' : 'No' ?></td>
                <td>
                    <a href="services.php?edit=<?= $d['id'] ?>" class="btn btn-secondary">Edit</a>
                    <a href="services.php?delete=<?= $d['id'] ?>" class="btn btn-danger"
                       onclick="return confirm('Delete this department?')">Delete</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
<?php else: ?>
<div class="card" style="max-width: 800px;">
<form method="POST" enctype="multipart/form-data">
    <label>ID (unique, lowercase)</label>
    <input name="id" value="<?= $editMode ? htmlspecialchars($dept['id']) : '' ?>" required>

    <label>Title</label>
    <input name="title" value="<?= $editMode ? htmlspecialchars($dept['title']) : '' ?>" required>

    <label>Description</label>
    <textarea name="description" required><?= $editMode ? htmlspecialchars($dept['description']) : '' ?></textarea>

    <label>Font Awesome Icon (e.g. fa-tv)</label>
    <input name="icon" value="<?= $editMode ? htmlspecialchars($dept['icon']) : '' ?>" required>

    <label>Note (optional)</label>
    <input name="note" value="<?= $editMode ? htmlspecialchars($dept['note']) : '' ?>">

    <label>Image</label>
    <input type="file" name="image">

    <label>
        <input type="checkbox" name="onLanding" <?= $editMode && $dept['onLanding'] ? 'checked' : '' ?>>
        Show on Homepage
    </label>

    <label>
        <input type="checkbox" name="visible" <?= !$editMode || $dept['visible'] ? 'checked' : '' ?>>
        Visible
    </label>

    <button type="submit" class="btn btn-primary">Save Department</button>
    <a href="services.php" class="btn btn-secondary">Cancel</a>
</form>
</div>
<?php endif; ?>
