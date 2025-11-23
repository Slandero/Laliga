<?php
/**
 * Configuración de la aplicación
 * Ajusta estos valores según tu entorno
 */

// Detectar si estamos en localhost o producción
$isLocal = in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:80', 'localhost:8080', 'localhost:3000', '127.0.0.1:80', '127.0.0.1:8080']) 
          || strpos($_SERVER['HTTP_HOST'] ?? '', 'localhost:') === 0
          || strpos($_SERVER['HTTP_HOST'] ?? '', '127.0.0.1:') === 0;

// Usar Railway siempre (tanto desde local como desde producción)
// Configuración de RAILWAY
define('DB_HOST', 'yamabiko.proxy.rlwy.net');
define('DB_PORT', '28754');
define('DB_NAME', 'railway');
define('DB_USER', 'root');
define('DB_PASS', 'ZAkiwwKgwmthUgTOJMwktjGDtNmmpVxi');
define('DB_CHARSET', 'utf8mb4');

// Configuración de la aplicación
define('APP_DEBUG', $isLocal ? true : false);
define('APP_ENV', $isLocal ? 'development' : 'production');

