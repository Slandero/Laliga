<?php
/**
 * API para verificar si hay sesión activa
 * GET: api/check_session.php
 */

// Limpiar cualquier salida previa
while (ob_get_level()) {
    ob_end_clean();
}

// Configurar para no mostrar errores en pantalla
error_reporting(0);
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);

// Iniciar buffer de salida
ob_start();

// Establecer headers JSON
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Iniciar sesión si no está iniciada
    if (session_status() === PHP_SESSION_NONE) {
        @session_start();
    }
    
    // Configurar parámetros de sesión
    @ini_set('session.cookie_httponly', 1);
    @ini_set('session.use_only_cookies', 1);

    // Verificar si hay sesión activa
    if (isset($_SESSION['usuario_id']) && !empty($_SESSION['usuario_id'])) {
        // Limpiar buffer antes de enviar JSON
        ob_clean();
        
        echo json_encode([
            'success' => true,
            'logged_in' => true,
            'usuario' => [
                'id' => isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : null,
                'username' => isset($_SESSION['usuario_username']) ? $_SESSION['usuario_username'] : '',
                'email' => isset($_SESSION['usuario_email']) ? $_SESSION['usuario_email'] : '',
                'nombre' => isset($_SESSION['usuario_nombre']) ? $_SESSION['usuario_nombre'] : '',
                'rol' => isset($_SESSION['usuario_rol']) ? $_SESSION['usuario_rol'] : 'usuario'
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        // Limpiar buffer antes de enviar JSON
        ob_clean();
        
        echo json_encode([
            'success' => true,
            'logged_in' => false
        ], JSON_UNESCAPED_UNICODE);
    }
    
    ob_end_flush();
    exit;

} catch (Exception $e) {
    // Limpiar buffer antes de enviar JSON de error
    ob_clean();
    
    echo json_encode([
        'success' => false,
        'logged_in' => false,
        'error' => 'Error al verificar sesión'
    ], JSON_UNESCAPED_UNICODE);
    
    ob_end_flush();
    exit;
}

