/**
 * Script para actualizar los datos del Getafe CF en la base de datos
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

// Datos del Getafe CF según el script SQL (equipos.sql)
const datosScriptSQL = [
    { Dorsal: 1, Nombre: 'Jiri', Apellido: 'Letacek', Posicion: 'Portero', Fecha_Nacimiento: '1991-12-30', Nacionalidad: 'República Checa' },
    { Dorsal: 2, Nombre: 'Djene', Apellido: 'Dakoman', Posicion: 'Defensa', Fecha_Nacimiento: '1991-12-30', Nacionalidad: 'Togo' },
    { Dorsal: 3, Nombre: 'Abdel', Apellido: 'Abqar', Posicion: 'Defensa', Fecha_Nacimiento: '1999-03-09', Nacionalidad: 'Marruecos' },
    { Dorsal: 4, Nombre: 'Yban', Apellido: 'Neyou', Posicion: 'Centrocampista', Fecha_Nacimiento: '1997-01-02', Nacionalidad: 'Camerún' },
    { Dorsal: 5, Nombre: 'Luis', Apellido: 'Milla', Posicion: 'Centrocampista', Fecha_Nacimiento: '1994-10-06', Nacionalidad: 'España' },
    { Dorsal: 6, Nombre: 'Mario', Apellido: 'Martin', Posicion: 'Defensa', Fecha_Nacimiento: '2004-03-04', Nacionalidad: 'España' },
    { Dorsal: 7, Nombre: 'Juanmi', Apellido: 'Jimenez', Posicion: 'Delantero', Fecha_Nacimiento: '1993-05-19', Nacionalidad: 'España' },
    { Dorsal: 9, Nombre: 'Borja', Apellido: 'Mayoral', Posicion: 'Delantero', Fecha_Nacimiento: '1997-04-04', Nacionalidad: 'España' },
    { Dorsal: 10, Nombre: 'Mauro', Apellido: 'Arambarri', Posicion: 'Centrocampista', Fecha_Nacimiento: '1995-09-29', Nacionalidad: 'Uruguay' },
    { Dorsal: 11, Nombre: '.', Apellido: 'Kamara', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-07-20', Nacionalidad: 'Inglaterra' },
    { Dorsal: 12, Nombre: 'Allan', Apellido: 'Nyom', Posicion: 'Defensa', Fecha_Nacimiento: '1988-05-09', Nacionalidad: 'Camerún' },
    { Dorsal: 13, Nombre: 'David', Apellido: 'Soria', Posicion: 'Portero', Fecha_Nacimiento: '1993-04-03', Nacionalidad: 'España' },
    { Dorsal: 16, Nombre: 'Diego', Apellido: 'Rico', Posicion: 'Defensa', Fecha_Nacimiento: '1993-02-01', Nacionalidad: 'España' },
    { Dorsal: 17, Nombre: 'Kiko', Apellido: 'Femenía', Posicion: 'Defensa', Fecha_Nacimiento: '1991-02-01', Nacionalidad: 'España' },
    { Dorsal: 18, Nombre: 'Alex', Apellido: 'Sola', Posicion: 'Delantero', Fecha_Nacimiento: '1997-01-17', Nacionalidad: 'España' },
    { Dorsal: 20, Nombre: 'C,', Apellido: 'Da Costa', Posicion: 'Centrocampista', Fecha_Nacimiento: '2002-07-25', Nacionalidad: 'España' },
    { Dorsal: 21, Nombre: 'Javi', Apellido: 'Muñoz', Posicion: 'Centrocampista', Fecha_Nacimiento: '1995-02-27', Nacionalidad: 'España' },
    { Dorsal: 22, Nombre: 'Domingos', Apellido: 'Duarte', Posicion: 'Defensa', Fecha_Nacimiento: '1995-03-09', Nacionalidad: 'Portugal' },
    { Dorsal: 23, Nombre: 'Sergio', Apellido: 'Liso', Posicion: 'Centrocampista', Fecha_Nacimiento: '2005-04-01', Nacionalidad: 'España' },
    { Dorsal: 26, Nombre: 'David', Apellido: 'Davinci', Posicion: 'Defensa', Fecha_Nacimiento: '2007-10-15', Nacionalidad: 'España' },
    { Dorsal: 29, Nombre: 'Vladyslav', Apellido: 'Mykyta', Posicion: 'Delantero', Fecha_Nacimiento: '2004-10-29', Nacionalidad: 'Ucrania' },
    { Dorsal: 30, Nombre: 'Alberto', Apellido: 'Risco', Posicion: 'Centrocampista', Fecha_Nacimiento: '2005-08-29', Nacionalidad: 'España' },
    { Dorsal: 31, Nombre: 'Ismael', Apellido: '...', Posicion: 'Defensa', Fecha_Nacimiento: '2004-11-19', Nacionalidad: 'Marruecos' },
    { Dorsal: 32, Nombre: 'Lucas', Apellido: 'Laso', Posicion: 'Defensa', Fecha_Nacimiento: '2003-01-03', Nacionalidad: 'España' },
    { Dorsal: 33, Nombre: 'Guillem', Apellido: 'Vilaplana', Posicion: 'Defensa', Fecha_Nacimiento: '2003-01-19', Nacionalidad: 'España' },
    { Dorsal: 34, Nombre: 'Alejandro', Apellido: 'Solozabal', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-02-06', Nacionalidad: 'España' },
    { Dorsal: 35, Nombre: 'Jorge', Apellido: 'Benito', Posicion: 'Portero', Fecha_Nacimiento: '2006-06-05', Nacionalidad: 'España' },
    { Dorsal: 37, Nombre: 'Jose Luis', Apellido: 'Joselu', Posicion: 'Delantero', Fecha_Nacimiento: '2004-03-11', Nacionalidad: 'España' },
    { Dorsal: 39, Nombre: 'Yassin', Apellido: 'Talal', Posicion: 'Delantero', Fecha_Nacimiento: '2005-02-02', Nacionalidad: 'Marruecos' },
    { Dorsal: 42, Nombre: 'Adrian', Apellido: 'Ferrer', Posicion: 'Portero', Fecha_Nacimiento: '2007-04-16', Nacionalidad: 'España' },
];

async function actualizarGetafe() {
    let connection;
    
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        console.log('=== ACTUALIZANDO DATOS DEL GETAFE CF ===\n');
        
        // Verificar que la tabla existe
        const [tablas] = await connection.execute("SHOW TABLES LIKE 'getafe_cf'");
        if (tablas.length === 0) {
            console.log('❌ La tabla getafe_cf no existe. Creándola...');
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS \`getafe_cf\` (
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
            "SELECT * FROM getafe_cf ORDER BY Dorsal ASC"
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
                    `INSERT INTO getafe_cf (Dorsal, Nombre, Apellido, Posicion, Fecha_Nacimiento, Nacionalidad) 
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
                        `UPDATE getafe_cf 
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
                    "DELETE FROM getafe_cf WHERE Dorsal = ?",
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

actualizarGetafe();

