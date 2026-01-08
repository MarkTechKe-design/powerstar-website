<?php
session_start();

/**
 * TEMPORARY SIMPLE LOGIN
 * JSON-based CMS
 */

// If already logged in, go to dashboard
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header("Location: dashboard.php");
    exit;
}

// Handle login
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    // CHANGE THESE CREDENTIALS
    if ($username === 'admin' && $password === 'powerstar123') {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = 'Admin';
        header("Location: dashboard.php");
        exit;
    } else {
        $error = "Invalid credentials.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Powerstar Admin Login</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f6f9;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .login-box {
            background: white;
            padding: 30px;
            width: 100%;
            max-width: 360px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,.1);
        }
        h2 { text-align: center; color: #008000; }
        input, button {
            width: 100%;
            padding: 10px;
            margin-top: 12px;
        }
        button {
            background: #008000;
            color: white;
            border: none;
            font-weight: bold;
            cursor: pointer;
        }
        .error {
            background: #ffebee;
            color: #c62828;
            padding: 10px;
            margin-top: 10px;
            text-align: center;
        }
    </style>
</head>
<body>

<div class="login-box">
    <h2>Powerstar Admin</h2>

    <?php if ($error): ?>
        <div class="error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="POST">
        <input type="text" name="username" placeholder="Username" required>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit">Login</button>
    </form>
</div>

</body>
</html>
