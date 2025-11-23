/**
 * Serverless function para verificar sesión
 * Vercel ejecutará esto cuando se acceda a /api/check_session.php
 * 
 * Nota: En serverless no podemos usar sesiones PHP, así que usamos cookies
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
        // Para simplificar, usamos '*' pero sin credentials para cookies
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        
        // Manejar OPTIONS
        if (req.method === 'OPTIONS') {
            return res.status(200).json({});
        }
        
        // Solo permitir GET
        if (req.method !== 'GET') {
            return res.status(405).json({
                success: false,
                error: 'Método no permitido'
            });
        }
        
        // En serverless, no podemos usar sesiones PHP
        // Usaremos cookies para almacenar el ID de usuario
        // O simplemente devolver que no hay sesión (el frontend puede manejar el estado)
        
        // Intentar obtener el usuario_id de las cookies
        const cookies = req.headers.cookie || '';
        let usuarioId = null;
        
        // Buscar cookie de sesión
        const cookieMatch = cookies.match(/usuario_id=([^;]+)/);
        if (cookieMatch) {
            usuarioId = cookieMatch[1];
        }
        
        // Si no hay cookie, devolver que no hay sesión
        if (!usuarioId) {
            return res.status(200).json({
                success: true,
                logged_in: false
            });
        }
        
        // Si hay cookie, verificar que el usuario existe en la base de datos
        const connection = await mysql.createConnection(DB_CONFIG);
        
        try {
            const [usuarios] = await connection.execute(
                "SELECT id, username, email, nombre_completo, rol FROM usuarios WHERE id = ? AND activo = 1",
                [usuarioId]
            );
            
            await connection.end();
            
            if (usuarios.length === 0) {
                return res.status(200).json({
                    success: true,
                    logged_in: false
                });
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
            await connection.end();
            throw error;
        }
        
    } catch (error) {
        console.error('Error en API check_session:', error);
        return res.status(200).json({
            success: true,
            logged_in: false
        });
    }
};

