<?php
/**
 * API para gestionar partidos y resultados de jornadas
 * GET: api/partidos.php?jornada=X - Obtener partidos de una jornada
 * POST: api/partidos.php - Crear nuevo partido
 * PUT: api/partidos.php?id=X - Actualizar partido
 * DELETE: api/partidos.php?id=X - Eliminar partido
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
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
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
    $tablas = $pdo->query("SHOW TABLES LIKE 'partidos'")->fetchAll();
    if (count($tablas) === 0) {
        // Crear tabla si no existe
        $createTableSQL = "
        CREATE TABLE IF NOT EXISTS `partidos` (
          `id` INT(11) NOT NULL AUTO_INCREMENT,
          `jornada` INT(2) NOT NULL,
          `fecha` DATE NOT NULL,
          `horario` TIME NOT NULL,
          `equipo_local` VARCHAR(100) NOT NULL,
          `equipo_visitante` VARCHAR(100) NOT NULL,
          `goles_local` INT(2) DEFAULT NULL,
          `goles_visitante` INT(2) DEFAULT NULL,
          `usuario_id` INT(11) DEFAULT NULL,
          `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_jornada` (`jornada`),
          KEY `idx_fecha` (`fecha`),
          KEY `idx_usuario` (`usuario_id`)
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
            // Obtener partidos de una jornada específica
            $jornada = isset($_GET['jornada']) ? intval($_GET['jornada']) : null;
            
            if (!$jornada || $jornada < 1 || $jornada > 38) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'Jornada inválida. Debe ser entre 1 y 38.'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $sql = "SELECT * FROM partidos WHERE jornada = :jornada ORDER BY fecha ASC, horario ASC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':jornada' => $jornada]);
            $partidos = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Formatear resultados
            $resultados = [];
            foreach ($partidos as $partido) {
                $fechaObj = new DateTime($partido['fecha']);
                $dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
                $diaSemana = $dias[$fechaObj->format('w')];
                $fechaFormateada = strtoupper($diaSemana . ' ' . $fechaObj->format('d.m.Y'));
                
                $horario = substr($partido['horario'], 0, 5); // HH:MM
                
                $resultado = null;
                if ($partido['goles_local'] !== null && $partido['goles_visitante'] !== null) {
                    $resultado = $partido['goles_local'] . '-' . $partido['goles_visitante'];
                }
                
                $resultados[] = [
                    'id' => intval($partido['id']),
                    'jornada' => intval($partido['jornada']),
                    'fecha' => $fechaFormateada,
                    'fecha_iso' => $partido['fecha'],
                    'horario' => $horario,
                    'local' => $partido['equipo_local'],
                    'visitante' => $partido['equipo_visitante'],
                    'resultado' => $resultado,
                    'goles_local' => $partido['goles_local'] !== null ? intval($partido['goles_local']) : null,
                    'goles_visitante' => $partido['goles_visitante'] !== null ? intval($partido['goles_visitante']) : null
                ];
            }
            
            ob_clean();
            echo json_encode([
                'success' => true,
                'jornada' => $jornada,
                'partidos' => $resultados,
                'total' => count($resultados)
            ], JSON_UNESCAPED_UNICODE);
            ob_end_flush();
            exit;
            
        case 'POST':
            // Crear nuevo partido (requiere autenticación)
            if (!$usuarioLogueado) {
                ob_clean();
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Debes iniciar sesión para agregar partidos'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $jornada = isset($input['jornada']) ? intval($input['jornada']) : null;
            $fecha = isset($input['fecha']) ? $input['fecha'] : null;
            $horario = isset($input['horario']) ? $input['horario'] : null;
            $equipoLocal = isset($input['equipo_local']) ? trim($input['equipo_local']) : null;
            $equipoVisitante = isset($input['equipo_visitante']) ? trim($input['equipo_visitante']) : null;
            $golesLocal = isset($input['goles_local']) ? ($input['goles_local'] === '' ? null : intval($input['goles_local'])) : null;
            $golesVisitante = isset($input['goles_visitante']) ? ($input['goles_visitante'] === '' ? null : intval($input['goles_visitante'])) : null;
            
            // Validaciones
            if (!$jornada || $jornada < 1 || $jornada > 38) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'Jornada inválida'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            if (!$fecha || !$horario || !$equipoLocal || !$equipoVisitante) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'Faltan campos requeridos'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            // Insertar partido
            $sql = "INSERT INTO partidos (jornada, fecha, horario, equipo_local, equipo_visitante, goles_local, goles_visitante, usuario_id) 
                    VALUES (:jornada, :fecha, :horario, :equipo_local, :equipo_visitante, :goles_local, :goles_visitante, :usuario_id)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':jornada' => $jornada,
                ':fecha' => $fecha,
                ':horario' => $horario,
                ':equipo_local' => $equipoLocal,
                ':equipo_visitante' => $equipoVisitante,
                ':goles_local' => $golesLocal,
                ':goles_visitante' => $golesVisitante,
                ':usuario_id' => $usuarioId
            ]);
            
            $partidoId = $pdo->lastInsertId();
            
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Partido creado correctamente',
                'id' => intval($partidoId)
            ], JSON_UNESCAPED_UNICODE);
            ob_end_flush();
            exit;
            
        case 'PUT':
            // Actualizar partido (requiere autenticación)
            if (!$usuarioLogueado) {
                ob_clean();
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Debes iniciar sesión para editar partidos'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $id = isset($input['id']) ? intval($input['id']) : null;
            
            if (!$id) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'ID de partido requerido'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            // Construir query de actualización dinámicamente
            $campos = [];
            $valores = [':id' => $id];
            
            if (isset($input['jornada'])) {
                $campos[] = 'jornada = :jornada';
                $valores[':jornada'] = intval($input['jornada']);
            }
            if (isset($input['fecha'])) {
                $campos[] = 'fecha = :fecha';
                $valores[':fecha'] = $input['fecha'];
            }
            if (isset($input['horario'])) {
                $campos[] = 'horario = :horario';
                $valores[':horario'] = $input['horario'];
            }
            if (isset($input['equipo_local'])) {
                $campos[] = 'equipo_local = :equipo_local';
                $valores[':equipo_local'] = $input['equipo_local'];
            }
            if (isset($input['equipo_visitante'])) {
                $campos[] = 'equipo_visitante = :equipo_visitante';
                $valores[':equipo_visitante'] = $input['equipo_visitante'];
            }
            if (isset($input['goles_local'])) {
                $campos[] = 'goles_local = :goles_local';
                $valores[':goles_local'] = $input['goles_local'] === '' ? null : intval($input['goles_local']);
            }
            if (isset($input['goles_visitante'])) {
                $campos[] = 'goles_visitante = :goles_visitante';
                $valores[':goles_visitante'] = $input['goles_visitante'] === '' ? null : intval($input['goles_visitante']);
            }
            
            if (empty($campos)) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'No hay campos para actualizar'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $sql = "UPDATE partidos SET " . implode(', ', $campos) . " WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($valores);
            
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Partido actualizado correctamente'
            ], JSON_UNESCAPED_UNICODE);
            ob_end_flush();
            exit;
            
        case 'DELETE':
            // Eliminar partido o jornada completa (requiere autenticación)
            if (!$usuarioLogueado) {
                ob_clean();
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Debes iniciar sesión para eliminar partidos'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $id = isset($_GET['id']) ? intval($_GET['id']) : null;
            $jornada = isset($_GET['jornada']) ? intval($_GET['jornada']) : null;
            
            // Si se proporciona jornada, eliminar todos los partidos de esa jornada
            if ($jornada) {
                if ($jornada < 1 || $jornada > 38) {
                    ob_clean();
                    echo json_encode([
                        'success' => false,
                        'error' => 'Jornada inválida. Debe ser entre 1 y 38.'
                    ], JSON_UNESCAPED_UNICODE);
                    ob_end_flush();
                    exit;
                }
                
                $sql = "DELETE FROM partidos WHERE jornada = :jornada";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':jornada' => $jornada]);
                $eliminados = $stmt->rowCount();
                
                ob_clean();
                echo json_encode([
                    'success' => true,
                    'message' => "Se eliminaron {$eliminados} partidos de la jornada {$jornada}"
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            // Si se proporciona ID, eliminar un partido específico
            if (!$id) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'ID de partido o jornada requerido'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $sql = "DELETE FROM partidos WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':id' => $id]);
            
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Partido eliminado correctamente'
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

