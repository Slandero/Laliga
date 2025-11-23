<?php
/**
 * Script para crear los partidos de las jornadas 13-38 en la base de datos
 * 
 * Uso: Acceder a este archivo desde el navegador o ejecutarlo por línea de comandos
 * Ejemplo: http://localhost/Laliga/api/crear_partidos_13_38.php
 */

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../conexionBase/conexion.php';

header('Content-Type: text/html; charset=UTF-8');

try {
    // Obtener conexión
    $conexion = Conexion::obtenerInstancia();
    $pdo = $conexion->obtenerPDO();
    
    // Verificar que la tabla exista
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
        echo "<p>Tabla 'partidos' creada correctamente.</p>";
    }
    
    // Datos de partidos para jornadas 13-38
    $partidosPorJornada = [
        13 => [
            ['fecha' => '2025-11-21', 'horario' => '14:00', 'local' => 'VALENCIA CF', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-22', 'horario' => '07:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-22', 'horario' => '09:15', 'local' => 'FC BARCELONA', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-22', 'horario' => '11:30', 'local' => 'CA OSASUNA', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-22', 'horario' => '14:00', 'local' => 'VILLARREAL CF', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-23', 'horario' => '07:00', 'local' => 'REAL OVIEDO', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-23', 'horario' => '09:15', 'local' => 'REAL BETIS', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-23', 'horario' => '11:30', 'local' => 'GETAFE CF', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-23', 'horario' => '14:00', 'local' => 'ELCHE CF', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-24', 'horario' => '14:00', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        14 => [
            ['fecha' => '2025-11-28', 'horario' => '14:00', 'local' => 'GETAFE CF', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-29', 'horario' => '07:00', 'local' => 'RCD MALLORCA', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-29', 'horario' => '09:15', 'local' => 'FC BARCELONA', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-29', 'horario' => '11:30', 'local' => 'LEVANTE UD', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-29', 'horario' => '14:00', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-30', 'horario' => '07:00', 'local' => 'REAL SOCIEDAD', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-30', 'horario' => '09:15', 'local' => 'SEVILLA FC', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-30', 'horario' => '11:30', 'local' => 'CELTA', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-11-30', 'horario' => '14:00', 'local' => 'GIRONA FC', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-01', 'horario' => '14:00', 'local' => 'RAYO VALLECANO', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        15 => [
            ['fecha' => '2025-12-05', 'horario' => '14:00', 'local' => 'REAL OVIEDO', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-06', 'horario' => '07:00', 'local' => 'VILLARREAL CF', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-06', 'horario' => '09:15', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-06', 'horario' => '11:30', 'local' => 'REAL BETIS', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-06', 'horario' => '14:00', 'local' => 'ATHLETIC CLUB', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-07', 'horario' => '07:00', 'local' => 'ELCHE CF', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-07', 'horario' => '09:15', 'local' => 'VALENCIA CF', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-07', 'horario' => '11:30', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-07', 'horario' => '14:00', 'local' => 'REAL MADRID', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-08', 'horario' => '14:00', 'local' => 'CA OSASUNA', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        16 => [
            ['fecha' => '2025-12-12', 'horario' => '14:00', 'local' => 'REAL SOCIEDAD', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-13', 'horario' => '07:00', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-13', 'horario' => '09:15', 'local' => 'RCD MALLORCA', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-13', 'horario' => '11:30', 'local' => 'FC BARCELONA', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-13', 'horario' => '14:00', 'local' => 'GETAFE CF', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-14', 'horario' => '07:00', 'local' => 'SEVILLA FC', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-14', 'horario' => '09:15', 'local' => 'CELTA', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-14', 'horario' => '11:30', 'local' => 'LEVANTE UD', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-14', 'horario' => '14:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-15', 'horario' => '14:00', 'local' => 'RAYO VALLECANO', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        17 => [
            ['fecha' => '2025-12-20', 'horario' => '07:00', 'local' => 'ATHLETIC CLUB', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-20', 'horario' => '09:15', 'local' => 'REAL BETIS', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-20', 'horario' => '11:30', 'local' => 'ELCHE CF', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-20', 'horario' => '14:00', 'local' => 'LEVANTE UD', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-20', 'horario' => '16:30', 'local' => 'REAL MADRID', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-20', 'horario' => '19:00', 'local' => 'CA OSASUNA', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-20', 'horario' => '21:00', 'local' => 'GIRONA FC', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-20', 'horario' => '23:00', 'local' => 'VILLARREAL CF', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-21', 'horario' => '07:00', 'local' => 'REAL OVIEDO', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-21', 'horario' => '14:00', 'local' => 'VALENCIA CF', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        18 => [
            ['fecha' => '2026-01-03', 'horario' => '07:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-03', 'horario' => '09:15', 'local' => 'CELTA', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-03', 'horario' => '11:30', 'local' => 'ELCHE CF', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-03', 'horario' => '14:00', 'local' => 'CA OSASUNA', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-03', 'horario' => '16:30', 'local' => 'REAL SOCIEDAD', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-03', 'horario' => '19:00', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-03', 'horario' => '21:00', 'local' => 'REAL MADRID', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-04', 'horario' => '07:00', 'local' => 'RAYO VALLECANO', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-04', 'horario' => '09:15', 'local' => 'RCD MALLORCA', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-04', 'horario' => '14:00', 'local' => 'SEVILLA FC', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        19 => [
            ['fecha' => '2025-12-02', 'horario' => '14:00', 'local' => 'FC BARCELONA', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2025-12-03', 'horario' => '12:00', 'local' => 'ATHLETIC CLUB', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-10', 'horario' => '07:00', 'local' => 'GETAFE CF', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-10', 'horario' => '09:15', 'local' => 'GIRONA FC', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-10', 'horario' => '11:30', 'local' => 'VILLARREAL CF', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-10', 'horario' => '14:00', 'local' => 'REAL OVIEDO', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-10', 'horario' => '16:30', 'local' => 'SEVILLA FC', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-10', 'horario' => '19:00', 'local' => 'VALENCIA CF', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-10', 'horario' => '21:00', 'local' => 'LEVANTE UD', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-11', 'horario' => '14:00', 'local' => 'RAYO VALLECANO', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        20 => [
            ['fecha' => '2026-01-17', 'horario' => '07:00', 'local' => 'REAL BETIS', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-17', 'horario' => '09:15', 'local' => 'CELTA', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-17', 'horario' => '11:30', 'local' => 'ELCHE CF', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-17', 'horario' => '14:00', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-17', 'horario' => '16:30', 'local' => 'GETAFE CF', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-17', 'horario' => '19:00', 'local' => 'CA OSASUNA', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-17', 'horario' => '21:00', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-18', 'horario' => '07:00', 'local' => 'RCD MALLORCA', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-18', 'horario' => '09:15', 'local' => 'REAL SOCIEDAD', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-18', 'horario' => '14:00', 'local' => 'REAL MADRID', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        21 => [
            ['fecha' => '2026-01-24', 'horario' => '07:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-24', 'horario' => '09:15', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-24', 'horario' => '11:30', 'local' => 'FC BARCELONA', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-24', 'horario' => '14:00', 'local' => 'SEVILLA FC', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-24', 'horario' => '16:30', 'local' => 'REAL SOCIEDAD', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-24', 'horario' => '19:00', 'local' => 'LEVANTE UD', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-24', 'horario' => '21:00', 'local' => 'VALENCIA CF', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-25', 'horario' => '07:00', 'local' => 'GIRONA FC', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-25', 'horario' => '09:15', 'local' => 'RAYO VALLECANO', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-25', 'horario' => '14:00', 'local' => 'VILLARREAL CF', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        22 => [
            ['fecha' => '2026-01-31', 'horario' => '07:00', 'local' => 'ATHLETIC CLUB', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-31', 'horario' => '09:15', 'local' => 'REAL BETIS', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-31', 'horario' => '11:30', 'local' => 'RCD MALLORCA', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-31', 'horario' => '14:00', 'local' => 'CA OSASUNA', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-31', 'horario' => '16:30', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-31', 'horario' => '19:00', 'local' => 'LEVANTE UD', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-01-31', 'horario' => '21:00', 'local' => 'ELCHE CF', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-01', 'horario' => '07:00', 'local' => 'GETAFE CF', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-01', 'horario' => '09:15', 'local' => 'REAL OVIEDO', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-01', 'horario' => '14:00', 'local' => 'REAL MADRID', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        23 => [
            ['fecha' => '2026-02-07', 'horario' => '07:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-07', 'horario' => '09:15', 'local' => 'ATHLETIC CLUB', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-07', 'horario' => '11:30', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-07', 'horario' => '14:00', 'local' => 'FC BARCELONA', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-07', 'horario' => '16:30', 'local' => 'CELTA', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-07', 'horario' => '19:00', 'local' => 'REAL SOCIEDAD', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-07', 'horario' => '21:00', 'local' => 'VILLARREAL CF', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-08', 'horario' => '07:00', 'local' => 'SEVILLA FC', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-08', 'horario' => '09:15', 'local' => 'VALENCIA CF', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-08', 'horario' => '14:00', 'local' => 'RAYO VALLECANO', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        24 => [
            ['fecha' => '2026-02-14', 'horario' => '07:00', 'local' => 'ELCHE CF', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-14', 'horario' => '09:15', 'local' => 'GETAFE CF', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-14', 'horario' => '11:30', 'local' => 'LEVANTE UD', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-14', 'horario' => '14:00', 'local' => 'REAL MADRID', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-14', 'horario' => '16:30', 'local' => 'SEVILLA FC', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-14', 'horario' => '19:00', 'local' => 'REAL OVIEDO', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-14', 'horario' => '21:00', 'local' => 'RAYO VALLECANO', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-15', 'horario' => '07:00', 'local' => 'GIRONA FC', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-15', 'horario' => '09:15', 'local' => 'RCD MALLORCA', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-15', 'horario' => '14:00', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        25 => [
            ['fecha' => '2026-02-21', 'horario' => '07:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-21', 'horario' => '09:15', 'local' => 'ATHLETIC CLUB', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-21', 'horario' => '11:30', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-21', 'horario' => '14:00', 'local' => 'FC BARCELONA', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-21', 'horario' => '16:30', 'local' => 'REAL BETIS', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-21', 'horario' => '19:00', 'local' => 'CELTA', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-21', 'horario' => '21:00', 'local' => 'GETAFE CF', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-22', 'horario' => '07:00', 'local' => 'CA OSASUNA', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-22', 'horario' => '09:15', 'local' => 'VILLARREAL CF', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-22', 'horario' => '14:00', 'local' => 'REAL SOCIEDAD', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        26 => [
            ['fecha' => '2026-02-28', 'horario' => '07:00', 'local' => 'FC BARCELONA', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-28', 'horario' => '09:15', 'local' => 'REAL BETIS', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-28', 'horario' => '11:30', 'local' => 'ELCHE CF', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-28', 'horario' => '14:00', 'local' => 'RCD MALLORCA', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-28', 'horario' => '16:30', 'local' => 'LEVANTE UD', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-28', 'horario' => '19:00', 'local' => 'RAYO VALLECANO', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-02-28', 'horario' => '21:00', 'local' => 'REAL OVIEDO', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-01', 'horario' => '07:00', 'local' => 'GIRONA FC', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-01', 'horario' => '09:15', 'local' => 'REAL MADRID', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-01', 'horario' => '14:00', 'local' => 'VALENCIA CF', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        27 => [
            ['fecha' => '2026-03-07', 'horario' => '07:00', 'local' => 'ATHLETIC CLUB', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-07', 'horario' => '09:15', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-07', 'horario' => '11:30', 'local' => 'CELTA', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-07', 'horario' => '14:00', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-07', 'horario' => '16:30', 'local' => 'VALENCIA CF', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-07', 'horario' => '19:00', 'local' => 'GETAFE CF', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-07', 'horario' => '21:00', 'local' => 'VILLARREAL CF', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-08', 'horario' => '07:00', 'local' => 'LEVANTE UD', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-08', 'horario' => '09:15', 'local' => 'CA OSASUNA', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-08', 'horario' => '14:00', 'local' => 'SEVILLA FC', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        28 => [
            ['fecha' => '2026-03-14', 'horario' => '07:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-14', 'horario' => '09:15', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-14', 'horario' => '11:30', 'local' => 'FC BARCELONA', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-14', 'horario' => '14:00', 'local' => 'REAL BETIS', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-14', 'horario' => '16:30', 'local' => 'REAL OVIEDO', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-14', 'horario' => '19:00', 'local' => 'GIRONA FC', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-14', 'horario' => '21:00', 'local' => 'REAL MADRID', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-15', 'horario' => '07:00', 'local' => 'RCD MALLORCA', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-15', 'horario' => '09:15', 'local' => 'RAYO VALLECANO', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-15', 'horario' => '14:00', 'local' => 'REAL SOCIEDAD', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        29 => [
            ['fecha' => '2026-03-21', 'horario' => '07:00', 'local' => 'ATHLETIC CLUB', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-21', 'horario' => '09:15', 'local' => 'FC BARCELONA', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-21', 'horario' => '11:30', 'local' => 'ELCHE CF', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-21', 'horario' => '14:00', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-21', 'horario' => '16:30', 'local' => 'LEVANTE UD', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-21', 'horario' => '19:00', 'local' => 'SEVILLA FC', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-21', 'horario' => '21:00', 'local' => 'CELTA', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-22', 'horario' => '07:00', 'local' => 'REAL MADRID', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-22', 'horario' => '09:15', 'local' => 'CA OSASUNA', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-03-22', 'horario' => '14:00', 'local' => 'VILLARREAL CF', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        30 => [
            ['fecha' => '2026-04-04', 'horario' => '07:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-04', 'horario' => '09:15', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-04', 'horario' => '11:30', 'local' => 'REAL BETIS', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-04', 'horario' => '14:00', 'local' => 'GIRONA FC', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-04', 'horario' => '16:30', 'local' => 'RCD MALLORCA', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-04', 'horario' => '19:00', 'local' => 'REAL OVIEDO', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-04', 'horario' => '21:00', 'local' => 'GETAFE CF', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-05', 'horario' => '07:00', 'local' => 'VALENCIA CF', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-05', 'horario' => '09:15', 'local' => 'RAYO VALLECANO', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-05', 'horario' => '14:00', 'local' => 'REAL SOCIEDAD', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        31 => [
            ['fecha' => '2026-04-11', 'horario' => '07:00', 'local' => 'ATHLETIC CLUB', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-11', 'horario' => '09:15', 'local' => 'FC BARCELONA', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-11', 'horario' => '11:30', 'local' => 'CELTA', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-11', 'horario' => '14:00', 'local' => 'ELCHE CF', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-11', 'horario' => '16:30', 'local' => 'RCD MALLORCA', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-11', 'horario' => '19:00', 'local' => 'REAL SOCIEDAD', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-11', 'horario' => '21:00', 'local' => 'SEVILLA FC', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-12', 'horario' => '07:00', 'local' => 'CA OSASUNA', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-12', 'horario' => '09:15', 'local' => 'LEVANTE UD', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-12', 'horario' => '14:00', 'local' => 'REAL MADRID', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        32 => [
            ['fecha' => '2026-04-18', 'horario' => '07:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-18', 'horario' => '09:15', 'local' => 'REAL BETIS', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-18', 'horario' => '11:30', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-18', 'horario' => '14:00', 'local' => 'CA OSASUNA', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-18', 'horario' => '16:30', 'local' => 'RAYO VALLECANO', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-18', 'horario' => '19:00', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-18', 'horario' => '21:00', 'local' => 'GETAFE CF', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-19', 'horario' => '07:00', 'local' => 'VILLARREAL CF', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-19', 'horario' => '09:15', 'local' => 'REAL OVIEDO', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-19', 'horario' => '14:00', 'local' => 'VALENCIA CF', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        33 => [
            ['fecha' => '2026-04-21', 'horario' => '07:00', 'local' => 'ATHLETIC CLUB', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-21', 'horario' => '09:15', 'local' => 'FC BARCELONA', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-21', 'horario' => '11:30', 'local' => 'LEVANTE UD', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-21', 'horario' => '14:00', 'local' => 'RCD MALLORCA', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-21', 'horario' => '16:30', 'local' => 'REAL OVIEDO', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-21', 'horario' => '19:00', 'local' => 'REAL MADRID', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-21', 'horario' => '21:00', 'local' => 'ELCHE CF', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-22', 'horario' => '07:00', 'local' => 'GIRONA FC', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-22', 'horario' => '09:15', 'local' => 'RAYO VALLECANO', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-04-22', 'horario' => '14:00', 'local' => 'REAL SOCIEDAD', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        34 => [
            ['fecha' => '2026-05-02', 'horario' => '07:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-02', 'horario' => '09:15', 'local' => 'REAL BETIS', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-02', 'horario' => '11:30', 'local' => 'CELTA', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-02', 'horario' => '14:00', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-02', 'horario' => '16:30', 'local' => 'GETAFE CF', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-02', 'horario' => '19:00', 'local' => 'GIRONA FC', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-02', 'horario' => '21:00', 'local' => 'VALENCIA CF', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-03', 'horario' => '07:00', 'local' => 'CA OSASUNA', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-03', 'horario' => '09:15', 'local' => 'VILLARREAL CF', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-03', 'horario' => '14:00', 'local' => 'SEVILLA FC', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        35 => [
            ['fecha' => '2026-05-09', 'horario' => '07:00', 'local' => 'ATHLETIC CLUB', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-09', 'horario' => '09:15', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-09', 'horario' => '11:30', 'local' => 'FC BARCELONA', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-09', 'horario' => '14:00', 'local' => 'LEVANTE UD', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-09', 'horario' => '16:30', 'local' => 'RCD MALLORCA', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-09', 'horario' => '19:00', 'local' => 'ELCHE CF', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-09', 'horario' => '21:00', 'local' => 'REAL SOCIEDAD', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-10', 'horario' => '07:00', 'local' => 'SEVILLA FC', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-10', 'horario' => '09:15', 'local' => 'REAL OVIEDO', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-10', 'horario' => '14:00', 'local' => 'RAYO VALLECANO', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        36 => [
            ['fecha' => '2026-05-12', 'horario' => '07:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-12', 'horario' => '09:15', 'local' => 'REAL BETIS', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-12', 'horario' => '11:30', 'local' => 'CELTA', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-12', 'horario' => '14:00', 'local' => 'GETAFE CF', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-12', 'horario' => '16:30', 'local' => 'GIRONA FC', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-12', 'horario' => '19:00', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-12', 'horario' => '21:00', 'local' => 'CA OSASUNA', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-13', 'horario' => '07:00', 'local' => 'VALENCIA CF', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-13', 'horario' => '09:15', 'local' => 'VILLARREAL CF', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-13', 'horario' => '14:00', 'local' => 'REAL MADRID', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        37 => [
            ['fecha' => '2026-05-16', 'horario' => '07:00', 'local' => 'ATHLETIC CLUB', 'visitante' => 'CELTA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-16', 'horario' => '09:15', 'local' => 'ATLÉTICO DE MADRID', 'visitante' => 'GIRONA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-16', 'horario' => '11:30', 'local' => 'FC BARCELONA', 'visitante' => 'REAL BETIS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-16', 'horario' => '14:00', 'local' => 'ELCHE CF', 'visitante' => 'GETAFE CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-16', 'horario' => '16:30', 'local' => 'LEVANTE UD', 'visitante' => 'RCD MALLORCA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-16', 'horario' => '19:00', 'local' => 'RAYO VALLECANO', 'visitante' => 'VILLARREAL CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-16', 'horario' => '21:00', 'local' => 'REAL SOCIEDAD', 'visitante' => 'VALENCIA CF', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-17', 'horario' => '07:00', 'local' => 'REAL OVIEDO', 'visitante' => 'DEPORTIVO ALAVÉS', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-17', 'horario' => '09:15', 'local' => 'CA OSASUNA', 'visitante' => 'RCD ESPANYOL DE BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-17', 'horario' => '14:00', 'local' => 'SEVILLA FC', 'visitante' => 'REAL MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
        38 => [
            ['fecha' => '2026-05-23', 'horario' => '07:00', 'local' => 'DEPORTIVO ALAVÉS', 'visitante' => 'RAYO VALLECANO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-23', 'horario' => '09:15', 'local' => 'REAL BETIS', 'visitante' => 'LEVANTE UD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-23', 'horario' => '11:30', 'local' => 'CELTA', 'visitante' => 'SEVILLA FC', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-23', 'horario' => '14:00', 'local' => 'RCD ESPANYOL DE BARCELONA', 'visitante' => 'REAL SOCIEDAD', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-23', 'horario' => '16:30', 'local' => 'GETAFE CF', 'visitante' => 'CA OSASUNA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-23', 'horario' => '19:00', 'local' => 'RCD MALLORCA', 'visitante' => 'REAL OVIEDO', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-23', 'horario' => '21:00', 'local' => 'REAL MADRID', 'visitante' => 'ATHLETIC CLUB', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-24', 'horario' => '07:00', 'local' => 'VILLARREAL CF', 'visitante' => 'ATLÉTICO DE MADRID', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-24', 'horario' => '09:15', 'local' => 'VALENCIA CF', 'visitante' => 'FC BARCELONA', 'goles_local' => 0, 'goles_visitante' => 0],
            ['fecha' => '2026-05-24', 'horario' => '14:00', 'local' => 'GIRONA FC', 'visitante' => 'ELCHE CF', 'goles_local' => 0, 'goles_visitante' => 0],
        ],
    ];
    
    $totalInsertados = 0;
    $totalDuplicados = 0;
    $totalErrores = 0;
    
    echo "<h1>Creando partidos de las jornadas 13-38</h1>";
    echo "<p>Conectado a la base de datos: " . DB_NAME . "</p>";
    echo "<hr>";
    
    // Preparar statement para insertar
    $sqlInsert = "INSERT INTO partidos (jornada, fecha, horario, equipo_local, equipo_visitante, goles_local, goles_visitante) 
                  VALUES (:jornada, :fecha, :horario, :equipo_local, :equipo_visitante, :goles_local, :goles_visitante)";
    $stmtInsert = $pdo->prepare($sqlInsert);
    
    // Preparar statement para verificar existencia
    $sqlCheck = "SELECT id FROM partidos WHERE jornada = :jornada AND equipo_local = :equipo_local AND equipo_visitante = :equipo_visitante";
    $stmtCheck = $pdo->prepare($sqlCheck);
    
    // Insertar partidos por jornada
    for ($jornada = 13; $jornada <= 38; $jornada++) {
        if (!isset($partidosPorJornada[$jornada])) {
            echo "<p style='color: orange;'>Jornada $jornada: No hay datos definidos</p>";
            continue;
        }
        
        $partidosJornada = $partidosPorJornada[$jornada];
        $insertadosJornada = 0;
        $duplicadosJornada = 0;
        $erroresJornada = 0;
        
        echo "<h2>Jornada $jornada</h2>";
        echo "<ul>";
        
        foreach ($partidosJornada as $partido) {
            try {
                // Verificar si el partido ya existe
                $stmtCheck->execute([
                    ':jornada' => $jornada,
                    ':equipo_local' => $partido['local'],
                    ':equipo_visitante' => $partido['visitante']
                ]);
                
                $existe = $stmtCheck->fetch();
                
                if ($existe) {
                    $duplicadosJornada++;
                    $totalDuplicados++;
                    echo "<li style='color: gray;'>✓ Ya existe: {$partido['local']} vs {$partido['visitante']}</li>";
                } else {
                    // Insertar nuevo partido
                    $stmtInsert->execute([
                        ':jornada' => $jornada,
                        ':fecha' => $partido['fecha'],
                        ':horario' => $partido['horario'],
                        ':equipo_local' => $partido['local'],
                        ':equipo_visitante' => $partido['visitante'],
                        ':goles_local' => $partido['goles_local'] === 0 ? null : $partido['goles_local'],
                        ':goles_visitante' => $partido['goles_visitante'] === 0 ? null : $partido['goles_visitante']
                    ]);
                    
                    $insertadosJornada++;
                    $totalInsertados++;
                    echo "<li style='color: green;'>✓ Creado: {$partido['local']} vs {$partido['visitante']} ({$partido['fecha']} {$partido['horario']})</li>";
                }
            } catch (PDOException $e) {
                $erroresJornada++;
                $totalErrores++;
                echo "<li style='color: red;'>✗ Error: {$partido['local']} vs {$partido['visitante']} - " . htmlspecialchars($e->getMessage()) . "</li>";
            }
        }
        
        echo "</ul>";
        echo "<p><strong>Resumen jornada $jornada:</strong> $insertadosJornada insertados, $duplicadosJornada duplicados, $erroresJornada errores</p>";
        echo "<hr>";
    }
    
    echo "<h2>Resumen General</h2>";
    echo "<ul>";
    echo "<li><strong>Total insertados:</strong> $totalInsertados</li>";
    echo "<li><strong>Total duplicados (ya existían):</strong> $totalDuplicados</li>";
    echo "<li><strong>Total errores:</strong> $totalErrores</li>";
    echo "</ul>";
    
    echo "<p style='color: green; font-weight: bold;'>✓ Proceso completado</p>";
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>Error de base de datos: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
?>

