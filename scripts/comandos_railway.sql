-- ============================================
-- COMANDOS SQL PARA EJECUTAR EN RAILWAY
-- ============================================
-- Copia y pega estos comandos en el Query Editor de Railway
-- (Database > Query o Data > Query)

-- 1. Cambiar a la base de datos laliga
USE laliga;

-- 2. Ver todas las tablas
SHOW TABLES;

-- 3. Ver todas las tablas con número de registros
SELECT 
    TABLE_NAME as 'Tabla',
    TABLE_ROWS as 'Registros'
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'laliga'
ORDER BY 
    TABLE_NAME;

-- 4. Ver estructura de una tabla específica (ejemplo: real_madrid)
DESCRIBE real_madrid;

-- 5. Ver datos de una tabla específica (ejemplo: real_madrid)
SELECT * FROM real_madrid LIMIT 10;

-- 6. Ver todas las tablas de equipos
SELECT 
    TABLE_NAME as 'Tabla',
    TABLE_ROWS as 'Registros'
FROM 
    information_schema.TABLES
WHERE 
    TABLE_SCHEMA = 'laliga'
    AND TABLE_NAME NOT IN ('entrenadores', 'partidos', 'usuarios', 'eventos_partido')
ORDER BY 
    TABLE_NAME;

-- 7. Contar registros por tabla
SELECT 
    TABLE_NAME as 'Tabla',
    (SELECT COUNT(*) FROM information_schema.TABLES t2 WHERE t2.TABLE_SCHEMA = 'laliga' AND t2.TABLE_NAME = t1.TABLE_NAME) as 'Total_Tablas',
    TABLE_ROWS as 'Registros_Aproximados'
FROM 
    information_schema.TABLES t1
WHERE 
    TABLE_SCHEMA = 'laliga'
ORDER BY 
    TABLE_NAME;


