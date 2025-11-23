/**
 * Script para actualizar los datos del Elche CF en la base de datos
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

// Datos del Elche CF según el script SQL (equipos.sql)
const datosScriptSQL = [
    { Dorsal: 1, Nombre: 'Matías', Apellido: 'Dituro', Posicion: 'Portero', Fecha_Nacimiento: '1987-05-07', Nacionalidad: 'Argentina' },
    { Dorsal: 3, Nombre: 'Adrià', Apellido: 'Pedrosa', Posicion: 'Defensa', Fecha_Nacimiento: '1998-05-12', Nacionalidad: 'España' },
    { Dorsal: 4, Nombre: 'Bambo', Apellido: 'Diaby', Posicion: 'Defensa', Fecha_Nacimiento: '1997-12-16', Nacionalidad: 'España' },
    { Dorsal: 5, Nombre: 'Federico', Apellido: 'Redondo', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-01-17', Nacionalidad: 'Argentina' },
    { Dorsal: 6, Nombre: 'Pedro', Apellido: 'Bigas', Posicion: 'Defensa', Fecha_Nacimiento: '1990-05-14', Nacionalidad: 'España' },
    { Dorsal: 7, Nombre: 'Yago', Apellido: 'Santiago', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-02-14', Nacionalidad: 'España' },
    { Dorsal: 8, Nombre: 'Marc', Apellido: 'Aguado', Posicion: 'Centrocampista', Fecha_Nacimiento: '2000-02-21', Nacionalidad: 'España' },
    { Dorsal: 9, Nombre: 'Andre', Apellido: 'Da Silva', Posicion: 'Delantero', Fecha_Nacimiento: '1995-11-05', Nacionalidad: 'Portugal' },
    { Dorsal: 10, Nombre: 'Rafa', Apellido: 'Mir', Posicion: 'Delantero', Fecha_Nacimiento: '1997-06-17', Nacionalidad: 'España' },
    { Dorsal: 11, Nombre: 'Germán', Apellido: 'Valera', Posicion: 'Centrocampista', Fecha_Nacimiento: '2002-03-15', Nacionalidad: 'España' },
    { Dorsal: 13, Nombre: 'Iñaki', Apellido: 'Peña', Posicion: 'Portero', Fecha_Nacimiento: '1999-03-01', Nacionalidad: 'España' },
    { Dorsal: 14, Nombre: 'Álex', Apellido: 'Febas', Posicion: 'Centrocampista', Fecha_Nacimiento: '1996-02-01', Nacionalidad: 'España' },
    { Dorsal: 15, Nombre: 'Álvaro', Apellido: 'Nuñez', Posicion: 'Defensa', Fecha_Nacimiento: '1997-07-06', Nacionalidad: 'España' }, // Corregido de 161 a 15
    { Dorsal: 16, Nombre: 'Martim', Apellido: 'Neto', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-01-13', Nacionalidad: 'Portugal' },
    { Dorsal: 17, Nombre: 'Josan', Apellido: 'Ferrandez', Posicion: 'Centrocampista', Fecha_Nacimiento: '1989-12-02', Nacionalidad: 'España' },
    { Dorsal: 18, Nombre: 'John', Apellido: 'Chetaiuya', Posicion: 'Defensa', Fecha_Nacimiento: '2000-09-24', Nacionalidad: 'España' },
    { Dorsal: 19, Nombre: 'Diang', Apellido: '...', Posicion: 'Centrocampista', Fecha_Nacimiento: '1998-04-18', Nacionalidad: 'Congo' },
    { Dorsal: 20, Nombre: 'Álvaro', Apellido: 'Rodríguez', Posicion: 'Delantero', Fecha_Nacimiento: '2004-07-13', Nacionalidad: 'Uruguay' },
    { Dorsal: 21, Nombre: 'Leo', Apellido: 'Petrot', Posicion: 'Defensa', Fecha_Nacimiento: '1997-04-14', Nacionalidad: 'Francia' },
    { Dorsal: 22, Nombre: 'David', Apellido: 'Affengr...', Posicion: 'Defensa', Fecha_Nacimiento: '2001-03-18', Nacionalidad: 'Austria' },
    { Dorsal: 23, Nombre: 'Víctor', Apellido: 'Chust', Posicion: 'Defensa', Fecha_Nacimiento: '2000-03-04', Nacionalidad: 'España' },
    { Dorsal: 27, Nombre: 'Albert', Apellido: 'Niculaesei', Posicion: 'Defensa', Fecha_Nacimiento: '2008-03-24', Nacionalidad: 'Rumania' },
    { Dorsal: 30, Nombre: 'Rodrigo', Apellido: 'Mendoza', Posicion: 'Centrocampista', Fecha_Nacimiento: '2005-03-14', Nacionalidad: 'España' },
    { Dorsal: 31, Nombre: 'David', Apellido: '...', Posicion: 'Defensa', Fecha_Nacimiento: '2008-02-03', Nacionalidad: 'España' },
    { Dorsal: 32, Nombre: 'Adam', Apellido: 'Boavar', Posicion: 'Centrocampista', Fecha_Nacimiento: '2004-10-12', Nacionalidad: 'Marruecos' },
    { Dorsal: 34, Nombre: 'Nordin', Apellido: 'Al-Lal', Posicion: 'Delantero', Fecha_Nacimiento: '2005-02-13', Nacionalidad: 'Marruecos' },
    { Dorsal: 35, Nombre: 'Ali', Apellido: 'Houary', Posicion: 'Delantero', Fecha_Nacimiento: '2005-08-04', Nacionalidad: 'Marruecos' },
    { Dorsal: 37, Nombre: 'A.', Apellido: 'MArtinez', Posicion: 'Delantero', Fecha_Nacimiento: '2005-08-04', Nacionalidad: 'España' },
    { Dorsal: 39, Nombre: 'Héctor', Apellido: 'Fort', Posicion: 'Defensa', Fecha_Nacimiento: '2006-08-01', Nacionalidad: 'España' },
    { Dorsal: 45, Nombre: 'Alejandro', Apellido: 'Iturbe', Posicion: 'Portero', Fecha_Nacimiento: '2003-09-01', Nacionalidad: 'España' },
];

async function actualizarElche() {
    let connection;
    
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        console.log('=== ACTUALIZANDO DATOS DEL ELCHE CF ===\n');
        
        // Verificar que la tabla existe
        const [tablas] = await connection.execute("SHOW TABLES LIKE 'elche_cf'");
        if (tablas.length === 0) {
            console.log('❌ La tabla elche_cf no existe. Creándola...');
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS \`elche_cf\` (
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
            "SELECT * FROM elche_cf ORDER BY Dorsal ASC"
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
                    `INSERT INTO elche_cf (Dorsal, Nombre, Apellido, Posicion, Fecha_Nacimiento, Nacionalidad) 
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
                        `UPDATE elche_cf 
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
                    "DELETE FROM elche_cf WHERE Dorsal = ?",
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

actualizarElche();

