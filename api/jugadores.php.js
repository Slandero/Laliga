/**
 * Serverless function para obtener jugadores de un equipo
 * Vercel ejecutará esto cuando se acceda a /api/jugadores.php
 * (Vercel automáticamente busca archivos .js en /api/)
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
    // Permitir CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        const { query } = req;
        const tabla = query.tabla;
        
        if (!tabla) {
            return res.status(400).json({
                success: false,
                error: 'Parámetro "tabla" requerido'
            });
        }
        
        // Conectar a Railway
        const connection = await mysql.createConnection(DB_CONFIG);
        
        try {
            // Verificar que la tabla existe
            const [tablas] = await connection.execute("SHOW TABLES");
            const nombresTablas = tablas.map(t => Object.values(t)[0]);
            
            if (!nombresTablas.includes(tabla)) {
                return res.status(404).json({
                    success: false,
                    error: `Tabla no encontrada: ${tabla}`
                });
            }
            
            // Obtener columnas para ordenar
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
            
            // Consultar jugadores
            let sql = `SELECT * FROM \`${tabla}\``;
            if (columnaOrden) {
                sql += ` ORDER BY \`${columnaOrden}\` ASC`;
            }
            
            const [jugadores] = await connection.execute(sql);
            
            // Mapeo de nombres de tablas a nombres de equipos para entrenadores
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
            
            // Obtener entrenadores si existe la tabla entrenadores
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
            
            // Combinar jugadores y entrenadores
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
            await connection.end();
            throw error;
        }
        
    } catch (error) {
        console.error('Error en API jugadores:', error);
        return res.status(500).json({
            success: false,
            error: `Error de base de datos: ${error.message}`,
            file: 'jugadores.php.js'
        });
    }
};

