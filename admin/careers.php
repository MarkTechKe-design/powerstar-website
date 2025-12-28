<?php
require_once 'includes/header.php';

if (isset($_GET['delete'])) {
    $id = (int) $_GET['delete'];
    $pdo->prepare("DELETE FROM careers WHERE id = ?")->execute([$id]);
    echo "<script>window.location.href='careers.php';</script>";
}

$editMode = false;
$job = null;
if (isset($_GET['edit'])) {
    $editMode = true;
    $id = (int) $_GET['edit'];
    $stmt = $pdo->prepare("SELECT * FROM careers WHERE id = ?");
    $stmt->execute([$id]);
    $job = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['job_title'];
    $dept = $_POST['department'];
    $desc = $_POST['description'];
    $status = $_POST['status'];

    if ($editMode) {
        $stmt = $pdo->prepare("UPDATE careers SET job_title=?, department=?, description=?, status=? WHERE id=?");
        $stmt->execute([$title, $dept, $desc, $status, $job['id']]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO careers (job_title, department, description, status) VALUES (?, ?, ?, ?)");
        $stmt->execute([$title, $dept, $desc, $status]);
    }
    echo "<script>window.location.href='careers.php';</script>";
}
?>

<div class="page-header">
    <h1 class="page-title">Manage Careers</h1>
    <a href="careers.php?action=add" class="btn btn-primary"><i class="fas fa-plus"></i> Post New Job</a>
</div>

<?php if (!isset($_GET['action']) && !isset($_GET['edit'])): ?>
    <div class="card">
        <table>
            <thead>
                <tr>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $stmt = $pdo->query("SELECT * FROM careers ORDER BY created_at DESC");
                while ($row = $stmt->fetch()):
                    ?>
                    <tr>
                        <td><strong><?php echo htmlspecialchars($row['job_title']); ?></strong></td>
                        <td><?php echo htmlspecialchars($row['department']); ?></td>
                        <td>
                            <span
                                class="status-badge <?php echo $row['status'] == 'Open' ? 'status-active' : 'status-inactive'; ?>">
                                <?php echo $row['status']; ?>
                            </span>
                        </td>
                        <td>
                            <a href="careers.php?edit=<?php echo $row['id']; ?>" class="btn btn-secondary"><i
                                    class="fas fa-edit"></i></a>
                            <a href="careers.php?delete=<?php echo $row['id']; ?>" onclick="return confirm('Delete job?')"
                                class="btn btn-danger"><i class="fas fa-trash"></i></a>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
<?php else: ?>
    <div class="card" style="max-width: 800px;">
        <h3><?php echo $editMode ? 'Edit Job' : 'Post New Job'; ?></h3>
        <form method="POST">
            <div class="form-group">
                <label class="form-label">Job Title</label>
                <input type="text" name="job_title" class="form-control"
                    value="<?php echo $editMode ? htmlspecialchars($job['job_title']) : ''; ?>" required>
            </div>

            <div class="form-group">
                <label class="form-label">Department</label>
                <input type="text" name="department" class="form-control"
                    value="<?php echo $editMode ? htmlspecialchars($job['department']) : ''; ?>" required>
            </div>

            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea name="description" class="form-control"
                    style="height: 150px;"><?php echo $editMode ? htmlspecialchars($job['description']) : ''; ?></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Status</label>
                <select name="status" class="form-control">
                    <option value="Open" <?php echo ($editMode && $job['status'] == 'Open') ? 'selected' : ''; ?>>Open
                    </option>
                    <option value="Closed" <?php echo ($editMode && $job['status'] == 'Closed') ? 'selected' : ''; ?>>Closed
                    </option>
                </select>
            </div>

            <button type="submit" class="btn btn-primary">Save Job</button>
            <a href="careers.php" class="btn btn-secondary">Cancel</a>
        </form>
    </div>
<?php endif; ?>
</body>

</html>