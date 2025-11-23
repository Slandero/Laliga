-- Tabla para almacenar usuarios del sistema
-- Esta tabla contiene todos los usuarios registrados en la aplicación
-- Campos:
--   id: Identificador único del usuario
--   username: Nombre de usuario único (máximo 50 caracteres)
--   email: Email único del usuario (máximo 100 caracteres)
--   password: Contraseña hasheada con bcrypt (máximo 255 caracteres)
--   nombre_completo: Nombre completo del usuario (opcional, máximo 100 caracteres)
--   rol: Rol del usuario ('usuario' o 'admin'), por defecto 'usuario'
--   activo: Estado del usuario (1=activo, 0=inactivo), por defecto 1
--   fecha_registro: Fecha y hora de registro del usuario
--   ultimo_acceso: Fecha y hora del último acceso del usuario
--   fecha_actualizacion: Fecha y hora de la última actualización del registro
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `nombre_completo` VARCHAR(100) DEFAULT NULL,
  `rol` ENUM('usuario', 'admin') DEFAULT 'usuario',
  `activo` TINYINT(1) DEFAULT 1,
  `fecha_registro` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `ultimo_acceso` TIMESTAMP NULL DEFAULT NULL,
  `fecha_actualizacion` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_activo` (`activo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Ejemplo de usuario administrador (contraseña: admin123)
-- INSERT INTO `usuarios` (`username`, `email`, `password`, `nombre_completo`, `rol`, `activo`) VALUES
-- ('admin', 'admin@laliga.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrador', 'admin', 1);

-- Ejemplo de usuario normal
-- INSERT INTO `usuarios` (`username`, `email`, `password`, `nombre_completo`, `rol`, `activo`) VALUES
-- ('usuario1', 'usuario1@laliga.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Usuario de Prueba', 'usuario', 1);

