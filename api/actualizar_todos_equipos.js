/**
 * Script para actualizar TODOS los equipos en la base de datos
 * según los cambios realizados en el script SQL
 * Parsea el archivo equipos.sql directamente
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Configuración de Railway
const DB_CONFIG = {
    host: 'yamabiko.proxy.rlwy.net',
    port: 28754,
    user: 'root',
    password: 'ZAkiwwKgwmthUgTOJMwktjGDtNmmpVxi',
    database: 'railway',
    charset: 'utf8mb4'
};

// Lista de equipos a actualizar (excluyendo entrenadores y valencia_cf que tiene estructura diferente)
const EQUIPOS = [
    'real_betis',
    'rcd_mallorca',
    'rcd_espanyol',
    'rayo_vallecano',
    'levante_ud',
    'girona_fc',
    'sevilla_fc',
    'real_sociedad',
    'real_oviedo',
    'real_madrid',
    'fc_barcelona',
    'getafe_cf',
    'ca_osasuna',
    'celta_vigo',
    'atletico_de_madrid',
    'athletic_club',
    'elche_cf',
    'deportivo_alaves',
    'villarreal_cf',
    'valencia_cf'
];

// Función para parsear el archivo SQL y extraer datos de un equipo
function parsearEquipoSQL(contenidoSQL, nombreTabla) {
    const datos = [];
    
    // Buscar la sección INSERT INTO para el equipo
    const regexInsert = new RegExp(`INSERT INTO (?:laliga\\.)?\\\`?${nombreTabla}\\\`?[^;]*VALUES\\s*([^;]+);`, 'is');
    const match = contenidoSQL.match(regexInsert);
    
    if (!match) {
        return datos;
    }
    
    // Extraer los valores de INSERT
    const valoresStr = match[1];
    
    // Parsear cada fila de valores (formato: (dorsal, 'nombre', 'apellido', 'posicion', 'fecha', 'nacionalidad'))
    const regexFila = /\((\d+),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'\)/g;
    let filaMatch;
    
    while ((filaMatch = regexFila.exec(valoresStr)) !== null) {
        datos.push({
            Dorsal: parseInt(filaMatch[1]),
            Nombre: filaMatch[2],
            Apellido: filaMatch[3],
            Posicion: filaMatch[4],
            Fecha_Nacimiento: filaMatch[5],
            Nacionalidad: filaMatch[6]
        });
    }
    
    return datos;
}

// Función para actualizar un equipo
async function actualizarEquipo(connection, nombreTabla, datosScriptSQL) {
    console.log(`\n📋 Procesando: ${nombreTabla}`);
    console.log(`   Jugadores en script: ${datosScriptSQL.length}`);
    
    // Verificar que la tabla existe
    const [tablas] = await connection.execute(`SHOW TABLES LIKE '${nombreTabla}'`);
    if (tablas.length === 0) {
        console.log(`   ⚠️  La tabla ${nombreTabla} no existe. Creándola...`);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS \`${nombreTabla}\` (
                \`Dorsal\` INT,
                \`Nombre\` VARCHAR(255),
                \`Apellido\` VARCHAR(255),
                \`Posicion\` VARCHAR(255),
                \`Fecha_Nacimiento\` DATE,
                \`Nacionalidad\` VARCHAR(255)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
    }
    
    // Obtener jugadores actuales de la BD
    const [jugadoresBD] = await connection.execute(
        `SELECT * FROM \`${nombreTabla}\` ORDER BY Dorsal ASC`
    );
    
    console.log(`   Jugadores en BD: ${jugadoresBD.length}`);
    
    // Crear índices para búsqueda rápida
    const jugadoresBDIndexados = {};
    jugadoresBD.forEach(j => {
        jugadoresBDIndexados[j.Dorsal] = j;
    });
    
    const jugadoresScriptIndexados = {};
    datosScriptSQL.forEach(j => {
        jugadoresScriptIndexados[j.Dorsal] = j;
    });
    
    // Procesar cada jugador del script SQL
    let insertados = 0;
    let actualizados = 0;
    let eliminados = 0;
    
    // 1. Insertar o actualizar jugadores del script
    for (const jugadorScript of datosScriptSQL) {
        const dorsal = jugadorScript.Dorsal;
        const jugadorBD = jugadoresBDIndexados[dorsal];
        
        if (!jugadorBD) {
            // Insertar nuevo jugador
            await connection.execute(
                `INSERT INTO \`${nombreTabla}\` (Dorsal, Nombre, Apellido, Posicion, Fecha_Nacimiento, Nacionalidad) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    jugadorScript.Dorsal,
                    jugadorScript.Nombre,
                    jugadorScript.Apellido,
                    jugadorScript.Posicion,
                    jugadorScript.Fecha_Nacimiento,
                    jugadorScript.Nacionalidad
                ]
            );
            insertados++;
        } else {
            // Verificar si hay cambios
            const fechaBD = jugadorBD.Fecha_Nacimiento instanceof Date 
                ? jugadorBD.Fecha_Nacimiento.toISOString().substring(0, 10)
                : String(jugadorBD.Fecha_Nacimiento).substring(0, 10);
            
            const hayCambios = 
                jugadorBD.Nombre !== jugadorScript.Nombre ||
                jugadorBD.Apellido !== jugadorScript.Apellido ||
                jugadorBD.Posicion !== jugadorScript.Posicion ||
                fechaBD !== jugadorScript.Fecha_Nacimiento ||
                jugadorBD.Nacionalidad !== jugadorScript.Nacionalidad;
            
            if (hayCambios) {
                // Actualizar jugador
                await connection.execute(
                    `UPDATE \`${nombreTabla}\` 
                     SET Nombre = ?, Apellido = ?, Posicion = ?, Fecha_Nacimiento = ?, Nacionalidad = ? 
                     WHERE Dorsal = ?`,
                    [
                        jugadorScript.Nombre,
                        jugadorScript.Apellido,
                        jugadorScript.Posicion,
                        jugadorScript.Fecha_Nacimiento,
                        jugadorScript.Nacionalidad,
                        dorsal
                    ]
                );
                actualizados++;
            }
        }
    }
    
    // 2. Eliminar jugadores que ya no están en el script
    for (const jugadorBD of jugadoresBD) {
        const dorsal = jugadorBD.Dorsal;
        if (!jugadoresScriptIndexados[dorsal]) {
            await connection.execute(
                `DELETE FROM \`${nombreTabla}\` WHERE Dorsal = ?`,
                [dorsal]
            );
            eliminados++;
        }
    }
    
    return { insertados, actualizados, eliminados };
}

async function actualizarTodosEquipos() {
    let connection;
    
    try {
        // Leer el archivo SQL
        const sqlPath = path.join(__dirname, '..', 'database', 'equipos.sql');
        const contenidoSQL = fs.readFileSync(sqlPath, 'utf8');
        
        connection = await mysql.createConnection(DB_CONFIG);
        
        console.log('=== ACTUALIZANDO TODOS LOS EQUIPOS ===\n');
        console.log(`📄 Archivo SQL: ${sqlPath}`);
        console.log(`📊 Equipos a procesar: ${EQUIPOS.length}\n`);
        
        const resumenEquipos = {};
        let totalInsertados = 0;
        let totalActualizados = 0;
        let totalEliminados = 0;
        
        // Procesar cada equipo
        for (const nombreTabla of EQUIPOS) {
            try {
                const datosScriptSQL = parsearEquipoSQL(contenidoSQL, nombreTabla);
                
                if (datosScriptSQL.length === 0) {
                    console.log(`⚠️  ${nombreTabla}: No se encontraron datos en el SQL`);
                    continue;
                }
                
                const resultado = await actualizarEquipo(connection, nombreTabla, datosScriptSQL);
                
                resumenEquipos[nombreTabla] = resultado;
                totalInsertados += resultado.insertados;
                totalActualizados += resultado.actualizados;
                totalEliminados += resultado.eliminados;
                
                if (resultado.insertados > 0 || resultado.actualizados > 0 || resultado.eliminados > 0) {
                    console.log(`   ✅ ${resultado.insertados} insertados, ${resultado.actualizados} actualizados, ${resultado.eliminados} eliminados`);
                } else {
                    console.log(`   ✓ Sincronizado (sin cambios)`);
                }
                
            } catch (error) {
                console.error(`   ❌ Error procesando ${nombreTabla}:`, error.message);
            }
        }
        
        // Resumen general
        console.log('\n=== RESUMEN GENERAL ===');
        console.log(`✅ Total insertados: ${totalInsertados}`);
        console.log(`✏️  Total actualizados: ${totalActualizados}`);
        console.log(`🗑️  Total eliminados: ${totalEliminados}`);
        
        console.log('\n📊 Resumen por equipo:');
        for (const [equipo, resultado] of Object.entries(resumenEquipos)) {
            if (resultado.insertados > 0 || resultado.actualizados > 0 || resultado.eliminados > 0) {
                console.log(`   ${equipo}: +${resultado.insertados} ✏️${resultado.actualizados} 🗑️${resultado.eliminados}`);
            }
        }
        
        if (totalInsertados === 0 && totalActualizados === 0 && totalEliminados === 0) {
            console.log('\n✅ Todos los equipos están sincronizados. No se realizaron cambios.');
        } else {
            console.log('\n✅ Actualización completada exitosamente.');
        }
        
        await connection.end();
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (connection) {
            await connection.end();
        }
        process.exit(1);
    }
}

actualizarTodosEquipos();

