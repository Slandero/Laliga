<?php
/**
 * API para obtener jugadores de un equipo
 * Uso: api/jugadores.php?tabla=fc_barcelona
 */

// Iniciar buffer de salida ANTES de cualquier cosa
@ob_start();
@ob_clean();

// Deshabilitar TODOS los errores y warnings
@error_reporting(0);
@ini_set('display_errors', 0);
@ini_set('html_errors', 0);
@ini_set('log_errors', 0);

// Establecer headers
@header('Content-Type: application/json; charset=UTF-8');
@header('Access-Control-Allow-Origin: *');

// Limpiar cualquier salida previa
@ob_clean();

try {
    // Cargar configuración primero (esto definirá Railway)
    $configPath = __DIR__ . '/../config/config.php';
    if (file_exists($configPath)) {
        @require_once $configPath;
    }
    
    // Cargar conexión después de la configuración
    @require_once __DIR__ . '/../conexionBase/conexion.php';
    
    // Obtener parámetro
    $tabla = isset($_GET['tabla']) ? $_GET['tabla'] : '';
    
    if (empty($tabla)) {
        @ob_clean();
        echo json_encode(array(
            'success' => false,
            'error' => 'Parámetro "tabla" requerido'
        ), JSON_UNESCAPED_UNICODE);
        @ob_end_flush();
        exit;
    }
    
    // Obtener conexión
    $conexion = Conexion::obtenerInstancia();
    $pdo = $conexion->obtenerPDO();
    
    // Validar tabla
    $tablas = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    if (!in_array($tabla, $tablas)) {
        @ob_clean();
        echo json_encode(array(
            'success' => false,
            'error' => 'Tabla no encontrada: ' . $tabla
        ), JSON_UNESCAPED_UNICODE);
        @ob_end_flush();
        exit;
    }
    
    // Construir consulta
    $sql = "SELECT * FROM `$tabla`";
    
    // Verificar columnas para ordenar
    $columnas = $pdo->query("SHOW COLUMNS FROM `$tabla`")->fetchAll(PDO::FETCH_COLUMN);
    $columnaOrden = null;
    
    // Buscar campo dorsal (puede estar en mayúsculas o minúsculas)
    if (in_array('Dorsal', $columnas)) {
        $columnaOrden = 'Dorsal';
    } elseif (in_array('dorsal', $columnas)) {
        $columnaOrden = 'dorsal';
    } elseif (in_array('numero', $columnas)) {
        $columnaOrden = 'numero';
    } elseif (in_array('Numero', $columnas)) {
        $columnaOrden = 'Numero';
    } elseif (in_array('num', $columnas)) {
        $columnaOrden = 'num';
    } elseif (in_array('Num', $columnas)) {
        $columnaOrden = 'Num';
    }
    
    if ($columnaOrden) {
        $sql .= " ORDER BY `$columnaOrden` ASC";
    }
    
    // Ejecutar consulta de jugadores
    $jugadores = $conexion->consultar($sql);
    
    // Mapeo de nombres de tablas a nombres de equipos para la tabla entrenadores
    $mapeoEquipos = [
        'athletic_club' => 'Athletic Club',
        'atletico_de_madrid' => 'Atlético de Madrid',
        'ca_osasuna' => 'CA Osasuna',
        'celta_vigo' => 'Celta de Vigo',
        'deportivo_alaves' => 'Deportivo Alavés',
        'elche_cf' => 'Elche CF',
        'fc_barcelona' => 'FC Barcelona',
        'getafe_cf' => 'Getafe CF',
        'girona_fc' => 'Girona FC',
        'levante_ud' => 'Levante UD',
        'rayo_vallecano' => 'Rayo Vallecano',
        'rcd_espanyol' => 'RCD Espanyol',
        'rcd_mallorca' => 'RCD Mallorca',
        'real_betis' => 'Real Betis',
        'real_madrid' => 'Real Madrid',
        'real_oviedo' => 'Real Oviedo',
        'real_sociedad' => 'Real Sociedad',
        'sevilla_fc' => 'Sevilla FC',
        'valencia_cf' => 'Valencia CF',
        'villarreal_cf' => 'Villarreal CF'
    ];
    
    // Obtener entrenadores de la tabla "entrenadores" si existe
    $entrenadores = [];
    try {
        if (in_array('entrenadores', $tablas)) {
            $nombreEquipo = isset($mapeoEquipos[$tabla]) ? $mapeoEquipos[$tabla] : null;
            
            if ($nombreEquipo) {
                try {
                    // Verificar qué columnas tiene la tabla entrenadores
                    $columnasEntrenadores = $pdo->query("SHOW COLUMNS FROM `entrenadores`")->fetchAll(PDO::FETCH_COLUMN);
                    
                    // Buscar el campo que contiene el nombre del equipo
                    $campoEquipo = null;
                    $posiblesCamposEquipo = ['equipo', 'Equipo', 'team', 'Team', 'club', 'Club'];
                    
                    foreach ($posiblesCamposEquipo as $campo) {
                        if (in_array($campo, $columnasEntrenadores)) {
                            $campoEquipo = $campo;
                            break;
                        }
                    }
                    
                    // Si encontramos el campo, buscar entrenadores del equipo
                    if ($campoEquipo) {
                        $stmt = $pdo->prepare("SELECT * FROM `entrenadores` WHERE `$campoEquipo` = :equipo");
                        $stmt->execute(array('equipo' => $nombreEquipo));
                        $entrenadores = $stmt->fetchAll(PDO::FETCH_ASSOC);
                        if (!$entrenadores) {
                            $entrenadores = array();
                        }
                    }
                } catch (Exception $e) {
                    // Si hay algún error al obtener entrenadores, continuar sin ellos
                    $entrenadores = array();
                } catch (PDOException $e) {
                    // Si hay algún error al obtener entrenadores, continuar sin ellos
                    $entrenadores = array();
                }
            }
        }
    } catch (Exception $e) {
        // Si hay algún error al obtener entrenadores, continuar sin ellos
        $entrenadores = array();
    } catch (PDOException $e) {
        // Si hay algún error al obtener entrenadores, continuar sin ellos
        $entrenadores = array();
    }
    
    // Combinar jugadores y entrenadores
    $todosLosRegistros = array_merge($entrenadores, $jugadores);
    
    // Limpiar buffer y enviar JSON
    @ob_clean();
    $json = json_encode(array(
        'success' => true,
        'data' => $todosLosRegistros,
        'total' => count($todosLosRegistros),
        'jugadores' => count($jugadores),
        'entrenadores' => count($entrenadores)
    ), JSON_UNESCAPED_UNICODE);
    
    if ($json === false) {
        @ob_clean();
        echo json_encode(array(
            'success' => false,
            'error' => 'Error al codificar JSON: ' . json_last_error_msg()
        ), JSON_UNESCAPED_UNICODE);
    } else {
        echo $json;
    }
    
} catch (PDOException $e) {
    @ob_clean();
    echo json_encode(array(
        'success' => false,
        'error' => 'Error de base de datos: ' . $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ), JSON_UNESCAPED_UNICODE);
    @ob_end_flush();
    exit;
} catch (Exception $e) {
    @ob_clean();
    echo json_encode(array(
        'success' => false,
        'error' => $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ), JSON_UNESCAPED_UNICODE);
    @ob_end_flush();
    exit;
} catch (Error $e) {
    @ob_clean();
    echo json_encode(array(
        'success' => false,
        'error' => 'Error fatal: ' . $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ), JSON_UNESCAPED_UNICODE);
    @ob_end_flush();
    exit;
} catch (Throwable $e) {
    @ob_clean();
    echo json_encode(array(
        'success' => false,
        'error' => 'Error: ' . $e->getMessage(),
        'file' => basename($e->getFile()),
        'line' => $e->getLine()
    ), JSON_UNESCAPED_UNICODE);
    @ob_end_flush();
    exit;
}

// Finalizar buffer
@ob_end_flush();
