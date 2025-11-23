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
                        // Formatear fecha (usar parseo local para evitar problemas de zona horaria)
                        let fechaFormateada = '';
                        if (partido.fecha) {
                            try {
                                // Parsear la fecha como fecha local (YYYY-MM-DD)
                                const partesFecha = String(partido.fecha).split('-');
                                if (partesFecha.length === 3) {
                                    const año = parseInt(partesFecha[0], 10);
                                    const mes = parseInt(partesFecha[1], 10) - 1; // Los meses van de 0-11
                                    const dia = parseInt(partesFecha[2], 10);
                                    const fechaObj = new Date(año, mes, dia);
                                    const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
                                    const diaSemana = dias[fechaObj.getDay()];
                                    const diaFormateado = fechaObj.getDate().toString().padStart(2, '0');
                                    const mesFormateado = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
                                    const añoFormateado = fechaObj.getFullYear();
                                    fechaFormateada = `${diaSemana} ${diaFormateado}.${mesFormateado}.${añoFormateado}`;
                                } else {
                                    fechaFormateada = partido.fecha;
                                }
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
                    
                case 'PUT':
                    // Actualizar resultado de un partido
                    const idPartido = body.id ? parseInt(body.id) : null;
                    
                    if (!idPartido) {
                        await connection.end();
                        return res.status(400).json({
                            success: false,
                            error: 'ID de partido requerido'
                        });
                    }
                    
                    // Construir query de actualización dinámicamente
                    const camposActualizar = [];
                    const valoresActualizar = [];
                    
                    if (body.goles_local !== undefined && body.goles_local !== null) {
                        camposActualizar.push('goles_local = ?');
                        valoresActualizar.push(body.goles_local === '' ? null : parseInt(body.goles_local));
                    }
                    if (body.goles_visitante !== undefined && body.goles_visitante !== null) {
                        camposActualizar.push('goles_visitante = ?');
                        valoresActualizar.push(body.goles_visitante === '' ? null : parseInt(body.goles_visitante));
                    }
                    
                    // También permitir actualizar otros campos si vienen
                    if (body.jornada !== undefined) {
                        camposActualizar.push('jornada = ?');
                        valoresActualizar.push(parseInt(body.jornada));
                    }
                    if (body.fecha !== undefined) {
                        camposActualizar.push('fecha = ?');
                        valoresActualizar.push(body.fecha);
                    }
                    if (body.horario !== undefined) {
                        camposActualizar.push('horario = ?');
                        valoresActualizar.push(body.horario);
                    }
                    if (body.equipo_local !== undefined) {
                        camposActualizar.push('equipo_local = ?');
                        valoresActualizar.push(body.equipo_local);
                    }
                    if (body.equipo_visitante !== undefined) {
                        camposActualizar.push('equipo_visitante = ?');
                        valoresActualizar.push(body.equipo_visitante);
                    }
                    
                    if (camposActualizar.length === 0) {
                        await connection.end();
                        return res.status(400).json({
                            success: false,
                            error: 'No hay campos para actualizar'
                        });
                    }
                    
                    // Agregar el ID al final de los valores
                    valoresActualizar.push(idPartido);
                    
                    // Ejecutar actualización
                    const sqlUpdate = `UPDATE partidos SET ${camposActualizar.join(', ')} WHERE id = ?`;
                    const [resultUpdate] = await connection.execute(sqlUpdate, valoresActualizar);
                    
                    if (resultUpdate.affectedRows === 0) {
                        await connection.end();
                        return res.status(404).json({
                            success: false,
                            error: 'Partido no encontrado'
                        });
                    }
                    
                    await connection.end();
                    
                    return res.status(200).json({
                        success: true,
                        message: 'Resultado actualizado correctamente',
                        affectedRows: resultUpdate.affectedRows
                    });
                    
                case 'POST':
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

