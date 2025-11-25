/**
 * Script para contar registros en las tablas de equipos
 * Uso: node scripts/contar_registros.js
 */

const mysql = require('mysql2/promise');

const DB_CONFIG = {
    host: 'yamabiko.proxy.rlwy.net',
    port: 28754,
    user: 'root',
    password: 'ZAkiwwKgwmthUgTOJMwktjGDtNmmpVxi',
    database: 'railway',
    charset: 'utf8mb4'
};

async function main() {
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        // Verificar en qué base de datos estamos
        const [currentDb] = await connection.query("SELECT DATABASE() as db");
        console.log(`Base de datos actual: ${currentDb[0].db || 'ninguna'}\n`);
        
        // Cambiar a laliga
        await connection.query("USE `laliga`");
        
        // Obtener todas las tablas
        const [tablas] = await connection.query("SHOW TABLES");
        
        console.log(`Total de tablas encontradas: ${tablas.length}\n`);
        console.log('--- Tablas y número de registros ---\n');
        
        for (const tabla of tablas) {
            const nombreTabla = Object.values(tabla)[0];
            try {
                const [result] = await connection.query(`SELECT COUNT(*) as total FROM \`${nombreTabla}\``);
                const total = result[0].total;
                console.log(`${nombreTabla.padEnd(30)} ${total.toString().padStart(5)} registros`);
            } catch (error) {
                console.log(`${nombreTabla.padEnd(30)} ERROR: ${error.message}`);
            }
        }
        
    } catch (error) {
        console.error('Error:', error.message);
        process.exitCode = 1;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

main();

