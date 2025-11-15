<?php
/**
 * Funciones auxiliares para la API
 */

// Si no está definido, marcar como endpoint de API
if (!defined('IS_API_ENDPOINT')) {
    define('IS_API_ENDPOINT', true);
}

// Deshabilitar display_errors para evitar HTML en las respuestas
ini_set('display_errors', 0);
ini_set('html_errors', 0);
error_reporting(0);

// Iniciar buffer de salida para capturar cualquier error
if (!ob_get_level()) {
    ob_start();
}

require_once __DIR__ . '/../config/config.php';

/**
 * Configurar cabeceras CORS
 */
function configurarCORS() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    // Obtener los orígenes permitidos de la variable global
    $allowedOrigins = [];
    if (isset($GLOBALS['CORS_ALLOWED_ORIGINS']) && is_array($GLOBALS['CORS_ALLOWED_ORIGINS'])) {
        $allowedOrigins = $GLOBALS['CORS_ALLOWED_ORIGINS'];
    }
    
    // En desarrollo, permitir todos los orígenes
    if (defined('APP_ENV') && APP_ENV === 'development') {
        header("Access-Control-Allow-Origin: *");
    } elseif (!empty($origin) && in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    } elseif (empty($origin)) {
        // Si no hay origin (acceso directo), permitir
        header("Access-Control-Allow-Origin: *");
    }
    
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json; charset=UTF-8");
    
    // Manejar peticiones OPTIONS (preflight)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * Enviar respuesta JSON
 * @param mixed $data Datos a enviar
 * @param int $codigo Código HTTP
 */
function enviarRespuesta($data, $codigo = 200) {
    // Limpiar TODOS los buffers de salida
    while (ob_get_level()) {
        ob_end_clean();
    }
    
    // Asegurar que no hay headers enviados
    if (!headers_sent()) {
        http_response_code($codigo);
        header('Content-Type: application/json; charset=UTF-8');
        header('Access-Control-Allow-Origin: *');
    }
    
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit();
}

/**
 * Enviar respuesta de error
 * @param string $mensaje Mensaje de error
 * @param int $codigo Código HTTP
 */
function enviarError($mensaje, $codigo = 400) {
    enviarRespuesta([
        'success' => false,
        'error' => $mensaje
    ], $codigo);
}

/**
 * Enviar respuesta de éxito
 * @param mixed $data Datos a enviar
 * @param string $mensaje Mensaje opcional
 * @param int $codigo Código HTTP
 */
function enviarExito($data, $mensaje = null, $codigo = 200) {
    $respuesta = [
        'success' => true,
        'data' => $data
    ];
    
    if ($mensaje !== null) {
        $respuesta['message'] = $mensaje;
    }
    
    enviarRespuesta($respuesta, $codigo);
}

/**
 * Obtener datos del cuerpo de la petición JSON
 * @return array
 */
function obtenerDatosJSON() {
    $json = file_get_contents('php://input');
    $datos = json_decode($json, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        enviarError('JSON inválido', 400);
    }
    
    return $datos;
}

/**
 * Validar que los campos requeridos estén presentes
 * @param array $datos Datos a validar
 * @param array $campos Campos requeridos
 */
function validarCamposRequeridos($datos, $campos) {
    $faltantes = [];
    
    foreach ($campos as $campo) {
        if (!isset($datos[$campo]) || empty($datos[$campo])) {
            $faltantes[] = $campo;
        }
    }
    
    if (!empty($faltantes)) {
        enviarError('Campos requeridos faltantes: ' . implode(', ', $faltantes), 400);
    }
}

/**
 * Limpiar y escapar datos de entrada
 * @param string $dato Dato a limpiar
 * @return string
 */
function limpiarDato($dato) {
    return htmlspecialchars(trim($dato), ENT_QUOTES, 'UTF-8');
}


