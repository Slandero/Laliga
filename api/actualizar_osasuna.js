/**
 * Script para actualizar los datos del CA Osasuna en la base de datos
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

// Datos del CA Osasuna según el script SQL (equipos.sql)
const datosScriptSQL = [
    { Dorsal: 1, Nombre: 'Sergio', Apellido: 'Herrera', Posicion: 'Portero', Fecha_Nacimiento: '1993-06-04', Nacionalidad: 'España' },
    { Dorsal: 2, Nombre: 'Iker', Apellido: 'Benito', Posicion: 'Delantero', Fecha_Nacimiento: '2002-08-09', Nacionalidad: 'España' },
    { Dorsal: 3, Nombre: 'Juan', Apellido: 'Cruz', Posicion: 'Defensa', Fecha_Nacimiento: '1992-02-04', Nacionalidad: 'España' },
    { Dorsal: 5, Nombre: 'Jorge', Apellido: 'Herrando', Posicion: 'Defensa', Fecha_Nacimiento: '2001-02-27', Nacionalidad: 'España' },
    { Dorsal: 6, Nombre: 'Jon', Apellido: 'Torró', Posicion: 'Centrocampista', Fecha_Nacimiento: '1994-07-12', Nacionalidad: 'España' },
    { Dorsal: 7, Nombre: 'Lucas', Apellido: 'Moncayola', Posicion: 'Centrocampista', Fecha_Nacimiento: '1998-05-12', Nacionalidad: 'España' },
    { Dorsal: 8, Nombre: 'Iker', Apellido: 'Muñoz', Posicion: 'Centrocampista', Fecha_Nacimiento: '2002-05-16', Nacionalidad: 'España' },
    { Dorsal: 9, Nombre: 'Raúl', Apellido: 'García', Posicion: 'Delantero', Fecha_Nacimiento: '2000-11-02', Nacionalidad: 'España' },
    { Dorsal: 10, Nombre: 'Aimar', Apellido: 'Oroz', Posicion: 'Delantero', Fecha_Nacimiento: '2001-11-26', Nacionalidad: 'España' },
    { Dorsal: 11, Nombre: 'Kike', Apellido: 'Barja', Posicion: 'Delantero', Fecha_Nacimiento: '1997-03-31', Nacionalidad: 'España' },
    { Dorsal: 13, Nombre: 'Aitor', Apellido: 'Fernández', Posicion: 'Portero', Fecha_Nacimiento: '1991-05-02', Nacionalidad: 'España' },
    { Dorsal: 14, Nombre: 'Rubén', Apellido: 'García', Posicion: 'Defensa', Fecha_Nacimiento: '1993-07-13', Nacionalidad: 'España' },
    { Dorsal: 16, Nombre: 'Moi', Apellido: 'Gómez', Posicion: 'Centrocampista', Fecha_Nacimiento: '1994-06-22', Nacionalidad: 'España' },
    { Dorsal: 17, Nombre: 'Ante', Apellido: 'Budimir', Posicion: 'Delantero', Fecha_Nacimiento: '1991-07-21', Nacionalidad: 'Croacia' },
    { Dorsal: 18, Nombre: 'Sheraldo', Apellido: 'Becker', Posicion: 'Delantero', Fecha_Nacimiento: '1995-02-09', Nacionalidad: 'Surinam' },
    { Dorsal: 19, Nombre: 'Víctor', Apellido: 'Rosier', Posicion: 'Defensa', Fecha_Nacimiento: '1996-08-18', Nacionalidad: 'Francia' },
    { Dorsal: 21, Nombre: 'Victor', Apellido: 'Moreno', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-07-12', Nacionalidad: 'España' },
    { Dorsal: 22, Nombre: 'Enzo', Apellido: 'Boyomo', Posicion: 'Defensa', Fecha_Nacimiento: '2001-10-06', Nacionalidad: 'Camerún' },
    { Dorsal: 23, Nombre: 'Abel', Apellido: 'Bretones', Posicion: 'Centrocampista', Fecha_Nacimiento: '2000-08-20', Nacionalidad: 'España' },
    { Dorsal: 24, Nombre: 'Juan', Apellido: 'Catena', Posicion: 'Defensa', Fecha_Nacimiento: '1994-10-27', Nacionalidad: 'España' },
    { Dorsal: 27, Nombre: 'Iker', Apellido: 'Pedroarena', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-08-09', Nacionalidad: 'España' },
    { Dorsal: 28, Nombre: 'Jon', Apellido: 'García', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-01-27', Nacionalidad: 'España' }, // Corregido de 291 a 28
    { Dorsal: 29, Nombre: 'A.', Apellido: 'Osambela', Posicion: 'Centrocampista', Fecha_Nacimiento: '2004-10-29', Nacionalidad: 'España' },
    { Dorsal: 31, Nombre: 'Dimitrios', Apellido: 'Stamatakis', Posicion: 'Portero', Fecha_Nacimiento: '2003-04-22', Nacionalidad: 'Grecia' },
    { Dorsal: 34, Nombre: 'Rafa', Apellido: 'Chasco', Posicion: 'Defensa', Fecha_Nacimiento: '2003-09-12', Nacionalidad: 'España' },
    { Dorsal: 37, Nombre: 'Roberto', Apellido: 'Arroyo', Posicion: 'Delantero', Fecha_Nacimiento: '2003-08-27', Nacionalidad: 'España' },
    { Dorsal: 41, Nombre: 'Iñigo', Apellido: 'Arreguibide', Posicion: 'Defensa', Fecha_Nacimiento: '2005-04-18', Nacionalidad: 'España' },
];

async function actualizarOsasuna() {
    let connection;
    
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        console.log('=== ACTUALIZANDO DATOS DEL CA OSASUNA ===\n');
        
        // Verificar que la tabla existe
        const [tablas] = await connection.execute("SHOW TABLES LIKE 'ca_osasuna'");
        if (tablas.length === 0) {
            console.log('❌ La tabla ca_osasuna no existe. Creándola...');
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS \`ca_osasuna\` (
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
            "SELECT * FROM ca_osasuna ORDER BY Dorsal ASC"
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
                    `INSERT INTO ca_osasuna (Dorsal, Nombre, Apellido, Posicion, Fecha_Nacimiento, Nacionalidad) 
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
                        `UPDATE ca_osasuna 
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
                    "DELETE FROM ca_osasuna WHERE Dorsal = ?",
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

actualizarOsasuna();

