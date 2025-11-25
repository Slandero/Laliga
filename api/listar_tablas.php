<?php
/**
 * Endpoint para listar todas las tablas de la base de datos laliga
 * Acceso: http://localhost/Laliga/api/listar_tablas.php
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../conexionBase/conexion.php';

try {
    $conexion = Conexion::obtenerInstancia();
    $pdo = $conexion->obtenerPDO();
    
    // Cambiar a la base de datos laliga
    $pdo->exec("USE `laliga`");
    
    // Obtener todas las tablas
    $stmt = $pdo->query("SHOW TABLES");
    $tablas = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    // Obtener información de cada tabla
    $tablasInfo = [];
    foreach ($tablas as $tabla) {
        $stmt = $pdo->query("SELECT COUNT(*) as total FROM `$tabla`");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Obtener estructura de la tabla
        $stmt = $pdo->query("DESCRIBE `$tabla`");
        $columnas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $tablasInfo[] = [
            'nombre' => $tabla,
            'registros' => (int)$result['total'],
            'columnas' => array_map(function($col) {
                return [
                    'campo' => $col['Field'],
                    'tipo' => $col['Type'],
                    'nulo' => $col['Null'],
                    'clave' => $col['Key'],
                    'default' => $col['Default']
                ];
            }, $columnas)
        ];
    }
    
    // Separar tablas de equipos de otras
    $tablasEquipos = [];
    $otrasTablas = [];
    
    foreach ($tablasInfo as $tabla) {
        if (in_array($tabla['nombre'], ['entrenadores', 'partidos', 'usuarios', 'eventos_partido'])) {
            $otrasTablas[] = $tabla;
        } else {
            $tablasEquipos[] = $tabla;
        }
    }
    
    // Ordenar tablas de equipos alfabéticamente
    usort($tablasEquipos, function($a, $b) {
        return strcmp($a['nombre'], $b['nombre']);
    });
    
    echo json_encode([
        'success' => true,
        'total_tablas' => count($tablasInfo),
        'tablas_equipos' => $tablasEquipos,
        'otras_tablas' => $otrasTablas,
        'resumen' => [
            'total_equipos' => count($tablasEquipos),
            'total_otras' => count($otrasTablas),
            'total_registros_equipos' => array_sum(array_column($tablasEquipos, 'registros')),
            'total_registros_otras' => array_sum(array_column($otrasTablas, 'registros'))
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

