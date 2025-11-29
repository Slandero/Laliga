/**
 * Función serverless única para manejar todos los endpoints de la API
 * Esto evita el límite de 12 funciones serverless del plan Hobby de Vercel
 * 
 * Endpoints soportados:
 * - /api/jugadores.php
 * - /api/login.php
 * - /api/registro.php
 * - /api/check_session.php
 * - /api/logout.php
 * - /api/partidos.php
 * - /api/eventos_partido.php
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

// Configuración de Railway
const DB_CONFIG = {
    host: 'yamabiko.proxy.rlwy.net',
    port: 28754,
    user: 'root',
    password: 'ZAkiwwKgwmthUgTOJMwktjGDtNmmpVxi',
    database: 'railway',
    charset: 'utf8mb4'
};

// Función para obtener el endpoint desde la URL
function getEndpoint(req) {
    // Intentar obtener de diferentes fuentes
    const url = req.url || req.path || '';
    
    // Extraer el nombre del endpoint de la URL
    // Ejemplo: /api/jugadores.php -> jugadores
    // Ejemplo: /api/login.php -> login
    // Ejemplo: /api/jugadores.php?tabla=real_madrid -> jugadores
    
    // Primero intentar con .php
    let match = url.match(/\/api\/([^\/\?\.]+)\.php/);
    if (match && match[1]) {
        return match[1];
    }
    
    // Si no tiene .php, intentar extraer de otra forma
    match = url.match(/\/api\/([^\/\?]+)/);
    if (match && match[1]) {
        return match[1];
    }
    
    // Si viene sin /api/, intentar de nuevo
    match = url.match(/\/([^\/\?\.]+)\.php/);
    if (match && match[1]) {
        return match[1];
    }
    
    match = url.match(/\/([^\/\?]+)/);
    return match ? match[1] : null;
}

// Función para parsear cookies
function parseCookies(cookieHeader) {
    const cookies = {};
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.trim().split('=');
            if (parts.length === 2) {
                cookies[parts[0]] = parts[1];
            }
        });
    }
    return cookies;
}

// Función para parsear el body
async function parseBody(req) {
    if (req.method === 'GET' || req.method === 'OPTIONS') return {};
    
    try {
        const contentType = req.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
            return typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        }
        if (contentType.includes('application/x-www-form-urlencoded')) {
            const body = typeof req.body === 'string' ? req.body : '';
            const params = new URLSearchParams(body);
            const result = {};
            params.forEach((value, key) => {
                result[key] = value;
            });
            return result;
        }
        return typeof req.body === 'object' ? req.body : {};
    } catch (e) {
        console.error('Error parsing body:', e);
        return {};
    }
}

// Función para configurar CORS
function setCORSHeaders(res, req) {
    const origin = req.headers.origin || req.headers.referer?.split('/').slice(0, 3).join('/') || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (origin !== '*') {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
}

// Handler para jugadores
async function handleJugadores(req, res, query, cookies) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Método no permitido' });
    }

    const tabla = query?.tabla;
    if (!tabla) {
        return res.status(400).json({ success: false, error: 'Parámetro "tabla" requerido' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        const [tablas] = await connection.execute("SHOW TABLES");
        const nombresTablas = tablas.map(t => Object.values(t)[0]);
        
        if (!nombresTablas.includes(tabla)) {
            await connection.end();
            return res.status(404).json({ success: false, error: `Tabla no encontrada: ${tabla}` });
        }
        
        const [columnas] = await connection.execute(`SHOW COLUMNS FROM \`${tabla}\``);
        const nombresColumnas = columnas.map(c => c.Field);
        
        let columnaOrden = null;
        if (nombresColumnas.includes('Dorsal')) {
            columnaOrden = 'Dorsal';
        } else if (nombresColumnas.includes('dorsal')) {
            columnaOrden = 'dorsal';
        } else if (nombresColumnas.includes('numero')) {
            columnaOrden = 'numero';
        } else if (nombresColumnas.includes('num')) {
            columnaOrden = 'num';
        }
        
        let sql = `SELECT * FROM \`${tabla}\``;
        if (columnaOrden) {
            sql += ` ORDER BY \`${columnaOrden}\` ASC`;
        }
        
        const [jugadores] = await connection.execute(sql);
        
        const mapeoEquipos = {
            'athletic_club': 'Athletic Club',
            'atletico_de_madrid': 'Atlético de Madrid',
            'ca_osasuna': 'CA Osasuna',
            'celta_vigo': 'Celta de Vigo',
            'deportivo_alaves': 'Deportivo Alavés',
            'elche_cf': 'Elche CF',
            'fc_barcelona': 'FC Barcelona',
            'getafe_cf': 'Getafe CF',
            'girona_fc': 'Girona FC',
            'levante_ud': 'Levante UD',
            'rayo_vallecano': 'Rayo Vallecano',
            'rcd_espanyol': 'RCD Espanyol',
            'rcd_mallorca': 'RCD Mallorca',
            'real_betis': 'Real Betis',
            'real_madrid': 'Real Madrid',
            'real_oviedo': 'Real Oviedo',
            'real_sociedad': 'Real Sociedad',
            'sevilla_fc': 'Sevilla FC',
            'valencia_cf': 'Valencia CF',
            'villarreal_cf': 'Villarreal CF'
        };
        
        let entrenadores = [];
        if (nombresTablas.includes('entrenadores')) {
            const nombreEquipo = mapeoEquipos[tabla];
            if (nombreEquipo) {
                try {
                    const [entrenadoresData] = await connection.execute(
                        "SELECT * FROM `entrenadores` WHERE `Equipo` = ? OR `equipo` = ?",
                        [nombreEquipo, nombreEquipo]
                    );
                    entrenadores = entrenadoresData;
                } catch (error) {
                    console.error('Error al obtener entrenadores:', error);
                }
            }
        }
        
        const todosLosRegistros = [...entrenadores, ...jugadores];
        
        await connection.end();
        return res.status(200).json({
            success: true,
            data: todosLosRegistros,
            total: todosLosRegistros.length,
            jugadores: jugadores.length,
            entrenadores: entrenadores.length
        });
    } catch (error) {
        if (connection) await connection.end();
        console.error('Error en jugadores:', error);
        return res.status(500).json({ success: false, error: 'Error de base de datos', message: error.message });
    }
}

// Handler para login
async function handleLogin(req, res, body, cookies) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método no permitido' });
    }

    const email = (body.email || '').trim();
    const password = (body.password || '').trim();

    if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email/username y contraseña son requeridos' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        const [usuarios] = await connection.execute(
            "SELECT * FROM usuarios WHERE (email = ? OR username = ?) AND activo = 1",
            [email, email]
        );

        if (usuarios.length === 0) {
            await connection.end();
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }

        const usuario = usuarios[0];
        const passwordMatch = await bcrypt.compare(password, usuario.password);

        if (!passwordMatch) {
            await connection.end();
            return res.status(401).json({ success: false, error: 'Credenciales incorrectas' });
        }

        await connection.execute("UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?", [usuario.id]);
        await connection.end();

        const isProduction = req.headers.host && !req.headers.host.includes('localhost');
        const cookieOptions = [
            `usuario_id=${usuario.id}`,
            'Path=/',
            'SameSite=Lax',
            isProduction ? 'Secure' : '',
            'Max-Age=604800' // 7 días
        ].filter(Boolean).join('; ');

        res.setHeader('Set-Cookie', cookieOptions);
        return res.status(200).json({
            success: true,
            message: 'Sesión iniciada correctamente',
            usuario: {
                id: usuario.id,
                username: usuario.username,
                email: usuario.email,
                nombre: usuario.nombre_completo,
                rol: usuario.rol
            }
        });
    } catch (error) {
        if (connection) await connection.end();
        console.error('Error en login:', error);
        return res.status(500).json({ success: false, error: 'Error del servidor', message: error.message });
    }
}

// Handler para registro
async function handleRegistro(req, res, body, cookies) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método no permitido' });
    }

    const username = (body.username || '').trim();
    const email = (body.email || '').trim();
    const password = (body.password || '').trim();
    const password_confirm = (body.password_confirm || '').trim();
    const nombre_completo = (body.nombre_completo || '').trim();

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, error: 'Username, email y contraseña son requeridos' });
    }

    if (password !== password_confirm) {
        return res.status(400).json({ success: false, error: 'Las contraseñas no coinciden' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, error: 'Email inválido' });
    }

    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        const [emailExists] = await connection.execute("SELECT id FROM usuarios WHERE email = ?", [email]);
        if (emailExists.length > 0) {
            await connection.end();
            return res.status(400).json({ success: false, error: 'El email ya está registrado' });
        }

        const [usernameExists] = await connection.execute("SELECT id FROM usuarios WHERE username = ?", [username]);
        if (usernameExists.length > 0) {
            await connection.end();
            return res.status(400).json({ success: false, error: 'El username ya está en uso' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await connection.execute(
            "INSERT INTO usuarios (username, email, password, nombre_completo, rol, activo) VALUES (?, ?, ?, ?, 'usuario', 1)",
            [username, email, passwordHash, nombre_completo || null]
        );

        const usuarioId = result.insertId;
        await connection.end();

        const isProduction = req.headers.host && !req.headers.host.includes('localhost');
        const cookieOptions = [
            `usuario_id=${usuarioId}`,
            'Path=/',
            'SameSite=Lax',
            isProduction ? 'Secure' : '',
            'Max-Age=604800' // 7 días
        ].filter(Boolean).join('; ');

        res.setHeader('Set-Cookie', cookieOptions);
        return res.status(200).json({
            success: true,
            message: 'Usuario registrado correctamente',
            usuario: {
                id: usuarioId,
                username: username,
                email: email,
                nombre: nombre_completo,
                rol: 'usuario'
            }
        });
    } catch (error) {
        if (connection) await connection.end();
        console.error('Error en registro:', error);
        return res.status(500).json({ success: false, error: 'Error del servidor', message: error.message });
    }
}

// Handler para check_session
async function handleCheckSession(req, res, body, cookies) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Método no permitido' });
    }

    const usuarioId = cookies.usuario_id || null;
    if (!usuarioId) {
        return res.status(200).json({ success: true, logged_in: false });
    }

    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        const [usuarios] = await connection.execute(
            "SELECT id, username, email, nombre_completo, rol FROM usuarios WHERE id = ? AND activo = 1",
            [usuarioId]
        );
        await connection.end();

        if (usuarios.length === 0) {
            return res.status(200).json({ success: true, logged_in: false });
        }

        const usuario = usuarios[0];
        return res.status(200).json({
            success: true,
            logged_in: true,
            usuario: {
                id: usuario.id,
                username: usuario.username,
                email: usuario.email,
                nombre: usuario.nombre_completo,
                rol: usuario.rol
            }
        });
    } catch (error) {
        if (connection) await connection.end();
        console.error('Error en check_session:', error);
        return res.status(200).json({ success: true, logged_in: false });
    }
}

// Handler para logout
async function handleLogout(req, res, body, cookies) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Método no permitido' });
    }

    const isProduction = req.headers.host && !req.headers.host.includes('localhost');
    const cookieOptions = [
        'usuario_id=',
        'Path=/',
        'SameSite=Lax',
        isProduction ? 'Secure' : '',
        'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Max-Age=0'
    ].filter(Boolean).join('; ');

    res.setHeader('Set-Cookie', cookieOptions);
    return res.status(200).json({ success: true, message: 'Sesión cerrada correctamente' });
}

// Handler para partidos - delegar al módulo existente
async function handlePartidos(req, res, body, cookies, query) {
    // Importar dinámicamente el handler de partidos
    const partidosHandler = require('./partidos.php.js');
    return await partidosHandler(req, res);
}

// Handler para eventos_partido - delegar al módulo existente
async function handleEventosPartido(req, res, body, cookies, query) {
    // Importar dinámicamente el handler de eventos
    const eventosHandler = require('./eventos_partido.php.js');
    return await eventosHandler(req, res);
}

// Handler para noticias
async function handleNoticias(req, res, body, cookies, query) {
    const usuarioId = cookies.usuario_id ? parseInt(cookies.usuario_id) : null;
    const usuarioLogueado = !!usuarioId;
    
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        if (req.method === 'GET') {
            // Obtener todas las noticias ordenadas por fecha de creación descendente
            const [noticias] = await connection.execute(
                `SELECT n.*, u.username, u.nombre_completo 
                 FROM noticias n 
                 INNER JOIN usuarios u ON n.usuario_id = u.id 
                 ORDER BY n.fecha_creacion DESC`
            );
            
            // Formatear resultados
            const resultados = noticias.map(noticia => {
                const fecha = new Date(noticia.fecha_creacion);
                const fechaFormateada = fecha.toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                return {
                    id: parseInt(noticia.id),
                    titulo: noticia.titulo,
                    contenido: noticia.contenido,
                    imagen_url: noticia.imagen_url,
                    jornada: noticia.jornada ? parseInt(noticia.jornada) : null,
                    usuario_id: parseInt(noticia.usuario_id),
                    usuario_nombre: noticia.nombre_completo || noticia.username,
                    fecha_creacion: fechaFormateada,
                    fecha_iso: noticia.fecha_creacion
                };
            });
            
            await connection.end();
            return res.status(200).json({
                success: true,
                noticias: resultados,
                total: resultados.length
            });
            
        } else if (req.method === 'POST') {
            // Crear nueva noticia (requiere autenticación)
            if (!usuarioLogueado) {
                await connection.end();
                return res.status(401).json({
                    success: false,
                    error: 'Debes iniciar sesión para agregar noticias'
                });
            }
            
            const titulo = (body.titulo || '').trim();
            const contenido = (body.contenido || '').trim();
            const imagenUrl = (body.imagen_url || '').trim() || null;
            
            // Validaciones
            if (!titulo || titulo.length < 3) {
                await connection.end();
                return res.status(400).json({
                    success: false,
                    error: 'El título debe tener al menos 3 caracteres'
                });
            }
            
            if (!contenido || contenido.length < 10) {
                await connection.end();
                return res.status(400).json({
                    success: false,
                    error: 'El contenido debe tener al menos 10 caracteres'
                });
            }
            
            // Insertar noticia
            const [result] = await connection.execute(
                `INSERT INTO noticias (titulo, contenido, imagen_url, usuario_id) 
                 VALUES (?, ?, ?, ?)`,
                [titulo, contenido, imagenUrl, usuarioId]
            );
            
            await connection.end();
            return res.status(200).json({
                success: true,
                message: 'Noticia agregada correctamente',
                id: result.insertId
            });
            
        } else if (req.method === 'DELETE') {
            // Eliminar noticia (requiere autenticación)
            if (!usuarioLogueado) {
                await connection.end();
                return res.status(401).json({
                    success: false,
                    error: 'Debes iniciar sesión para eliminar noticias'
                });
            }
            
            const noticiaId = query.id ? parseInt(query.id) : null;
            if (!noticiaId) {
                await connection.end();
                return res.status(400).json({
                    success: false,
                    error: 'ID de noticia requerido'
                });
            }
            
            // Verificar que la noticia pertenezca al usuario o que sea admin
            const [noticias] = await connection.execute(
                'SELECT usuario_id FROM noticias WHERE id = ?',
                [noticiaId]
            );
            
            if (noticias.length === 0) {
                await connection.end();
                return res.status(404).json({
                    success: false,
                    error: 'Noticia no encontrada'
                });
            }
            
            // Verificar permisos (solo el autor o admin pueden eliminar)
            const [usuarios] = await connection.execute(
                'SELECT rol FROM usuarios WHERE id = ?',
                [usuarioId]
            );
            const esAdmin = usuarios.length > 0 && usuarios[0].rol === 'admin';
            const esAutor = noticias[0].usuario_id === usuarioId;
            
            if (!esAdmin && !esAutor) {
                await connection.end();
                return res.status(403).json({
                    success: false,
                    error: 'No tienes permiso para eliminar esta noticia'
                });
            }
            
            // Eliminar noticia
            await connection.execute('DELETE FROM noticias WHERE id = ?', [noticiaId]);
            await connection.end();
            return res.status(200).json({
                success: true,
                message: 'Noticia eliminada correctamente'
            });
        } else {
            await connection.end();
            return res.status(405).json({ success: false, error: 'Método no permitido' });
        }
    } catch (error) {
        if (connection) await connection.end();
        console.error('Error en noticias:', error);
        return res.status(500).json({ success: false, error: 'Error de base de datos', message: error.message });
    }
}

// Handler para estadísticas
async function handleEstadisticas(req, res, body, cookies, query) {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Método no permitido' });
    }
    
    let connection;
    try {
        connection = await mysql.createConnection(DB_CONFIG);
        
        // Verificar que la tabla exista
        const [tablas] = await connection.execute("SHOW TABLES LIKE 'eventos_partido'");
        if (tablas.length === 0) {
            await connection.end();
            return res.status(200).json({
                success: true,
                goleadores: [],
                asistencias: [],
                tarjetas_amarillas: [],
                tarjetas_rojas: []
            });
        }
        
        // Obtener goleadores (excluyendo autogoles) con equipo y dorsal
        const [goleadores] = await connection.execute(
            `SELECT 
                ep.jugador_nombre,
                ep.jugador_dorsal,
                COUNT(*) as total_goles,
                CASE 
                    WHEN ep.equipo = 'local' THEN p.equipo_local
                    ELSE p.equipo_visitante
                END as equipo_nombre
             FROM eventos_partido ep
             INNER JOIN partidos p ON ep.partido_id = p.id
             WHERE ep.tipo_evento = 'gol' 
               AND (ep.es_autogol IS NULL OR ep.es_autogol = 0)
             GROUP BY ep.jugador_nombre, ep.jugador_dorsal, 
                      CASE 
                          WHEN ep.equipo = 'local' THEN p.equipo_local
                          ELSE p.equipo_visitante
                      END
             ORDER BY total_goles DESC, ep.jugador_nombre ASC 
             LIMIT 10`
        );
        
        // Obtener asistencias con equipo y dorsal
        const [asistencias] = await connection.execute(
            `SELECT 
                ep.jugador_asistencia_nombre as jugador_nombre,
                ep.jugador_asistencia_dorsal as jugador_dorsal,
                COUNT(*) as total_asistencias,
                CASE 
                    WHEN ep.equipo = 'local' THEN p.equipo_local
                    ELSE p.equipo_visitante
                END as equipo_nombre
             FROM eventos_partido ep
             INNER JOIN partidos p ON ep.partido_id = p.id
             WHERE ep.tipo_evento = 'gol' 
               AND ep.jugador_asistencia_nombre IS NOT NULL 
               AND ep.jugador_asistencia_nombre != ''
             GROUP BY ep.jugador_asistencia_nombre, ep.jugador_asistencia_dorsal,
                      CASE 
                          WHEN ep.equipo = 'local' THEN p.equipo_local
                          ELSE p.equipo_visitante
                      END
             ORDER BY total_asistencias DESC, ep.jugador_asistencia_nombre ASC 
             LIMIT 10`
        );
        
        // Obtener tarjetas amarillas con equipo y dorsal
        const [tarjetasAmarillas] = await connection.execute(
            `SELECT 
                ep.jugador_nombre,
                ep.jugador_dorsal,
                COUNT(*) as total_tarjetas,
                CASE 
                    WHEN ep.equipo = 'local' THEN p.equipo_local
                    ELSE p.equipo_visitante
                END as equipo_nombre
             FROM eventos_partido ep
             INNER JOIN partidos p ON ep.partido_id = p.id
             WHERE ep.tipo_evento = 'tarjeta_amarilla'
             GROUP BY ep.jugador_nombre, ep.jugador_dorsal,
                      CASE 
                          WHEN ep.equipo = 'local' THEN p.equipo_local
                          ELSE p.equipo_visitante
                      END
             ORDER BY total_tarjetas DESC, ep.jugador_nombre ASC 
             LIMIT 10`
        );
        
        // Obtener tarjetas rojas con equipo y dorsal
        const [tarjetasRojas] = await connection.execute(
            `SELECT 
                ep.jugador_nombre,
                ep.jugador_dorsal,
                COUNT(*) as total_tarjetas,
                CASE 
                    WHEN ep.equipo = 'local' THEN p.equipo_local
                    ELSE p.equipo_visitante
                END as equipo_nombre
             FROM eventos_partido ep
             INNER JOIN partidos p ON ep.partido_id = p.id
             WHERE ep.tipo_evento = 'tarjeta_roja'
             GROUP BY ep.jugador_nombre, ep.jugador_dorsal,
                      CASE 
                          WHEN ep.equipo = 'local' THEN p.equipo_local
                          ELSE p.equipo_visitante
                      END
             ORDER BY total_tarjetas DESC, ep.jugador_nombre ASC 
             LIMIT 10`
        );
        
        await connection.end();
        return res.status(200).json({
            success: true,
            goleadores: goleadores.map(g => ({
                jugador: g.jugador_nombre || '',
                dorsal: g.jugador_dorsal || null,
                equipo: g.equipo_nombre || '',
                total: parseInt(g.total_goles) || 0
            })),
            asistencias: asistencias.map(a => ({
                jugador: a.jugador_nombre || '',
                dorsal: a.jugador_dorsal || null,
                equipo: a.equipo_nombre || '',
                total: parseInt(a.total_asistencias) || 0
            })),
            tarjetas_amarillas: tarjetasAmarillas.map(t => ({
                jugador: t.jugador_nombre || '',
                dorsal: t.jugador_dorsal || null,
                equipo: t.equipo_nombre || '',
                total: parseInt(t.total_tarjetas) || 0
            })),
            tarjetas_rojas: tarjetasRojas.map(t => ({
                jugador: t.jugador_nombre || '',
                dorsal: t.jugador_dorsal || null,
                equipo: t.equipo_nombre || '',
                total: parseInt(t.total_tarjetas) || 0
            }))
        });
    } catch (error) {
        if (connection) await connection.end();
        console.error('Error en estadísticas:', error);
        return res.status(500).json({ success: false, error: 'Error de base de datos', message: error.message });
    }
}

// Mapa de endpoints a handlers
const handlers = {
    'jugadores': handleJugadores,
    'login': handleLogin,
    'registro': handleRegistro,
    'check_session': handleCheckSession,
    'logout': handleLogout,
    'partidos': handlePartidos,
    'eventos_partido': handleEventosPartido,
    'noticias': handleNoticias,
    'estadisticas': handleEstadisticas
};

// Función principal exportada
module.exports = async (req, res) => {
    try {
        // Configurar CORS
        setCORSHeaders(res, req);

        // Manejar OPTIONS (preflight)
        if (req.method === 'OPTIONS') {
            return res.status(200).json({});
        }

        // Obtener el endpoint desde la URL
        const endpoint = getEndpoint(req);
        
        if (!endpoint) {
            return res.status(404).json({
                success: false,
                error: 'Endpoint no encontrado',
                url: req.url
            });
        }

        // Buscar el handler correspondiente
        const handler = handlers[endpoint];

        if (!handler) {
            return res.status(404).json({
                success: false,
                error: 'Endpoint no encontrado',
                endpoint: endpoint,
                available: Object.keys(handlers)
            });
        }

        // Parsear cookies y body
        const cookies = parseCookies(req.headers.cookie);
        const body = await parseBody(req);
        const query = req.query || {};

        // Ejecutar el handler
        return await handler(req, res, body, cookies, query);

    } catch (error) {
        console.error('Error general en API:', error);
        return res.status(500).json({
            success: false,
            error: 'Error interno del servidor',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
