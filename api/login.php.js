/**
 * Serverless function para iniciar sesión
 * Vercel ejecutará esto cuando se acceda a /api/login.php
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

module.exports = async (req, res) => {
    try {
        // Permitir CORS siempre
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Content-Type', 'application/json; charset=UTF-8');
        
        // Manejar OPTIONS
        if (req.method === 'OPTIONS') {
            return res.status(200).json({});
        }
        
        // Solo permitir POST
        if (req.method !== 'POST') {
            return res.status(405).json({
                success: false,
                error: 'Método no permitido'
            });
        }
        
        // Obtener datos del body
        // En Vercel, el body puede venir parseado o como string
        let body = {};
        
        // Intentar obtener el body de diferentes maneras
        if (req.body) {
            if (typeof req.body === 'string') {
                try {
                    body = JSON.parse(req.body);
                } catch (e) {
                    return res.status(400).json({
                        success: false,
                        error: 'Error al procesar los datos de la solicitud'
                    });
                }
            } else {
                body = req.body;
            }
        }
        
        const email = (body.email || '').trim();
        const password = (body.password || '').trim();
        
        // Validar datos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email/username y contraseña son requeridos'
            });
        }
        
        // Conectar a Railway
        const connection = await mysql.createConnection(DB_CONFIG);
        
        try {
            // Buscar usuario por email o username
            const [usuarios] = await connection.execute(
                "SELECT * FROM usuarios WHERE (email = ? OR username = ?) AND activo = 1",
                [email, email]
            );
            
            if (usuarios.length === 0) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales incorrectas'
                });
            }
            
            const usuario = usuarios[0];
            
            // Verificar contraseña
            const passwordMatch = await bcrypt.compare(password, usuario.password);
            
            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales incorrectas'
                });
            }
            
            // Actualizar último acceso
            await connection.execute(
                "UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?",
                [usuario.id]
            );
            
            await connection.end();
            
            // Establecer cookie para mantener la sesión (en lugar de sesión PHP)
            // En serverless, usamos cookies para mantener el estado
            const isProduction = req.headers.host && !req.headers.host.includes('localhost');
            const cookieOptions = [
                `usuario_id=${usuario.id}`,
                'Path=/',
                'SameSite=Lax',
                isProduction ? 'Secure' : '', // Solo Secure en producción (HTTPS)
                'Max-Age=86400' // 24 horas
            ].filter(Boolean).join('; ');
            
            res.setHeader('Set-Cookie', cookieOptions);
            
            // Devolver datos del usuario (sin la contraseña)
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
            await connection.end();
            throw error;
        }
        
    } catch (error) {
        console.error('Error en API login:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Error al iniciar sesión',
            file: 'login.php.js'
        });
    }
};

