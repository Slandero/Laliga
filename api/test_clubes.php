<?php
/**
 * Script de prueba para verificar qué devuelve la API de clubes
 * Accede directamente a: http://localhost/Tareas/ProyectoLiga/api/test_clubes.php
 */

// Deshabilitar todos los errores
error_reporting(0);
ini_set('display_errors', 0);
ini_set('html_errors', 0);

header('Content-Type: text/plain; charset=UTF-8');

echo "=== PRUEBA DE API CLUBES ===\n\n";

// Simular una petición GET
$_SERVER['REQUEST_METHOD'] = 'GET';
unset($_GET['tabla']);
unset($_GET['id']);

echo "1. Capturando output de clubes.php...\n";
echo str_repeat("-", 50) . "\n";

// Capturar el output
ob_start();
try {
    include __DIR__ . '/clubes.php';
    $output = ob_get_clean();
    echo "Output recibido:\n";
    echo substr($output, 0, 500) . "\n";
    echo "\n¿Es JSON válido? ";
    $json = json_decode($output);
    if ($json !== null) {
        echo "SÍ\n";
        echo "Estructura: " . print_r($json, true) . "\n";
    } else {
        echo "NO - Error: " . json_last_error_msg() . "\n";
    }
} catch (Exception $e) {
    $output = ob_get_clean();
    echo "Excepción capturada: " . $e->getMessage() . "\n";
    echo "Output: " . substr($output, 0, 500) . "\n";
} catch (Error $e) {
    $output = ob_get_clean();
    echo "Error fatal: " . $e->getMessage() . "\n";
    echo "Output: " . substr($output, 0, 500) . "\n";
}

