/**
 * Ejecuta un archivo SQL completo en la base de datos 'railway' de Railway.
 * Reemplaza automáticamente las referencias 'laliga.' por vacío.
 * Uso: node scripts/ejecutar_sql.js
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const DB_CONFIG = {
    host: 'yamabiko.proxy.rlwy.net',
    port: 28754,
    user: 'root',
    password: 'ZAkiwwKgwmthUgTOJMwktjGDtNmmpVxi',
    database: 'railway',
    charset: 'utf8mb4',
    multipleStatements: true
};

async function main() {
    const sqlPath = path.join(__dirname, '..', 'database', 'equipos.sql');

    if (!fs.existsSync(sqlPath)) {
        console.error('No se encontró el archivo SQL:', sqlPath);
        process.exit(1);
    }

    let sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Reemplazar todas las referencias a laliga. por vacío (para usar la base de datos railway)
    sqlContent = sqlContent.replace(/laliga\./g, '');

    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        // Ya estamos conectados a la base de datos 'railway' por defecto

        const tablas = extraerTablas(sqlContent);
        if (tablas.length) {
            console.log('Limpiando tablas existentes en `railway`...');
            await connection.query('SET FOREIGN_KEY_CHECKS=0');
            for (const tabla of tablas) {
                await connection.query(`DROP TABLE IF EXISTS ${formatearIdentificador(tabla)}`);
            }
            await connection.query('SET FOREIGN_KEY_CHECKS=1');
        }

        console.log('Ejecutando script SQL completo...');
        await connection.query(sqlContent);
        console.log('Script ejecutado correctamente en la base de datos `railway`.');
    } catch (error) {
        console.error('Error al ejecutar el script SQL:', error.message);
        process.exitCode = 1;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

function extraerTablas(sqlContent) {
    const tablas = new Set();
    const regex = /CREATE TABLE(?: IF NOT EXISTS)?\s+([`"]?[\w.]+[`"]?)/gi;
    let match;
    while ((match = regex.exec(sqlContent)) !== null) {
        const raw = match[1].replace(/[`"]/g, '');
        tablas.add(raw);
    }
    return Array.from(tablas);
}

function formatearIdentificador(nombre) {
    if (nombre.includes('.')) {
        const [schema, tabla] = nombre.split('.');
        return `\`${schema}\`.\`${tabla}\``;
    }
    return `\`${nombre}\``;
}

main();

