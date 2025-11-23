<?php
/**
 * Script para crear la tabla usuarios si no existe y opcionalmente un usuario de prueba
 * Ejecutar desde el navegador: http://localhost/Laliga/api/crear_tabla_usuarios.php
 * Para crear usuario de prueba: http://localhost/Laliga/api/crear_tabla_usuarios.php?crear_usuario=1
 */

@ob_start();
@ob_clean();

@error_reporting(E_ALL);
@ini_set('display_errors', 1);

@header('Content-Type: application/json; charset=UTF-8');
@header('Access-Control-Allow-Origin: *');

try {
    // Cargar configuración y conexión
    $configPath = __DIR__ . '/../config/config.php';
    if (file_exists($configPath)) {
        @require_once $configPath;
    }
    
    @require_once __DIR__ . '/../conexionBase/conexion.php';
    
    // Obtener conexión
    $conexion = Conexion::obtenerInstancia();
    $pdo = $conexion->obtenerPDO();
    
    $resultados = [];
    $crearUsuario = isset($_GET['crear_usuario']) && $_GET['crear_usuario'] === '1';
    
    // Verificar si la tabla ya existe
    $tablas = $pdo->query("SHOW TABLES LIKE 'usuarios'")->fetchAll();
    $tablaExiste = count($tablas) > 0;
    
    if ($tablaExiste) {
        $count = $pdo->query("SELECT COUNT(*) FROM usuarios")->fetchColumn();
        $resultados['tabla_existe'] = true;
        $resultados['registros_actuales'] = intval($count);
        $resultados['mensaje'] = 'La tabla usuarios ya existe';
    } else {
        // Crear la tabla
        $createTableSQL = "
        CREATE TABLE IF NOT EXISTS `usuarios` (
          `id` INT(11) NOT NULL AUTO_INCREMENT,
          `username` VARCHAR(50) NOT NULL UNIQUE,
          `email` VARCHAR(100) NOT NULL UNIQUE,
          `password` VARCHAR(255) NOT NULL,
          `nombre_completo` VARCHAR(100) DEFAULT NULL,
          `rol` ENUM('usuario', 'admin') DEFAULT 'usuario',
          `activo` TINYINT(1) DEFAULT 1,
          `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `ultimo_acceso` TIMESTAMP NULL DEFAULT NULL,
          `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_username` (`username`),
          KEY `idx_email` (`email`),
          KEY `idx_activo` (`activo`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        
        $pdo->exec($createTableSQL);
        $resultados['tabla_creada'] = true;
        $resultados['mensaje'] = 'Tabla usuarios creada correctamente';
        $tablaExiste = true; // Actualizar flag después de crear
    }
    
    // Verificar que la tabla esté correcta
    try {
        $columnas = $pdo->query("SHOW COLUMNS FROM usuarios")->fetchAll(PDO::FETCH_COLUMN);
        $resultados['columnas'] = $columnas;
        $resultados['total_columnas'] = count($columnas);
        
        // Información de las columnas
        $columnasDetalle = $pdo->query("SHOW COLUMNS FROM usuarios")->fetchAll(PDO::FETCH_ASSOC);
        $resultados['detalle_columnas'] = $columnasDetalle;
    } catch (PDOException $e) {
        $resultados['error_columnas'] = $e->getMessage();
    }
    
    // Crear usuario de prueba si se solicita y la tabla existe
    if ($crearUsuario && $tablaExiste) {
        $usernamePrueba = 'admin';
        $emailPrueba = 'admin@laliga.com';
        $passwordPrueba = 'admin123'; // Contraseña por defecto para pruebas
        $nombrePrueba = 'Administrador';
        
        // Verificar si el usuario ya existe
        $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE username = :username OR email = :email");
        $stmt->execute([
            'username' => $usernamePrueba,
            'email' => $emailPrueba
        ]);
        
        if ($stmt->fetch()) {
            $resultados['usuario_prueba'] = 'El usuario de prueba ya existe';
        } else {
            // Crear usuario de prueba (admin)
            $passwordHash = password_hash($passwordPrueba, PASSWORD_BCRYPT);
            
            $stmt = $pdo->prepare("
                INSERT INTO usuarios (username, email, password, nombre_completo, rol, activo) 
                VALUES (:username, :email, :password, :nombre_completo, 'admin', 1)
            ");
            
            $stmt->execute([
                'username' => $usernamePrueba,
                'email' => $emailPrueba,
                'password' => $passwordHash,
                'nombre_completo' => $nombrePrueba
            ]);
            
            $usuarioId = $pdo->lastInsertId();
            $resultados['usuario_prueba'] = 'Usuario de prueba creado correctamente';
            $resultados['usuario_info'] = [
                'id' => $usuarioId,
                'username' => $usernamePrueba,
                'email' => $emailPrueba,
                'nombre' => $nombrePrueba,
                'rol' => 'admin',
                'password' => $passwordPrueba . ' (contraseña por defecto - cambiar después)'
            ];
        }
    }
    
    // Obtener información final
    $countFinal = $pdo->query("SELECT COUNT(*) FROM usuarios")->fetchColumn();
    $resultados['registros_finales'] = intval($countFinal);
    
    // Obtener lista de usuarios (sin contraseñas)
    try {
        $usuarios = $pdo->query("SELECT id, username, email, nombre_completo, rol, activo, fecha_registro FROM usuarios ORDER BY id")->fetchAll(PDO::FETCH_ASSOC);
        $resultados['usuarios'] = $usuarios;
        $resultados['total_usuarios'] = count($usuarios);
    } catch (PDOException $e) {
        $resultados['error_usuarios'] = $e->getMessage();
    }
    
    @ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Tabla usuarios verificada/creada correctamente',
        'resultados' => $resultados,
        'instrucciones' => [
            'Para crear un usuario de prueba ejecuta: /api/crear_tabla_usuarios.php?crear_usuario=1',
            'Usuario de prueba (si se crea): username=admin, email=admin@laliga.com, password=admin123'
        ]
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    @ob_clean();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

@ob_end_flush();

