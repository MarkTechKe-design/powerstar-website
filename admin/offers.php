<?php
require_once 'includes/header.php';

// Delete Action
if (isset($_GET['delete'])) {
    $id = (int) $_GET['delete'];
    $stmt = $pdo->prepare("SELECT image_path FROM offers WHERE id = ?");
    $stmt->execute([$id]);
    $img = $stmt->fetchColumn();

    $pdo->prepare("DELETE FROM offers WHERE id = ?")->execute([$id]);
    if ($img && file_exists("../" . $img))
        unlink("../" . $img);
    echo "<script>window.location.href='offers.php';</script>";
}

// Add/Edit Logic
$editMode = false;
$offer = null;

if (isset($_GET['edit'])) {
    $editMode = true;
    $id = (int) $_GET['edit'];
    $stmt = $pdo->prepare("SELECT * FROM offers WHERE id = ?");
    $stmt->execute([$id]);
    $offer = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $description = $_POST['description'];
    $price = !empty($_POST['price']) ? $_POST['price'] : null;
    $branch = $_POST['branch'];
    $start_date = !empty($_POST['start_date']) ? $_POST['start_date'] : null;
    $end_date = !empty($_POST['end_date']) ? $_POST['end_date'] : null;
    $is_active = isset($_POST['is_active']) ? 1 : 0;

    $imagePath = $editMode ? $offer['image_path'] : '';

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        if (in_array($ext, $allowed)) {
            $newName = uniqid('offer_') . '.' . $ext;
            if (!is_dir('uploads/offers'))
                mkdir('uploads/offers', 0777, true);
            if (move_uploaded_file($_FILES['image']['tmp_name'], 'uploads/offers/' . $newName)) {
                $imagePath = 'admin/uploads/offers/' . $newName;
            }
        }
    }

    if ($editMode) {
        $sql = "UPDATE offers SET title=?, description=?, price=?, branch=?, start_date=?, end_date=?, is_active=?";
        $params = [$title, $description, $price, $branch, $start_date, $end_date, $is_active];
        if ($imagePath && $imagePath !== $offer['image_path']) {
            $sql .= ", image_path=?";
            $params[] = $imagePath;
        }
        $sql .= " WHERE id=?";
        $params[] = $offer['id'];
        $pdo->prepare($sql)->execute($params);
    } else {
        $sql = "INSERT INTO offers (title, description, price, branch, start_date, end_date, image_path, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $pdo->prepare($sql)->execute([$title, $description, $price, $branch, $start_date, $end_date, $imagePath, $is_active]);
    }
    echo "<script>window.location.href='offers.php';</script>";
}
?>

<div class="page-header">
    <h1 class="page-title">Manage Offers</h1>
    <a href="offers.php?action=add" class="btn btn-primary"><i class="fas fa-plus"></i> Add New Offer</a>
</div>

<?php if (!isset($_GET['action']) && !isset($_GET['edit'])): ?>
    <div class="card">
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Details</th>
                    <th>Branch</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $stmt = $pdo->query("SELECT * FROM offers ORDER BY id DESC");
                while ($row = $stmt->fetch()):
                    ?>
                    <tr>
                        <td>
                            <?php if ($row['image_path']): ?>
                                <img src="../<?php echo $row['image_path']; ?>" class="thumb">
                            <?php else: ?>
                                N/A
                            <?php endif; ?>
                        </td>
                        <td>
                            <strong><?php echo htmlspecialchars($row['title']); ?></strong>
                            <?php if ($row['price']): ?><br><span style="color:var(--ps-green); font-weight:bold;">KES
                                    <?php echo number_format($row['price']); ?></span><?php endif; ?>
                        </td>
                        <td><?php echo htmlspecialchars($row['branch'] ?: 'All Branches'); ?></td>
                        <td>
                            <small>Start: <?php echo $row['start_date'] ?: '-'; ?></small><br>
                            <small>End: <?php echo $row['end_date'] ?: '-'; ?></small>
                        </td>
                        <td><span
                                class="status-badge <?php echo $row['is_active'] ? 'status-active' : 'status-inactive'; ?>"><?php echo $row['is_active'] ? 'Active' : 'Inactive'; ?></span>
                        </td>
                        <td>
                            <a href="offers.php?edit=<?php echo $row['id']; ?>" class="btn btn-secondary"><i
                                    class="fas fa-edit"></i></a>
                            <a href="offers.php?delete=<?php echo $row['id']; ?>" onclick="return confirm('Delete offer?')"
                                class="btn btn-danger"><i class="fas fa-trash"></i></a>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
<?php else: ?>
    <div class="card" style="max-width: 800px;">
        <h3><?php echo $editMode ? 'Edit Offer' : 'Add New Offer'; ?></h3>
        <form method="POST" enctype="multipart/form-data">
            <div class="form-group">
                <label class="form-label">Offer Title</label>
                <input type="text" name="title" class="form-control"
                    value="<?php echo $editMode ? htmlspecialchars($offer['title']) : ''; ?>" required>
            </div>

            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea name="description"
                    class="form-control"><?php echo $editMode ? htmlspecialchars($offer['description']) : ''; ?></textarea>
            </div>

            <div style="display:flex; gap: 20px;">
                <div class="form-group" style="flex:1;">
                    <label class="form-label">Price (Optional)</label>
                    <input type="number" name="price" class="form-control"
                        value="<?php echo $editMode ? $offer['price'] : ''; ?>">
                </div>
                <div class="form-group" style="flex:1;">
                    <label class="form-label">Branch</label>
                    <input type="text" name="branch" class="form-control"
                        value="<?php echo $editMode ? htmlspecialchars($offer['branch']) : ''; ?>"
                        placeholder="Leave empty for all">
                </div>
            </div>

            <div style="display:flex; gap: 20px;">
                <div class="form-group" style="flex:1;">
                    <label class="form-label">Start Date</label>
                    <input type="date" name="start_date" class="form-control"
                        value="<?php echo $editMode ? $offer['start_date'] : ''; ?>">
                </div>
                <div class="form-group" style="flex:1;">
                    <label class="form-label">End Date</label>
                    <input type="date" name="end_date" class="form-control"
                        value="<?php echo $editMode ? $offer['end_date'] : ''; ?>">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Image</label>
                <input type="file" name="image" class="form-control">
                <?php if ($editMode && $offer['image_path'])
                    echo "<small>Current: {$offer['image_path']}</small>"; ?>
            </div>

            <div class="form-group">
                <label><input type="checkbox" name="is_active" <?php echo ($editMode && !$offer['is_active']) ? '' : 'checked'; ?>> Active</label>
            </div>

            <button type="submit" class="btn btn-primary">Save Offer</button>
            <a href="offers.php" class="btn btn-secondary">Cancel</a>
        </form>
    </div>
<?php endif; ?>
</body>

</html>