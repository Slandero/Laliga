<?php
/**
 * Script para probar la conexión a Railway
 * Ejecutar desde el navegador: http://localhost/Laliga/api/test_railway_connection.php
 */

@ob_start();
@ob_clean();

@error_reporting(E_ALL);
@ini_set('display_errors', 1);

@header('Content-Type: application/json; charset=UTF-8');
@header('Access-Control-Allow-Origin: *');

try {
    // Configuración de Railway
    $host = 'yamabiko.proxy.rlwy.net';
    $port = '28754';
    $dbName = 'railway';
    $user = 'root';
    $pass = 'ZAkiwwKgwmthUgTOJMwktjGDtNmmpVxi';
    
    $resultados = [];
    
    // Probar conexión sin especificar la base de datos
    try {
        $dsn = "mysql:host=$host;port=$port;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 10 // Timeout de 10 segundos
        ]);
        $resultados['conexion_sin_bd'] = 'OK - Conectado a MySQL de Railway';
    } catch (PDOException $e) {
        $resultados['conexion_sin_bd'] = 'ERROR - ' . $e->getMessage();
        
        @ob_clean();
        echo json_encode([
            'success' => false,
            'error' => 'No se pudo conectar a Railway',
            'detalles' => $e->getMessage(),
            'codigo_error' => $e->getCode(),
            'sugerencias' => [
                '1. Verifica que Railway esté corriendo',
                '2. Verifica que las credenciales sean correctas',
                '3. Verifica tu conexión a internet',
                '4. Railway puede requerir conexiones SSL o configuración especial'
            ],
            'resultados' => $resultados
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        exit;
    }
    
    // Probar conexión con la base de datos
    try {
        $dsn = "mysql:host=$host;port=$port;dbname=$dbName;charset=utf8mb4";
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_TIMEOUT => 10
        ]);
        $resultados['conexion_con_bd'] = 'OK - Conectado a la base de datos railway';
        
        // Obtener información de la base de datos
        $version = $pdo->query('SELECT VERSION()')->fetchColumn();
        $resultados['version_mysql'] = $version;
        
        // Obtener tablas
        $tablas = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        $resultados['total_tablas'] = count($tablas);
        $resultados['tablas'] = $tablas;
        
        @ob_clean();
        echo json_encode([
            'success' => true,
            'message' => 'Conexión a Railway exitosa',
            'resultados' => $resultados
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        
    } catch (PDOException $e) {
        $resultados['conexion_con_bd'] = 'ERROR - ' . $e->getMessage();
        
        @ob_clean();
        echo json_encode([
            'success' => false,
            'error' => 'No se pudo conectar a la base de datos railway',
            'detalles' => $e->getMessage(),
            'resultados' => $resultados,
            'sugerencias' => [
                '1. La base de datos railway puede no existir en Railway',
                '2. Verifica el nombre de la base de datos en Railway',
                '3. Puede que necesites crear la base de datos primero'
            ]
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

