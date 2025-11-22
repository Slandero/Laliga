// Página de Clasificación

// Mapeo de nombres de equipos a carpetas de imágenes
const mapeoEquipos = {
    'GIRONA FC': 'GironaFútbolClubSAD',
    'RAYO VALLECANO': 'RayoVallecanodeMadridSAD',
    'VILLARREAL CF': 'villareal',
    'REAL OVIEDO': 'RealOviedo',
    'RCD MALLORCA': 'mallorca',
    'FC BARCELONA': 'FútbolClubBarcelona',
    'DEPORTIVO ALAVÉS': 'DeportivoAlavésSAD',
    'LEVANTE UD': 'LevanteUniónDeportivaSAD',
    'VALENCIA CF': 'valencia',
    'REAL SOCIEDAD': 'realsociedad',
    'CELTA': 'Celta',
    'CELTA DE VIGO': 'Celta',
    'GETAFE CF': 'GetafeClubdeFútbolSAD',
    'ATHLETIC CLUB': 'AthleticClub',
    'SEVILLA FC': 'sevilla',
    'RCD ESPANYOL DE BARCELONA': 'espanyol',
    'ATLÉTICO DE MADRID': 'ClubAtléticodeMadridSAD',
    'ELCHE CF': 'ElcheClubdeFútbolSAD',
    'REAL BETIS': 'betis',
    'REAL MADRID': 'realmadrid',
    'CA OSASUNA': 'ClubAtléticoOsasuna'
};

function obtenerCarpetaEquipo(nombreEquipo) {
    return mapeoEquipos[nombreEquipo] || null;
}

function obtenerRutaLogo(nombreEquipo) {
    const carpeta = obtenerCarpetaEquipo(nombreEquipo);
    return carpeta ? `images/${carpeta}/escudo.png` : 'images/LaligaLogo.jpg';
}

function ClasificacionPage() {
    return `
        <section id="clasificacion">
            <h1>Clasificación</h1>
            <div id="clasificacion-content">
                <p>Cargando clasificación...</p>
            </div>
        </section>
    `;
}

async function init() {
    console.log('Página de clasificación cargada');
    await cargarClasificacion();
}

async function cargarClasificacion() {
    const content = document.getElementById('clasificacion-content');
    if (!content) {
        setTimeout(cargarClasificacion, 100);
        return;
    }

    try {
        // Obtener todos los partidos
        const response = await fetch('api/partidos.php?jornada=all', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.partidos) {
            const clasificacion = calcularClasificacion(result.partidos);
            mostrarClasificacion(content, clasificacion);
        } else {
            content.innerHTML = '<p>No hay datos de clasificación disponibles.</p>';
        }
    } catch (error) {
        console.error('Error al cargar clasificación:', error);
        content.innerHTML = '<p>Error al cargar la clasificación. Por favor, intenta más tarde.</p>';
    }
}

function calcularClasificacion(partidos) {
    // Objeto para almacenar estadísticas de cada equipo
    const estadisticas = {};
    
    // Obtener la fecha actual (solo fecha, sin hora)
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    // Procesar cada partido
    partidos.forEach(partido => {
        // Solo procesar partidos que ya se han jugado (fecha <= fecha actual)
        if (partido.fecha_iso) {
            const fechaPartido = new Date(partido.fecha_iso);
            fechaPartido.setHours(0, 0, 0, 0);
            
            // Si la fecha del partido es futura, no procesarlo
            if (fechaPartido > fechaActual) {
                return;
            }
        }
        
        // Solo procesar partidos con resultado
        if (partido.goles_local === null || partido.goles_visitante === null) {
            return;
        }

        const local = partido.local;
        const visitante = partido.visitante;
        const golesLocal = partido.goles_local;
        const golesVisitante = partido.goles_visitante;

        // Inicializar estadísticas del equipo local si no existe
        if (!estadisticas[local]) {
            estadisticas[local] = {
                equipo: local,
                PJ: 0,
                PG: 0,
                PE: 0,
                PP: 0,
                GF: 0,
                GC: 0,
                DG: 0,
                PUNTOS: 0
            };
        }

        // Inicializar estadísticas del equipo visitante si no existe
        if (!estadisticas[visitante]) {
            estadisticas[visitante] = {
                equipo: visitante,
                PJ: 0,
                PG: 0,
                PE: 0,
                PP: 0,
                GF: 0,
                GC: 0,
                DG: 0,
                PUNTOS: 0
            };
        }

        // Actualizar estadísticas del equipo local
        estadisticas[local].PJ++;
        estadisticas[local].GF += golesLocal;
        estadisticas[local].GC += golesVisitante;

        // Actualizar estadísticas del equipo visitante
        estadisticas[visitante].PJ++;
        estadisticas[visitante].GF += golesVisitante;
        estadisticas[visitante].GC += golesLocal;

        // Determinar resultado y actualizar puntos
        if (golesLocal > golesVisitante) {
            // Victoria local
            estadisticas[local].PG++;
            estadisticas[local].PUNTOS += 3;
            estadisticas[visitante].PP++;
        } else if (golesLocal < golesVisitante) {
            // Victoria visitante
            estadisticas[visitante].PG++;
            estadisticas[visitante].PUNTOS += 3;
            estadisticas[local].PP++;
        } else {
            // Empate
            estadisticas[local].PE++;
            estadisticas[local].PUNTOS += 1;
            estadisticas[visitante].PE++;
            estadisticas[visitante].PUNTOS += 1;
        }
    });

    // Calcular diferencia de goles para cada equipo
    Object.keys(estadisticas).forEach(equipo => {
        estadisticas[equipo].DG = estadisticas[equipo].GF - estadisticas[equipo].GC;
    });

    // Convertir a array y ordenar
    const clasificacion = Object.values(estadisticas);

    // Ordenar por puntos (descendente), luego por diferencia de goles (descendente)
    clasificacion.sort((a, b) => {
        if (b.PUNTOS !== a.PUNTOS) {
            return b.PUNTOS - a.PUNTOS;
        }
        return b.DG - a.DG;
    });

    return clasificacion;
}

function mostrarClasificacion(content, clasificacion) {
    if (clasificacion.length === 0) {
        content.innerHTML = '<p>No hay datos de clasificación disponibles.</p>';
        return;
    }

    let html = `
        <div class="clasificacion-container">
            <table class="clasificacion-table">
                <thead>
                    <tr>
                        <th>POSICIÓN</th>
                        <th>EQUIPO</th>
                        <th>PUNTOS</th>
                        <th>PJ</th>
                        <th>PG</th>
                        <th>PE</th>
                        <th>PP</th>
                        <th>GF</th>
                        <th>GC</th>
                        <th>DG</th>
                    </tr>
                </thead>
                <tbody>
    `;

    clasificacion.forEach((equipo, index) => {
        const posicion = index + 1;
        const rutaLogo = obtenerRutaLogo(equipo.equipo);
        html += `
            <tr>
                <td class="posicion">${posicion}</td>
                <td class="equipo">
                    <div class="equipo-con-logo">
                        <img src="${rutaLogo}" alt="${equipo.equipo}" class="equipo-logo" 
                             onerror="this.src='images/LaligaLogo.jpg'">
                        <span class="equipo-nombre">${equipo.equipo}</span>
                    </div>
                </td>
                <td class="puntos">${equipo.PUNTOS}</td>
                <td>${equipo.PJ}</td>
                <td>${equipo.PG}</td>
                <td>${equipo.PE}</td>
                <td>${equipo.PP}</td>
                <td>${equipo.GF}</td>
                <td>${equipo.GC}</td>
                <td class="${equipo.DG >= 0 ? 'dg-positivo' : 'dg-negativo'}">${equipo.DG > 0 ? '+' : ''}${equipo.DG}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
            <div class="clasificacion-leyenda">
                <div class="leyenda-item">
                    <div class="leyenda-franja franja-azul"></div>
                    <span>Champions League</span>
                </div>
                <div class="leyenda-item">
                    <div class="leyenda-franja franja-naranja"></div>
                    <span>Europa League</span>
                </div>
                <div class="leyenda-item">
                    <div class="leyenda-franja franja-verde"></div>
                    <span>Conference League</span>
                </div>
                <div class="leyenda-item">
                    <div class="leyenda-franja franja-roja"></div>
                    <span>Descenso</span>
                </div>
            </div>
        </div>
    `;

    content.innerHTML = html;
}

export default ClasificacionPage;
export { init };

