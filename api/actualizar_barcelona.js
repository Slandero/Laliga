/**
 * Script para actualizar los datos del FC Barcelona en la base de datos
 * según los cambios realizados en el script SQL
 */

const mysql = require('mysql2/promise');

// Configuración de Railway
const DB_CONFIG = {
    host: 'yamabiko.proxy.rlwy.net',
    port: 28754,
    user: 'root',
    password: 'ZAkiwwKgwmthUgTOJMwktjGDtNmmpVxi',
    database: 'railway',
    charset: 'utf8mb4'
};

// Datos del FC Barcelona según el script SQL (equipos.sql)
const datosScriptSQL = [
    { Dorsal: 1, Nombre: 'Marc-André', Apellido: 'ter Stegen', Posicion: 'Portero', Fecha_Nacimiento: '1992-04-29', Nacionalidad: 'Alemania' },
    { Dorsal: 3, Nombre: 'Alejandro', Apellido: 'Balde', Posicion: 'Defensa', Fecha_Nacimiento: '2003-10-17', Nacionalidad: 'España' },
    { Dorsal: 4, Nombre: 'Ronald', Apellido: 'Araujo', Posicion: 'Defensa', Fecha_Nacimiento: '1999-03-06', Nacionalidad: 'Uruguay' },
    { Dorsal: 5, Nombre: 'Pau', Apellido: 'Cubarsí', Posicion: 'Defensa', Fecha_Nacimiento: '2007-01-21', Nacionalidad: 'España' },
    { Dorsal: 6, Nombre: 'Gavi', Apellido: 'Páez', Posicion: 'Centrocampista', Fecha_Nacimiento: '2004-08-04', Nacionalidad: 'España' },
    { Dorsal: 7, Nombre: 'Ferran', Apellido: 'Torres', Posicion: 'Delantero', Fecha_Nacimiento: '2000-02-28', Nacionalidad: 'España' },
    { Dorsal: 8, Nombre: 'Pedri', Apellido: 'González', Posicion: 'Centrocampista', Fecha_Nacimiento: '1997-05-12', Nacionalidad: 'Países Bajos' },
    { Dorsal: 9, Nombre: 'Robert', Apellido: 'Lewandowski', Posicion: 'Delantero', Fecha_Nacimiento: '1988-08-20', Nacionalidad: 'Polonia' },
    { Dorsal: 10, Nombre: 'Lamine', Apellido: 'Yamal', Posicion: 'Delantero', Fecha_Nacimiento: '2007-07-12', Nacionalidad: 'España' },
    { Dorsal: 11, Nombre: 'Raphael', Apellido: 'Díaz Belloli', Posicion: 'Delantero', Fecha_Nacimiento: '1996-12-13', Nacionalidad: 'Brasil' },
    { Dorsal: 13, Nombre: 'Joan', Apellido: 'García', Posicion: 'Portero', Fecha_Nacimiento: '2001-05-03', Nacionalidad: 'España' },
    { Dorsal: 14, Nombre: 'Marcus', Apellido: 'Rashford', Posicion: 'Delantero', Fecha_Nacimiento: '1997-10-30', Nacionalidad: 'Inglaterra' },
    { Dorsal: 15, Nombre: 'Andreas', Apellido: 'Christensen', Posicion: 'Defensa', Fecha_Nacimiento: '1996-04-09', Nacionalidad: 'Dinamarca' },
    { Dorsal: 16, Nombre: 'Fermín', Apellido: 'López', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-05-10', Nacionalidad: 'España' },
    { Dorsal: 17, Nombre: 'Marc', Apellido: 'Casadó', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-09-13', Nacionalidad: 'España' },
    { Dorsal: 18, Nombre: 'Gerard', Apellido: 'Martin', Posicion: 'Defensa', Fecha_Nacimiento: '2002-02-25', Nacionalidad: 'España' },
    { Dorsal: 20, Nombre: 'Dani', Apellido: 'Olmo', Posicion: 'Delantero', Fecha_Nacimiento: '1998-05-06', Nacionalidad: 'España' },
    { Dorsal: 21, Nombre: 'Frenkie', Apellido: 'de Jong', Posicion: 'Centrocampista', Fecha_Nacimiento: '1997-05-11', Nacionalidad: 'Países Bajos' },
    { Dorsal: 22, Nombre: 'Marc', Apellido: 'Bernal', Posicion: 'Centrocampista', Fecha_Nacimiento: '2007-05-25', Nacionalidad: 'España' },
    { Dorsal: 23, Nombre: 'Jules', Apellido: 'Koundé', Posicion: 'Defensa', Fecha_Nacimiento: '1998-11-11', Nacionalidad: 'Francia' },
    { Dorsal: 24, Nombre: 'Eric', Apellido: 'García', Posicion: 'Defensa', Fecha_Nacimiento: '2001-01-08', Nacionalidad: 'España' },
    { Dorsal: 25, Nombre: 'Wojciech', Apellido: 'Szczesny', Posicion: 'Portero', Fecha_Nacimiento: '1990-04-17', Nacionalidad: 'Polonia' },
    { Dorsal: 26, Nombre: 'Jofre', Apellido: 'Torrents', Posicion: 'Delantero', Fecha_Nacimiento: '2007-01-27', Nacionalidad: 'España' },
    { Dorsal: 27, Nombre: 'Dro', Apellido: 'Rodríguez', Posicion: 'Centrocampista', Fecha_Nacimiento: '2008-01-11', Nacionalidad: 'España' },
    { Dorsal: 28, Nombre: 'Roony', Apellido: 'Bardghji', Posicion: 'Delantero', Fecha_Nacimiento: '2005-11-14', Nacionalidad: 'Suecia' },
    { Dorsal: 29, Nombre: 'A.', Apellido: 'Fernández', Posicion: 'Centrocampista', Fecha_Nacimiento: '2008-07-14', Nacionalidad: 'España' },
    { Dorsal: 30, Nombre: 'Guille', Apellido: 'García', Posicion: 'Delantero', Fecha_Nacimiento: '2006-06-17', Nacionalidad: 'España' },
    { Dorsal: 31, Nombre: 'Diego', Apellido: 'Kochen', Posicion: 'Portero', Fecha_Nacimiento: '2006-03-18', Nacionalidad: 'Estados Unidos' },
    { Dorsal: 33, Nombre: 'Eder', Apellido: 'Aler', Posicion: 'Portero', Fecha_Nacimiento: '2007-04-03', Nacionalidad: 'España' },
    { Dorsal: 41, Nombre: 'Juan', Apellido: 'Hernández', Posicion: 'Centrocampista', Fecha_Nacimiento: '2007-07-20', Nacionalidad: 'España' },
    { Dorsal: 42, Nombre: 'Xavi', Apellido: 'Espart', Posicion: 'Defensa', Fecha_Nacimiento: '2007-05-20', Nacionalidad: 'España' },
];

async function actualizarBarcelona() {
    let connection;
    
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        console.log('=== ACTUALIZANDO DATOS DEL FC BARCELONA ===\n');
        
        // Verificar que la tabla existe
        const [tablas] = await connection.execute("SHOW TABLES LIKE 'fc_barcelona'");
        if (tablas.length === 0) {
            console.log('❌ La tabla fc_barcelona no existe. Creándola...');
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS \`fc_barcelona\` (
                    \`Dorsal\` INT,
                    \`Nombre\` VARCHAR(255),
                    \`Apellido\` VARCHAR(255),
                    \`Posicion\` VARCHAR(255),
                    \`Fecha_Nacimiento\` DATE,
                    \`Nacionalidad\` VARCHAR(255)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            `);
            console.log('✅ Tabla creada correctamente.\n');
        }
        
        // Obtener jugadores actuales de la BD
        const [jugadoresBD] = await connection.execute(
            "SELECT * FROM fc_barcelona ORDER BY Dorsal ASC"
        );
        
        console.log(`📊 Jugadores actuales en BD: ${jugadoresBD.length}`);
        console.log(`📋 Jugadores esperados en script: ${datosScriptSQL.length}\n`);
        
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
        
        console.log('🔄 Procesando cambios...\n');
        
        // 1. Insertar o actualizar jugadores del script
        for (const jugadorScript of datosScriptSQL) {
            const dorsal = jugadorScript.Dorsal;
            const jugadorBD = jugadoresBDIndexados[dorsal];
            
            if (!jugadorBD) {
                // Insertar nuevo jugador
                await connection.execute(
                    `INSERT INTO fc_barcelona (Dorsal, Nombre, Apellido, Posicion, Fecha_Nacimiento, Nacionalidad) 
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
                console.log(`➕ Insertado: Dorsal ${dorsal} - ${jugadorScript.Nombre} ${jugadorScript.Apellido}`);
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
                        `UPDATE fc_barcelona 
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
                    console.log(`✏️  Actualizado: Dorsal ${dorsal} - ${jugadorScript.Nombre} ${jugadorScript.Apellido}`);
                    actualizados++;
                }
            }
        }
        
        // 2. Eliminar jugadores que ya no están en el script
        for (const jugadorBD of jugadoresBD) {
            const dorsal = jugadorBD.Dorsal;
            if (!jugadoresScriptIndexados[dorsal]) {
                await connection.execute(
                    "DELETE FROM fc_barcelona WHERE Dorsal = ?",
                    [dorsal]
                );
                console.log(`🗑️  Eliminado: Dorsal ${dorsal} - ${jugadorBD.Nombre} ${jugadorBD.Apellido} (ya no está en el script)`);
                eliminados++;
            }
        }
        
        // Resumen
        console.log('\n=== RESUMEN ===');
        console.log(`✅ Jugadores insertados: ${insertados}`);
        console.log(`✏️  Jugadores actualizados: ${actualizados}`);
        console.log(`🗑️  Jugadores eliminados: ${eliminados}`);
        
        if (insertados === 0 && actualizados === 0 && eliminados === 0) {
            console.log('\n✅ Los datos ya están sincronizados. No se realizaron cambios.');
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

actualizarBarcelona();

