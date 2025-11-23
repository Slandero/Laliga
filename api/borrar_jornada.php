<?php
/**
 * Script para borrar todos los partidos de una jornada específica
 * Ejecutar desde el navegador: http://localhost/Laliga/api/borrar_jornada.php?jornada=1
 * Para borrar jornada 1: http://localhost/Laliga/api/borrar_jornada.php?jornada=1
 */

@ob_start();
@ob_clean();

@error_reporting(E_ALL);
@ini_set('display_errors', 1);

@header('Content-Type: application/json; charset=UTF-8');
@header('Access-Control-Allow-Origin: *');

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
    
    // Obtener la jornada del parámetro GET
    $jornada = isset($_GET['jornada']) ? intval($_GET['jornada']) : null;
    
    if (!$jornada || $jornada < 1 || $jornada > 38) {
        throw new Exception('Jornada inválida. Debe ser un número entre 1 y 38.');
    }
    
    $resultados = [];
    
    // Verificar que la tabla partidos existe
    $tablas = $pdo->query("SHOW TABLES LIKE 'partidos'")->fetchAll();
    if (count($tablas) === 0) {
        throw new Exception('La tabla partidos no existe');
    }
    
    // Obtener partidos de la jornada antes de borrarlos (para mostrar información)
    $stmt = $pdo->prepare("SELECT id, jornada, fecha, horario, equipo_local, equipo_visitante, goles_local, goles_visitante FROM partidos WHERE jornada = :jornada");
    $stmt->execute([':jornada' => $jornada]);
    $partidos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $resultados['partidos_encontrados'] = count($partidos);
    $resultados['partidos'] = $partidos;
    
    if (count($partidos) === 0) {
        $resultados['mensaje'] = "No hay partidos en la jornada $jornada para borrar";
    } else {
        // Obtener IDs de los partidos para verificar eventos relacionados
        $partidoIds = array_column($partidos, 'id');
        
        // Verificar eventos de partidos relacionados
        $eventosEliminados = 0;
        if (count($partidoIds) > 0) {
            try {
                // Verificar si la tabla eventos_partido existe
                $tablasEventos = $pdo->query("SHOW TABLES LIKE 'eventos_partido'")->fetchAll();
                if (count($tablasEventos) > 0) {
                    // Contar eventos que se eliminarán (si hay foreign key CASCADE, se eliminarán automáticamente)
                    $placeholders = implode(',', array_fill(0, count($partidoIds), '?'));
                    $stmt = $pdo->prepare("SELECT COUNT(*) FROM eventos_partido WHERE partido_id IN ($placeholders)");
                    $stmt->execute($partidoIds);
                    $eventosEliminados = $stmt->fetchColumn();
                    $resultados['eventos_relacionados'] = intval($eventosEliminados);
                }
            } catch (PDOException $e) {
                // Si hay error al contar eventos, continuar de todas formas
                $resultados['error_eventos'] = 'No se pudieron contar los eventos relacionados';
            }
        }
        
        // Eliminar partidos de la jornada
        // Si hay foreign key CASCADE en eventos_partido, los eventos se eliminarán automáticamente
        $stmt = $pdo->prepare("DELETE FROM partidos WHERE jornada = :jornada");
        $stmt->execute([':jornada' => $jornada]);
        
        $partidosEliminados = $stmt->rowCount();
        $resultados['partidos_eliminados'] = $partidosEliminados;
        $resultados['mensaje'] = "Se eliminaron $partidosEliminados partido(s) de la jornada $jornada";
        
        // Si hay eventos y no se eliminaron automáticamente, eliminarlos manualmente
        if ($eventosEliminados > 0 && count($partidoIds) > 0) {
            try {
                $tablasEventos = $pdo->query("SHOW TABLES LIKE 'eventos_partido'")->fetchAll();
                if (count($tablasEventos) > 0) {
                    $placeholders = implode(',', array_fill(0, count($partidoIds), '?'));
                    $stmt = $pdo->prepare("DELETE FROM eventos_partido WHERE partido_id IN ($placeholders)");
                    $stmt->execute($partidoIds);
                    $eventosEliminados = $stmt->rowCount();
                    $resultados['eventos_eliminados'] = intval($eventosEliminados);
                }
            } catch (PDOException $e) {
                // Si hay error, continuar de todas formas
                $resultados['advertencia'] = 'Los eventos relacionados pueden no haberse eliminado automáticamente';
            }
        }
    }
    
    // Verificar que los partidos se eliminaron correctamente
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM partidos WHERE jornada = :jornada");
    $stmt->execute([':jornada' => $jornada]);
    $partidosRestantes = $stmt->fetchColumn();
    $resultados['partidos_restantes'] = intval($partidosRestantes);
    
    @ob_clean();
    echo json_encode([
        'success' => true,
        'message' => "Proceso completado para la jornada $jornada",
        'resultados' => $resultados
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    @ob_clean();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

@ob_end_flush();

