<?php
/**
 * Script de prueba para verificar que la API de jugadores funciona correctamente
 * Ejecutar: http://localhost/Laliga/api/test_equipo.php?equipo=fc_barcelona
 */

@ob_start();
@ob_clean();

@error_reporting(E_ALL);
@ini_set('display_errors', 1);

@header('Content-Type: application/json; charset=UTF-8');
@header('Access-Control-Allow-Origin: *');

try {
    // Cargar configuración
    $configPath = __DIR__ . '/../config/config.php';
    if (file_exists($configPath)) {
        @require_once $configPath;
    }
    
    @require_once __DIR__ . '/../conexionBase/conexion.php';
    
    $equipo = isset($_GET['equipo']) ? $_GET['equipo'] : 'fc_barcelona';
    
    // Llamar a la API de jugadores
    $url = "http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/jugadores.php?tabla=" . urlencode($equipo);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $data = json_decode($response, true);
        
        echo json_encode([
            'success' => true,
            'equipo' => $equipo,
            'total_registros' => isset($data['total']) ? $data['total'] : 0,
            'jugadores' => isset($data['jugadores']) ? $data['jugadores'] : 0,
            'entrenadores' => isset($data['entrenadores']) ? $data['entrenadores'] : 0,
            'primer_jugador' => isset($data['data'][0]) ? $data['data'][0] : null,
            'campos_detectados' => isset($data['data'][0]) ? array_keys($data['data'][0]) : [],
            'mensaje' => 'API funcionando correctamente'
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Error al llamar a la API',
            'http_code' => $httpCode,
            'response' => $response
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
    
} catch (Exception $e) {
    @ob_clean();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

@ob_end_flush();

