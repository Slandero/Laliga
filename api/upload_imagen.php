<?php
/**
 * API para subir imágenes de noticias
 * POST: api/upload_imagen.php - Subir imagen (requiere autenticación)
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
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit;
}

try {
    // Iniciar sesión si no está iniciada
    if (session_status() === PHP_SESSION_NONE) {
        @session_start();
    }
    
    // Verificar autenticación
    if (!isset($_SESSION['usuario_id']) || empty($_SESSION['usuario_id'])) {
        ob_clean();
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => 'Debes iniciar sesión para subir imágenes'
        ], JSON_UNESCAPED_UNICODE);
        ob_end_flush();
        exit;
    }
    
    // Verificar que se haya enviado un archivo
    if (!isset($_FILES['imagen']) || $_FILES['imagen']['error'] !== UPLOAD_ERR_OK) {
        ob_clean();
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'No se ha enviado ningún archivo o hubo un error en la subida'
        ], JSON_UNESCAPED_UNICODE);
        ob_end_flush();
        exit;
    }
    
    $archivo = $_FILES['imagen'];
    
    // Validar tipo de archivo
    $tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $tipoArchivo = mime_content_type($archivo['tmp_name']);
    
    if (!in_array($tipoArchivo, $tiposPermitidos)) {
        ob_clean();
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)'
        ], JSON_UNESCAPED_UNICODE);
        ob_end_flush();
        exit;
    }
    
    // Validar tamaño (máximo 5MB)
    $tamañoMaximo = 5 * 1024 * 1024; // 5MB en bytes
    if ($archivo['size'] > $tamañoMaximo) {
        ob_clean();
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'El archivo es demasiado grande. Tamaño máximo: 5MB'
        ], JSON_UNESCAPED_UNICODE);
        ob_end_flush();
        exit;
    }
    
    // Crear directorio de uploads si no existe
    $directorioUploads = __DIR__ . '/../images/uploads/';
    if (!file_exists($directorioUploads)) {
        if (!mkdir($directorioUploads, 0755, true)) {
            ob_clean();
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Error al crear el directorio de uploads'
            ], JSON_UNESCAPED_UNICODE);
            ob_end_flush();
            exit;
        }
    }
    
    // Generar nombre único para el archivo
    $extension = pathinfo($archivo['name'], PATHINFO_EXTENSION);
    $nombreArchivo = uniqid('noticia_', true) . '.' . $extension;
    $rutaCompleta = $directorioUploads . $nombreArchivo;
    
    // Mover el archivo al directorio de uploads
    if (!move_uploaded_file($archivo['tmp_name'], $rutaCompleta)) {
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error al guardar el archivo'
        ], JSON_UNESCAPED_UNICODE);
        ob_end_flush();
        exit;
    }
    
    // Generar URL relativa para la imagen
    $urlImagen = 'images/uploads/' . $nombreArchivo;
    
    ob_clean();
    echo json_encode([
        'success' => true,
        'url' => $urlImagen,
        'message' => 'Imagen subida correctamente'
    ], JSON_UNESCAPED_UNICODE);
    ob_end_flush();
    exit;
    
} catch (Exception $e) {
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Error en el servidor: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    ob_end_flush();
    exit;
}

