<?php
require_once 'auth.php';
require_once '../config/db.php';
require_login();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Powerstar Admin</title>
    <!-- Use FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">

    <style>
        :root {
            --ps-green: #008000;
            --ps-dark: #005528;
            --ps-light: #f4f6f9;
            --text-color: #333;
            --sidebar-width: 250px;
        }

        body {
            font-family: 'Poppins', sans-serif;
            background: var(--ps-light);
            margin: 0;
            display: flex;
            min-height: 100vh;
            color: var(--text-color);
        }

        /* Sidebar */
        .sidebar {
            width: var(--sidebar-width);
            background: #fff;
            border-right: 1px solid #ddd;
            display: flex;
            flex-direction: column;
            position: fixed;
            height: 100%;
            z-index: 100;
        }

        .brand {
            padding: 20px;
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--ps-green);
            border-bottom: 1px solid #eee;
        }

        .nav-links {
            flex: 1;
            padding: 20px 0;
            list-style: none;
            margin: 0;
        }

        .nav-links li a {
            display: flex;
            align-items: center;
            padding: 12px 20px;
            color: #555;
            text-decoration: none;
            transition: 0.3s;
        }

        .nav-links li a:hover,
        .nav-links li a.active {
            background: #f0f9f0;
            color: var(--ps-green);
            border-right: 3px solid var(--ps-green);
        }

        .nav-links i {
            margin-right: 10px;
            width: 20px;
            text-align: center;
        }

        .user-info {
            padding: 20px;
            border-top: 1px solid #eee;
            font-size: 0.9rem;
        }

        .btn-logout {
            display: block;
            margin-top: 10px;
            color: #d32f2f;
            text-decoration: none;
            font-weight: 500;
        }

        /* Main Content */
        .main-content {
            margin-left: var(--sidebar-width);
            flex: 1;
            padding: 30px;
        }

        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
        }

        .page-title {
            margin: 0;
            font-size: 1.5rem;
            color: var(--ps-dark);
        }

        /* Cards & Tables */
        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
            padding: 20px;
            margin-bottom: 20px;
        }

        .btn {
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            color: white;
            border: none;
            cursor: pointer;
            display: inline-block;
            font-size: 0.9rem;
        }

        .btn-primary {
            background: var(--ps-green);
        }

        .btn-primary:hover {
            background: var(--ps-dark);
        }

        .btn-danger {
            background: #d32f2f;
        }

        .btn-secondary {
            background: #757575;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th,
        td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }

        th {
            font-weight: 600;
            color: #555;
            background: #f9f9f9;
        }

        .status-badge {
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 0.8rem;
        }

        .status-active {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .status-inactive {
            background: #ffebee;
            color: #c62828;
        }

        /* Forms */
        .form-group {
            margin-bottom: 15px;
        }

        .form-label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }

        .form-control {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }

        textarea.form-control {
            resize: vertical;
            min-height: 100px;
        }

        img.thumb {
            width: 60px;
            height: 40px;
            object-fit: cover;
            border-radius: 4px;
        }
    </style>
</head>

<body>

    <div class="sidebar">
        <div class="brand">Powerstar Admin</div>
        <ul class="nav-links">
            <li><a href="dashboard.php"
                    class="<?php echo basename($_SERVER['PHP_SELF']) == 'dashboard.php' ? 'active' : ''; ?>"><i
                        class="fas fa-home"></i> Dashboard</a></li>
            <li><a href="sliders.php"
                    class="<?php echo basename($_SERVER['PHP_SELF']) == 'sliders.php' ? 'active' : ''; ?>"><i
                        class="fas fa-images"></i> Sliders</a></li>
            <li><a href="offers.php"
                    class="<?php echo basename($_SERVER['PHP_SELF']) == 'offers.php' ? 'active' : ''; ?>"><i
                        class="fas fa-tags"></i> Offers</a></li>
            <li><a href="careers.php"
                    class="<?php echo basename($_SERVER['PHP_SELF']) == 'careers.php' ? 'active' : ''; ?>"><i
                        class="fas fa-briefcase"></i> Careers</a></li>
            <li><a href="media.php"
                    class="<?php echo basename($_SERVER['PHP_SELF']) == 'media.php' ? 'active' : ''; ?>"><i
                        class="fas fa-photo-video"></i> Media</a></li>
        </ul>
        <div class="user-info">
            Logged in as <strong><?php echo htmlspecialchars($_SESSION['admin_username'] ?? 'Admin'); ?></strong>
            <a href="logout.php" class="btn-logout"><i class="fas fa-sign-out-alt"></i> Logout</a>
        </div>
    </div>

    <div class="main-content">