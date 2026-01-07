<?php
require_once 'includes/header.php';

$jsonFile = __DIR__ . '/../data/whats-new.json';

/* ===============================
   LOAD JSON
================================ */
$items = file_exists($jsonFile)
    ? json_decode(file_get_contents($jsonFile), true)
    : [];

/* ===============================
   SAVE JSON (ATOMIC)
================================ */
function saveWhatsNew(array $items, string $jsonFile) {
    $tmp = $jsonFile . '.tmp';
    file_put_contents(
        $tmp,
        json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
    );
    rename($tmp, $jsonFile);
}

/* ===============================
   DELETE ITEM
================================ */
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $items = array_values(array_filter($items, fn($i) => $i['id'] !== $id));
    saveWhatsNew($items, $jsonFile);
    header('Location: whats-new.php');
    exit;
}

/* ===============================
   EDIT MODE
================================ */
$editMode = false;
$item = null;

if (isset($_GET['edit'])) {
    $editMode = true;
    $id = $_GET['edit'];
    foreach ($items as $i) {
        if ($i['id'] === $id) {
            $item = $i;
            break;
        }
    }
}

/* ===============================
   ADD / UPDATE
================================ */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title']);
    $tag = trim($_POST['tag']);
    $link = trim($_POST['link']);
    $link_text = trim($_POST['link_text']);
    $active = isset($_POST['active']);

    $imagePath = $editMode ? $item['image'] : null;

    /* IMAGE UPLOAD */
    if (!empty($_FILES['image']['name']) && $_FILES['image']['error'] === 0) {
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];

        if (in_array($ext, $allowed)) {
            $filename = uniqid('whatsnew_') . '.' . $ext;
            $targetDir = __DIR__ . '/../assets/';
            if (!is_dir($targetDir)) mkdir($targetDir, 0755, true);
            move_uploaded_file($_FILES['image']['tmp_name'], $targetDir . $filename);
            $imagePath = 'assets/' . $filename;
        }
    }

    if ($editMode) {
        foreach ($items as &$i) {
            if ($i['id'] === $item['id']) {
                $i = [
                    'id' => $i['id'],
                    'title' => $title,
                    'image' => $imagePath,
                    'tag' => $tag,
                    'link' => $link,
                    'link_text' => $link_text,
                    'active' => $active
                ];
                break;
            }
        }
    } else {
        $nextIndex = count($items) + 1;
        $newId = 'new-' . $nextIndex;

        $items[] = [
            'id' => $newId,
            'title' => $title,
            'image' => $imagePath,
            'tag' => $tag,
            'link' => $link,
            'link_text' => $link_text,
            'active' => $active
        ];
    }

    saveWhatsNew($items, $jsonFile);
    header('Location: whats-new.php');
    exit;
}
?>

<div class="page-header">
    <h1 class="page-title">What’s New</h1>
    <a href="whats-new.php?action=add" class="btn btn-primary">Add Item</a>
</div>

<?php if (!isset($_GET['action']) && !$editMode): ?>
<div class="card">
    <table>
        <thead>
            <tr>
                <th>Title</th>
                <th>Tag</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($items as $i): ?>
            <tr>
                <td><?= htmlspecialchars($i['title']) ?></td>
                <td><?= htmlspecialchars($i['tag']) ?></td>
                <td><?= $i['active'] ? 'Active' : 'Inactive' ?></td>
                <td>
                    <a href="whats-new.php?edit=<?= $i['id'] ?>" class="btn btn-secondary">Edit</a>
                    <a href="whats-new.php?delete=<?= $i['id'] ?>" class="btn btn-danger"
                       onclick="return confirm('Delete this item?')">Delete</a>
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
    <input name="title" value="<?= $editMode ? htmlspecialchars($item['title']) : '' ?>" required>

    <label>Tag</label>
    <input name="tag" value="<?= $editMode ? htmlspecialchars($item['tag']) : '' ?>" required>

    <label>Link</label>
    <input name="link" value="<?= $editMode ? htmlspecialchars($item['link']) : '' ?>" required>

    <label>Link Text</label>
    <input name="link_text" value="<?= $editMode ? htmlspecialchars($item['link_text']) : '' ?>" required>

    <label>Image</label>
    <input type="file" name="image">

    <label>
        <input type="checkbox" name="active" <?= !$editMode || $item['active'] ? 'checked' : '' ?>>
        Active
    </label>

    <button type="submit" class="btn btn-primary">Save</button>
    <a href="whats-new.php" class="btn btn-secondary">Cancel</a>
</form>
</div>
<?php endif; ?>
