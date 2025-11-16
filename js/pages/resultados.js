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
                <div class="resultados-fecha-rango" id="fecha-rango" style="color: white; font-size: 0.9rem; margin-top: 0.5rem;">
                    15 - 19 AGOSTO
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
                    <div id="admin-buttons" class="admin-buttons" style="display: none;">
                        <button id="btn-cargar-jornada" class="btn-admin">Cargar Partidos de Jornada</button>
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
    
    // Verificar si el usuario está logueado para mostrar botones de administración
    verificarUsuarioLogueado().then(() => {
        // Después de verificar, recargar resultados para mostrar botones de editar
        const jornadaActual = parseInt(document.getElementById('jornada-select').value);
        cargarResultados(jornadaActual);
    });
    
    // Configurar botón de cargar partidos de jornada
    const btnCargarJornada = document.getElementById('btn-cargar-jornada');
    if (btnCargarJornada) {
        btnCargarJornada.addEventListener('click', () => {
            const jornadaActual = parseInt(document.getElementById('jornada-select').value);
            cargarPartidosJornada(jornadaActual);
        });
    }
}


function actualizarTituloJornada(jornada) {
    const titulo = document.querySelector('.resultados-title');
    const jornadaInfo = document.getElementById('jornada-info');
    const fechaRango = document.getElementById('fecha-rango');
    
    if (titulo) {
        titulo.textContent = `RESULTADOS DE LA JORNADA ${jornada} DE LALIGA EA SPORTS 2025/26`;
    }
    
    if (jornadaInfo) {
        jornadaInfo.textContent = `JORNADA ${jornada} | 2025/2026`;
    }
    
    // Actualizar rango de fechas según la jornada
    if (fechaRango) {
        const rangosFechas = {
            1: '15 - 19 AGOSTO',
            2: '22 - 25 AGOSTO',
            3: '29 AGOSTO - 1 SEPTIEMBRE',
            // Agregar más rangos según sea necesario
        };
        fechaRango.textContent = rangosFechas[jornada] || '';
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
        const resultados = await obtenerResultados(jornada);
        resultadosActuales = resultados; // Guardar resultados actuales
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
    try {
        const response = await fetch(`api/partidos.php?jornada=${jornada}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.partidos) {
            // Convertir formato de la API al formato esperado por renderizarResultados
            return result.partidos.map(partido => ({
                id: partido.id,
                fecha: partido.fecha,
                horario: partido.horario,
                local: partido.local,
                visitante: partido.visitante,
                resultado: partido.resultado || '-',
                goles_local: partido.goles_local,
                goles_visitante: partido.goles_visitante
            }));
        } else {
            // Si no hay partidos en la base de datos, usar datos de ejemplo
            console.log('No hay partidos en la base de datos, usando datos de ejemplo');
            return generarDatosEjemplo(jornada);
        }
    } catch (error) {
        console.error('Error al obtener resultados:', error);
        // Si hay error, usar datos de ejemplo como fallback
        return generarDatosEjemplo(jornada);
    }
}

function generarDatosEjemplo(jornada) {
    // Datos de ejemplo para mostrar la estructura
    // TODO: Reemplazar con llamada real a la API
    
    // Datos específicos para jornada 2
    if (jornada === 2) {
        return [
            { fecha: 'VIE 22.08.2025', horario: '13:30', local: 'REAL BETIS', visitante: 'DEPORTIVO ALAVÉS', resultado: '1-0' },
            { fecha: 'SÁB 23.08.2025', horario: '09:00', local: 'RCD MALLORCA', visitante: 'CELTA', resultado: '1-1' },
            { fecha: 'SÁB 23.08.2025', horario: '11:30', local: 'ATLÉTICO DE MADRID', visitante: 'ELCHE CF', resultado: '1-1' },
            { fecha: 'SÁB 23.08.2025', horario: '13:30', local: 'LEVANTE UD', visitante: 'FC BARCELONA', resultado: '2-3' },
            { fecha: 'DOM 24.08.2025', horario: '09:00', local: 'CA OSASUNA', visitante: 'VALENCIA CF', resultado: '1-0' },
            { fecha: 'DOM 24.08.2025', horario: '11:30', local: 'REAL SOCIEDAD', visitante: 'RCD ESPANYOL DE BARCELONA', resultado: '2-2' },
            { fecha: 'DOM 24.08.2025', horario: '11:30', local: 'VILLARREAL CF', visitante: 'GIRONA FC', resultado: '5-0' },
            { fecha: 'DOM 24.08.2025', horario: '13:30', local: 'REAL OVIEDO', visitante: 'REAL MADRID', resultado: '0-3' },
            { fecha: 'LUN 25.08.2025', horario: '11:30', local: 'ATHLETIC CLUB', visitante: 'RAYO VALLECANO', resultado: '1-0' },
            { fecha: 'LUN 25.08.2025', horario: '13:30', local: 'SEVILLA FC', visitante: 'GETAFE CF', resultado: '1-2' }
        ];
    }
    
    // Datos específicos para jornada 3
    if (jornada === 3) {
        return [
            { fecha: 'VIE 29.08.2025', horario: '11:30', local: 'ELCHE CF', visitante: 'LEVANTE UD', resultado: '2-0' },
            { fecha: 'VIE 29.08.2025', horario: '13:30', local: 'VALENCIA CF', visitante: 'GETAFE CF', resultado: '3-0' },
            { fecha: 'SÁB 30.08.2025', horario: '09:00', local: 'DEPORTIVO ALAVÉS', visitante: 'ATLÉTICO DE MADRID', resultado: '1-1' },
            { fecha: 'SÁB 30.08.2025', horario: '11:00', local: 'REAL OVIEDO', visitante: 'REAL SOCIEDAD', resultado: '1-0' },
            { fecha: 'SÁB 30.08.2025', horario: '11:30', local: 'GIRONA FC', visitante: 'SEVILLA FC', resultado: '0-2' },
            { fecha: 'SÁB 30.08.2025', horario: '13:30', local: 'REAL MADRID', visitante: 'RCD MALLORCA', resultado: '2-1' },
            { fecha: 'DOM 31.08.2025', horario: '09:00', local: 'CELTA', visitante: 'VILLARREAL CF', resultado: '1-1' },
            { fecha: 'DOM 31.08.2025', horario: '11:00', local: 'REAL BETIS', visitante: 'ATHLETIC CLUB', resultado: '1-2' },
            { fecha: 'DOM 31.08.2025', horario: '11:30', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'CA OSASUNA', resultado: '1-0' },
            { fecha: 'DOM 31.08.2025', horario: '13:30', local: 'RAYO VALLECANO', visitante: 'FC BARCELONA', resultado: '1-1' }
        ];
    }
    
    // Datos para jornada 1 u otras jornadas
    
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
        resultado: equipo.resultado
    }));
}

let usuarioLogueado = false;
let resultadosActuales = []; // Almacenar resultados actuales para poder editarlos

async function verificarUsuarioLogueado() {
    try {
        const response = await fetch('api/check_session.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) return;
        
        const result = await response.json();
        const adminButtons = document.getElementById('admin-buttons');
        
        if (result.success && result.logged_in && adminButtons) {
            usuarioLogueado = true;
            adminButtons.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
    }
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
        
        // Botón de editar resultado solo si el usuario está logueado
        const botonEditar = usuarioLogueado && partido.id ? `
            <button class="btn-edit-resultado" onclick="editarResultado(${partido.id})" title="Editar Resultado">✏️</button>
        ` : '';
        
        // Si el resultado es '-' o está vacío y el usuario está logueado, mostrar botón para agregar resultado
        const mostrarBotonResultado = usuarioLogueado && partido.id && (!partido.resultado || partido.resultado === '-' || partido.resultado === '');
        
        return `
        <tr class="partido-row" data-partido-id="${partido.id || ''}">
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
                    <div class="resultado-score-wrapper">
                        <div class="resultado-score ${mostrarBotonResultado ? 'resultado-vacio' : ''}">
                            ${partido.resultado || '-'}
                        </div>
                        ${botonEditar}
                    </div>
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

// Lista completa de equipos
const listaEquipos = [
    'ATHLETIC CLUB', 'ATLÉTICO DE MADRID', 'CA OSASUNA', 'CELTA', 'DEPORTIVO ALAVÉS',
    'ELCHE CF', 'FC BARCELONA', 'GETAFE CF', 'GIRONA FC', 'LEVANTE UD',
    'RAYO VALLECANO', 'RCD ESPANYOL DE BARCELONA', 'RCD MALLORCA', 'REAL BETIS',
    'REAL MADRID', 'REAL OVIEDO', 'REAL SOCIEDAD', 'SEVILLA FC', 'VALENCIA CF', 'VILLARREAL CF'
];

async function cargarPartidosJornada(jornada) {
    if (!confirm(`¿Deseas cargar todos los partidos de la jornada ${jornada}?\n\nEsto creará los 10 partidos de la jornada si no existen.`)) {
        return;
    }
    
    // Partidos específicos por jornada
    let partidosJornada = [];
    
    if (jornada === 1) {
        // Jornada 1 según la imagen
        partidosJornada = [
            { fecha: '2025-08-15', horario: '11:00', local: 'GIRONA FC', visitante: 'RAYO VALLECANO', golesLocal: 1, golesVisitante: 3 },
            { fecha: '2025-08-15', horario: '13:30', local: 'VILLARREAL CF', visitante: 'REAL OVIEDO', golesLocal: 2, golesVisitante: 0 },
            { fecha: '2025-08-16', horario: '11:30', local: 'RCD MALLORCA', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 3 },
            { fecha: '2025-08-16', horario: '13:30', local: 'DEPORTIVO ALAVÉS', visitante: 'LEVANTE UD', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-08-16', horario: '13:30', local: 'VALENCIA CF', visitante: 'REAL SOCIEDAD', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-08-17', horario: '09:00', local: 'CELTA', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 2 },
            { fecha: '2025-08-17', horario: '11:30', local: 'ATHLETIC CLUB', visitante: 'SEVILLA FC', golesLocal: 3, golesVisitante: 2 },
            { fecha: '2025-08-17', horario: '13:30', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'ATLÉTICO DE MADRID', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-08-18', horario: '13:00', local: 'ELCHE CF', visitante: 'REAL BETIS', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-08-19', horario: '13:00', local: 'REAL MADRID', visitante: 'CA OSASUNA', golesLocal: 1, golesVisitante: 0 }
        ];
    } else if (jornada === 2) {
        // Jornada 2 según la imagen
        partidosJornada = [
            { fecha: '2025-08-22', horario: '13:30', local: 'REAL BETIS', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-08-23', horario: '09:00', local: 'RCD MALLORCA', visitante: 'CELTA', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-08-23', horario: '11:30', local: 'ATLÉTICO DE MADRID', visitante: 'ELCHE CF', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-08-23', horario: '13:30', local: 'LEVANTE UD', visitante: 'FC BARCELONA', golesLocal: 2, golesVisitante: 3 },
            { fecha: '2025-08-24', horario: '09:00', local: 'CA OSASUNA', visitante: 'VALENCIA CF', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-08-24', horario: '11:30', local: 'REAL SOCIEDAD', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 2, golesVisitante: 2 },
            { fecha: '2025-08-24', horario: '11:30', local: 'VILLARREAL CF', visitante: 'GIRONA FC', golesLocal: 5, golesVisitante: 0 },
            { fecha: '2025-08-24', horario: '13:30', local: 'REAL OVIEDO', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 3 },
            { fecha: '2025-08-25', horario: '11:30', local: 'ATHLETIC CLUB', visitante: 'RAYO VALLECANO', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-08-25', horario: '13:30', local: 'SEVILLA FC', visitante: 'GETAFE CF', golesLocal: 1, golesVisitante: 2 }
        ];
    } else if (jornada === 3) {
        // Jornada 3 según la imagen
        partidosJornada = [
            { fecha: '2025-08-29', horario: '11:30', local: 'ELCHE CF', visitante: 'LEVANTE UD', golesLocal: 2, golesVisitante: 0 },
            { fecha: '2025-08-29', horario: '13:30', local: 'VALENCIA CF', visitante: 'GETAFE CF', golesLocal: 3, golesVisitante: 0 },
            { fecha: '2025-08-30', horario: '09:00', local: 'DEPORTIVO ALAVÉS', visitante: 'ATLÉTICO DE MADRID', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-08-30', horario: '11:00', local: 'REAL OVIEDO', visitante: 'REAL SOCIEDAD', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-08-30', horario: '11:30', local: 'GIRONA FC', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 2 },
            { fecha: '2025-08-30', horario: '13:30', local: 'REAL MADRID', visitante: 'RCD MALLORCA', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-08-31', horario: '09:00', local: 'CELTA', visitante: 'VILLARREAL CF', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-08-31', horario: '11:00', local: 'REAL BETIS', visitante: 'ATHLETIC CLUB', golesLocal: 1, golesVisitante: 2 },
            { fecha: '2025-08-31', horario: '11:30', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'CA OSASUNA', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-08-31', horario: '13:30', local: 'RAYO VALLECANO', visitante: 'FC BARCELONA', golesLocal: 1, golesVisitante: 1 }
        ];
    } else if (jornada === 4) {
        // Jornada 4 según la imagen
        partidosJornada = [
            { fecha: '2025-09-12', horario: '13:00', local: 'SEVILLA FC', visitante: 'ELCHE CF', golesLocal: 2, golesVisitante: 2 },
            { fecha: '2025-09-13', horario: '06:00', local: 'GETAFE CF', visitante: 'REAL OVIEDO', golesLocal: 2, golesVisitante: 0 },
            { fecha: '2025-09-13', horario: '08:15', local: 'REAL SOCIEDAD', visitante: 'REAL MADRID', golesLocal: 1, golesVisitante: 2 },
            { fecha: '2025-09-13', horario: '10:30', local: 'ATHLETIC CLUB', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 1 },
            { fecha: '2025-09-13', horario: '13:00', local: 'ATLÉTICO DE MADRID', visitante: 'VILLARREAL CF', golesLocal: 2, golesVisitante: 0 },
            { fecha: '2025-09-14', horario: '06:00', local: 'CELTA', visitante: 'GIRONA FC', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-09-14', horario: '08:15', local: 'LEVANTE UD', visitante: 'REAL BETIS', golesLocal: 2, golesVisitante: 2 },
            { fecha: '2025-09-14', horario: '10:30', local: 'CA OSASUNA', visitante: 'RAYO VALLECANO', golesLocal: 2, golesVisitante: 0 },
            { fecha: '2025-09-14', horario: '13:00', local: 'FC BARCELONA', visitante: 'VALENCIA CF', golesLocal: 6, golesVisitante: 0 },
            { fecha: '2025-09-15', horario: '13:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'RCD MALLORCA', golesLocal: 3, golesVisitante: 2 }
        ];
    } else if (jornada === 5) {
        // Jornada 5 según la imagen
        partidosJornada = [
            { fecha: '2025-09-19', horario: '13:00', local: 'REAL BETIS', visitante: 'REAL SOCIEDAD', golesLocal: 3, golesVisitante: 1 },
            { fecha: '2025-09-20', horario: '06:00', local: 'GIRONA FC', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 4 },
            { fecha: '2025-09-20', horario: '08:15', local: 'REAL MADRID', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 2, golesVisitante: 0 },
            { fecha: '2025-09-20', horario: '10:30', local: 'DEPORTIVO ALAVÉS', visitante: 'SEVILLA FC', golesLocal: 1, golesVisitante: 2 },
            { fecha: '2025-09-20', horario: '10:30', local: 'VILLARREAL CF', visitante: 'CA OSASUNA', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-09-20', horario: '13:00', local: 'VALENCIA CF', visitante: 'ATHLETIC CLUB', golesLocal: 2, golesVisitante: 0 },
            { fecha: '2025-09-21', horario: '06:00', local: 'RAYO VALLECANO', visitante: 'CELTA', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-09-21', horario: '08:15', local: 'RCD MALLORCA', visitante: 'ATLÉTICO DE MADRID', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-09-21', horario: '10:30', local: 'ELCHE CF', visitante: 'REAL OVIEDO', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-09-21', horario: '13:00', local: 'FC BARCELONA', visitante: 'GETAFE CF', golesLocal: 3, golesVisitante: 0 }
        ];
    } else if (jornada === 6) {
        // Jornada 6 según la imagen
        partidosJornada = [
            { fecha: '2025-08-27', horario: '13:00', local: 'CELTA', visitante: 'REAL BETIS', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-09-23', horario: '11:00', local: 'ATHLETIC CLUB', visitante: 'GIRONA FC', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-09-23', horario: '11:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'VALENCIA CF', golesLocal: 2, golesVisitante: 2 },
            { fecha: '2025-09-23', horario: '13:30', local: 'LEVANTE UD', visitante: 'REAL MADRID', golesLocal: 1, golesVisitante: 4 },
            { fecha: '2025-09-23', horario: '13:30', local: 'SEVILLA FC', visitante: 'VILLARREAL CF', golesLocal: 1, golesVisitante: 2 },
            { fecha: '2025-09-24', horario: '11:00', local: 'GETAFE CF', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-09-24', horario: '13:30', local: 'ATLÉTICO DE MADRID', visitante: 'RAYO VALLECANO', golesLocal: 3, golesVisitante: 2 },
            { fecha: '2025-09-24', horario: '13:30', local: 'REAL SOCIEDAD', visitante: 'RCD MALLORCA', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-09-25', horario: '11:30', local: 'CA OSASUNA', visitante: 'ELCHE CF', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-09-25', horario: '13:30', local: 'REAL OVIEDO', visitante: 'FC BARCELONA', golesLocal: 1, golesVisitante: 3 }
        ];
    } else if (jornada === 7) {
        // Jornada 7 según la imagen
        partidosJornada = [
            { fecha: '2025-09-26', horario: '13:00', local: 'GIRONA FC', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-09-27', horario: '06:00', local: 'GETAFE CF', visitante: 'LEVANTE UD', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-09-27', horario: '08:15', local: 'ATLÉTICO DE MADRID', visitante: 'REAL MADRID', golesLocal: 5, golesVisitante: 2 },
            { fecha: '2025-09-27', horario: '10:30', local: 'RCD MALLORCA', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-09-27', horario: '13:00', local: 'VILLARREAL CF', visitante: 'ATHLETIC CLUB', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-09-28', horario: '06:00', local: 'RAYO VALLECANO', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 1 },
            { fecha: '2025-09-28', horario: '08:15', local: 'ELCHE CF', visitante: 'CELTA', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-09-28', horario: '10:30', local: 'FC BARCELONA', visitante: 'REAL SOCIEDAD', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-09-28', horario: '13:00', local: 'REAL BETIS', visitante: 'CA OSASUNA', golesLocal: 2, golesVisitante: 0 },
            { fecha: '2025-09-30', horario: '12:00', local: 'VALENCIA CF', visitante: 'REAL OVIEDO', golesLocal: 1, golesVisitante: 2 }
        ];
    } else if (jornada === 8) {
        // Jornada 8 según la imagen
        partidosJornada = [
            { fecha: '2025-10-03', horario: '13:00', local: 'CA OSASUNA', visitante: 'GETAFE CF', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-10-04', horario: '06:00', local: 'REAL OVIEDO', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 2 },
            { fecha: '2025-10-04', horario: '08:15', local: 'GIRONA FC', visitante: 'VALENCIA CF', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-10-04', horario: '10:30', local: 'ATHLETIC CLUB', visitante: 'RCD MALLORCA', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-10-04', horario: '13:00', local: 'REAL MADRID', visitante: 'VILLARREAL CF', golesLocal: 3, golesVisitante: 1 },
            { fecha: '2025-10-05', horario: '06:00', local: 'DEPORTIVO ALAVÉS', visitante: 'ELCHE CF', golesLocal: 3, golesVisitante: 1 },
            { fecha: '2025-10-05', horario: '08:15', local: 'SEVILLA FC', visitante: 'FC BARCELONA', golesLocal: 4, golesVisitante: 1 },
            { fecha: '2025-10-05', horario: '10:30', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'REAL BETIS', golesLocal: 1, golesVisitante: 2 },
            { fecha: '2025-10-05', horario: '10:30', local: 'REAL SOCIEDAD', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 1 },
            { fecha: '2025-10-05', horario: '13:00', local: 'CELTA', visitante: 'ATLÉTICO DE MADRID', golesLocal: 1, golesVisitante: 1 }
        ];
    } else if (jornada === 9) {
        // Jornada 9 según la imagen
        partidosJornada = [
            { fecha: '2025-10-17', horario: '13:00', local: 'REAL OVIEDO', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 2 },
            { fecha: '2025-10-18', horario: '06:00', local: 'SEVILLA FC', visitante: 'RCD MALLORCA', golesLocal: 1, golesVisitante: 3 },
            { fecha: '2025-10-18', horario: '08:15', local: 'FC BARCELONA', visitante: 'GIRONA FC', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-10-18', horario: '10:30', local: 'VILLARREAL CF', visitante: 'REAL BETIS', golesLocal: 2, golesVisitante: 2 },
            { fecha: '2025-10-18', horario: '13:00', local: 'ATLÉTICO DE MADRID', visitante: 'CA OSASUNA', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-10-19', horario: '06:00', local: 'ELCHE CF', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-10-19', horario: '08:15', local: 'CELTA', visitante: 'REAL SOCIEDAD', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-10-19', horario: '10:30', local: 'LEVANTE UD', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 3 },
            { fecha: '2025-10-19', horario: '13:00', local: 'GETAFE CF', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 1 },
            { fecha: '2025-10-20', horario: '13:00', local: 'DEPORTIVO ALAVÉS', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 }
        ];
    } else if (jornada === 10) {
        // Jornada 10 según la imagen
        partidosJornada = [
            { fecha: '2025-10-24', horario: '13:00', local: 'REAL SOCIEDAD', visitante: 'SEVILLA FC', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-10-25', horario: '06:00', local: 'GIRONA FC', visitante: 'REAL OVIEDO', golesLocal: 3, golesVisitante: 3 },
            { fecha: '2025-10-25', horario: '08:15', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'ELCHE CF', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-10-25', horario: '10:30', local: 'ATHLETIC CLUB', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 1 },
            { fecha: '2025-10-25', horario: '13:00', local: 'VALENCIA CF', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 2 },
            { fecha: '2025-10-26', horario: '07:00', local: 'RCD MALLORCA', visitante: 'LEVANTE UD', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-10-26', horario: '09:15', local: 'REAL MADRID', visitante: 'FC BARCELONA', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-10-26', horario: '11:30', local: 'CA OSASUNA', visitante: 'CELTA', golesLocal: 2, golesVisitante: 3 },
            { fecha: '2025-10-26', horario: '14:00', local: 'RAYO VALLECANO', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-10-27', horario: '14:00', local: 'REAL BETIS', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 2 }
        ];
    } else if (jornada === 11) {
        // Jornada 11 según la imagen
        partidosJornada = [
            { fecha: '2025-10-31', horario: '14:00', local: 'GETAFE CF', visitante: 'GIRONA FC', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-11-01', horario: '07:00', local: 'VILLARREAL CF', visitante: 'RAYO VALLECANO', golesLocal: 4, golesVisitante: 0 },
            { fecha: '2025-11-01', horario: '09:15', local: 'ATLÉTICO DE MADRID', visitante: 'SEVILLA FC', golesLocal: 3, golesVisitante: 0 },
            { fecha: '2025-11-01', horario: '11:30', local: 'REAL SOCIEDAD', visitante: 'ATHLETIC CLUB', golesLocal: 3, golesVisitante: 2 },
            { fecha: '2025-11-01', horario: '14:00', local: 'REAL MADRID', visitante: 'VALENCIA CF', golesLocal: 4, golesVisitante: 0 },
            { fecha: '2025-11-02', horario: '07:00', local: 'LEVANTE UD', visitante: 'CELTA', golesLocal: 1, golesVisitante: 2 },
            { fecha: '2025-11-02', horario: '09:15', local: 'DEPORTIVO ALAVÉS', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 2, golesVisitante: 1 },
            { fecha: '2025-11-02', horario: '11:30', local: 'FC BARCELONA', visitante: 'ELCHE CF', golesLocal: 3, golesVisitante: 1 },
            { fecha: '2025-11-02', horario: '14:00', local: 'REAL BETIS', visitante: 'RCD MALLORCA', golesLocal: 3, golesVisitante: 0 },
            { fecha: '2025-11-03', horario: '14:00', local: 'REAL OVIEDO', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 }
        ];
    } else if (jornada === 12) {
        // Jornada 12 según la imagen
        partidosJornada = [
            { fecha: '2025-11-07', horario: '14:00', local: 'ELCHE CF', visitante: 'REAL SOCIEDAD', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-11-08', horario: '07:00', local: 'GIRONA FC', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-11-08', horario: '09:15', local: 'SEVILLA FC', visitante: 'CA OSASUNA', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-11-08', horario: '11:30', local: 'ATLÉTICO DE MADRID', visitante: 'LEVANTE UD', golesLocal: 3, golesVisitante: 1 },
            { fecha: '2025-11-08', horario: '14:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 2 },
            { fecha: '2025-11-09', horario: '07:00', local: 'ATHLETIC CLUB', visitante: 'REAL OVIEDO', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-11-09', horario: '09:15', local: 'RAYO VALLECANO', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-09', horario: '11:30', local: 'VALENCIA CF', visitante: 'REAL BETIS', golesLocal: 1, golesVisitante: 1 },
            { fecha: '2025-11-09', horario: '11:30', local: 'RCD MALLORCA', visitante: 'GETAFE CF', golesLocal: 1, golesVisitante: 0 },
            { fecha: '2025-11-09', horario: '14:00', local: 'CELTA', visitante: 'FC BARCELONA', golesLocal: 2, golesVisitante: 4 }
        ];
    } else if (jornada === 13) {
        // Jornada 13 según la imagen (sin resultados, configurados con 0-0 para edición)
        partidosJornada = [
            { fecha: '2025-11-21', horario: '14:00', local: 'VALENCIA CF', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-22', horario: '07:00', local: 'DEPORTIVO ALAVÉS', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-22', horario: '09:15', local: 'FC BARCELONA', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-22', horario: '11:30', local: 'CA OSASUNA', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-22', horario: '14:00', local: 'VILLARREAL CF', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-23', horario: '07:00', local: 'REAL OVIEDO', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-23', horario: '09:15', local: 'REAL BETIS', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-23', horario: '11:30', local: 'GETAFE CF', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-23', horario: '14:00', local: 'ELCHE CF', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-24', horario: '14:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 }
        ];
    } else if (jornada === 14) {
        // Jornada 14 según la imagen (sin resultados, configurados con 0-0 para edición)
        partidosJornada = [
            { fecha: '2025-11-28', horario: '14:00', local: 'GETAFE CF', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-29', horario: '07:00', local: 'RCD MALLORCA', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-29', horario: '09:15', local: 'FC BARCELONA', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-29', horario: '11:30', local: 'LEVANTE UD', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-29', horario: '14:00', local: 'ATLÉTICO DE MADRID', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-30', horario: '07:00', local: 'REAL SOCIEDAD', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-30', horario: '09:15', local: 'SEVILLA FC', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-30', horario: '11:30', local: 'CELTA', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-11-30', horario: '14:00', local: 'GIRONA FC', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-01', horario: '14:00', local: 'RAYO VALLECANO', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 }
        ];
    } else if (jornada === 15) {
        // Jornada 15 según la imagen (sin resultados, configurados con 0-0 para edición)
        partidosJornada = [
            { fecha: '2025-12-05', horario: '14:00', local: 'REAL OVIEDO', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-06', horario: '07:00', local: 'VILLARREAL CF', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-06', horario: '09:15', local: 'DEPORTIVO ALAVÉS', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-06', horario: '11:30', local: 'REAL BETIS', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-06', horario: '14:00', local: 'ATHLETIC CLUB', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-07', horario: '07:00', local: 'ELCHE CF', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-07', horario: '09:15', local: 'VALENCIA CF', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-07', horario: '11:30', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-07', horario: '14:00', local: 'REAL MADRID', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-08', horario: '14:00', local: 'CA OSASUNA', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 }
        ];
    } else {
        // Para jornadas 16-38: no cargar partidos estándar, solo usar los que se proporcionen
        // Si la jornada no está definida, no se cargarán partidos
        alert(`La jornada ${jornada} aún no está configurada. Por favor, proporciona los partidos específicos para esta jornada.`);
        return; // No crear partidos si la jornada no está definida
    }
    
    try {
        // Obtener partidos existentes una sola vez
        let partidosExistentes = [];
        const responseCheck = await fetch(`api/partidos.php?jornada=${jornada}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (responseCheck.ok) {
            const resultCheck = await responseCheck.json();
            partidosExistentes = resultCheck.partidos || [];
        }
        
        let partidosCreados = 0;
        
        for (let i = 0; i < partidosJornada.length; i++) {
            const partido = partidosJornada[i];
            
            // Verificar si el partido ya existe
            const existe = partidosExistentes.some(p => 
                p.local === partido.local && p.visitante === partido.visitante
            );
            
            if (existe) {
                continue; // Ya existe, saltar
            }
            
            // Crear partido con el resultado especificado (o 0-0 si no hay)
            const response = await fetch('api/partidos.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    jornada: jornada,
                    fecha: partido.fecha,
                    horario: partido.horario,
                    equipo_local: partido.local,
                    equipo_visitante: partido.visitante,
                    goles_local: partido.golesLocal,
                    goles_visitante: partido.golesVisitante
                })
            });
            
            if (response.ok) {
                partidosCreados++;
            }
        }
        
        alert(`${partidosCreados} partidos creados para la jornada ${jornada}`);
        await cargarResultados(jornada);
        
    } catch (error) {
        console.error('Error al cargar partidos:', error);
        alert('Error al cargar los partidos de la jornada');
    }
}

function mostrarModalEditarResultado(partidoId, partido) {
    const modalHTML = `
        <div id="modal-resultado" class="modal-partido">
            <div class="modal-partido-content">
                <span class="modal-partido-close">&times;</span>
                <h2>Editar Resultado</h2>
                <form id="form-resultado">
                    <input type="hidden" id="resultado-partido-id" value="${partidoId}">
                    
                    <div class="form-group">
                        <label>${partido.local}</label>
                        <input type="number" id="resultado-goles-local" min="0" value="${partido.goles_local !== null && partido.goles_local !== undefined ? partido.goles_local : '0'}" required>
                    </div>
                    
                    <div style="text-align: center; font-size: 1.5rem; margin: 1rem 0;">VS</div>
                    
                    <div class="form-group">
                        <label>${partido.visitante}</label>
                        <input type="number" id="resultado-goles-visitante" min="0" value="${partido.goles_visitante !== null && partido.goles_visitante !== undefined ? partido.goles_visitante : '0'}" required>
                    </div>
                    
                    <div id="resultado-error" class="error-message"></div>
                    
                    <div class="form-buttons">
                        <button type="button" class="btn-cancel" onclick="cerrarModalPartido()">Cancelar</button>
                        <button type="submit" class="btn-submit">Guardar Resultado</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Eliminar modal anterior si existe
    const modalAnterior = document.getElementById('modal-resultado');
    if (modalAnterior) {
        modalAnterior.remove();
    }
    
    // Agregar modal al body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Event listeners
    const modal = document.getElementById('modal-resultado');
    const form = document.getElementById('form-resultado');
    const closeBtn = document.querySelector('.modal-resultado .modal-partido-close') || 
                     document.querySelector('#modal-resultado .modal-partido-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', cerrarModalPartido);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModalPartido();
        });
    }
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarResultado();
        });
    }
}

async function editarResultado(partidoId) {
    if (!partidoId) return;
    
    try {
        // Buscar partido en resultados actuales
        const partido = resultadosActuales.find(p => p.id === partidoId);
        
        if (!partido) {
            alert('No se encontró el partido');
            return;
        }
        
        mostrarModalEditarResultado(partidoId, partido);
    } catch (error) {
        console.error('Error al editar resultado:', error);
        alert('Error al cargar los datos del partido');
    }
}

async function guardarResultado() {
    const errorDiv = document.getElementById('resultado-error');
    if (errorDiv) {
        errorDiv.textContent = '';
    }
    
    const partidoId = document.getElementById('resultado-partido-id').value;
    const golesLocal = parseInt(document.getElementById('resultado-goles-local').value) || 0;
    const golesVisitante = parseInt(document.getElementById('resultado-goles-visitante').value) || 0;
    
    try {
        const response = await fetch('api/partidos.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                id: parseInt(partidoId),
                goles_local: golesLocal,
                goles_visitante: golesVisitante
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            cerrarModalPartido();
            const jornadaActual = parseInt(document.getElementById('jornada-select').value);
            await cargarResultados(jornadaActual);
        } else {
            if (errorDiv) {
                errorDiv.textContent = result.error || 'Error al guardar el resultado';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        if (errorDiv) {
            errorDiv.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
        }
    }
}

function cerrarModalPartido() {
    const modal = document.getElementById('modal-partido') || document.getElementById('modal-resultado');
    if (modal) {
        modal.remove();
    }
}



// Hacer funciones disponibles globalmente para onclick
window.editarResultado = editarResultado;
window.cerrarModalPartido = cerrarModalPartido;

export default ResultadosPage;
export { init };

