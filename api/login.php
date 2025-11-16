<?php
/**
 * API para iniciar sesión
 * POST: api/login.php
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
    $email = isset($input['email']) ? trim($input['email']) : '';
    $password = isset($input['password']) ? trim($input['password']) : '';

    // Validar datos
    if (empty($email) || empty($password)) {
        throw new Exception('Email/username y contraseña son requeridos');
    }

    // Obtener conexión
    $conexion = Conexion::obtenerInstancia();
    $pdo = $conexion->obtenerPDO();

    // Buscar usuario por email o username
    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE (email = :email OR username = :username) AND activo = 1");
    $stmt->execute([
        'email' => $email,
        'username' => $email
    ]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verificar si el usuario existe y la contraseña es correcta
    if (!$usuario || !password_verify($password, $usuario['password'])) {
        @ob_clean();
        echo json_encode([
            'success' => false,
            'error' => 'Credenciales incorrectas'
        ], JSON_UNESCAPED_UNICODE);
        @ob_end_flush();
        exit;
    }

    // Iniciar sesión si no está iniciada
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    
    // Configurar parámetros de sesión
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    
    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_username'] = $usuario['username'];
    $_SESSION['usuario_email'] = $usuario['email'];
    $_SESSION['usuario_rol'] = $usuario['rol'];
    $_SESSION['usuario_nombre'] = $usuario['nombre_completo'];

    // Actualizar último acceso
    $stmt = $pdo->prepare("UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = :id");
    $stmt->execute(['id' => $usuario['id']]);

    @ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Sesión iniciada correctamente',
        'usuario' => [
            'id' => $usuario['id'],
            'username' => $usuario['username'],
            'email' => $usuario['email'],
            'nombre' => $usuario['nombre_completo'],
            'rol' => $usuario['rol']
        ]
    ], JSON_UNESCAPED_UNICODE);
    @ob_end_flush();

} catch (Exception $e) {
    @ob_clean();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    @ob_end_flush();
    exit;
}

