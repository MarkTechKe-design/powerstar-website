<?php require_once 'includes/header.php'; ?>

<div class="page-header">
    <h1 class="page-title">Dashboard</h1>
</div>

<div class="card">
    <h3>Welcome back, <?php echo htmlspecialchars($_SESSION['admin_username']); ?>!</h3>
    <p>Use the sidebar to manage website content.</p>
</div>

<!-- Quick Stats -->
<div style="display: flex; gap: 20px; flex-wrap: wrap;">
    <?php
    // Fetch counts
    $stats = [
        'sliders' => $pdo->query("SELECT COUNT(*) FROM sliders WHERE is_active = 1")->fetchColumn(),
        'offers' => $pdo->query("SELECT COUNT(*) FROM offers WHERE is_active = 1")->fetchColumn(),
        'careers' => $pdo->query("SELECT COUNT(*) FROM careers WHERE status = 'Open'")->fetchColumn()
    ];
    ?>

    <div class="card" style="flex: 1; min-width: 200px; text-align: center;">
        <i class="fas fa-images" style="font-size: 2rem; color: var(--ps-green); margin-bottom: 10px;"></i>
        <h2><?php echo $stats['sliders']; ?></h2>
        <p>Active Sliders</p>
    </div>

    <div class="card" style="flex: 1; min-width: 200px; text-align: center;">
        <i class="fas fa-tags" style="font-size: 2rem; color: var(--ps-green); margin-bottom: 10px;"></i>
        <h2><?php echo $stats['offers']; ?></h2>
        <p>Active Offers</p>
    </div>

    <div class="card" style="flex: 1; min-width: 200px; text-align: center;">
        <i class="fas fa-briefcase" style="font-size: 2rem; color: var(--ps-green); margin-bottom: 10px;"></i>
        <h2><?php echo $stats['careers']; ?></h2>
        <p>Open Jobs</p>
    </div>
</div>

</body>

</html>