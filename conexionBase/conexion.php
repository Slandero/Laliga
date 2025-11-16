<?php
/**
 * Conexión a la Base de Datos MySQL
 * Utiliza PDO para conexiones seguras y preparadas
 */

// Suprimir errores durante la carga
@error_reporting(0);
@ini_set('display_errors', 0);

// Intentar cargar config.php si existe
$configPath = __DIR__ . '/../config/config.php';
if (file_exists($configPath)) {
    @require_once $configPath;
}

// Si no están definidas las constantes, usar valores por defecto
if (!defined('DB_HOST')) {
    @define('DB_HOST', '127.0.0.1');
}
if (!defined('DB_NAME')) {
    @define('DB_NAME', 'laliga');
}
if (!defined('DB_USER')) {
    @define('DB_USER', 'root');
}
if (!defined('DB_PASS')) {
    @define('DB_PASS', '');
}
if (!defined('DB_CHARSET')) {
    @define('DB_CHARSET', 'utf8mb4');
}
if (!defined('APP_DEBUG')) {
    @define('APP_DEBUG', false);
}
if (!defined('APP_ENV')) {
    @define('APP_ENV', 'production');
}

class Conexion {
    private static $instancia = null;
    private $pdo;
    
    /**
     * Constructor privado para implementar patrón Singleton
     */
    private function __construct() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            
            $opciones = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, $opciones);
            
            if (APP_DEBUG && APP_ENV === 'development') {
                error_log("Conexión a MySQL establecida correctamente");
            }
            
        } catch (PDOException $e) {
            // Lanzar la excepción en lugar de usar die() para que se capture en el endpoint
            throw $e;
        }
    }
    
    /**
     * Obtener instancia única de la conexión (Singleton)
     * @return Conexion
     */
    public static function obtenerInstancia() {
        if (self::$instancia === null) {
            self::$instancia = new self();
        }
        return self::$instancia;
    }
    
    /**
     * Obtener el objeto PDO
     * @return PDO
     */
    public function obtenerPDO() {
        return $this->pdo;
    }
    
    /**
     * Prevenir clonación de la instancia
     */
    private function __clone() {}
    
    /**
     * Prevenir deserialización de la instancia
     */
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
    
    /**
     * Ejecutar una consulta SELECT
     * @param string $sql Consulta SQL
     * @param array $params Parámetros para la consulta preparada
     * @return array Resultados
     */
    public function consultar($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            $resultado = $stmt->fetchAll();
            return $resultado ? $resultado : [];
        } catch (PDOException $e) {
            // Solo loggear errores, no mostrar
            if (APP_DEBUG) {
                error_log("Error en consulta: " . $e->getMessage());
                error_log("SQL: " . $sql);
            }
            throw $e;
        }
    }
    
    /**
     * Ejecutar una consulta SELECT y obtener un solo registro
     * @param string $sql Consulta SQL
     * @param array $params Parámetros para la consulta preparada
     * @return array|null Un registro o null si no hay resultados
     */
    public function consultarUno($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            $resultado = $stmt->fetch();
            return $resultado ? $resultado : null;
        } catch (PDOException $e) {
            if (APP_DEBUG) {
                error_log("Error en consulta: " . $e->getMessage());
                error_log("SQL: " . $sql);
            }
            throw $e;
        }
    }
    
    /**
     * Ejecutar una consulta INSERT, UPDATE o DELETE
     * @param string $sql Consulta SQL
     * @param array $params Parámetros para la consulta preparada
     * @return int Número de filas afectadas
     */
    public function ejecutar($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt->rowCount();
        } catch (PDOException $e) {
            if (APP_DEBUG) {
                error_log("Error en ejecución: " . $e->getMessage());
                error_log("SQL: " . $sql);
            }
            throw $e;
        }
    }
    
    /**
     * Ejecutar una consulta INSERT y obtener el último ID insertado
     * @param string $sql Consulta SQL
     * @param array $params Parámetros para la consulta preparada
     * @return int ID del último registro insertado
     */
    public function insertar($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            return $this->pdo->lastInsertId();
        } catch (PDOException $e) {
            if (APP_DEBUG) {
                error_log("Error en inserción: " . $e->getMessage());
                error_log("SQL: " . $sql);
            }
            throw $e;
        }
    }
    
    /**
     * Iniciar una transacción
     * @return bool
     */
    public function iniciarTransaccion() {
        return $this->pdo->beginTransaction();
    }
    
    /**
     * Confirmar una transacción
     * @return bool
     */
    public function confirmarTransaccion() {
        return $this->pdo->commit();
    }
    
    /**
     * Revertir una transacción
     * @return bool
     */
    public function revertirTransaccion() {
        return $this->pdo->rollBack();
    }
}


