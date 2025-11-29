-- Tabla para almacenar noticias del sistema
CREATE TABLE IF NOT EXISTS `noticias` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(200) NOT NULL,
  `contenido` TEXT NOT NULL,
  `imagen_url` VARCHAR(500) DEFAULT NULL,
  `jornada` INT(11) DEFAULT NULL,
  `usuario_id` INT(11) NOT NULL,
  `fecha_creacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_usuario` (`usuario_id`),
  KEY `idx_fecha_creacion` (`fecha_creacion`),
  KEY `idx_jornada` (`jornada`),
  CONSTRAINT `fk_noticias_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

