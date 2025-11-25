<?php
/**
 * API para gestionar noticias
 * GET: api/noticias.php - Obtener todas las noticias
 * POST: api/noticias.php - Crear nueva noticia (requiere autenticación)
 * DELETE: api/noticias.php?id=X - Eliminar noticia (requiere autenticación)
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
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
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
    
    // Cargar configuración y conexión
    $configPath = __DIR__ . '/../config/config.php';
    if (file_exists($configPath)) {
        @require_once $configPath;
    }
    
    @require_once __DIR__ . '/../conexionBase/conexion.php';
    
    // Obtener conexión
    $conexion = Conexion::obtenerInstancia();
    $pdo = $conexion->obtenerPDO();
    
    // Verificar que la tabla exista, si no, crearla
    $tablas = $pdo->query("SHOW TABLES LIKE 'noticias'")->fetchAll();
    if (count($tablas) === 0) {
        // Crear tabla si no existe
        $createTableSQL = "
        CREATE TABLE IF NOT EXISTS `noticias` (
          `id` INT(11) NOT NULL AUTO_INCREMENT,
          `titulo` VARCHAR(200) NOT NULL,
          `contenido` TEXT NOT NULL,
          `imagen_url` VARCHAR(500) DEFAULT NULL,
          `usuario_id` INT(11) NOT NULL,
          `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_usuario` (`usuario_id`),
          KEY `idx_fecha_creacion` (`fecha_creacion`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        $pdo->exec($createTableSQL);
    }
    
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Verificar autenticación para métodos que modifican datos
    $usuarioId = null;
    $usuarioLogueado = false;
    if (isset($_SESSION['usuario_id']) && !empty($_SESSION['usuario_id'])) {
        $usuarioId = $_SESSION['usuario_id'];
        $usuarioLogueado = true;
    }
    
    switch ($method) {
        case 'GET':
            // Obtener todas las noticias ordenadas por fecha de creación descendente
            $sql = "SELECT n.*, u.username, u.nombre_completo 
                    FROM noticias n 
                    INNER JOIN usuarios u ON n.usuario_id = u.id 
                    ORDER BY n.fecha_creacion DESC 
                    LIMIT 10";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
            $noticias = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Formatear resultados
            $resultados = [];
            foreach ($noticias as $noticia) {
                $fechaObj = new DateTime($noticia['fecha_creacion']);
                $fechaFormateada = $fechaObj->format('d/m/Y H:i');
                
                $resultados[] = [
                    'id' => intval($noticia['id']),
                    'titulo' => $noticia['titulo'],
                    'contenido' => $noticia['contenido'],
                    'imagen_url' => $noticia['imagen_url'],
                    'usuario_id' => intval($noticia['usuario_id']),
                    'usuario_nombre' => $noticia['nombre_completo'] ? $noticia['nombre_completo'] : $noticia['username'],
                    'fecha_creacion' => $fechaFormateada,
                    'fecha_iso' => $noticia['fecha_creacion']
                ];
            }
            
            ob_clean();
            echo json_encode([
                'success' => true,
                'noticias' => $resultados,
                'total' => count($resultados)
            ], JSON_UNESCAPED_UNICODE);
            ob_end_flush();
            exit;
            
        case 'POST':
            // Crear nueva noticia (requiere autenticación)
            if (!$usuarioLogueado) {
                ob_clean();
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Debes iniciar sesión para agregar noticias'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $titulo = isset($input['titulo']) ? trim($input['titulo']) : null;
            $contenido = isset($input['contenido']) ? trim($input['contenido']) : null;
            $imagenUrl = isset($input['imagen_url']) ? trim($input['imagen_url']) : null;
            
            // Validaciones
            if (!$titulo || strlen($titulo) < 3) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'El título debe tener al menos 3 caracteres'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            if (!$contenido || strlen($contenido) < 10) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'El contenido debe tener al menos 10 caracteres'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            // Insertar noticia
            $sql = "INSERT INTO noticias (titulo, contenido, imagen_url, usuario_id) 
                    VALUES (:titulo, :contenido, :imagen_url, :usuario_id)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':titulo' => $titulo,
                ':contenido' => $contenido,
                ':imagen_url' => $imagenUrl ? $imagenUrl : null,
                ':usuario_id' => $usuarioId
            ]);
            
            $noticiaId = $pdo->lastInsertId();
            
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Noticia creada correctamente',
                'id' => intval($noticiaId)
            ], JSON_UNESCAPED_UNICODE);
            ob_end_flush();
            exit;
            
        case 'DELETE':
            // Eliminar noticia (requiere autenticación)
            if (!$usuarioLogueado) {
                ob_clean();
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Debes iniciar sesión para eliminar noticias'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $id = isset($_GET['id']) ? intval($_GET['id']) : null;
            
            if (!$id) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'ID de noticia requerido'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            // Verificar que la noticia pertenezca al usuario o que sea admin
            $sql = "SELECT usuario_id FROM noticias WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':id' => $id]);
            $noticia = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$noticia) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'Noticia no encontrada'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            // Verificar permisos (solo el autor o admin puede eliminar)
            $sqlUsuario = "SELECT rol FROM usuarios WHERE id = :id";
            $stmtUsuario = $pdo->prepare($sqlUsuario);
            $stmtUsuario->execute([':id' => $usuarioId]);
            $usuario = $stmtUsuario->fetch(PDO::FETCH_ASSOC);
            
            if ($noticia['usuario_id'] != $usuarioId && (!$usuario || $usuario['rol'] !== 'admin')) {
                ob_clean();
                http_response_code(403);
                echo json_encode([
                    'success' => false,
                    'error' => 'No tienes permisos para eliminar esta noticia'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            // Eliminar noticia
            $sql = "DELETE FROM noticias WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':id' => $id]);
            
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Noticia eliminada correctamente'
            ], JSON_UNESCAPED_UNICODE);
            ob_end_flush();
            exit;
            
        default:
            ob_clean();
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'error' => 'Método no permitido'
            ], JSON_UNESCAPED_UNICODE);
            ob_end_flush();
            exit;
    }
    
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

