// Página de Resultados

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

function ResultadosPage() {
    // Generar opciones para las jornadas (1 a 38)
    const jornadasOptions = Array.from({ length: 38 }, (_, i) => i + 1)
        .map(j => `<option value="${j}">Jornada ${j}</option>`)
        .join('');

    return `
        <section id="resultados">
            <!-- Header rojo con título y combo box -->
            <div class="resultados-header">
                <div class="breadcrumbs">
                    <a href="#" data-route="inicio">Inicio</a> > 
                    <span>Resultados</span>
                </div>
                <div class="resultados-title-section">
                    <h1 class="resultados-title">RESULTADOS DE LA JORNADA 1 DE LALIGA EA SPORTS 2025/26</h1>
                    <select id="jornada-select" class="jornada-select">
                        ${jornadasOptions}
                    </select>
                </div>
            </div>

            <!-- Barra informativa gris -->
            <div class="resultados-info-bar">
                <div class="info-bar-left">
                    <span class="info-icon"></span>
                </div>
                <div class="info-bar-right">
                    <a href="#" data-route="calendario" class="horarios-link">HORARIOS▸</a>
                </div>
            </div>

            <!-- Tabla de resultados -->
            <div class="resultados-table-container">
                <div class="resultados-table-header">
                    <div class="table-header-info">
                        <span class="calendar-icon"></span>
                        <span id="jornada-info">JORNADA 1 | 2025/2026</span>
                    </div>
                </div>
                <table class="resultados-table">
                    <thead>
                        <tr>
                            <th>FECHA</th>
                            <th>HORARIO</th>
                            <th>PARTIDO</th>
                        </tr>
                    </thead>
                    <tbody id="resultados-tbody">
                        <tr>
                            <td colspan="3" class="loading-row">
                                <p>Cargando resultados...</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;
}

function init() {
    console.log('Página de resultados cargada');
    setTimeout(() => {
        inicializarResultados();
    }, 100);
}

function inicializarResultados() {
    const jornadaSelect = document.getElementById('jornada-select');
    if (jornadaSelect) {
        // Cargar resultados de la jornada seleccionada
        cargarResultados(parseInt(jornadaSelect.value));
        
        // Event listener para cambio de jornada
        jornadaSelect.addEventListener('change', (e) => {
            const jornada = parseInt(e.target.value);
            cargarResultados(jornada);
            actualizarTituloJornada(jornada);
        });
    }
}

function actualizarTituloJornada(jornada) {
    const titulo = document.querySelector('.resultados-title');
    const jornadaInfo = document.getElementById('jornada-info');
    
    if (titulo) {
        titulo.textContent = `RESULTADOS DE LA JORNADA ${jornada} DE LALIGA EA SPORTS 2025/26`;
    }
    
    if (jornadaInfo) {
        jornadaInfo.textContent = `JORNADA ${jornada} | 2025/2026`;
    }
}

async function cargarResultados(jornada = 1) {
    const tbody = document.getElementById('resultados-tbody');
    if (!tbody) {
        setTimeout(() => cargarResultados(jornada), 100);
        return;
    }

    // Mostrar estado de carga
    tbody.innerHTML = `
        <tr>
            <td colspan="3" class="loading-row">
                <p>Cargando resultados de la jornada ${jornada}...</p>
            </td>
        </tr>
    `;

    try {
        // TODO: Aquí irá la llamada a la API cuando esté disponible
        // Por ahora, mostrar datos de ejemplo
        const resultados = await obtenerResultados(jornada);
        renderizarResultados(resultados);
    } catch (error) {
        console.error('Error al cargar resultados:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="error-row">
                    <p>Error al cargar los resultados. Por favor, intenta de nuevo.</p>
                </td>
            </tr>
        `;
    }
}

async function obtenerResultados(jornada) {
    // TODO: Implementar llamada a API
    // Por ahora retornar datos de ejemplo
    return generarDatosEjemplo(jornada);
}

function generarDatosEjemplo(jornada) {
    // Datos de ejemplo para mostrar la estructura
    // TODO: Reemplazar con llamada real a la API
    const equipos = [
        { nombre: 'GIRONA FC', logo: 'girona', resultado: '1-3', rival: 'RAYO VALLECANO' },
        { nombre: 'VILLARREAL CF', logo: 'villareal', resultado: '2-0', rival: 'REAL OVIEDO' },
        { nombre: 'RCD MALLORCA', logo: 'mallorca', resultado: '0-3', rival: 'FC BARCELONA' },
        { nombre: 'DEPORTIVO ALAVÉS', logo: 'alaves', resultado: '2-1', rival: 'LEVANTE UD' },
        { nombre: 'VALENCIA CF', logo: 'valencia', resultado: '1-1', rival: 'REAL SOCIEDAD' },
        { nombre: 'CELTA', logo: 'celta', resultado: '0-2', rival: 'GETAFE CF' },
        { nombre: 'ATHLETIC CLUB', logo: 'athletic', resultado: '3-2', rival: 'SEVILLA FC' },
        { nombre: 'RCD ESPANYOL DE BARCELONA', logo: 'espanyol', resultado: '2-1', rival: 'ATLÉTICO DE MADRID' },
        { nombre: 'ELCHE CF', logo: 'elche', resultado: '1-1', rival: 'REAL BETIS' },
        { nombre: 'REAL MADRID', logo: 'real_madrid', resultado: '1-0', rival: 'CA OSASUNA' }
    ];

    const arbitros = [
        'Javier Alberola Rojas',
        'Alejandro Muñiz Ruiz',
        'José María Sánchez Martínez',
        'Carlos del Cerro Grande',
        'Guillermo Cuadra Fernández',
        'Juan Martínez Munuera',
        'Ricardo de Burgos Bengoetxea',
        'Antonio Mateu Lahoz',
        'Pablo González Fuertes',
        'Santiago Jaime Latre'
    ];

    const fechas = [
        { fecha: 'VIE 15.08.2025', hora: '11:00' },
        { fecha: 'VIE 15.08.2025', hora: '13:30' },
        { fecha: 'SÁB 16.08.2025', hora: '09:00' },
        { fecha: 'SÁB 16.08.2025', hora: '11:00' },
        { fecha: 'SÁB 16.08.2025', hora: '13:30' },
        { fecha: 'DOM 17.08.2025', hora: '09:00' },
        { fecha: 'DOM 17.08.2025', hora: '11:00' },
        { fecha: 'DOM 17.08.2025', hora: '13:30' },
        { fecha: 'LUN 18.08.2025', hora: '11:00' },
        { fecha: 'MAR 19.08.2025', hora: '13:30' }
    ];

    return equipos.map((equipo, index) => ({
        fecha: fechas[index].fecha,
        horario: fechas[index].hora,
        local: equipo.nombre,
        visitante: equipo.rival,
        resultado: equipo.resultado,
        arbitro: arbitros[index] || 'Pendiente'
    }));
}

function renderizarResultados(resultados) {
    const tbody = document.getElementById('resultados-tbody');
    if (!tbody || !resultados || resultados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="empty-row">
                    <p>No hay resultados disponibles para esta jornada.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = resultados.map(partido => {
        const carpetaLocal = obtenerCarpetaEquipo(partido.local);
        const carpetaVisitante = obtenerCarpetaEquipo(partido.visitante);
        const rutaLogoLocal = carpetaLocal ? `images/${carpetaLocal}/escudo.png` : 'images/LaligaLogo.jpg';
        const rutaLogoVisitante = carpetaVisitante ? `images/${carpetaVisitante}/escudo.png` : 'images/LaligaLogo.jpg';
        
        return `
        <tr class="partido-row">
            <td class="fecha-col">${partido.fecha}</td>
            <td class="horario-col">${partido.horario}</td>
            <td class="partido-col">
                <div class="partido-info">
                    <div class="equipo-local">
                        <img src="${rutaLogoLocal}" 
                             alt="${partido.local}" 
                             class="equipo-logo"
                             onerror="this.onerror=null; this.src='images/LaligaLogo.jpg'">
                        <span class="equipo-nombre">${partido.local}</span>
                    </div>
                    <div class="resultado-score">${partido.resultado}</div>
                    <div class="equipo-visitante">
                        <img src="${rutaLogoVisitante}" 
                             alt="${partido.visitante}" 
                             class="equipo-logo"
                             onerror="this.onerror=null; this.src='images/LaligaLogo.jpg'">
                        <span class="equipo-nombre">${partido.visitante}</span>
                    </div>
                </div>
            </td>
        </tr>
        `;
    }).join('');
}

export default ResultadosPage;
export { init };

