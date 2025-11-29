/**
 * Script para actualizar la tabla `noticias` y añadir la columna `jornada`.
 *
 * Uso:
 *   node scripts/alter_noticias_jornada.js
 *
 * Se conecta a la base de datos de Railway usando la misma configuración
 * que `scripts/ejecutar_sql.js` y ejecuta un ALTER TABLE seguro (idempotente).
 */

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
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        console.log('Conectado a la base de datos `railway`');

        // Comprobar si la columna jornada ya existe
        const [rows] = await connection.query(
            "SHOW COLUMNS FROM `noticias` LIKE 'jornada';"
        );

        if (rows && rows.length > 0) {
            console.log('La columna `jornada` ya existe en la tabla `noticias`. No se realizan cambios.');
            return;
        }

        console.log('Añadiendo columna `jornada` a la tabla `noticias`...');

        const alterSql = `
            ALTER TABLE \`noticias\`
                ADD COLUMN \`jornada\` INT(11) DEFAULT NULL AFTER \`imagen_url\`,
                ADD INDEX \`idx_jornada\` (\`jornada\`);
        `;

        await connection.query(alterSql);

        console.log('✅ Columna `jornada` añadida correctamente a la tabla `noticias`.');
    } catch (error) {
        console.error('❌ Error al modificar la tabla `noticias`:', error.message);
        process.exitCode = 1;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

main();


