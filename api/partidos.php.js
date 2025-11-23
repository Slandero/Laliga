/**
 * Serverless function para gestionar partidos
 * Vercel ejecutará esto cuando se acceda a /api/partidos.php
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

module.exports = async (req, res) => {
    try {
        // Permitir CORS siempre
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        
        // Manejar OPTIONS
        if (req.method === 'OPTIONS') {
            return res.status(200).json({});
        }
        
        // Conectar a Railway
        const connection = await mysql.createConnection(DB_CONFIG);
        
        try {
            // Verificar que la tabla exista, si no, crearla
            const [tables] = await connection.execute("SHOW TABLES LIKE 'partidos'");
            if (tables.length === 0) {
                // Crear tabla si no existe
                await connection.execute(`
                    CREATE TABLE IF NOT EXISTS \`partidos\` (
                      \`id\` INT(11) NOT NULL AUTO_INCREMENT,
                      \`jornada\` INT(2) NOT NULL,
                      \`fecha\` DATE NOT NULL,
                      \`horario\` TIME NOT NULL,
                      \`equipo_local\` VARCHAR(100) NOT NULL,
                      \`equipo_visitante\` VARCHAR(100) NOT NULL,
                      \`goles_local\` INT(2) DEFAULT NULL,
                      \`goles_visitante\` INT(2) DEFAULT NULL,
                      \`usuario_id\` INT(11) DEFAULT NULL,
                      \`fecha_creacion\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      \`fecha_actualizacion\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      PRIMARY KEY (\`id\`),
                      KEY \`idx_jornada\` (\`jornada\`),
                      KEY \`idx_fecha\` (\`fecha\`),
                      KEY \`idx_usuario\` (\`usuario_id\`)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                `);
            }
            
            // Obtener método HTTP
            const method = req.method;
            
            // Obtener datos del body si existe
            let body = {};
            if (req.body) {
                if (typeof req.body === 'string') {
                    try {
                        body = JSON.parse(req.body);
                    } catch (e) {
                        body = {};
                    }
                } else {
                    body = req.body;
                }
            }
            
            // Obtener query parameters
            const query = req.query || {};
            
            // Verificar autenticación para métodos que modifican datos (simplificado por ahora)
            const usuarioId = null; // TODO: Implementar autenticación con cookies
            const usuarioLogueado = false; // TODO: Implementar verificación de sesión
            
            switch (method) {
                case 'GET':
                    // Obtener partidos de una jornada específica o todos los partidos
                    const jornada = query.jornada || null;
                    const todos = (jornada === 'all' || jornada === null || jornada === '');
                    
                    let partidos = [];
                    
                    if (!todos) {
                        const jornadaNum = parseInt(jornada);
                        if (isNaN(jornadaNum) || jornadaNum < 1 || jornadaNum > 38) {
                            return res.status(400).json({
                                success: false,
                                error: 'Jornada inválida. Debe ser entre 1 y 38.'
                            });
                        }
                        
                        const [partidosData] = await connection.execute(
                            "SELECT * FROM partidos WHERE jornada = ? ORDER BY fecha ASC, horario ASC",
                            [jornadaNum]
                        );
                        partidos = partidosData;
                    } else {
                        // Obtener todos los partidos
                        const [partidosData] = await connection.execute(
                            "SELECT * FROM partidos ORDER BY jornada ASC, fecha ASC, horario ASC"
                        );
                        partidos = partidosData;
                    }
                    
                    // Formatear resultados
                    const resultados = partidos.map(partido => {
                        // Formatear fecha
                        let fechaFormateada = '';
                        if (partido.fecha) {
                            try {
                                const fechaObj = new Date(partido.fecha + 'T00:00:00');
                                const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
                                const diaSemana = dias[fechaObj.getUTCDay()];
                                const dia = fechaObj.getUTCDate().toString().padStart(2, '0');
                                const mes = (fechaObj.getUTCMonth() + 1).toString().padStart(2, '0');
                                const año = fechaObj.getUTCFullYear();
                                fechaFormateada = `${diaSemana} ${dia}.${mes}.${año}`;
                            } catch (e) {
                                fechaFormateada = partido.fecha;
                            }
                        }
                        
                        const horario = partido.horario ? (partido.horario.toString().substring(0, 5)) : '';
                        
                        let resultado = null;
                        if (partido.goles_local !== null && partido.goles_visitante !== null) {
                            resultado = `${partido.goles_local}-${partido.goles_visitante}`;
                        }
                        
                        return {
                            id: parseInt(partido.id),
                            jornada: parseInt(partido.jornada),
                            fecha: fechaFormateada,
                            fecha_iso: partido.fecha,
                            horario: horario,
                            local: partido.equipo_local,
                            visitante: partido.equipo_visitante,
                            resultado: resultado,
                            goles_local: partido.goles_local !== null ? parseInt(partido.goles_local) : null,
                            goles_visitante: partido.goles_visitante !== null ? parseInt(partido.goles_visitante) : null
                        };
                    });
                    
                    await connection.end();
                    
                    return res.status(200).json({
                        success: true,
                        jornada: todos ? 'all' : parseInt(jornada),
                        partidos: resultados,
                        total: resultados.length
                    });
                    
                case 'POST':
                case 'PUT':
                case 'DELETE':
                    // Por ahora, solo devolver error para métodos que modifican datos
                    // TODO: Implementar lógica completa cuando se necesite
                    await connection.end();
                    return res.status(501).json({
                        success: false,
                        error: 'Funcionalidad no implementada aún'
                    });
                    
                default:
                    await connection.end();
                    return res.status(405).json({
                        success: false,
                        error: 'Método no permitido'
                    });
            }
            
        } catch (error) {
            await connection.end();
            throw error;
        }
        
    } catch (error) {
        console.error('Error en API partidos:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Error al procesar la solicitud',
            file: 'partidos.php.js'
        });
    }
};

