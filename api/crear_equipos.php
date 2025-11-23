<?php
/**
 * Script para crear todas las tablas de equipos y sus jugadores
 * Ejecutar desde el navegador: http://tu-dominio/api/crear_equipos.php
 * Para reinsertar datos: http://tu-dominio/api/crear_equipos.php?reinsertar=1
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
    
    $reinsertar = isset($_GET['reinsertar']) && $_GET['reinsertar'] === '1';
    $resultados = [];
    $tablasProcesadas = [];
    
    // Leer el archivo SQL
    $sqlFile = __DIR__ . '/../database/equipos.sql';
    
    if (!file_exists($sqlFile)) {
        throw new Exception('El archivo SQL no existe: ' . $sqlFile);
    }
    
    $sqlContent = file_get_contents($sqlFile);
    
    if (empty($sqlContent)) {
        throw new Exception('El archivo SQL está vacío');
    }
    
    // Limpiar el contenido SQL: eliminar comentarios y espacios extra
    $sqlContent = preg_replace('/--.*$/m', '', $sqlContent); // Eliminar comentarios de una línea
    $sqlContent = preg_replace('/\/\*.*?\*\//s', '', $sqlContent); // Eliminar comentarios multilínea
    
    // Reemplazar referencias a "laliga." con el nombre de la base de datos actual
    $sqlContent = str_replace('laliga.', '', $sqlContent);
    
    // Dividir en declaraciones SQL individuales
    $statements = [];
    $currentStatement = '';
    $inQuotes = false;
    $quoteChar = null;
    $inBackticks = false;
    
    for ($i = 0; $i < strlen($sqlContent); $i++) {
        $char = $sqlContent[$i];
        $prevChar = $i > 0 ? $sqlContent[$i - 1] : '';
        
        // Manejar comillas simples
        if ($char === "'" && $prevChar !== '\\') {
            if (!$inQuotes || $quoteChar === "'") {
                $inQuotes = !$inQuotes;
                $quoteChar = $inQuotes ? "'" : null;
            }
        }
        // Manejar comillas dobles
        elseif ($char === '"' && $prevChar !== '\\') {
            if (!$inQuotes || $quoteChar === '"') {
                $inQuotes = !$inQuotes;
                $quoteChar = $inQuotes ? '"' : null;
            }
        }
        // Manejar backticks
        elseif ($char === '`') {
            $inBackticks = !$inBackticks;
        }
        
        $currentStatement .= $char;
        
        // Si encontramos un punto y coma y no estamos dentro de comillas
        if ($char === ';' && !$inQuotes && !$inBackticks) {
            $statement = trim($currentStatement);
            if (!empty($statement)) {
                $statements[] = $statement;
            }
            $currentStatement = '';
        }
    }
    
    // Procesar cada declaración SQL
    foreach ($statements as $index => $statement) {
        $statement = trim($statement);
        
        if (empty($statement)) {
            continue;
        }
        
        try {
            // Detectar tipo de declaración
            if (preg_match('/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?`?(\w+)`?/i', $statement, $matches)) {
                $nombreTabla = isset($matches[1]) ? $matches[1] : null;
                
                if ($nombreTabla) {
                    // Verificar si la tabla ya existe
                    $tablas = $pdo->query("SHOW TABLES LIKE '$nombreTabla'")->fetchAll();
                    
                    if (count($tablas) > 0 && $reinsertar) {
                        // Eliminar tabla si se solicita reinsertar
                        $pdo->exec("DROP TABLE IF EXISTS `$nombreTabla`");
                        $resultados['tablas_eliminadas'][] = $nombreTabla;
                    }
                    
                    // Ejecutar CREATE TABLE
                    $pdo->exec($statement);
                    
                    if (!isset($tablasProcesadas[$nombreTabla])) {
                        $tablasProcesadas[$nombreTabla] = ['creada' => true, 'inserts' => 0];
                    }
                    
                    $resultados['tablas_creadas'][] = $nombreTabla;
                }
            }
            elseif (preg_match('/^INSERT\s+INTO\s+`?(\w+)`?/i', $statement, $matches)) {
                $nombreTabla = isset($matches[1]) ? $matches[1] : null;
                
                if ($nombreTabla) {
                    // Verificar si la tabla existe
                    $tablas = $pdo->query("SHOW TABLES LIKE '$nombreTabla'")->fetchAll();
                    
                    if (count($tablas) === 0) {
                        // Si la tabla no existe, saltar el INSERT (se creará después)
                        continue;
                    }
                    
                    // Si se solicita reinsertar y la tabla tiene datos, limpiarla primero
                    if ($reinsertar) {
                        try {
                            $count = $pdo->query("SELECT COUNT(*) FROM `$nombreTabla`")->fetchColumn();
                            if ($count > 0) {
                                $pdo->exec("DELETE FROM `$nombreTabla`");
                            }
                        } catch (PDOException $e) {
                            // Continuar si hay error
                        }
                    } else {
                        // Verificar si ya tiene datos
                        try {
                            $count = $pdo->query("SELECT COUNT(*) FROM `$nombreTabla`")->fetchColumn();
                            if ($count > 0) {
                                // Saltar INSERT si ya tiene datos (a menos que se solicite reinsertar)
                                continue;
                            }
                        } catch (PDOException $e) {
                            // Continuar si hay error
                        }
                    }
                    
                    // Ejecutar INSERT
                    try {
                        $pdo->exec($statement);
                        
                        if (!isset($tablasProcesadas[$nombreTabla])) {
                            $tablasProcesadas[$nombreTabla] = ['creada' => false, 'inserts' => 0];
                        }
                        
                        $tablasProcesadas[$nombreTabla]['inserts']++;
                    } catch (PDOException $e) {
                        // Si es error de duplicado, continuar
                        if (strpos($e->getMessage(), 'Duplicate entry') !== false) {
                            // Continuar silenciosamente
                        } else {
                            // Guardar error pero continuar
                            $resultados['errores'][] = "Error en INSERT para $nombreTabla: " . $e->getMessage();
                        }
                    }
                }
            }
            
        } catch (PDOException $e) {
            // Si el error es que la tabla ya existe, continuar
            if (strpos($e->getMessage(), 'already exists') !== false || 
                strpos($e->getMessage(), 'Duplicate entry') !== false) {
                continue;
            }
            
            // Guardar error pero continuar con las siguientes declaraciones
            $resultados['errores'][] = "Error en declaración " . ($index + 1) . ": " . $e->getMessage();
        }
    }
    
    // Obtener información final de las tablas creadas
    $tablasFinales = [];
    foreach (array_keys($tablasProcesadas) as $tabla) {
        try {
            $count = $pdo->query("SELECT COUNT(*) FROM `$tabla`")->fetchColumn();
            $tablasFinales[$tabla] = intval($count);
        } catch (PDOException $e) {
            $tablasFinales[$tabla] = 'Error al contar';
        }
    }
    
    // Resumen
    $resultados['resumen'] = [
        'total_tablas_procesadas' => count($tablasProcesadas),
        'tablas_con_datos' => $tablasFinales,
        'total_registros' => array_sum(array_filter($tablasFinales, 'is_numeric'))
    ];
    
    @ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Proceso completado correctamente',
        'resultados' => $resultados,
        'tablas_procesadas' => $tablasProcesadas
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    @ob_clean();
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

@ob_end_flush();

