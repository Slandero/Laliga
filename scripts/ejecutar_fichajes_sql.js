/**
 * Ejecuta el archivo SQL de fichajes en la base de datos 'railway' de Railway.
 * - Limpia referencias al esquema 'laliga.' para que funcione en la BD 'railway'
 * - Elimina el comando 'USE laliga;' si está presente
 *
 * Uso (en local, desde la carpeta del proyecto):
 *   node scripts/ejecutar_fichajes_sql.js
 */

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Misma configuración que en scripts/ejecutar_sql.js
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
    const sqlPath = path.join(__dirname, '..', 'database', 'fichajes.sql');

    if (!fs.existsSync(sqlPath)) {
        console.error('No se encontró el archivo SQL de fichajes:', sqlPath);
        process.exit(1);
    }

    let sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // 1) Eliminar cualquier "USE laliga;" para que no falle en Railway
    sqlContent = sqlContent.replace(/^\s*USE\s+laliga;\s*$/gim, '');

    // 2) Reemplazar todas las referencias a "laliga." por vacío
    //    (CREATE TABLE laliga.fichajes -> CREATE TABLE fichajes, INSERT INTO laliga.fichajes -> INSERT INTO fichajes)
    sqlContent = sqlContent.replace(/laliga\./g, '');

    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('Conectado a la base de datos `railway` en Railway');

        // Detectar las tablas que se van a crear para limpiarlas antes
        const tablas = extraerTablas(sqlContent);
        if (tablas.length) {
            console.log('Limpiando tablas existentes antes de importar fichajes...');
            await connection.query('SET FOREIGN_KEY_CHECKS=0');
            for (const tabla of tablas) {
                console.log(` - DROP TABLE IF EXISTS ${tabla}`);
                await connection.query(`DROP TABLE IF EXISTS ${formatearIdentificador(tabla)}`);
            }
            await connection.query('SET FOREIGN_KEY_CHECKS=1');
        }

        console.log('Ejecutando script SQL de fichajes...');
        await connection.query(sqlContent);
        console.log('✅ Script de fichajes ejecutado correctamente en la base de datos `railway`.');
    } catch (error) {
        console.error('❌ Error al ejecutar el script SQL de fichajes:', error.message);
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


