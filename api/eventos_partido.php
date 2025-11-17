<?php
/**
 * API para gestionar eventos de partido (goles, asistencias, tarjetas)
 * GET: api/eventos_partido.php?partido_id=X - Obtener eventos de un partido
 * POST: api/eventos_partido.php - Crear nuevo evento
 * PUT: api/eventos_partido.php?id=X - Actualizar evento
 * DELETE: api/eventos_partido.php?id=X - Eliminar evento
 */

// Configurar para no mostrar errores en pantalla
error_reporting(0);
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
ini_set('log_errors', 0);

// Limpiar cualquier salida previa
while (ob_get_level()) {
    ob_end_clean();
}

// Iniciar buffer de salida limpio
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
    
    // Limpiar buffer antes de incluir archivos
    ob_clean();
    
    // Cargar configuración y conexión
    try {
        $configPath = __DIR__ . '/../config/config.php';
        if (file_exists($configPath)) {
            @require_once $configPath;
        }
        
        @require_once __DIR__ . '/../conexionBase/conexion.php';
        
        // Limpiar cualquier salida de los includes
        ob_clean();
        
        // Obtener conexión
        $conexion = Conexion::obtenerInstancia();
        $pdo = $conexion->obtenerPDO();
    } catch (Exception $e) {
        ob_clean();
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Error de conexión: ' . $e->getMessage()
        ], JSON_UNESCAPED_UNICODE);
        ob_end_flush();
        exit;
    }
    
    // Verificar que la tabla exista, si no, crearla
    $tablas = $pdo->query("SHOW TABLES LIKE 'eventos_partido'")->fetchAll();
    if (count($tablas) === 0) {
        // Crear tabla si no existe
        $createTableSQL = "
        CREATE TABLE IF NOT EXISTS `eventos_partido` (
          `id` INT(11) NOT NULL AUTO_INCREMENT,
          `partido_id` INT(11) NOT NULL,
          `tipo_evento` ENUM('gol', 'asistencia', 'tarjeta_amarilla', 'tarjeta_roja', 'sustitucion', 'fin_partido') NOT NULL,
          `minuto` VARCHAR(10) NOT NULL,
          `jugador_id` VARCHAR(100) DEFAULT NULL,
          `jugador_nombre` VARCHAR(200) NOT NULL,
          `jugador_dorsal` VARCHAR(10) DEFAULT NULL,
          `equipo` ENUM('local', 'visitante') NOT NULL,
          `jugador_asistencia_id` VARCHAR(100) DEFAULT NULL,
          `jugador_asistencia_nombre` VARCHAR(200) DEFAULT NULL,
          `jugador_asistencia_dorsal` VARCHAR(10) DEFAULT NULL,
          `jugador_sale_id` VARCHAR(100) DEFAULT NULL,
          `jugador_sale_nombre` VARCHAR(200) DEFAULT NULL,
          `jugador_sale_dorsal` VARCHAR(10) DEFAULT NULL,
          `jugador_entra_id` VARCHAR(100) DEFAULT NULL,
          `jugador_entra_nombre` VARCHAR(200) DEFAULT NULL,
          `jugador_entra_dorsal` VARCHAR(10) DEFAULT NULL,
          `es_penal` TINYINT(1) DEFAULT 0,
          `es_autogol` TINYINT(1) DEFAULT 0,
          `usuario_id` INT(11) DEFAULT NULL,
          `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_partido` (`partido_id`),
          KEY `idx_tipo_evento` (`tipo_evento`),
          KEY `idx_minuto` (`minuto`),
          KEY `idx_usuario` (`usuario_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        ";
        $pdo->exec($createTableSQL);
    } else {
        // Verificar si las columnas es_penal y es_autogol existen, si no, agregarlas
        try {
            $columnas = $pdo->query("SHOW COLUMNS FROM eventos_partido")->fetchAll(PDO::FETCH_COLUMN);
            
            // Verificar y agregar columnas de dorsal si no existen (primero los dorsales)
            if (!in_array('jugador_dorsal', $columnas)) {
                try {
                    @$pdo->exec("ALTER TABLE eventos_partido ADD COLUMN jugador_dorsal VARCHAR(10) DEFAULT NULL AFTER jugador_nombre");
                } catch (Exception $e) {}
            }
            if (!in_array('jugador_asistencia_dorsal', $columnas)) {
                try {
                    @$pdo->exec("ALTER TABLE eventos_partido ADD COLUMN jugador_asistencia_dorsal VARCHAR(10) DEFAULT NULL AFTER jugador_asistencia_nombre");
                } catch (Exception $e) {}
            }
            if (!in_array('jugador_sale_dorsal', $columnas)) {
                try {
                    @$pdo->exec("ALTER TABLE eventos_partido ADD COLUMN jugador_sale_dorsal VARCHAR(10) DEFAULT NULL AFTER jugador_sale_nombre");
                } catch (Exception $e) {}
            }
            if (!in_array('jugador_entra_dorsal', $columnas)) {
                try {
                    @$pdo->exec("ALTER TABLE eventos_partido ADD COLUMN jugador_entra_dorsal VARCHAR(10) DEFAULT NULL AFTER jugador_entra_nombre");
                } catch (Exception $e) {}
            }
            
            // Actualizar lista de columnas después de agregar dorsales
            $columnas = $pdo->query("SHOW COLUMNS FROM eventos_partido")->fetchAll(PDO::FETCH_COLUMN);
            
            // Agregar es_penal y es_autogol al final si no existen
            if (!in_array('es_penal', $columnas)) {
                try {
                    // Intentar después de jugador_entra_nombre, si no existe, agregar al final
                    if (in_array('jugador_entra_nombre', $columnas)) {
                        @$pdo->exec("ALTER TABLE eventos_partido ADD COLUMN es_penal TINYINT(1) DEFAULT 0 AFTER jugador_entra_nombre");
                    } else {
                        @$pdo->exec("ALTER TABLE eventos_partido ADD COLUMN es_penal TINYINT(1) DEFAULT 0");
                    }
                } catch (Exception $e) {}
            }
            
            // Actualizar lista de columnas
            $columnas = $pdo->query("SHOW COLUMNS FROM eventos_partido")->fetchAll(PDO::FETCH_COLUMN);
            
            if (!in_array('es_autogol', $columnas)) {
                try {
                    // Intentar después de es_penal, si no existe, agregar al final
                    if (in_array('es_penal', $columnas)) {
                        @$pdo->exec("ALTER TABLE eventos_partido ADD COLUMN es_autogol TINYINT(1) DEFAULT 0 AFTER es_penal");
                    } else {
                        @$pdo->exec("ALTER TABLE eventos_partido ADD COLUMN es_autogol TINYINT(1) DEFAULT 0");
                    }
                } catch (Exception $e) {}
            }
        } catch (Exception $e) {
            // Si hay error al agregar columnas, continuar (puede que ya existan)
            // No hacer nada, solo continuar
        }
        
        // Verificar y actualizar el ENUM de tipo_evento para incluir 'fin_partido'
        try {
            $columnInfo = $pdo->query("SHOW COLUMNS FROM eventos_partido WHERE Field = 'tipo_evento'")->fetch(PDO::FETCH_ASSOC);
            if ($columnInfo && isset($columnInfo['Type'])) {
                $type = $columnInfo['Type'];
                // Verificar si 'fin_partido' no está en el ENUM
                if (strpos($type, 'fin_partido') === false) {
                    @$pdo->exec("ALTER TABLE eventos_partido MODIFY COLUMN tipo_evento ENUM('gol', 'asistencia', 'tarjeta_amarilla', 'tarjeta_roja', 'sustitucion', 'fin_partido') NOT NULL");
                }
            }
        } catch (Exception $e) {
            // Si hay error, continuar
        }
        
        // Verificar y actualizar el tipo de columna minuto para permitir VARCHAR
        try {
            $columnInfo = $pdo->query("SHOW COLUMNS FROM eventos_partido WHERE Field = 'minuto'")->fetch(PDO::FETCH_ASSOC);
            if ($columnInfo && isset($columnInfo['Type'])) {
                $type = $columnInfo['Type'];
                // Verificar si es INT, cambiarlo a VARCHAR
                if (strpos(strtoupper($type), 'INT') !== false) {
                    @$pdo->exec("ALTER TABLE eventos_partido MODIFY COLUMN minuto VARCHAR(10) NOT NULL");
                }
            }
        } catch (Exception $e) {
            // Si hay error, continuar
        }
    }
    
    // Limpiar buffer después de operaciones de base de datos
    ob_clean();
    
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
            try {
                // Obtener eventos de un partido específico
                $partidoId = isset($_GET['partido_id']) ? intval($_GET['partido_id']) : null;
                
                if (!$partidoId) {
                    ob_clean();
                    echo json_encode([
                        'success' => false,
                        'error' => 'ID de partido requerido'
                    ], JSON_UNESCAPED_UNICODE);
                    ob_end_flush();
                    exit;
                }
                
                $sql = "SELECT * FROM eventos_partido WHERE partido_id = :partido_id ORDER BY minuto ASC, tipo_evento ASC";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':partido_id' => $partidoId]);
                $eventos = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                // Formatear resultados
                $resultados = [];
                foreach ($eventos as $evento) {
                    $resultados[] = [
                        'id' => intval($evento['id']),
                        'partido_id' => intval($evento['partido_id']),
                        'tipo_evento' => $evento['tipo_evento'],
                        'minuto' => $evento['minuto'],
                        'jugador_id' => $evento['jugador_id'],
                        'jugador_nombre' => $evento['jugador_nombre'],
                        'jugador_dorsal' => isset($evento['jugador_dorsal']) ? $evento['jugador_dorsal'] : null,
                        'equipo' => $evento['equipo'],
                        'jugador_asistencia_id' => $evento['jugador_asistencia_id'],
                        'jugador_asistencia_nombre' => $evento['jugador_asistencia_nombre'],
                        'jugador_asistencia_dorsal' => isset($evento['jugador_asistencia_dorsal']) ? $evento['jugador_asistencia_dorsal'] : null,
                        'jugador_sale_id' => $evento['jugador_sale_id'],
                        'jugador_sale_nombre' => $evento['jugador_sale_nombre'],
                        'jugador_sale_dorsal' => isset($evento['jugador_sale_dorsal']) ? $evento['jugador_sale_dorsal'] : null,
                        'jugador_entra_id' => $evento['jugador_entra_id'],
                        'jugador_entra_nombre' => $evento['jugador_entra_nombre'],
                        'jugador_entra_dorsal' => isset($evento['jugador_entra_dorsal']) ? $evento['jugador_entra_dorsal'] : null,
                        'es_penal' => isset($evento['es_penal']) ? (bool)$evento['es_penal'] : false,
                        'es_autogol' => isset($evento['es_autogol']) ? (bool)$evento['es_autogol'] : false
                    ];
                }
                
                ob_clean();
                echo json_encode([
                    'success' => true,
                    'partido_id' => $partidoId,
                    'eventos' => $resultados,
                    'total' => count($resultados)
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            } catch (Exception $e) {
                ob_clean();
                http_response_code(500);
                echo json_encode([
                    'success' => false,
                    'error' => 'Error al obtener eventos: ' . $e->getMessage()
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
        case 'POST':
            // Crear nuevo evento (requiere autenticación)
            if (!$usuarioLogueado) {
                ob_clean();
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Debes iniciar sesión para agregar eventos'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $partidoId = isset($input['partido_id']) ? intval($input['partido_id']) : null;
            $tipoEvento = isset($input['tipo_evento']) ? $input['tipo_evento'] : null;
            $minuto = isset($input['minuto']) ? trim($input['minuto']) : null;
            $jugadorNombre = isset($input['jugador_nombre']) ? trim($input['jugador_nombre']) : null;
            $equipo = isset($input['equipo']) ? $input['equipo'] : null;
            $jugadorId = isset($input['jugador_id']) ? trim($input['jugador_id']) : null;
            $jugadorAsistenciaId = isset($input['jugador_asistencia_id']) ? trim($input['jugador_asistencia_id']) : null;
            $jugadorAsistenciaNombre = isset($input['jugador_asistencia_nombre']) ? trim($input['jugador_asistencia_nombre']) : null;
            $jugadorSaleId = isset($input['jugador_sale_id']) ? trim($input['jugador_sale_id']) : null;
            $jugadorSaleNombre = isset($input['jugador_sale_nombre']) ? trim($input['jugador_sale_nombre']) : null;
            $jugadorEntraId = isset($input['jugador_entra_id']) ? trim($input['jugador_entra_id']) : null;
            $jugadorEntraNombre = isset($input['jugador_entra_nombre']) ? trim($input['jugador_entra_nombre']) : null;
            $jugadorDorsal = isset($input['jugador_dorsal']) ? trim($input['jugador_dorsal']) : null;
            $jugadorAsistenciaDorsal = isset($input['jugador_asistencia_dorsal']) ? trim($input['jugador_asistencia_dorsal']) : null;
            $jugadorSaleDorsal = isset($input['jugador_sale_dorsal']) ? trim($input['jugador_sale_dorsal']) : null;
            $jugadorEntraDorsal = isset($input['jugador_entra_dorsal']) ? trim($input['jugador_entra_dorsal']) : null;
            $esPenal = isset($input['es_penal']) ? (bool)$input['es_penal'] : false;
            $esAutogol = isset($input['es_autogol']) ? (bool)$input['es_autogol'] : false;
            
            // Validar formato de minuto (número o número+número)
            if ($minuto && !preg_match('/^\d+(\+\d+)?$/', $minuto)) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'Formato de minuto inválido. Debe ser un número o número+número (ej: 45 o 90+3)'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            // Validaciones
            // Para fin_partido, no se requiere jugador ni equipo
            if ($tipoEvento === 'fin_partido') {
                if (!$partidoId || !$tipoEvento || $minuto === null || $minuto === '') {
                    ob_clean();
                    echo json_encode([
                        'success' => false,
                        'error' => 'Faltan campos requeridos'
                    ], JSON_UNESCAPED_UNICODE);
                    ob_end_flush();
                    exit;
                }
                // Valores por defecto para fin_partido
                $jugadorNombre = 'Fin del Partido';
                $equipo = 'local'; // Valor por defecto, no se usa realmente
            } elseif ($tipoEvento === 'sustitucion') {
                // Para sustituciones, se requiere jugador_sale y jugador_entra
                if (!$partidoId || !$tipoEvento || $minuto === null || $minuto === '' || !$equipo || 
                    !$jugadorSaleNombre || !$jugadorEntraNombre) {
                    ob_clean();
                    echo json_encode([
                        'success' => false,
                        'error' => 'Faltan campos requeridos para la sustitución'
                    ], JSON_UNESCAPED_UNICODE);
                    ob_end_flush();
                    exit;
                }
                // Para sustituciones, usar jugador_sale_nombre como jugador_nombre
                $jugadorNombre = $jugadorSaleNombre;
            } else {
                // Para otros eventos, se requiere jugador_nombre
                if (!$partidoId || !$tipoEvento || $minuto === null || $minuto === '' || !$jugadorNombre || !$equipo) {
                    ob_clean();
                    echo json_encode([
                        'success' => false,
                        'error' => 'Faltan campos requeridos'
                    ], JSON_UNESCAPED_UNICODE);
                    ob_end_flush();
                    exit;
                }
            }
            
            if (!in_array($tipoEvento, ['gol', 'asistencia', 'tarjeta_amarilla', 'tarjeta_roja', 'sustitucion', 'fin_partido'])) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'Tipo de evento inválido'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            if ($tipoEvento !== 'fin_partido' && !in_array($equipo, ['local', 'visitante'])) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'Equipo inválido'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            // Si es penal o autogol, no debe haber asistencia
            if ($esPenal || $esAutogol) {
                $jugadorAsistenciaId = null;
                $jugadorAsistenciaNombre = null;
                $jugadorAsistenciaDorsal = null;
            }
            
            // Insertar evento
            $sql = "INSERT INTO eventos_partido (partido_id, tipo_evento, minuto, jugador_id, jugador_nombre, jugador_dorsal, equipo, 
                    jugador_asistencia_id, jugador_asistencia_nombre, jugador_asistencia_dorsal, jugador_sale_id, jugador_sale_nombre, jugador_sale_dorsal, 
                    jugador_entra_id, jugador_entra_nombre, jugador_entra_dorsal, es_penal, es_autogol, usuario_id) 
                    VALUES (:partido_id, :tipo_evento, :minuto, :jugador_id, :jugador_nombre, :jugador_dorsal, :equipo, 
                    :jugador_asistencia_id, :jugador_asistencia_nombre, :jugador_asistencia_dorsal, :jugador_sale_id, :jugador_sale_nombre, :jugador_sale_dorsal, 
                    :jugador_entra_id, :jugador_entra_nombre, :jugador_entra_dorsal, :es_penal, :es_autogol, :usuario_id)";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':partido_id' => $partidoId,
                ':tipo_evento' => $tipoEvento,
                ':minuto' => $minuto,
                ':jugador_id' => $jugadorId ?: null,
                ':jugador_nombre' => $jugadorNombre,
                ':jugador_dorsal' => $jugadorDorsal ?: null,
                ':equipo' => $equipo,
                ':jugador_asistencia_id' => $jugadorAsistenciaId ?: null,
                ':jugador_asistencia_nombre' => $jugadorAsistenciaNombre ?: null,
                ':jugador_asistencia_dorsal' => $jugadorAsistenciaDorsal ?: null,
                ':jugador_sale_id' => $jugadorSaleId ?: null,
                ':jugador_sale_nombre' => $jugadorSaleNombre ?: null,
                ':jugador_sale_dorsal' => $jugadorSaleDorsal ?: null,
                ':jugador_entra_id' => $jugadorEntraId ?: null,
                ':jugador_entra_nombre' => $jugadorEntraNombre ?: null,
                ':jugador_entra_dorsal' => $jugadorEntraDorsal ?: null,
                ':es_penal' => $esPenal ? 1 : 0,
                ':es_autogol' => $esAutogol ? 1 : 0,
                ':usuario_id' => $usuarioId
            ]);
            
            $eventoId = $pdo->lastInsertId();
            
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Evento creado correctamente',
                'id' => intval($eventoId)
            ], JSON_UNESCAPED_UNICODE);
            ob_end_flush();
            exit;
            
        case 'PUT':
            // Actualizar evento (requiere autenticación)
            if (!$usuarioLogueado) {
                ob_clean();
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Debes iniciar sesión para editar eventos'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $id = isset($input['id']) ? intval($input['id']) : null;
            
            if (!$id) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'ID de evento requerido'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            // Construir query de actualización dinámicamente
            $campos = [];
            $valores = [':id' => $id];
            
            if (isset($input['tipo_evento'])) {
                $campos[] = 'tipo_evento = :tipo_evento';
                $valores[':tipo_evento'] = $input['tipo_evento'];
            }
            if (isset($input['minuto'])) {
                $campos[] = 'minuto = :minuto';
                $valores[':minuto'] = trim($input['minuto']);
            }
            if (isset($input['jugador_nombre'])) {
                $campos[] = 'jugador_nombre = :jugador_nombre';
                $valores[':jugador_nombre'] = trim($input['jugador_nombre']);
            }
            if (isset($input['jugador_id'])) {
                $campos[] = 'jugador_id = :jugador_id';
                $valores[':jugador_id'] = trim($input['jugador_id']) ?: null;
            }
            if (isset($input['equipo'])) {
                $campos[] = 'equipo = :equipo';
                $valores[':equipo'] = $input['equipo'];
            }
            if (isset($input['jugador_asistencia_nombre'])) {
                $campos[] = 'jugador_asistencia_nombre = :jugador_asistencia_nombre';
                $valores[':jugador_asistencia_nombre'] = trim($input['jugador_asistencia_nombre']) ?: null;
            }
            if (isset($input['jugador_asistencia_id'])) {
                $campos[] = 'jugador_asistencia_id = :jugador_asistencia_id';
                $valores[':jugador_asistencia_id'] = trim($input['jugador_asistencia_id']) ?: null;
            }
            if (isset($input['es_penal'])) {
                $campos[] = 'es_penal = :es_penal';
                $valores[':es_penal'] = (bool)$input['es_penal'] ? 1 : 0;
            }
            if (isset($input['es_autogol'])) {
                $campos[] = 'es_autogol = :es_autogol';
                $valores[':es_autogol'] = (bool)$input['es_autogol'] ? 1 : 0;
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
            
            $sql = "UPDATE eventos_partido SET " . implode(', ', $campos) . " WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($valores);
            
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Evento actualizado correctamente'
            ], JSON_UNESCAPED_UNICODE);
            ob_end_flush();
            exit;
            
        case 'DELETE':
            // Eliminar evento (requiere autenticación)
            if (!$usuarioLogueado) {
                ob_clean();
                http_response_code(401);
                echo json_encode([
                    'success' => false,
                    'error' => 'Debes iniciar sesión para eliminar eventos'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $id = isset($_GET['id']) ? intval($_GET['id']) : null;
            
            if (!$id) {
                ob_clean();
                echo json_encode([
                    'success' => false,
                    'error' => 'ID de evento requerido'
                ], JSON_UNESCAPED_UNICODE);
                ob_end_flush();
                exit;
            }
            
            $sql = "DELETE FROM eventos_partido WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([':id' => $id]);
            
            ob_clean();
            echo json_encode([
                'success' => true,
                'message' => 'Evento eliminado correctamente'
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

