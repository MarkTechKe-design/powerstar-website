<?php
require_once 'includes/header.php';

if (isset($_GET['delete'])) {
    $id = (int) $_GET['delete'];
    $stmt = $pdo->prepare("SELECT file_path FROM media WHERE id = ?");
    $stmt->execute([$id]);
    $file = $stmt->fetchColumn();

    $pdo->prepare("DELETE FROM media WHERE id = ?")->execute([$id]);
    if ($file && file_exists("../" . $file))
        unlink("../" . $file);
    echo "<script>window.location.href='media.php';</script>";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $caption = $_POST['caption'];
    $category = $_POST['category'];
    $published = isset($_POST['published']) ? 1 : 0;

    if (isset($_FILES['file']) && $_FILES['file']['error'] === 0) {
        $allowed = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];
        $ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));

        if (in_array($ext, $allowed)) {
            $newName = uniqid('media_') . '.' . $ext;
            if (!is_dir('uploads/media'))
                mkdir('uploads/media', 0777, true);

            if (move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/media/' . $newName)) {
                $filePath = 'admin/uploads/media/' . $newName;

                $sql = "INSERT INTO media (file_path, caption, category, is_published) VALUES (?, ?, ?, ?)";
                $pdo->prepare($sql)->execute([$filePath, $caption, $category, $published]);
            }
        }
    }
    echo "<script>window.location.href='media.php';</script>";
}
?>

<div class="page-header">
    <h1 class="page-title">Media Library</h1>
    <a href="media.php?action=add" class="btn btn-primary"><i class="fas fa-upload"></i> Upload Media</a>
</div>

<?php if (!isset($_GET['action'])): ?>
    <div class="card">
        <table>
            <thead>
                <tr>
                    <th>Preview</th>
                    <th>Caption</th>
                    <th>Category</th>
                    <th>Link (Copy)</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $stmt = $pdo->query("SELECT * FROM media ORDER BY id DESC");
                while ($row = $stmt->fetch()):
                    ?>
                    <tr>
                        <td>
                            <a href="../<?php echo $row['file_path']; ?>" target="_blank">
                                <img src="../<?php echo $row['file_path']; ?>" class="thumb">
                            </a>
                        </td>
                        <td><?php echo htmlspecialchars($row['caption']); ?></td>
                        <td><?php echo htmlspecialchars($row['category']); ?></td>
                        <td><input type="text" value="<?php echo $row['file_path']; ?>" readonly
                                style="width:150px; font-size:0.8rem; padding:2px;"></td>
                        <td>
                            <a href="media.php?delete=<?php echo $row['id']; ?>" onclick="return confirm('Delete file?')"
                                class="btn btn-danger"><i class="fas fa-trash"></i></a>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
<?php else: ?>
    <div class="card" style="max-width: 600px;">
        <h3>Upload New File</h3>
        <form method="POST" enctype="multipart/form-data">
            <div class="form-group">
                <label class="form-label">File</label>
                <input type="file" name="file" class="form-control" required>
            </div>
            <div class="form-group">
                <label class="form-label">Caption</label>
                <input type="text" name="caption" class="form-control" placeholder="e.g. CSR Event 2025">
            </div>
            <div class="form-group">
                <label class="form-label">Category</label>
                <input type="text" name="category" class="form-control" placeholder="e.g. Gallery">
            </div>
            <div class="form-group">
                <label><input type="checkbox" name="published" checked> Published</label>
            </div>
            <button type="submit" class="btn btn-primary">Upload</button>
            <a href="media.php" class="btn btn-secondary">Cancel</a>
        </form>
    </div>
<?php endif; ?>
</body>

</html>