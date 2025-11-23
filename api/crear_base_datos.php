<?php
/**
 * Script para crear la base de datos local si no existe
 * Ejecutar desde el navegador: http://localhost/Laliga/api/crear_base_datos.php
 */

@ob_start();
@ob_clean();

@error_reporting(E_ALL);
@ini_set('display_errors', 1);

@header('Content-Type: application/json; charset=UTF-8');
@header('Access-Control-Allow-Origin: *');

try {
    // Detectar si estamos en localhost
    $isLocal = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', 'localhost:8080', 'localhost:3000', '127.0.0.1:80', '127.0.0.1:8080']) 
              || strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost:') === 0
              || strpos($_SERVER['HTTP_HOST'] ?? '', '127.0.0.1:') === 0;

    if (!$isLocal) {
        throw new Exception('Este script solo funciona en entorno local');
    }

    // Configuración para LOCAL (XAMPP)
    $host = '127.0.0.1';
    $port = '3306';
    $dbName = 'laliga';
    $user = 'root';
    $pass = '';

    // Conectar a MySQL sin especificar la base de datos
    $dsn = "mysql:host=$host;port=$port;charset=utf8mb4";
    
    try {
        $pdo = new PDO($dsn, $user, $pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
    } catch (PDOException $e) {
        throw new Exception('Error al conectar a MySQL. Asegúrate de que XAMPP esté corriendo y MySQL esté iniciado: ' . $e->getMessage());
    }

    $resultados = [];

    // Verificar si la base de datos existe
    $stmt = $pdo->query("SHOW DATABASES LIKE '$dbName'");
    $exists = $stmt->rowCount() > 0;

    if (!$exists) {
        // Crear la base de datos
        $pdo->exec("CREATE DATABASE `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $resultados['base_datos'] = "Base de datos '$dbName' creada correctamente";
    } else {
        $resultados['base_datos'] = "La base de datos '$dbName' ya existe";
    }

    // Ahora conectarse a la base de datos creada
    $dsnWithDb = "mysql:host=$host;port=$port;dbname=$dbName;charset=utf8mb4";
    $pdo = new PDO($dsnWithDb, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $resultados['conexion'] = "Conectado a la base de datos '$dbName' correctamente";

    @ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Base de datos verificada/creada correctamente',
        'resultados' => $resultados,
        'siguiente_paso' => 'Ahora ejecuta: /api/crear_equipos.php para crear las tablas'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    @ob_clean();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

@ob_end_flush();

