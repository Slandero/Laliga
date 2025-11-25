<?php
/**
 * API para obtener estadísticas generales de la liga
 * GET: api/estadisticas.php - Obtener estadísticas (goleadores, asistencias, tarjetas)
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
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit;
}

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
    
    // Verificar que la tabla exista
    $tablas = $pdo->query("SHOW TABLES LIKE 'eventos_partido'")->fetchAll();
    if (count($tablas) === 0) {
        ob_clean();
        echo json_encode([
            'success' => true,
            'goleadores' => [],
            'asistencias' => [],
            'tarjetas_amarillas' => [],
            'tarjetas_rojas' => []
        ], JSON_UNESCAPED_UNICODE);
        ob_end_flush();
        exit;
    }
    
    // Obtener goleadores (excluyendo autogoles) con equipo y dorsal
    $sqlGoleadores = "SELECT 
                        ep.jugador_nombre,
                        ep.jugador_dorsal,
                        COUNT(*) as total_goles,
                        CASE 
                            WHEN ep.equipo = 'local' THEN p.equipo_local
                            ELSE p.equipo_visitante
                        END as equipo_nombre
                      FROM eventos_partido ep
                      INNER JOIN partidos p ON ep.partido_id = p.id
                      WHERE ep.tipo_evento = 'gol' 
                        AND (ep.es_autogol IS NULL OR ep.es_autogol = 0)
                      GROUP BY ep.jugador_nombre, ep.jugador_dorsal, equipo_nombre
                      ORDER BY total_goles DESC, ep.jugador_nombre ASC 
                      LIMIT 10";
    $stmtGoleadores = $pdo->prepare($sqlGoleadores);
    $stmtGoleadores->execute();
    $goleadores = $stmtGoleadores->fetchAll(PDO::FETCH_ASSOC);
    
    // Obtener asistencias con equipo y dorsal
    $sqlAsistencias = "SELECT 
                         ep.jugador_asistencia_nombre as jugador_nombre,
                         ep.jugador_asistencia_dorsal as jugador_dorsal,
                         COUNT(*) as total_asistencias,
                         CASE 
                             WHEN ep.equipo = 'local' THEN p.equipo_local
                             ELSE p.equipo_visitante
                         END as equipo_nombre
                       FROM eventos_partido ep
                       INNER JOIN partidos p ON ep.partido_id = p.id
                       WHERE ep.tipo_evento = 'gol' 
                         AND ep.jugador_asistencia_nombre IS NOT NULL 
                         AND ep.jugador_asistencia_nombre != ''
                       GROUP BY ep.jugador_asistencia_nombre, ep.jugador_asistencia_dorsal, equipo_nombre
                       ORDER BY total_asistencias DESC, ep.jugador_asistencia_nombre ASC 
                       LIMIT 10";
    $stmtAsistencias = $pdo->prepare($sqlAsistencias);
    $stmtAsistencias->execute();
    $asistencias = $stmtAsistencias->fetchAll(PDO::FETCH_ASSOC);
    
    // Obtener tarjetas amarillas con equipo y dorsal
    $sqlTarjetasAmarillas = "SELECT 
                               ep.jugador_nombre,
                               ep.jugador_dorsal,
                               COUNT(*) as total_tarjetas,
                               CASE 
                                   WHEN ep.equipo = 'local' THEN p.equipo_local
                                   ELSE p.equipo_visitante
                               END as equipo_nombre
                             FROM eventos_partido ep
                             INNER JOIN partidos p ON ep.partido_id = p.id
                             WHERE ep.tipo_evento = 'tarjeta_amarilla'
                             GROUP BY ep.jugador_nombre, ep.jugador_dorsal, equipo_nombre
                             ORDER BY total_tarjetas DESC, ep.jugador_nombre ASC 
                             LIMIT 10";
    $stmtTarjetasAmarillas = $pdo->prepare($sqlTarjetasAmarillas);
    $stmtTarjetasAmarillas->execute();
    $tarjetasAmarillas = $stmtTarjetasAmarillas->fetchAll(PDO::FETCH_ASSOC);
    
    // Obtener tarjetas rojas con equipo y dorsal
    $sqlTarjetasRojas = "SELECT 
                           ep.jugador_nombre,
                           ep.jugador_dorsal,
                           COUNT(*) as total_tarjetas,
                           CASE 
                               WHEN ep.equipo = 'local' THEN p.equipo_local
                               ELSE p.equipo_visitante
                           END as equipo_nombre
                         FROM eventos_partido ep
                         INNER JOIN partidos p ON ep.partido_id = p.id
                         WHERE ep.tipo_evento = 'tarjeta_roja'
                         GROUP BY ep.jugador_nombre, ep.jugador_dorsal, equipo_nombre
                         ORDER BY total_tarjetas DESC, ep.jugador_nombre ASC 
                         LIMIT 10";
    $stmtTarjetasRojas = $pdo->prepare($sqlTarjetasRojas);
    $stmtTarjetasRojas->execute();
    $tarjetasRojas = $stmtTarjetasRojas->fetchAll(PDO::FETCH_ASSOC);
    
    // Formatear resultados
    $resultados = [
        'success' => true,
        'goleadores' => array_map(function($item) {
            return [
                'jugador' => $item['jugador_nombre'],
                'dorsal' => $item['jugador_dorsal'],
                'equipo' => $item['equipo_nombre'],
                'total' => intval($item['total_goles'])
            ];
        }, $goleadores),
        'asistencias' => array_map(function($item) {
            return [
                'jugador' => $item['jugador_nombre'],
                'dorsal' => $item['jugador_dorsal'],
                'equipo' => $item['equipo_nombre'],
                'total' => intval($item['total_asistencias'])
            ];
        }, $asistencias),
        'tarjetas_amarillas' => array_map(function($item) {
            return [
                'jugador' => $item['jugador_nombre'],
                'dorsal' => $item['jugador_dorsal'],
                'equipo' => $item['equipo_nombre'],
                'total' => intval($item['total_tarjetas'])
            ];
        }, $tarjetasAmarillas),
        'tarjetas_rojas' => array_map(function($item) {
            return [
                'jugador' => $item['jugador_nombre'],
                'dorsal' => $item['jugador_dorsal'],
                'equipo' => $item['equipo_nombre'],
                'total' => intval($item['total_tarjetas'])
            ];
        }, $tarjetasRojas)
    ];
    
    ob_clean();
    echo json_encode($resultados, JSON_UNESCAPED_UNICODE);
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

