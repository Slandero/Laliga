<?php
/**
 * Script de diagnóstico - Verifica la configuración
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$diagnostico = [
    'config_file' => [],
    'database' => [],
    'errors' => []
];

// 1. Verificar archivo de configuración
try {
    require_once __DIR__ . '/../config/config.php';
    $diagnostico['config_file'] = [
        'existe' => true,
        'DB_HOST' => defined('DB_HOST') ? DB_HOST : 'NO DEFINIDO',
        'DB_NAME' => defined('DB_NAME') ? DB_NAME : 'NO DEFINIDO',
        'DB_USER' => defined('DB_USER') ? DB_USER : 'NO DEFINIDO',
        'DB_PASS' => defined('DB_PASS') ? (DB_PASS === '' ? '(vacía)' : '***') : 'NO DEFINIDO',
        'APP_ENV' => defined('APP_ENV') ? APP_ENV : 'NO DEFINIDO'
    ];
} catch (Exception $e) {
    $diagnostico['config_file']['error'] = $e->getMessage();
    $diagnostico['errors'][] = 'Error al cargar config.php: ' . $e->getMessage();
}

// 2. Probar conexión a la base de datos
if (defined('DB_HOST') && defined('DB_NAME') && defined('DB_USER') && defined('DB_PASS')) {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
        
        $diagnostico['database'] = [
            'conexion' => 'OK',
            'host' => DB_HOST,
            'base_datos' => DB_NAME,
            'usuario' => DB_USER,
            'version' => $pdo->query('SELECT VERSION()')->fetchColumn()
        ];
        
        // Obtener tablas
        $tablas = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        $diagnostico['database']['total_tablas'] = count($tablas);
        $diagnostico['database']['tablas'] = $tablas;
        
    } catch (PDOException $e) {
        $diagnostico['database'] = [
            'conexion' => 'ERROR',
            'mensaje' => $e->getMessage(),
            'codigo' => $e->getCode()
        ];
        $diagnostico['errors'][] = 'Error de conexión: ' . $e->getMessage();
    }
} else {
    $diagnostico['database']['error'] = 'Configuración incompleta';
    $diagnostico['errors'][] = 'Las constantes de base de datos no están definidas';
}

// 3. Verificar archivos importantes
$archivos = [
    'config/config.php' => __DIR__ . '/../config/config.php',
    'conexionBase/conexion.php' => __DIR__ . '/../conexionBase/conexion.php',
    'api/helpers.php' => __DIR__ . '/helpers.php',
    'api/clubes.php' => __DIR__ . '/clubes.php'
];

$diagnostico['archivos'] = [];
foreach ($archivos as $nombre => $ruta) {
    $diagnostico['archivos'][$nombre] = [
        'existe' => file_exists($ruta),
        'ruta' => $ruta
    ];
}

echo json_encode($diagnostico, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

