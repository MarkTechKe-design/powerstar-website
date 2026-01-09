<?php
// --- 1. DEBUG & AUTH ---
ini_set('display_errors', 1);
error_reporting(E_ALL);

if (file_exists(__DIR__ . '/auth.php')) {
    require_once __DIR__ . '/auth.php';
} else {
    die("<h1>Error</h1><p>Missing auth.php in admin folder.</p>");
}
require_login();

// --- 2. CONFIGURATION ---
// We use __DIR__ to ensure the path is always correct
$jsonFile = __DIR__ . '/../data/departments.json';
$uploadDir = __DIR__ . '/../assets/uploads/';

// Auto-create folders if missing
if (!is_dir(__DIR__ . '/../data')) mkdir(__DIR__ . '/../data', 0755, true);
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

// --- 3. DATA HELPERS ---
function getDepartments() {
    global $jsonFile;
    return file_exists($jsonFile) ? json_decode(file_get_contents($jsonFile), true) : [];
}

function saveDepartments($data) {
    global $jsonFile;
    file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

// --- 4. HANDLE ACTIONS ---
$departments = getDepartments();
$editMode = false;
$deptToEdit = null;

// HANDLE DELETE
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $departments = array_values(array_filter($departments, function($d) use ($id) {
        return $d['id'] !== $id;
    }));
    saveDepartments($departments);
    header('Location: departments.php'); // Redirect to SELF
    exit;
}

// HANDLE EDIT PRELOAD
if (isset($_GET['edit'])) {
    $editMode = true;
    foreach ($departments as $d) {
        if ($d['id'] === $_GET['edit']) {
            $deptToEdit = $d;
            break;
        }
    }
}

// HANDLE FORM SUBMISSION (ADD/UPDATE)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?: uniqid('dept_'); // Generate ID if empty
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);
    $onLanding = isset($_POST['onLanding']);
    $visible = isset($_POST['visible']);

    // Handle Image Upload
    $imagePath = $_POST['current_image'] ?? ''; // Keep old image by default
    
    if (!empty($_FILES['image']['name']) && $_FILES['image']['error'] === 0) {
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp'])) {
            $filename = uniqid('img_') . '.' . $ext;
            if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . $filename)) {
                $imagePath = 'assets/uploads/' . $filename;
            }
        }
    }

    $newDept = [
        'id' => $id,
        'title' => $title,
        'description' => $description,
        'image' => $imagePath,
        'onLanding' => $onLanding,
        'visible' => $visible
    ];

    if ($editMode) {
        // Update existing
        foreach ($departments as &$d) {
            if ($d['id'] === $id) {
                $d = $newDept;
                break;
            }
        }
    } else {
        // Add new
        $departments[] = $newDept;
    }

    saveDepartments($departments);
    header('Location: departments.php'); // Redirect to SELF
    exit;
}

// Include Sidebar
include 'includes/header.php';
?>

<div class="page-header">
    <h1 class="page-title">Manage Departments</h1>
    <?php if(!$editMode): ?>
        <a href="departments.php?action=new" class="btn btn-primary"><i class="fas fa-plus"></i> Add Department</a>
    <?php endif; ?>
</div>

<?php if (isset($_GET['action']) || $editMode): ?>
<div class="card">
    <h3><?= $editMode ? 'Edit Department' : 'Add New Department' ?></h3>
    <form method="POST" enctype="multipart/form-data" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
        
        <input type="hidden" name="id" value="<?= $deptToEdit['id'] ?? '' ?>">
        <input type="hidden" name="current_image" value="<?= $deptToEdit['image'] ?? '' ?>">

        <div style="grid-column: 1 / -1;">
            <label class="form-label">Department Title</label>
            <input type="text" name="title" class="form-control" value="<?= htmlspecialchars($deptToEdit['title'] ?? '') ?>" required placeholder="e.g. Fresh Bakery">
        </div>

        <div style="grid-column: 1 / -1;">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control" required placeholder="Short description..."><?= htmlspecialchars($deptToEdit['description'] ?? '') ?></textarea>
        </div>

        <div>
            <label class="form-label">Cover Image</label>
            <?php if (!empty($deptToEdit['image'])): ?>
                <img src="../<?= $deptToEdit['image'] ?>" style="height: 80px; margin-bottom: 10px; display:block; border-radius: 4px;">
            <?php endif; ?>
            <input type="file" name="image" class="form-control" <?= $editMode ? '' : 'required' ?>>
        </div>

        <div style="display: flex; flex-direction: column; justify-content: center; gap: 10px;">
            <label style="cursor: pointer;">
                <input type="checkbox" name="onLanding" <?= ($deptToEdit['onLanding'] ?? false) ? 'checked' : '' ?>>
                Show on Homepage (Top 6)
            </label>
            <label style="cursor: pointer;">
                <input type="checkbox" name="visible" <?= ($deptToEdit['visible'] ?? true) ? 'checked' : '' ?>>
                Visible on Site
            </label>
        </div>

        <div style="grid-column: 1 / -1; margin-top: 10px;">
            <button type="submit" class="btn btn-primary">Save Department</button>
            <a href="departments.php" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
</div>
<?php endif; ?>

<?php if (!isset($_GET['action']) && !$editMode): ?>
<div class="card">
    <h3>Current Departments</h3>
    <table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background: #f9f9f9; text-align: left;">
                <th style="padding: 12px;">Image</th>
                <th style="padding: 12px;">Title</th>
                <th style="padding: 12px;">Status</th>
                <th style="padding: 12px;">Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($departments)): ?>
                <tr><td colspan="4" style="padding: 20px; text-align: center;">No departments found. Add one above!</td></tr>
            <?php else: ?>
                <?php foreach ($departments as $d): ?>
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 10px;">
                        <img src="../<?= $d['image'] ?>" style="width: 50px; height: 35px; object-fit: cover; border-radius: 4px;">
                    </td>
                    <td style="padding: 10px; font-weight: 500;"><?= htmlspecialchars($d['title']) ?></td>
                    <td style="padding: 10px;">
                        <?php if($d['onLanding']): ?><span class="status-badge status-active">Home</span><?php endif; ?>
                        <?php if(!$d['visible']): ?><span class="status-badge status-inactive">Hidden</span><?php endif; ?>
                    </td>
                    <td style="padding: 10px;">
                        <a href="departments.php?edit=<?= $d['id'] ?>" class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.8rem;">Edit</a>
                        <a href="departments.php?delete=<?= $d['id'] ?>" class="btn btn-danger" style="padding: 4px 10px; font-size: 0.8rem;" onclick="return confirm('Delete this department?');">Delete</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>
<?php endif; ?>

</body>
</html>