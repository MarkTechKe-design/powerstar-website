<?php
require_once 'includes/header.php';

// Handle Actions (Delete)
if (isset($_GET['delete'])) {
    $id = (int) $_GET['delete'];
    // Get image path to delete file
    $stmt = $pdo->prepare("SELECT image_path FROM sliders WHERE id = ?");
    $stmt->execute([$id]);
    $img = $stmt->fetchColumn();

    $pdo->prepare("DELETE FROM sliders WHERE id = ?")->execute([$id]);

    // Attempt to delete file if exists
    if ($img && file_exists("../" . $img)) {
        unlink("../" . $img);
    }

    // Redirect to clear query string
    echo "<script>window.location.href='sliders.php';</script>";
}

// Handle Form Submission (Add/Edit)
$editMode = false;
$slider = null;

if (isset($_GET['edit'])) {
    $editMode = true;
    $id = (int) $_GET['edit'];
    $stmt = $pdo->prepare("SELECT * FROM sliders WHERE id = ?");
    $stmt->execute([$id]);
    $slider = $stmt->fetch();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $headline = $_POST['headline'];
    $subheadline = $_POST['subheadline'];
    $cta_text = $_POST['cta_text'];
    $cta_link = $_POST['cta_link'];
    $display_order = (int) $_POST['display_order'];
    $is_active = isset($_POST['is_active']) ? 1 : 0;

    $imagePath = $editMode ? $slider['image_path'] : '';

    // Handle Upload
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));

        if (in_array($ext, $allowed)) {
            $newName = uniqid('slider_') . '.' . $ext;
            $destination = 'uploads/sliders/' . $newName;

            // Ensure dir exists
            if (!is_dir('uploads/sliders'))
                mkdir('uploads/sliders', 0777, true);

            if (move_uploaded_file($_FILES['image']['tmp_name'], $destination)) {
                $imagePath = 'admin/' . $destination; // Store relative to root usually, or relative to domain
                // Note: Frontend is in root, admin is in /admin. 
                // If we store as 'admin/uploads/...', frontend can access it as 'admin/uploads/...'
            }
        }
    }

    if ($editMode) {
        $sql = "UPDATE sliders SET headline=?, subheadline=?, cta_text=?, cta_link=?, display_order=?, is_active=?";
        $params = [$headline, $subheadline, $cta_text, $cta_link, $display_order, $is_active];

        if (!empty($imagePath) && $imagePath !== $slider['image_path']) {
            $sql .= ", image_path=?";
            $params[] = $imagePath;
        }
        $sql .= " WHERE id=?";
        $params[] = $slider['id'];

        $pdo->prepare($sql)->execute($params);
    } else {
        if (!empty($imagePath)) {
            $sql = "INSERT INTO sliders (headline, subheadline, cta_text, cta_link, image_path, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)";
            $pdo->prepare($sql)->execute([$headline, $subheadline, $cta_text, $cta_link, $imagePath, $display_order, $is_active]);
        }
    }

    echo "<script>window.location.href='sliders.php';</script>";
}
?>

<div class="page-header">
    <h1 class="page-title">Manage Sliders</h1>
    <a href="sliders.php?action=add" class="btn btn-primary"><i class="fas fa-plus"></i> Add New Slider</a>
</div>

<!-- List View -->
<?php if (!isset($_GET['action']) && !isset($_GET['edit'])): ?>
    <div class="card">
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Headline</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $stmt = $pdo->query("SELECT * FROM sliders ORDER BY display_order ASC");
                while ($row = $stmt->fetch()):
                    ?>
                    <tr>
                        <td>
                            <?php if ($row['image_path']): ?>
                                <img src="../<?php echo $row['image_path']; ?>" class="thumb" alt="Slider">
                            <?php else: ?>
                                <span style="color:#999; font-size:0.8rem;">No Image</span>
                            <?php endif; ?>
                        </td>
                        <td><strong><?php echo htmlspecialchars($row['headline']); ?></strong><br><span
                                style="font-size:0.8rem; color:#777;"><?php echo htmlspecialchars($row['subheadline']); ?></span>
                        </td>
                        <td><?php echo $row['display_order']; ?></td>
                        <td>
                            <span class="status-badge <?php echo $row['is_active'] ? 'status-active' : 'status-inactive'; ?>">
                                <?php echo $row['is_active'] ? 'Active' : 'Hidden'; ?>
                            </span>
                        </td>
                        <td>
                            <a href="sliders.php?edit=<?php echo $row['id']; ?>" class="btn btn-secondary"
                                style="padding: 5px 10px; font-size: 0.8rem;"><i class="fas fa-edit"></i></a>
                            <a href="sliders.php?delete=<?php echo $row['id']; ?>" onclick="return confirm('Are you sure?')"
                                class="btn btn-danger" style="padding: 5px 10px; font-size: 0.8rem;"><i
                                    class="fas fa-trash"></i></a>
                        </td>
                    </tr>
                <?php endwhile; ?>
            </tbody>
        </table>
    </div>
<?php else: ?>
    <!-- Add/Edit Form -->
    <div class="card" style="max-width: 800px;">
        <h3><?php echo $editMode ? 'Edit Slider' : 'Add New Slider'; ?></h3>
        <form method="POST" enctype="multipart/form-data">
            <div class="form-group">
                <label class="form-label">Headline</label>
                <input type="text" name="headline" class="form-control"
                    value="<?php echo $editMode ? htmlspecialchars($slider['headline']) : ''; ?>"
                    placeholder="e.g. Big Savings This Weekend">
            </div>

            <div class="form-group">
                <label class="form-label">Subheadline</label>
                <input type="text" name="subheadline" class="form-control"
                    value="<?php echo $editMode ? htmlspecialchars($slider['subheadline']) : ''; ?>"
                    placeholder="e.g. Up to 50% Off Fresh Produce">
            </div>

            <div style="display:flex; gap: 20px;">
                <div class="form-group" style="flex:1;">
                    <label class="form-label">CTA Text</label>
                    <input type="text" name="cta_text" class="form-control"
                        value="<?php echo $editMode ? htmlspecialchars($slider['cta_text']) : ''; ?>"
                        placeholder="e.g. Shop Now">
                </div>
                <div class="form-group" style="flex:1;">
                    <label class="form-label">CTA Link</label>
                    <input type="text" name="cta_link" class="form-control"
                        value="<?php echo $editMode ? htmlspecialchars($slider['cta_link']) : ''; ?>"
                        placeholder="e.g. offers.html">
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Slider Image (Recommended: 1920x600)</label>
                <?php if ($editMode && $slider['image_path']): ?>
                    <div style="margin-bottom: 10px;">
                        <img src="../<?php echo $slider['image_path']; ?>" style="max-width: 200px; border-radius: 5px;">
                        <p style="font-size: 0.8rem; color: #666;">Current Image</p>
                    </div>
                <?php endif; ?>
                <input type="file" name="image" class="form-control" accept="image/*" <?php echo $editMode ? '' : 'required'; ?>>
            </div>

            <div style="display:flex; gap: 20px; align-items: center;">
                <div class="form-group" style="width: 100px;">
                    <label class="form-label">Order</label>
                    <input type="number" name="display_order" class="form-control"
                        value="<?php echo $editMode ? $slider['display_order'] : '0'; ?>">
                </div>

                <div class="form-group" style="margin-top: 25px;">
                    <label>
                        <input type="checkbox" name="is_active" <?php echo ($editMode && !$slider['is_active']) ? '' : 'checked'; ?>> Active / Visible
                    </label>
                </div>
            </div>

            <div style="margin-top: 20px;">
                <button type="submit" class="btn btn-primary">Save Slider</button>
                <a href="sliders.php" class="btn btn-secondary" style="background: #ccc; color: #333;">Cancel</a>
            </div>
        </form>
    </div>
<?php endif; ?>

</body>

</html>