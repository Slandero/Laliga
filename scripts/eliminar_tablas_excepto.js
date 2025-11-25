/**
 * Script para eliminar todas las tablas de la base de datos 'railway'
 * excepto las incluidas en la lista de protección.
 *
 * Uso:
 *   node scripts/eliminar_tablas_excepto.js
 */

const mysql = require('mysql2/promise');

// Configuración de Railway (misma que usa ejecutar_sql.js)
const DB_CONFIG = {
    host: 'yamabiko.proxy.rlwy.net',
    port: 28754,
    user: 'root',
    password: 'ZAkiwwKgwmthUgTOJMwktjGDtNmmpVxi',
    database: 'railway',
    charset: 'utf8mb4'
};

// Tablas que deben conservarse
const TABLAS_PROTEGIDAS = new Set([
    'entrenadores',
    'eventos_partido',
    'partidos',
    'usuarios'
]);

async function obtenerTablasAEliminar(conn) {
    const [rows] = await conn.query(
        `SELECT table_name AS nombre
         FROM information_schema.tables
         WHERE table_schema = ?`,
        [DB_CONFIG.database]
    );

    return rows
        .map(row => row.nombre)
        .filter(nombre => !TABLAS_PROTEGIDAS.has(nombre));
}

async function eliminarTablas(conn, tablas) {
    for (const tabla of tablas) {
        console.log(`Eliminando tabla: ${tabla}`);
        await conn.query(`DROP TABLE IF EXISTS \`${tabla}\``);
    }
}

async function main() {
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('Conexión exitosa con la base de datos');

        const tablasAEliminar = await obtenerTablasAEliminar(connection);

        if (tablasAEliminar.length === 0) {
            console.log('No hay tablas para eliminar. Solo existen las protegidas.');
            return;
        }

        console.log('Tablas que se eliminarán:', tablasAEliminar);
        await eliminarTablas(connection, tablasAEliminar);
        console.log('Proceso completado. Se eliminaron todas las tablas no protegidas.');
    } catch (error) {
        console.error('Error al eliminar tablas:', error.message);
        process.exitCode = 1;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

main();

