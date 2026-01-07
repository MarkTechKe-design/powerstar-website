<?php
require_once 'includes/header.php';

$jsonFile = __DIR__ . '/../data/offers.json';

// Atomic JSON Read
$jsonData = file_exists($jsonFile)
    ? json_decode(file_get_contents($jsonFile), true)
    : ['hero' => [], 'offers' => []];

$offers = $jsonData['offers'] ?? [];

function saveJson(array $data)
{
    global $jsonFile;
    $tmp = $jsonFile . '.tmp';
    file_put_contents(
        $tmp,
        json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
    );
    rename($tmp, $jsonFile);
}

// Delete Action
if (isset($_GET['delete'])) {
    $id = (int) $_GET['delete'];
    $offers = array_values(array_filter($offers, function ($o) use ($id) {
        return $o['id'] !== $id;
    }));
    $jsonData['offers'] = $offers;
    saveJson($jsonData);
    echo "<script>window.location.href='offers.php';</script>";
    exit;
}

// Add/Edit Logic
$editMode = false;
$offer = null;

if (isset($_GET['edit'])) {
    $editMode = true;
    $id = (int) $_GET['edit'];
    foreach ($offers as $o) {
        if ($o['id'] === $id) {
            $offer = $o;
            break;
        }
    }
}

// Handle Form Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_name = $_POST['product_name'];
    $old_price = $_POST['old_price'];
    $new_price = $_POST['new_price'];
    $discount_label = $_POST['discount_label'];
    $active = isset($_POST['active']) ? true : false;

    // Process Branches (Comma separated string -> Array)
    $branches = array_map('trim', explode(',', $_POST['branches']));

    // Image Upload Logic
    $imagePath = $editMode ? ($offer['image'] ?? '') : '';

    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));

        if (in_array($ext, $allowed)) {
            $newName = uniqid('offer_') . '.' . $ext;
            // Target directory relative to this script
            $targetDir = __DIR__ . '/../assets/offers/';

            if (!is_dir($targetDir)) {
                mkdir($targetDir, 0777, true);
            }

            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetDir . $newName)) {
                // Path stored in JSON (relative to website root)
                $imagePath = 'assets/offers/' . $newName;
            }
        }
    }

    if ($editMode && $offer) {
        // Update Existing
        foreach ($offers as &$o) {
            if ($o['id'] === $offer['id']) {
                $o['product_name'] = $product_name;
                $o['old_price'] = $old_price;
                $o['new_price'] = $new_price;
                $o['discount_label'] = $discount_label;
                $o['branches'] = $branches;
                $o['image'] = $imagePath;
                $o['active'] = $active;
                break;
            }
        }
    } else {
        // Create New
        $newId = empty($offers) ? 1 : max(array_column($offers, 'id')) + 1;

        $offers[] = [
            'id' => $newId,
            'product_name' => $product_name,
            'image' => $imagePath,
            'old_price' => $old_price,
            'new_price' => $new_price,
            'discount_label' => $discount_label,
            'branches' => $branches,
            'active' => $active
        ];
    }

    $jsonData['offers'] = $offers;
    saveJson($jsonData);
    echo "<script>window.location.href='offers.php';</script>";
    exit;
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
                    <th>Product Details</th>
                    <th>Pricing</th>
                    <th>Branches</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($offers as $row): ?>
                    <tr>
                        <td>
                            <?php if (!empty($row['image'])): ?>
                                <img src="../<?php echo htmlspecialchars($row['image']); ?>" class="thumb">
                            <?php else: ?>
                                <span style="color:#ccc;">No Image</span>
                            <?php endif; ?>
                        </td>
                        <td>
                            <strong><?php echo htmlspecialchars($row['product_name']); ?></strong><br>
                            <?php if (!empty($row['discount_label'])): ?>
                                <small class="badge"
                                    style="background:var(--ps-red); color:white; padding:2px 6px; border-radius:4px;"><?php echo htmlspecialchars($row['discount_label']); ?></small>
                            <?php endif; ?>
                        </td>
                        <td>
                            <div style="display:flex; flex-direction:column;">
                                <s style="color:#999; font-size:0.9em;"><?php echo htmlspecialchars($row['old_price']); ?></s>
                                <span
                                    style="color:var(--ps-green); font-weight:bold;"><?php echo htmlspecialchars($row['new_price']); ?></span>
                            </div>
                        </td>
                        <td>
                            <small><?php echo htmlspecialchars(implode(', ', $row['branches'])); ?></small>
                        </td>
                        <td>
                            <span class="status-badge <?php echo $row['active'] ? 'status-active' : 'status-inactive'; ?>">
                                <?php echo $row['active'] ? 'Active' : 'Inactive'; ?>
                            </span>
                        </td>
                        <td>
                            <a href="offers.php?edit=<?php echo $row['id']; ?>" class="btn btn-secondary"><i
                                    class="fas fa-edit"></i></a>
                            <a href="offers.php?delete=<?php echo $row['id']; ?>" onclick="return confirm('Delete this offer?')"
                                class="btn btn-danger"><i class="fas fa-trash"></i></a>
                        </td>
                    </tr>
                <?php endforeach; ?>
                <?php if (empty($offers)): ?>
                    <tr>
                        <td colspan="6" style="text-align:center; padding:20px;">No offers found. Add one to get started.</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
<?php else: ?>
    <div class="card" style="max-width: 800px;">
        <h3><?php echo $editMode ? 'Edit Offer' : 'Add New Offer'; ?></h3>
        <form method="POST" enctype="multipart/form-data">

            <div class="form-group">
                <label class="form-label">Product Name</label>
                <input type="text" name="product_name" class="form-control"
                    value="<?php echo $editMode ? htmlspecialchars($offer['product_name']) : ''; ?>" required>
            </div>

            <div style="display:flex; gap: 20px;">
                <div class="form-group" style="flex:1;">
                    <label class="form-label">Old Price (e.g. Ksh 1,800)</label>
                    <input type="text" name="old_price" class="form-control"
                        value="<?php echo $editMode ? htmlspecialchars($offer['old_price']) : ''; ?>" required>
                </div>
                <div class="form-group" style="flex:1;">
                    <label class="form-label">New Price (e.g. Ksh 1,620)</label>
                    <input type="text" name="new_price" class="form-control"
                        value="<?php echo $editMode ? htmlspecialchars($offer['new_price']) : ''; ?>" required>
                </div>
            </div>

            <div style="display:flex; gap: 20px;">
                <div class="form-group" style="flex:1;">
                    <label class="form-label">Discount Label (Optional)</label>
                    <input type="text" name="discount_label" class="form-control" placeholder="-10%, HOT, SALE"
                        value="<?php echo $editMode ? htmlspecialchars($offer['discount_label']) : ''; ?>">
                </div>
                <div class="form-group" style="flex:2;">
                    <label class="form-label">Branches (Comma separated)</label>
                    <input type="text" name="branches" class="form-control" placeholder="Kasarani, Ruiru, All Branches"
                        value="<?php echo $editMode ? htmlspecialchars(implode(', ', $offer['branches'])) : 'All Branches'; ?>"
                        required>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Product Image</label>
                <input type="file" name="image" class="form-control" accept="image/*">
                <?php if ($editMode && !empty($offer['image'])): ?>
                    <div style="margin-top:10px; padding:5px; border:1px solid #eee; display:inline-block;">
                        <small>Current Image:</small><br>
                        <img src="../<?php echo htmlspecialchars($offer['image']); ?>" style="height: 80px; width:auto;">
                    </div>
                <?php endif; ?>
            </div>

            <div class="form-group">
                <label style="display:flex; align-items:center; cursor:pointer;">
                    <input type="checkbox" name="active" style="width:auto; margin-right:10px;" <?php echo ($editMode && !$offer['active']) ? '' : 'checked'; ?>>
                    <strong>Active (Visible on Website)</strong>
                </label>
            </div>

            <button type="submit" class="btn btn-primary">Save Offer</button>
            <a href="offers.php" class="btn btn-secondary">Cancel</a>
        </form>
    </div>
<?php endif; ?>

</body>

</html>