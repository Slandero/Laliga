-- Tabla para almacenar partidos y resultados de las jornadas
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

