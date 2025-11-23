/**
 * Script para actualizar los datos del Athletic Club en la base de datos
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

// Datos del Athletic Club según el script SQL (equipos.sql) - ACTUALIZADO
const datosScriptSQL = [
    { Dorsal: 1, Nombre: 'Unai', Apellido: 'Simón', Posicion: 'Portero', Fecha_Nacimiento: '1997-06-10', Nacionalidad: 'España' },
    { Dorsal: 2, Nombre: 'Andoni', Apellido: 'Gorosabel', Posicion: 'Defensa', Fecha_Nacimiento: '1996-08-04', Nacionalidad: 'España' },
    { Dorsal: 3, Nombre: 'Dani', Apellido: 'Vivian', Posicion: 'Defensa', Fecha_Nacimiento: '1999-07-04', Nacionalidad: 'España' },
    { Dorsal: 4, Nombre: 'Aitor', Apellido: 'Paredes', Posicion: 'Defensa', Fecha_Nacimiento: '2000-04-28', Nacionalidad: 'España' },
    { Dorsal: 5, Nombre: 'Yeray', Apellido: 'Álvarez', Posicion: 'Defensa', Fecha_Nacimiento: '1995-01-23', Nacionalidad: 'España' },
    { Dorsal: 6, Nombre: 'Mikel', Apellido: 'Vesga', Posicion: 'Centrocampista', Fecha_Nacimiento: '1993-04-07', Nacionalidad: 'España' },
    { Dorsal: 7, Nombre: 'Alex', Apellido: 'Berenguer', Posicion: 'Delantero', Fecha_Nacimiento: '1995-07-03', Nacionalidad: 'España' },
    { Dorsal: 8, Nombre: 'Oihan', Apellido: 'Sancet', Posicion: 'Centrocampista', Fecha_Nacimiento: '2000-04-24', Nacionalidad: 'España' },
    { Dorsal: 9, Nombre: 'Iñaki', Apellido: 'Williams', Posicion: 'Delantero', Fecha_Nacimiento: '1994-06-14', Nacionalidad: 'Ghana' },
    { Dorsal: 10, Nombre: 'Nico', Apellido: 'Williams', Posicion: 'Delantero', Fecha_Nacimiento: '2002-07-11', Nacionalidad: 'España' },
    { Dorsal: 11, Nombre: 'Gorka', Apellido: 'Guruzeta', Posicion: 'Delantero', Fecha_Nacimiento: '1996-09-11', Nacionalidad: 'España' },
    { Dorsal: 12, Nombre: 'Iñigo', Apellido: 'Areso', Posicion: 'Defensa', Fecha_Nacimiento: '1999-07-01', Nacionalidad: 'España' },
    { Dorsal: 14, Nombre: 'Aymeric', Apellido: 'Laporte', Posicion: 'Defensa', Fecha_Nacimiento: '1994-05-26', Nacionalidad: 'España' },
    { Dorsal: 15, Nombre: 'Iñigo', Apellido: 'Lekue', Posicion: 'Defensa', Fecha_Nacimiento: '1993-05-03', Nacionalidad: 'España' },
    { Dorsal: 16, Nombre: 'Iñigo', Apellido: 'Ruiz de Galarreta', Posicion: 'Centrocampista', Fecha_Nacimiento: '1993-08-05', Nacionalidad: 'España' },
    { Dorsal: 17, Nombre: 'Yuri', Apellido: 'Berchiche', Posicion: 'Defensa', Fecha_Nacimiento: '1990-02-09', Nacionalidad: 'España' },
    { Dorsal: 18, Nombre: 'Mikel', Apellido: 'Jauregizar', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-11-12', Nacionalidad: 'España' },
    { Dorsal: 19, Nombre: 'Adama', Apellido: 'Traoré', Posicion: 'Centrocampista', Fecha_Nacimiento: '2002-06-21', Nacionalidad: 'España' },
    { Dorsal: 20, Nombre: 'Unai', Apellido: 'García', Posicion: 'Delantero', Fecha_Nacimiento: '2003-05-24', Nacionalidad: 'España' },
    { Dorsal: 21, Nombre: 'Nico', Apellido: 'Maroan', Posicion: 'Delantero', Fecha_Nacimiento: '2001-03-04', Nacionalidad: 'España' },
    { Dorsal: 22, Nombre: 'Nico', Apellido: 'Serrano', Posicion: 'Delantero', Fecha_Nacimiento: '2003-03-04', Nacionalidad: 'España' },
    { Dorsal: 23, Nombre: 'Robert', Apellido: 'Navarro', Posicion: 'Centrocampista', Fecha_Nacimiento: '2002-04-11', Nacionalidad: 'España' },
    { Dorsal: 24, Nombre: 'Urko', Apellido: 'Prados', Posicion: 'Centrocampista', Fecha_Nacimiento: '2001-02-07', Nacionalidad: 'España' },
    { Dorsal: 25, Nombre: 'Nico', Apellido: 'Izeta', Posicion: 'Centrocampista', Fecha_Nacimiento: '1998-09-28', Nacionalidad: 'México' },
    { Dorsal: 26, Nombre: 'M.', Apellido: 'Santos', Posicion: 'Portero', Fecha_Nacimiento: '2004-10-31', Nacionalidad: 'México' },
    { Dorsal: 27, Nombre: 'Álex', Apellido: 'Padilla', Posicion: 'Portero', Fecha_Nacimiento: '2003-08-31', Nacionalidad: 'España' },
    { Dorsal: 30, Nombre: 'Rego', Apellido: '...', Posicion: 'Defensa', Fecha_Nacimiento: '2003-06-10', Nacionalidad: 'España' },
    { Dorsal: 31, Nombre: 'Asier', Apellido: 'Hierro', Posicion: 'Defensa', Fecha_Nacimiento: '2005-05-05', Nacionalidad: 'España' },
    { Dorsal: 33, Nombre: 'Adrián', Apellido: 'Pérez', Posicion: 'Delantero', Fecha_Nacimiento: '2006-10-24', Nacionalidad: 'España' },
    { Dorsal: 34, Nombre: 'Jon', Apellido: 'de Luis', Posicion: 'Delantero', Fecha_Nacimiento: '2004-08-07', Nacionalidad: 'España' },
    { Dorsal: 35, Nombre: 'Ibon', Apellido: 'Sánchez', Posicion: 'Delantero', Fecha_Nacimiento: '2003-03-07', Nacionalidad: 'España' },
    { Dorsal: 44, Nombre: 'Selton', Apellido: 'Monreal', Posicion: 'Defensa', Fecha_Nacimiento: '2005-07-02', Nacionalidad: 'España' },
];

async function actualizarAthleticClub() {
    let connection;
    
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        console.log('=== ACTUALIZANDO DATOS DEL ATHLETIC CLUB ===\n');
        
        // Verificar que la tabla existe
        const [tablas] = await connection.execute("SHOW TABLES LIKE 'athletic_club'");
        if (tablas.length === 0) {
            console.log('❌ La tabla athletic_club no existe. Creándola...');
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS \`athletic_club\` (
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
            "SELECT * FROM athletic_club ORDER BY Dorsal ASC"
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
                    `INSERT INTO athletic_club (Dorsal, Nombre, Apellido, Posicion, Fecha_Nacimiento, Nacionalidad) 
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
                const hayCambios = 
                    jugadorBD.Nombre !== jugadorScript.Nombre ||
                    jugadorBD.Apellido !== jugadorScript.Apellido ||
                    jugadorBD.Posicion !== jugadorScript.Posicion ||
                    String(jugadorBD.Fecha_Nacimiento).substring(0, 10) !== jugadorScript.Fecha_Nacimiento ||
                    jugadorBD.Nacionalidad !== jugadorScript.Nacionalidad;
                
                if (hayCambios) {
                    // Actualizar jugador
                    await connection.execute(
                        `UPDATE athletic_club 
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
                    "DELETE FROM athletic_club WHERE Dorsal = ?",
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

actualizarAthleticClub();

