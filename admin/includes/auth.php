<?php
session_start();

// Check if user is logged in
function require_login() {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        header("Location: index.php");
        exit;
    }
}

// Check logged in state (bool)
function is_logged_in() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

// Redirect if already logged in
function redirect_if_logged_in() {
    if (is_logged_in()) {
        header("Location: dashboard.php");
        exit;
    }
}
?>