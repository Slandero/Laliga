<?php
/**
 * API para registro de usuarios
 * POST: api/registro.php
 */

@ob_start();
@ob_clean();

@error_reporting(0);
@ini_set('display_errors', 0);

@header('Content-Type: application/json; charset=UTF-8');
@header('Access-Control-Allow-Origin: *');
@header('Access-Control-Allow-Methods: POST');
@header('Access-Control-Allow-Headers: Content-Type');

@ob_clean();

try {
    // Solo permitir método POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }

    // Cargar configuración y conexión
    $configPath = __DIR__ . '/../config/config.php';
    if (file_exists($configPath)) {
        @require_once $configPath;
    }
    
    @require_once __DIR__ . '/../conexionBase/conexion.php';

    // Obtener datos del POST
    $input = json_decode(file_get_contents('php://input'), true);
    $username = isset($input['username']) ? trim($input['username']) : '';
    $email = isset($input['email']) ? trim($input['email']) : '';
    $password = isset($input['password']) ? trim($input['password']) : '';
    $password_confirm = isset($input['password_confirm']) ? trim($input['password_confirm']) : '';
    $nombre_completo = isset($input['nombre_completo']) ? trim($input['nombre_completo']) : '';

    // Validar datos
    if (empty($username) || empty($email) || empty($password)) {
        throw new Exception('Username, email y contraseña son requeridos');
    }

    if ($password !== $password_confirm) {
        throw new Exception('Las contraseñas no coinciden');
    }

    if (strlen($password) < 6) {
        throw new Exception('La contraseña debe tener al menos 6 caracteres');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Email inválido');
    }

    // Obtener conexión
    $conexion = Conexion::obtenerInstancia();
    $pdo = $conexion->obtenerPDO();

    // Verificar si el email ya existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        throw new Exception('El email ya está registrado');
    }

    // Verificar si el username ya existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE username = :username");
    $stmt->execute(['username' => $username]);
    if ($stmt->fetch()) {
        throw new Exception('El username ya está en uso');
    }

    // Hashear contraseña
    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    // Insertar nuevo usuario
    $stmt = $pdo->prepare("INSERT INTO usuarios (username, email, password, nombre_completo, rol, activo) 
                          VALUES (:username, :email, :password, :nombre_completo, 'usuario', 1)");
    $stmt->execute([
        'username' => $username,
        'email' => $email,
        'password' => $password_hash,
        'nombre_completo' => $nombre_completo ?: null
    ]);

    $usuario_id = $pdo->lastInsertId();

    // Iniciar sesión automáticamente
    session_start();
    $_SESSION['usuario_id'] = $usuario_id;
    $_SESSION['usuario_username'] = $username;
    $_SESSION['usuario_email'] = $email;
    $_SESSION['usuario_rol'] = 'usuario';
    $_SESSION['usuario_nombre'] = $nombre_completo;

    @ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Usuario registrado correctamente',
        'usuario' => [
            'id' => $usuario_id,
            'username' => $username,
            'email' => $email,
            'nombre' => $nombre_completo,
            'rol' => 'usuario'
        ]
    ], JSON_UNESCAPED_UNICODE);
    @ob_end_flush();

} catch (PDOException $e) {
    @ob_clean();
    echo json_encode([
        'success' => false,
        'error' => 'Error de base de datos: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    @ob_end_flush();
    exit;
} catch (Exception $e) {
    @ob_clean();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    @ob_end_flush();
    exit;
}

