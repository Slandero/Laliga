<?php
/**
 * API para cerrar sesión
 * POST: api/logout.php
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
    // Iniciar sesión si no está iniciada
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    // Destruir sesión
    $_SESSION = array();
    
    // Si se desea eliminar la cookie de sesión también
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    
    // Destruir la sesión
    session_destroy();

    @ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Sesión cerrada correctamente'
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

