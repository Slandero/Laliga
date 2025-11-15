<?php
/**
 * Test simple para verificar que la API funciona
 */

// Deshabilitar TODOS los errores visuales
error_reporting(0);
ini_set('display_errors', 0);
ini_set('html_errors', 0);

// Iniciar buffer
ob_start();

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

try {
    require_once __DIR__ . '/../config/config.php';
    require_once __DIR__ . '/../conexionBase/conexion.php';
    
    $conexion = Conexion::obtenerInstancia();
    $pdo = $conexion->obtenerPDO();
    
    // Obtener tablas
    $tablas = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    
    // Filtrar tablas de clubes
    $clubes = [];
    foreach ($tablas as $tabla) {
        if ($tabla !== 'entrenadores') {
            $count = $pdo->query("SELECT COUNT(*) FROM `$tabla`")->fetchColumn();
            $clubes[] = [
                'tabla' => $tabla,
                'total_registros' => intval($count)
            ];
        }
    }
    
    ob_clean();
    echo json_encode([
        'success' => true,
        'data' => $clubes,
        'message' => 'Test exitoso'
    ], JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    ob_clean();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

