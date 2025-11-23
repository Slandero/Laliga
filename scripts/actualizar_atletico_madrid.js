/**
 * Script para actualizar los datos del Atlético de Madrid en la base de datos
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

// Datos del Atlético de Madrid según el script SQL (equipos.sql)
const datosScriptSQL = [
    { Dorsal: 1, Nombre: 'Juan', Apellido: 'Musso', Posicion: 'Portero', Fecha_Nacimiento: '1994-05-05', Nacionalidad: 'Argentina' },
    { Dorsal: 2, Nombre: 'José María', Apellido: 'Giménez', Posicion: 'Defensa', Fecha_Nacimiento: '1995-01-19', Nacionalidad: 'Uruguay' },
    { Dorsal: 3, Nombre: 'Matteo', Apellido: 'Ruggeri', Posicion: 'Defensa', Fecha_Nacimiento: '2002-07-10', Nacionalidad: 'Italia' },
    { Dorsal: 4, Nombre: 'Conor', Apellido: 'Gallagher', Posicion: 'Centrocampista', Fecha_Nacimiento: '2000-02-05', Nacionalidad: 'Inglaterra' },
    { Dorsal: 5, Nombre: 'Johnny', Apellido: 'Cardoso', Posicion: 'Centrocampista', Fecha_Nacimiento: '2001-09-19', Nacionalidad: 'Estados Unidos' },
    { Dorsal: 6, Nombre: 'Jorge', Apellido: 'Koke', Posicion: 'Centrocampista', Fecha_Nacimiento: '1992-01-07', Nacionalidad: 'España' },
    { Dorsal: 7, Nombre: 'Antoine', Apellido: 'Griezmann', Posicion: 'Delantero', Fecha_Nacimiento: '1991-03-20', Nacionalidad: 'Francia' },
    { Dorsal: 8, Nombre: 'Pablo', Apellido: 'Barrios', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-06-14', Nacionalidad: 'España' },
    { Dorsal: 9, Nombre: 'Alexander', Apellido: 'Sørloth', Posicion: 'Delantero', Fecha_Nacimiento: '1995-12-04', Nacionalidad: 'Noruega' },
    { Dorsal: 10, Nombre: 'Álex', Apellido: 'Baena', Posicion: 'Centrocampista', Fecha_Nacimiento: '2001-07-19', Nacionalidad: 'España' },
    { Dorsal: 11, Nombre: 'Thiago', Apellido: 'Almada', Posicion: 'Centrocampista', Fecha_Nacimiento: '2001-04-25', Nacionalidad: 'Argentina' },
    { Dorsal: 12, Nombre: 'Carlos', Apellido: 'Martín', Posicion: 'Centrocampista', Fecha_Nacimiento: '2002-04-21', Nacionalidad: 'España' },
    { Dorsal: 13, Nombre: 'Jan', Apellido: 'Oblak', Posicion: 'Portero', Fecha_Nacimiento: '1993-01-06', Nacionalidad: 'Eslovenia' },
    { Dorsal: 14, Nombre: 'Marcos', Apellido: 'Llorente', Posicion: 'Centrocampista', Fecha_Nacimiento: '1995-01-29', Nacionalidad: 'España' },
    { Dorsal: 15, Nombre: 'Clément', Apellido: 'Lenglet', Posicion: 'Defensa', Fecha_Nacimiento: '1995-06-16', Nacionalidad: 'Francia' },
    { Dorsal: 16, Nombre: 'Nahuel', Apellido: 'Molina', Posicion: 'Defensa', Fecha_Nacimiento: '1998-04-05', Nacionalidad: 'Argentina' },
    { Dorsal: 17, Nombre: 'David', Apellido: 'Hancko', Posicion: 'Defensa', Fecha_Nacimiento: '1997-12-12', Nacionalidad: 'Eslovaquia' },
    { Dorsal: 18, Nombre: 'Marc', Apellido: 'Pubill', Posicion: 'Defensa', Fecha_Nacimiento: '2003-06-19', Nacionalidad: 'España' },
    { Dorsal: 19, Nombre: 'Julián', Apellido: 'Álvarez', Posicion: 'Delantero', Fecha_Nacimiento: '2000-01-30', Nacionalidad: 'Argentina' },
    { Dorsal: 20, Nombre: 'Giuliano', Apellido: 'Simeone', Posicion: 'Delantero', Fecha_Nacimiento: '2002-12-17', Nacionalidad: 'Argentina' },
    { Dorsal: 21, Nombre: 'Javi', Apellido: 'Galán', Posicion: 'Centrocampista', Fecha_Nacimiento: '1994-11-18', Nacionalidad: 'España' },
    { Dorsal: 22, Nombre: 'Giacomo', Apellido: 'Raspadori', Posicion: 'Delantero', Fecha_Nacimiento: '2000-02-17', Nacionalidad: 'Italia' },
    { Dorsal: 23, Nombre: 'Nicolás', Apellido: 'González', Posicion: 'Centrocampista', Fecha_Nacimiento: '1998-04-05', Nacionalidad: 'Argentina' },
    { Dorsal: 24, Nombre: 'Robin', Apellido: 'Le Normand', Posicion: 'Defensa', Fecha_Nacimiento: '1996-11-10', Nacionalidad: 'Francia' },
    { Dorsal: 26, Nombre: 'Ilias', Apellido: 'Kostis', Posicion: 'Defensa', Fecha_Nacimiento: '2003-02-26', Nacionalidad: 'Grecia' },
    { Dorsal: 27, Nombre: 'Jon', Apellido: 'Monserrate', Posicion: 'Centrocampista', Fecha_Nacimiento: '2006-01-27', Nacionalidad: 'España' },
    { Dorsal: 28, Nombre: 'Taufik', Apellido: 'Seidou', Posicion: 'Centrocampista', Fecha_Nacimiento: '2008-01-19', Nacionalidad: 'España' },
    { Dorsal: 30, Nombre: 'Rayane', Apellido: 'Belaid', Posicion: 'Defensa', Fecha_Nacimiento: '2005-02-10', Nacionalidad: 'España' }, // Corregido de 310 a 30
    { Dorsal: 31, Nombre: 'Luis Miguel', Apellido: 'Esquivel', Posicion: 'Portero', Fecha_Nacimiento: '2005-09-29', Nacionalidad: 'España' },
    { Dorsal: 42, Nombre: 'Javi', Apellido: 'Serrano', Posicion: 'Centrocampista', Fecha_Nacimiento: '2003-01-15', Nacionalidad: 'España' },
];

async function actualizarAtleticoMadrid() {
    let connection;
    
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        console.log('=== ACTUALIZANDO DATOS DEL ATLÉTICO DE MADRID ===\n');
        
        // Verificar que la tabla existe
        const [tablas] = await connection.execute("SHOW TABLES LIKE 'atletico_de_madrid'");
        if (tablas.length === 0) {
            console.log('❌ La tabla atletico_de_madrid no existe. Creándola...');
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS \`atletico_de_madrid\` (
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
            "SELECT * FROM atletico_de_madrid ORDER BY Dorsal ASC"
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
                    `INSERT INTO atletico_de_madrid (Dorsal, Nombre, Apellido, Posicion, Fecha_Nacimiento, Nacionalidad) 
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
                        `UPDATE atletico_de_madrid 
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
                    "DELETE FROM atletico_de_madrid WHERE Dorsal = ?",
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

actualizarAtleticoMadrid();

