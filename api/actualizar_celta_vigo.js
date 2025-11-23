/**
 * Script para actualizar los datos del Celta de Vigo en la base de datos
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

// Datos del Celta de Vigo según el script SQL (equipos.sql)
const datosScriptSQL = [
    { Dorsal: 1, Nombre: 'Iván', Apellido: 'Villar', Posicion: 'Portero', Fecha_Nacimiento: '1997-07-08', Nacionalidad: 'España' },
    { Dorsal: 2, Nombre: 'Carl', Apellido: 'Starfelt', Posicion: 'Defensa', Fecha_Nacimiento: '1995-05-31', Nacionalidad: 'Suecia' },
    { Dorsal: 3, Nombre: 'Óscar', Apellido: 'Mingueza', Posicion: 'Defensa', Fecha_Nacimiento: '1999-05-12', Nacionalidad: 'España' },
    { Dorsal: 4, Nombre: 'Joseph', Apellido: 'Aidoo', Posicion: 'Defensa', Fecha_Nacimiento: '1995-09-28', Nacionalidad: 'Ghana' },
    { Dorsal: 5, Nombre: 'Sergio', Apellido: 'Carreira', Posicion: 'Defensa', Fecha_Nacimiento: '2000-10-12', Nacionalidad: 'España' },
    { Dorsal: 6, Nombre: 'Ilaix', Apellido: 'Moriba', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-01-18', Nacionalidad: 'Guinea' },
    { Dorsal: 7, Nombre: 'Borja', Apellido: 'Iglesias', Posicion: 'Delantero', Fecha_Nacimiento: '1993-01-16', Nacionalidad: 'España' },
    { Dorsal: 8, Nombre: 'Fran', Apellido: 'Beltrán', Posicion: 'Centrocampista', Fecha_Nacimiento: '1999-02-02', Nacionalidad: 'España' },
    { Dorsal: 9, Nombre: 'Ferran', Apellido: '...', Posicion: 'Delantero', Fecha_Nacimiento: '1999-01-31', Nacionalidad: 'España' },
    { Dorsal: 10, Nombre: 'Iago', Apellido: 'Aspas', Posicion: 'Delantero', Fecha_Nacimiento: '1987-08-01', Nacionalidad: 'España' },
    { Dorsal: 11, Nombre: 'Franco', Apellido: 'Cervi', Posicion: 'Delantero', Fecha_Nacimiento: '1994-05-25', Nacionalidad: 'Argentina' },
    { Dorsal: 12, Nombre: 'Manu', Apellido: 'Fernández', Posicion: 'Defensa', Fecha_Nacimiento: '2001-04-22', Nacionalidad: 'España' },
    { Dorsal: 13, Nombre: 'Andrei', Apellido: 'Radu', Posicion: 'Portero', Fecha_Nacimiento: '1997-05-27', Nacionalidad: 'Rumania' },
    { Dorsal: 14, Nombre: 'Damián', Apellido: 'Rodríguez', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-03-16', Nacionalidad: 'España' },
    { Dorsal: 15, Nombre: 'Bryan', Apellido: '...', Posicion: 'Centrocampista', Fecha_Nacimiento: '2001-09-08', Nacionalidad: 'España' },
    { Dorsal: 16, Nombre: 'Miguel', Apellido: 'Román', Posicion: 'Defensa', Fecha_Nacimiento: '2002-12-25', Nacionalidad: 'España' },
    { Dorsal: 17, Nombre: 'Javi', Apellido: 'Rueda', Posicion: 'Defensa', Fecha_Nacimiento: '2003-05-07', Nacionalidad: 'España' },
    { Dorsal: 18, Nombre: 'Pablo', Apellido: 'Durán', Posicion: 'Delantero', Fecha_Nacimiento: '2001-05-24', Nacionalidad: 'España' },
    { Dorsal: 19, Nombre: 'Willot', Apellido: 'Swedberg', Posicion: 'Centrocampista', Fecha_Nacimiento: '2004-01-31', Nacionalidad: 'Suecia' },
    { Dorsal: 20, Nombre: 'Marcos', Apellido: 'Alonso', Posicion: 'Defensa', Fecha_Nacimiento: '1990-12-27', Nacionalidad: 'España' },
    { Dorsal: 21, Nombre: 'Mihailo', Apellido: 'Ristic', Posicion: 'Defensa', Fecha_Nacimiento: '1995-10-30', Nacionalidad: 'Serbia' },
    { Dorsal: 22, Nombre: 'Hugo', Apellido: 'Sotelo', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-12-18', Nacionalidad: 'España' },
    { Dorsal: 23, Nombre: 'Hugo', Apellido: 'Álvarez', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-07-01', Nacionalidad: 'España' },
    { Dorsal: 24, Nombre: 'Carlos', Apellido: 'Domínguez', Posicion: 'Defensa', Fecha_Nacimiento: '2001-02-10', Nacionalidad: 'España' },
    { Dorsal: 25, Nombre: 'Marc', Apellido: 'Vidal', Posicion: 'Portero', Fecha_Nacimiento: '2000-02-13', Nacionalidad: 'España' },
    { Dorsal: 28, Nombre: 'A.', Apellido: 'Arcos', Posicion: 'Centrocampista', Fecha_Nacimiento: '2006-04-17', Nacionalidad: 'España' },
    { Dorsal: 29, Nombre: 'Yoel', Apellido: 'Lago', Posicion: 'Defensa', Fecha_Nacimiento: '2004-03-24', Nacionalidad: 'España' },
    { Dorsal: 30, Nombre: 'Hugo', Apellido: 'González', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-02-06', Nacionalidad: 'España' },
    { Dorsal: 31, Nombre: 'Pablo', Apellido: 'Meixus', Posicion: 'Defensa', Fecha_Nacimiento: '2003-05-20', Nacionalidad: 'España' },
    { Dorsal: 32, Nombre: 'Javi', Apellido: 'Rodríguez', Posicion: 'Defensa', Fecha_Nacimiento: '2003-06-26', Nacionalidad: 'España' },
    { Dorsal: 33, Nombre: 'Óscar', Apellido: 'Marcos', Posicion: 'Delantero', Fecha_Nacimiento: '2006-02-18', Nacionalidad: 'España' },
    { Dorsal: 39, Nombre: 'Moha', Apellido: 'El-Abdell', Posicion: 'Delantero', Fecha_Nacimiento: '2006-01-11', Nacionalidad: 'Marruecos' },
];

async function actualizarCeltaVigo() {
    let connection;
    
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        console.log('=== ACTUALIZANDO DATOS DEL CELTA DE VIGO ===\n');
        
        // Verificar que la tabla existe
        const [tablas] = await connection.execute("SHOW TABLES LIKE 'celta_vigo'");
        if (tablas.length === 0) {
            console.log('❌ La tabla celta_vigo no existe. Creándola...');
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS \`celta_vigo\` (
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
            "SELECT * FROM celta_vigo ORDER BY Dorsal ASC"
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
                    `INSERT INTO celta_vigo (Dorsal, Nombre, Apellido, Posicion, Fecha_Nacimiento, Nacionalidad) 
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
                        `UPDATE celta_vigo 
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
                    "DELETE FROM celta_vigo WHERE Dorsal = ?",
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

actualizarCeltaVigo();

