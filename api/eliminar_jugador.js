/**
 * Script para eliminar un jugador específico de la base de datos
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

async function eliminarJugador() {
    let connection;
    
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        console.log('=== ELIMINANDO JUGADOR ===\n');
        
        // Datos del jugador a eliminar
        const tabla = 'athletic_club';
        const dorsal = 20;
        const nombre = 'Unai';
        const apellido = 'García';
        
        console.log(`Eliminando: Dorsal ${dorsal} - ${nombre} ${apellido} de ${tabla}\n`);
        
        // Verificar que existe antes de eliminar
        const [jugadores] = await connection.execute(
            "SELECT * FROM athletic_club WHERE Dorsal = ? AND Nombre = ? AND Apellido = ?",
            [dorsal, nombre, apellido]
        );
        
        if (jugadores.length === 0) {
            console.log('❌ El jugador no existe en la base de datos.');
            await connection.end();
            return;
        }
        
        console.log('Jugador encontrado:');
        const jugador = jugadores[0];
        console.log(`  Dorsal: ${jugador.Dorsal}`);
        console.log(`  Nombre: ${jugador.Nombre} ${jugador.Apellido}`);
        console.log(`  Posición: ${jugador.Posicion}`);
        console.log(`  Fecha Nacimiento: ${jugador.Fecha_Nacimiento}`);
        console.log(`  Nacionalidad: ${jugador.Nacionalidad}\n`);
        
        // Eliminar el jugador
        const [result] = await connection.execute(
            "DELETE FROM athletic_club WHERE Dorsal = ? AND Nombre = ? AND Apellido = ?",
            [dorsal, nombre, apellido]
        );
        
        if (result.affectedRows > 0) {
            console.log('✅ Jugador eliminado exitosamente.');
            console.log(`   Filas afectadas: ${result.affectedRows}`);
        } else {
            console.log('❌ No se pudo eliminar el jugador.');
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

eliminarJugador();

