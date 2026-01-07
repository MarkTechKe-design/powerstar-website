<?php
require_once 'includes/header.php';

$jsonFile = __DIR__ . '/../data/careers.json';

/* ===============================
   LOAD JSON
================================ */
$data = file_exists($jsonFile)
    ? json_decode(file_get_contents($jsonFile), true)
    : [
        'hero' => [],
        'general_applications' => [],
        'professional_roles' => []
    ];

/* ===============================
   SAVE JSON (ATOMIC)
================================ */
function saveCareers(array $data, string $jsonFile) {
    $tmp = $jsonFile . '.tmp';
    file_put_contents(
        $tmp,
        json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
    );
    rename($tmp, $jsonFile);
}

/* ===============================
   DELETE PROFESSIONAL ROLE
================================ */
if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    $data['professional_roles'] = array_values(
        array_filter($data['professional_roles'], fn($r) => $r['id'] !== $id)
    );
    saveCareers($data, $jsonFile);
    header('Location: careers.php');
    exit;
}

/* ===============================
   EDIT MODE
================================ */
$editMode = false;
$role = null;

if (isset($_GET['edit'])) {
    $editMode = true;
    foreach ($data['professional_roles'] as $r) {
        if ($r['id'] === $_GET['edit']) {
            $role = $r;
            break;
        }
    }
}

/* ===============================
   ADD / UPDATE ROLE
================================ */
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['save_role'])) {
    $department = trim($_POST['department']);
    $title = trim($_POST['title']);
    $description = trim($_POST['description']);
    $email = trim($_POST['application_email']);
    $status = $_POST['status'];

    if ($editMode) {
        foreach ($data['professional_roles'] as &$r) {
            if ($r['id'] === $role['id']) {
                $r = [
                    'id' => $r['id'],
                    'department' => $department,
                    'title' => $title,
                    'description' => $description,
                    'application_email' => $email,
                    'status' => $status
                ];
                break;
            }
        }
    } else {
        $newId = 'pro-' . (count($data['professional_roles']) + 1);
        $data['professional_roles'][] = [
            'id' => $newId,
            'department' => $department,
            'title' => $title,
            'description' => $description,
            'application_email' => $email,
            'status' => $status
        ];
    }

    saveCareers($data, $jsonFile);
    header('Location: careers.php');
    exit;
}
?>

<div class="page-header">
    <h1 class="page-title">Careers</h1>
    <a href="careers.php?action=add" class="btn btn-primary">Add Professional Role</a>
</div>

<div class="card">
    <h3>Professional & Management Roles</h3>
    <table>
        <thead>
            <tr>
                <th>Department</th>
                <th>Title</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data['professional_roles'] as $r): ?>
            <tr>
                <td><?= htmlspecialchars($r['department']) ?></td>
                <td><?= htmlspecialchars($r['title']) ?></td>
                <td><?= ucfirst($r['status']) ?></td>
                <td>
                    <a href="careers.php?edit=<?= $r['id'] ?>" class="btn btn-secondary">Edit</a>
                    <a href="careers.php?delete=<?= $r['id'] ?>" class="btn btn-danger"
                       onclick="return confirm('Delete this role?')">Delete</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

<?php if (isset($_GET['action']) || $editMode): ?>
<div class="card" style="max-width: 800px;">
<form method="POST">
    <label>Department</label>
    <input name="department" value="<?= $editMode ? htmlspecialchars($role['department']) : '' ?>" required>

    <label>Job Title</label>
    <input name="title" value="<?= $editMode ? htmlspecialchars($role['title']) : '' ?>" required>

    <label>Description</label>
    <textarea name="description" required><?= $editMode ? htmlspecialchars($role['description']) : '' ?></textarea>

    <label>Application Email</label>
    <input name="application_email"
           value="<?= $editMode ? htmlspecialchars($role['application_email']) : 'careers@powerstarsupermarkets.co.ke' ?>"
           required>

    <label>Status</label>
    <select name="status">
        <option value="open" <?= $editMode && $role['status'] === 'open' ? 'selected' : '' ?>>Open</option>
        <option value="filled" <?= $editMode && $role['status'] === 'filled' ? 'selected' : '' ?>>Filled</option>
    </select>

    <button type="submit" name="save_role" class="btn btn-primary">Save Role</button>
    <a href="careers.php" class="btn btn-secondary">Cancel</a>
</form>
</div>
<?php endif; ?>
