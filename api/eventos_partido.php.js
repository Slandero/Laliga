/**
 * Serverless function para gestionar eventos de partido
 * Vercel ejecutará esto cuando se acceda a /api/eventos_partido.php
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
            const [tables] = await connection.execute("SHOW TABLES LIKE 'eventos_partido'");
            if (tables.length === 0) {
                // Crear tabla si no existe
                await connection.execute(`
                    CREATE TABLE IF NOT EXISTS \`eventos_partido\` (
                      \`id\` INT(11) NOT NULL AUTO_INCREMENT,
                      \`partido_id\` INT(11) NOT NULL,
                      \`tipo_evento\` ENUM('gol', 'asistencia', 'tarjeta_amarilla', 'tarjeta_roja', 'sustitucion', 'fin_partido') NOT NULL,
                      \`minuto\` VARCHAR(10) NOT NULL,
                      \`jugador_id\` VARCHAR(100) DEFAULT NULL,
                      \`jugador_nombre\` VARCHAR(200) NOT NULL,
                      \`jugador_dorsal\` VARCHAR(10) DEFAULT NULL,
                      \`equipo\` ENUM('local', 'visitante') NOT NULL,
                      \`jugador_asistencia_id\` VARCHAR(100) DEFAULT NULL,
                      \`jugador_asistencia_nombre\` VARCHAR(200) DEFAULT NULL,
                      \`jugador_asistencia_dorsal\` VARCHAR(10) DEFAULT NULL,
                      \`jugador_sale_id\` VARCHAR(100) DEFAULT NULL,
                      \`jugador_sale_nombre\` VARCHAR(200) DEFAULT NULL,
                      \`jugador_sale_dorsal\` VARCHAR(10) DEFAULT NULL,
                      \`jugador_entra_id\` VARCHAR(100) DEFAULT NULL,
                      \`jugador_entra_nombre\` VARCHAR(200) DEFAULT NULL,
                      \`jugador_entra_dorsal\` VARCHAR(10) DEFAULT NULL,
                      \`es_penal\` TINYINT(1) DEFAULT 0,
                      \`es_autogol\` TINYINT(1) DEFAULT 0,
                      \`usuario_id\` INT(11) DEFAULT NULL,
                      \`fecha_creacion\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                      \`fecha_actualizacion\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      PRIMARY KEY (\`id\`),
                      KEY \`idx_partido\` (\`partido_id\`),
                      KEY \`idx_tipo_evento\` (\`tipo_evento\`),
                      KEY \`idx_minuto\` (\`minuto\`),
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
            // TODO: Implementar verificación de cookies de sesión
            const usuarioId = null;
            const usuarioLogueado = false; // Por ahora permitir sin autenticación para desarrollo
            
            switch (method) {
                case 'GET':
                    // Obtener eventos de un partido específico
                    const partidoId = query.partido_id ? parseInt(query.partido_id) : null;
                    
                    if (!partidoId) {
                        await connection.end();
                        return res.status(400).json({
                            success: false,
                            error: 'ID de partido requerido'
                        });
                    }
                    
                    const [eventosData] = await connection.execute(
                        "SELECT * FROM eventos_partido WHERE partido_id = ? ORDER BY minuto ASC, tipo_evento ASC",
                        [partidoId]
                    );
                    
                    // Formatear resultados
                    const resultados = eventosData.map(evento => ({
                        id: parseInt(evento.id),
                        partido_id: parseInt(evento.partido_id),
                        tipo_evento: evento.tipo_evento,
                        minuto: evento.minuto,
                        jugador_id: evento.jugador_id,
                        jugador_nombre: evento.jugador_nombre,
                        jugador_dorsal: evento.jugador_dorsal || null,
                        equipo: evento.equipo,
                        jugador_asistencia_id: evento.jugador_asistencia_id,
                        jugador_asistencia_nombre: evento.jugador_asistencia_nombre,
                        jugador_asistencia_dorsal: evento.jugador_asistencia_dorsal || null,
                        jugador_sale_id: evento.jugador_sale_id,
                        jugador_sale_nombre: evento.jugador_sale_nombre,
                        jugador_sale_dorsal: evento.jugador_sale_dorsal || null,
                        jugador_entra_id: evento.jugador_entra_id,
                        jugador_entra_nombre: evento.jugador_entra_nombre,
                        jugador_entra_dorsal: evento.jugador_entra_dorsal || null,
                        es_penal: evento.es_penal ? true : false,
                        es_autogol: evento.es_autogol ? true : false
                    }));
                    
                    await connection.end();
                    
                    return res.status(200).json({
                        success: true,
                        partido_id: partidoId,
                        eventos: resultados,
                        total: resultados.length
                    });
                    
                case 'POST':
                    // Crear nuevo evento
                    const partidoIdPost = body.partido_id ? parseInt(body.partido_id) : null;
                    const tipoEvento = body.tipo_evento || null;
                    const minuto = body.minuto ? String(body.minuto).trim() : null;
                    const jugadorNombre = body.jugador_nombre ? String(body.jugador_nombre).trim() : null;
                    const equipo = body.equipo || null;
                    const jugadorId = body.jugador_id ? String(body.jugador_id).trim() : null;
                    const jugadorDorsal = body.jugador_dorsal ? String(body.jugador_dorsal).trim() : null;
                    const jugadorAsistenciaId = body.jugador_asistencia_id ? String(body.jugador_asistencia_id).trim() : null;
                    const jugadorAsistenciaNombre = body.jugador_asistencia_nombre ? String(body.jugador_asistencia_nombre).trim() : null;
                    const jugadorAsistenciaDorsal = body.jugador_asistencia_dorsal ? String(body.jugador_asistencia_dorsal).trim() : null;
                    const jugadorSaleId = body.jugador_sale_id ? String(body.jugador_sale_id).trim() : null;
                    const jugadorSaleNombre = body.jugador_sale_nombre ? String(body.jugador_sale_nombre).trim() : null;
                    const jugadorSaleDorsal = body.jugador_sale_dorsal ? String(body.jugador_sale_dorsal).trim() : null;
                    const jugadorEntraId = body.jugador_entra_id ? String(body.jugador_entra_id).trim() : null;
                    const jugadorEntraNombre = body.jugador_entra_nombre ? String(body.jugador_entra_nombre).trim() : null;
                    const jugadorEntraDorsal = body.jugador_entra_dorsal ? String(body.jugador_entra_dorsal).trim() : null;
                    const esPenal = body.es_penal ? (body.es_penal === true || body.es_penal === 1 || body.es_penal === '1') : false;
                    const esAutogol = body.es_autogol ? (body.es_autogol === true || body.es_autogol === 1 || body.es_autogol === '1') : false;
                    
                    // Validar formato de minuto
                    if (minuto && !/^\d+(\+\d+)?$/.test(minuto)) {
                        await connection.end();
                        return res.status(400).json({
                            success: false,
                            error: 'Formato de minuto inválido. Debe ser un número o número+número (ej: 45 o 90+3)'
                        });
                    }
                    
                    // Validaciones según tipo de evento
                    if (tipoEvento === 'fin_partido') {
                        if (!partidoIdPost || !tipoEvento || !minuto) {
                            await connection.end();
                            return res.status(400).json({
                                success: false,
                                error: 'Faltan campos requeridos'
                            });
                        }
                        // Valores por defecto para fin_partido
                        const jugadorNombreFinal = 'Fin del Partido';
                        const equipoFinal = 'local';
                        
                        // Insertar evento
                        const [resultFin] = await connection.execute(
                            `INSERT INTO eventos_partido (partido_id, tipo_evento, minuto, jugador_nombre, equipo, usuario_id) 
                             VALUES (?, ?, ?, ?, ?, ?)`,
                            [partidoIdPost, tipoEvento, minuto, jugadorNombreFinal, equipoFinal, usuarioId]
                        );
                        
                        await connection.end();
                        return res.status(200).json({
                            success: true,
                            message: 'Evento creado correctamente',
                            id: resultFin.insertId
                        });
                    } else if (tipoEvento === 'sustitucion') {
                        // Para sustituciones, se requiere jugador_sale y jugador_entra
                        if (!partidoIdPost || !tipoEvento || !minuto || !equipo || !jugadorSaleNombre || !jugadorEntraNombre) {
                            await connection.end();
                            return res.status(400).json({
                                success: false,
                                error: 'Faltan campos requeridos para la sustitución'
                            });
                        }
                        // Para sustituciones, usar jugador_sale_nombre como jugador_nombre
                        const jugadorNombreFinal = jugadorSaleNombre;
                        
                        // Si es penal o autogol, no debe haber asistencia
                        const asistenciaIdFinal = (esPenal || esAutogol) ? null : jugadorAsistenciaId;
                        const asistenciaNombreFinal = (esPenal || esAutogol) ? null : jugadorAsistenciaNombre;
                        const asistenciaDorsalFinal = (esPenal || esAutogol) ? null : jugadorAsistenciaDorsal;
                        
                        // Insertar evento
                        const [resultSust] = await connection.execute(
                            `INSERT INTO eventos_partido (partido_id, tipo_evento, minuto, jugador_id, jugador_nombre, jugador_dorsal, equipo, 
                             jugador_asistencia_id, jugador_asistencia_nombre, jugador_asistencia_dorsal, 
                             jugador_sale_id, jugador_sale_nombre, jugador_sale_dorsal, 
                             jugador_entra_id, jugador_entra_nombre, jugador_entra_dorsal, es_penal, es_autogol, usuario_id) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                partidoIdPost, tipoEvento, minuto, jugadorId, jugadorNombreFinal, jugadorDorsal, equipo,
                                asistenciaIdFinal, asistenciaNombreFinal, asistenciaDorsalFinal,
                                jugadorSaleId, jugadorSaleNombre, jugadorSaleDorsal,
                                jugadorEntraId, jugadorEntraNombre, jugadorEntraDorsal,
                                esPenal ? 1 : 0, esAutogol ? 1 : 0, usuarioId
                            ]
                        );
                        
                        await connection.end();
                        return res.status(200).json({
                            success: true,
                            message: 'Evento creado correctamente',
                            id: resultSust.insertId
                        });
                    } else {
                        // Para otros eventos, se requiere jugador_nombre
                        if (!partidoIdPost || !tipoEvento || !minuto || !jugadorNombre || !equipo) {
                            await connection.end();
                            return res.status(400).json({
                                success: false,
                                error: 'Faltan campos requeridos'
                            });
                        }
                        
                        // Validar tipo de evento
                        if (!['gol', 'asistencia', 'tarjeta_amarilla', 'tarjeta_roja'].includes(tipoEvento)) {
                            await connection.end();
                            return res.status(400).json({
                                success: false,
                                error: 'Tipo de evento inválido'
                            });
                        }
                        
                        // Validar equipo
                        if (!['local', 'visitante'].includes(equipo)) {
                            await connection.end();
                            return res.status(400).json({
                                success: false,
                                error: 'Equipo inválido'
                            });
                        }
                        
                        // Si es penal o autogol, no debe haber asistencia
                        const asistenciaIdFinal = (esPenal || esAutogol) ? null : jugadorAsistenciaId;
                        const asistenciaNombreFinal = (esPenal || esAutogol) ? null : jugadorAsistenciaNombre;
                        const asistenciaDorsalFinal = (esPenal || esAutogol) ? null : jugadorAsistenciaDorsal;
                        
                        // Insertar evento
                        const [result] = await connection.execute(
                            `INSERT INTO eventos_partido (partido_id, tipo_evento, minuto, jugador_id, jugador_nombre, jugador_dorsal, equipo, 
                             jugador_asistencia_id, jugador_asistencia_nombre, jugador_asistencia_dorsal, es_penal, es_autogol, usuario_id) 
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                                partidoIdPost, tipoEvento, minuto, jugadorId, jugadorNombre, jugadorDorsal, equipo,
                                asistenciaIdFinal, asistenciaNombreFinal, asistenciaDorsalFinal,
                                esPenal ? 1 : 0, esAutogol ? 1 : 0, usuarioId
                            ]
                        );
                        
                        await connection.end();
                        return res.status(200).json({
                            success: true,
                            message: 'Evento creado correctamente',
                            id: result.insertId
                        });
                    }
                    
                case 'PUT':
                    // Actualizar evento
                    const eventoId = body.id ? parseInt(body.id) : null;
                    
                    if (!eventoId) {
                        await connection.end();
                        return res.status(400).json({
                            success: false,
                            error: 'ID de evento requerido'
                        });
                    }
                    
                    // Construir query de actualización dinámicamente
                    const camposActualizar = [];
                    const valoresActualizar = [];
                    
                    if (body.tipo_evento !== undefined) {
                        camposActualizar.push('tipo_evento = ?');
                        valoresActualizar.push(body.tipo_evento);
                    }
                    if (body.minuto !== undefined) {
                        camposActualizar.push('minuto = ?');
                        valoresActualizar.push(String(body.minuto).trim());
                    }
                    if (body.jugador_nombre !== undefined) {
                        camposActualizar.push('jugador_nombre = ?');
                        valoresActualizar.push(String(body.jugador_nombre).trim());
                    }
                    if (body.jugador_id !== undefined) {
                        camposActualizar.push('jugador_id = ?');
                        valoresActualizar.push(body.jugador_id ? String(body.jugador_id).trim() : null);
                    }
                    if (body.equipo !== undefined) {
                        camposActualizar.push('equipo = ?');
                        valoresActualizar.push(body.equipo);
                    }
                    if (body.jugador_asistencia_nombre !== undefined) {
                        camposActualizar.push('jugador_asistencia_nombre = ?');
                        valoresActualizar.push(body.jugador_asistencia_nombre ? String(body.jugador_asistencia_nombre).trim() : null);
                    }
                    if (body.jugador_asistencia_id !== undefined) {
                        camposActualizar.push('jugador_asistencia_id = ?');
                        valoresActualizar.push(body.jugador_asistencia_id ? String(body.jugador_asistencia_id).trim() : null);
                    }
                    if (body.es_penal !== undefined) {
                        camposActualizar.push('es_penal = ?');
                        valoresActualizar.push(body.es_penal ? 1 : 0);
                    }
                    if (body.es_autogol !== undefined) {
                        camposActualizar.push('es_autogol = ?');
                        valoresActualizar.push(body.es_autogol ? 1 : 0);
                    }
                    
                    if (camposActualizar.length === 0) {
                        await connection.end();
                        return res.status(400).json({
                            success: false,
                            error: 'No hay campos para actualizar'
                        });
                    }
                    
                    valoresActualizar.push(eventoId);
                    
                    const sqlUpdate = `UPDATE eventos_partido SET ${camposActualizar.join(', ')} WHERE id = ?`;
                    const [resultUpdate] = await connection.execute(sqlUpdate, valoresActualizar);
                    
                    if (resultUpdate.affectedRows === 0) {
                        await connection.end();
                        return res.status(404).json({
                            success: false,
                            error: 'Evento no encontrado'
                        });
                    }
                    
                    await connection.end();
                    return res.status(200).json({
                        success: true,
                        message: 'Evento actualizado correctamente'
                    });
                    
                case 'DELETE':
                    // Eliminar evento
                    const eventoIdDelete = query.id ? parseInt(query.id) : null;
                    
                    if (!eventoIdDelete) {
                        await connection.end();
                        return res.status(400).json({
                            success: false,
                            error: 'ID de evento requerido'
                        });
                    }
                    
                    const [resultDelete] = await connection.execute(
                        "DELETE FROM eventos_partido WHERE id = ?",
                        [eventoIdDelete]
                    );
                    
                    if (resultDelete.affectedRows === 0) {
                        await connection.end();
                        return res.status(404).json({
                            success: false,
                            error: 'Evento no encontrado'
                        });
                    }
                    
                    await connection.end();
                    return res.status(200).json({
                        success: true,
                        message: 'Evento eliminado correctamente'
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
        console.error('Error en API eventos_partido:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Error al procesar la solicitud',
            file: 'eventos_partido.php.js'
        });
    }
};

