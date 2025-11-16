<?php
// Test simple de la API de jugadores

// Deshabilitar TODOS los errores
error_reporting(0);
ini_set('display_errors', 0);
ini_set('html_errors', 0);

// Buffer de salida
ob_start();

header('Content-Type: application/json; charset=UTF-8');

try {
    ob_clean();
    
    // Configuración
    $host = '127.0.0.1';
    $db = 'laliga';
    $user = 'root';
    $pass = '';
    
    // Conexión directa
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
    
    $tabla = $_GET['tabla'] ?? 'fc_barcelona';
    
    $sql = "SELECT * FROM `$tabla` LIMIT 5";
    $stmt = $pdo->query($sql);
    $jugadores = $stmt->fetchAll();
    
    ob_clean();
    echo json_encode([
        'success' => true,
        'data' => $jugadores,
        'total' => count($jugadores)
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    ob_clean();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

ob_end_flush();

