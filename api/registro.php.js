/**
 * Serverless function para registro de usuarios
 * Vercel ejecutará esto cuando se acceda a /api/registro.php
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
        let body = {};
        
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
        
        const username = (body.username || '').trim();
        const email = (body.email || '').trim();
        const password = (body.password || '').trim();
        const password_confirm = (body.password_confirm || '').trim();
        const nombre_completo = (body.nombre_completo || '').trim();
        
        // Validar datos
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username, email y contraseña son requeridos'
            });
        }
        
        if (password !== password_confirm) {
            return res.status(400).json({
                success: false,
                error: 'Las contraseñas no coinciden'
            });
        }
        
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: 'Email inválido'
            });
        }
        
        // Conectar a Railway
        const connection = await mysql.createConnection(DB_CONFIG);
        
        try {
            // Verificar si el email ya existe
            const [emailExists] = await connection.execute(
                "SELECT id FROM usuarios WHERE email = ?",
                [email]
            );
            
            if (emailExists.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'El email ya está registrado'
                });
            }
            
            // Verificar si el username ya existe
            const [usernameExists] = await connection.execute(
                "SELECT id FROM usuarios WHERE username = ?",
                [username]
            );
            
            if (usernameExists.length > 0) {
                return res.status(400).json({
                    success: false,
                    error: 'El username ya está en uso'
                });
            }
            
            // Hashear contraseña
            const passwordHash = await bcrypt.hash(password, 10);
            
            // Insertar nuevo usuario
            const [result] = await connection.execute(
                "INSERT INTO usuarios (username, email, password, nombre_completo, rol, activo) VALUES (?, ?, ?, ?, 'usuario', 1)",
                [username, email, passwordHash, nombre_completo || null]
            );
            
            const usuarioId = result.insertId;
            
            await connection.end();
            
            // Establecer cookie para mantener la sesión (en lugar de sesión PHP)
            const isProduction = req.headers.host && !req.headers.host.includes('localhost');
            const cookieOptions = [
                `usuario_id=${usuarioId}`,
                'Path=/',
                'SameSite=Lax',
                isProduction ? 'Secure' : '', // Solo Secure en producción (HTTPS)
                'Max-Age=86400' // 24 horas
            ].filter(Boolean).join('; ');
            
            res.setHeader('Set-Cookie', cookieOptions);
            
            // Devolver datos del usuario (sin la contraseña)
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
            await connection.end();
            throw error;
        }
        
    } catch (error) {
        console.error('Error en API registro:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Error al registrar usuario',
            file: 'registro.php.js'
        });
    }
};

