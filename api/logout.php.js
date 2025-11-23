/**
 * Serverless function para cerrar sesión
 * Vercel ejecutará esto cuando se acceda a /api/logout.php
 */

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
        
        // Eliminar la cookie de sesión estableciendo una fecha de expiración en el pasado
        const isProduction = req.headers.host && !req.headers.host.includes('localhost');
        const cookieOptions = [
            'usuario_id=',
            'Path=/',
            'SameSite=Lax',
            'HttpOnly',
            isProduction ? 'Secure' : '',
            'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'Max-Age=0'
        ].filter(Boolean).join('; ');
        
        res.setHeader('Set-Cookie', cookieOptions);
        
        return res.status(200).json({
            success: true,
            message: 'Sesión cerrada correctamente'
        });
        
    } catch (error) {
        console.error('Error en API logout:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Error al cerrar sesión',
            file: 'logout.php.js'
        });
    }
};

