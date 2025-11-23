<?php
/**
 * Script para crear la tabla valencia_cf y insertar los jugadores
 * Ejecutar desde el navegador: http://tu-dominio/api/crear_valencia_cf.php
 * Para reinsertar datos: http://tu-dominio/api/crear_valencia_cf.php?reinsertar=1
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
    
    $resultados = [];
    $reinsertar = isset($_GET['reinsertar']) && $_GET['reinsertar'] === '1';
    
    // Verificar si la tabla ya existe
    $tablas = $pdo->query("SHOW TABLES LIKE 'valencia_cf'")->fetchAll();
    $tablaExiste = count($tablas) > 0;
    
    if ($tablaExiste) {
        $count = $pdo->query("SELECT COUNT(*) FROM valencia_cf")->fetchColumn();
        $resultados['tabla_existe'] = true;
        $resultados['registros_actuales'] = intval($count);
        
        // Si se solicita reinsertar, eliminar datos existentes
        if ($reinsertar) {
            $pdo->exec("DELETE FROM valencia_cf");
            $resultados['mensaje'] = 'Datos anteriores eliminados';
        }
    }
    
    // Crear la tabla
    $createTableSQL = "
    CREATE TABLE IF NOT EXISTS `valencia_cf` (
      `Dorsal` INT(2) NOT NULL,
      `Nombre` VARCHAR(100) NOT NULL,
      `Apellido` VARCHAR(100) NOT NULL,
      `Posicion` VARCHAR(50) NOT NULL,
      `Fecha_Nacimiento` DATE NOT NULL,
      `Nacionalidad` VARCHAR(100) NOT NULL,
      PRIMARY KEY (`Dorsal`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $pdo->exec($createTableSQL);
    $resultados['creacion'] = 'Tabla creada o ya existía';
    
    // Insertar jugadores solo si la tabla no tenía datos o se solicita reinsertar
    if (!$tablaExiste || $reinsertar || $resultados['registros_actuales'] == 0) {
        // Insertar jugadores
        $jugadores = [
            [1, 'Stole', 'Dimitrievski', 'Portero', '1993-12-24', 'Macedonia del Norte'],
            [3, 'Jose Luis', 'Copete', 'Defensa', '1999-10-09', 'España'],
            [4, 'Mouctar', 'Diakhaby', 'Defensa', '1996-12-18', 'Guinea'],
            [5, 'Cesar', 'Tarrega', 'Defensa', '2002-02-25', 'España'],
            [7, 'Arnaut', 'Danjuma', 'Delantero', '1997-01-30', 'Países Bajos'],
            [8, 'Javi', 'Guerra', 'Centrocampista', '2003-05-12', 'España'],
            [9, 'Hugo', 'Duro', 'Delantero', '1999-11-09', 'España'],
            [10, 'Andre', 'Almeida', 'Centrocampista', '2000-05-29', 'Portugal'],
            [11, 'Luis', 'Rioja', 'Delantero', '1993-10-15', 'España'],
            [12, 'Thierry', 'Correia', 'Defensa', '1999-03-08', 'Portugal'],
            [13, 'Cristian', 'Rivero', 'Portero', '1998-03-20', 'España'],
            [14, 'Lucas', 'Gaya', 'Defensa', '1995-05-24', 'España'],
            [15, 'Diego', 'Beltran', 'Centrocampista', '2001-03-28', 'España'],
            [16, 'Largie', 'Lopez', 'Delantero', '2002-05-12', 'España'],
            [17, 'Pepelu', 'Ramirez', 'Centrocampista', '2001-02-26', 'España'],
            [18, 'Dani', 'Garcia', 'Centrocampista', '1998-08-10', 'España'],
            [19, 'Dimitri', 'Foulquier', 'Defensa', '1993-03-22', 'Guadalupe'],
            [20, 'Jesus', 'Vazquez', 'Defensa', '2003-01-01', 'España'],
            [21, 'Baptiste', 'Santamaria', 'Centrocampista', '1995-03-08', 'Francia'],
            [22, 'Filip', 'Ugrinic', 'Centrocampista', '1999-01-04', 'Suiza'],
            [23, 'Eray', 'Comert', 'Defensa', '1998-02-03', 'Suiza'],
            [24, 'Julen', 'Agirrezabala', 'Portero', '2000-12-25', 'España'],
            [25, 'Ruben', 'Iranzo', 'Defensa', '2003-03-13', 'España'],
            [26, 'David', 'Otorbi', 'Defensa', '2007-10-15', 'España'],
            [27, 'Carlos', 'Nuñez', 'Centrocampista', '2006-03-17', 'España'],
            [29, 'Aimar', 'Panach', 'Centrocampista', '2006-01-17', 'España'],
            [32, 'Marc', 'Navarro', 'Defensa', '2004-05-29', 'España'],
            [36, 'Pedro', 'Blazquez', 'Centrocampista', '2006-03-18', 'España'],
            [37, 'Sergio', 'Jurado', 'Delantero', '2005-12-07', 'España'],
            [38, 'Alberto', 'Mari', 'Centrocampista', '2004-08-22', 'España']
        ];
        
        $stmt = $pdo->prepare("
            INSERT INTO `valencia_cf` (`Dorsal`, `Nombre`, `Apellido`, `Posicion`, `Fecha_Nacimiento`, `Nacionalidad`) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $insertados = 0;
        foreach ($jugadores as $jugador) {
            try {
                $stmt->execute($jugador);
                $insertados++;
            } catch (PDOException $e) {
                // Si es error de duplicado, continuar
                if (strpos($e->getMessage(), 'Duplicate entry') === false) {
                    throw $e;
                }
            }
        }
        
        $resultados['jugadores_insertados'] = $insertados;
        $resultados['total_jugadores'] = count($jugadores);
    } else {
        $resultados['mensaje'] = 'La tabla ya tiene datos. Use ?reinsertar=1 para reinsertar';
    }
    
    // Obtener información final
    $countFinal = $pdo->query("SELECT COUNT(*) FROM valencia_cf")->fetchColumn();
    $resultados['registros_finales'] = intval($countFinal);
    
    @ob_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Proceso completado correctamente',
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

