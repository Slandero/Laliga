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
                    <div class="jornada-select-wrapper">
                        <select id="jornada-select" class="jornada-select">
                            ${jornadasOptions}
                        </select>
                    </div>
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
        
        // Detectar si es un dispositivo móvil
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                         (window.innerWidth <= 768 && 'ontouchstart' in window);
        
        // Configurar comportamiento del select: mostrar 5 opciones con scroll
        jornadaSelect.size = 1; // Por defecto como dropdown
        
        let blurTimeout = null;
        let isChanging = false;
        
        // Guardar posición del scroll antes de abrir el select
        let scrollPositionBeforeSelect = 0;
        
        // En móviles, no cambiar el size del select para evitar problemas de selección
        if (!isMobile) {
            jornadaSelect.addEventListener('focus', () => {
                // Guardar posición del scroll antes de abrir
                scrollPositionBeforeSelect = window.pageYOffset || document.documentElement.scrollTop;
                jornadaSelect.size = 5; // Mostrar 5 opciones al abrir solo en desktop
                
                // Prevenir scroll automático
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: scrollPositionBeforeSelect,
                        behavior: 'instant'
                    });
                });
            });
            
            jornadaSelect.addEventListener('blur', () => {
                blurTimeout = setTimeout(() => {
                    if (!isChanging) {
                        jornadaSelect.size = 1; // Volver a dropdown al cerrar
                        // Restaurar posición del scroll
                        requestAnimationFrame(() => {
                            window.scrollTo({
                                top: scrollPositionBeforeSelect,
                                behavior: 'instant'
                            });
                        });
                    }
                }, 200);
            });
        } else {
            // En móviles, también prevenir scroll al abrir
            jornadaSelect.addEventListener('focus', () => {
                scrollPositionBeforeSelect = window.pageYOffset || document.documentElement.scrollTop;
            });
            
            jornadaSelect.addEventListener('blur', () => {
                // Restaurar posición del scroll en móviles
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: scrollPositionBeforeSelect,
                        behavior: 'instant'
                    });
                });
            });
        }
        
        // Función para limpiar todos los estilos de hover
        const limpiarEstilosHover = () => {
            const options = jornadaSelect.options;
            for (let i = 0; i < options.length; i++) {
                options[i].style.backgroundColor = '';
                options[i].style.color = '';
            }
        };
        
        // Aplicar estilo rojo cuando se mueve el mouse sobre el select abierto
        jornadaSelect.addEventListener('mousemove', (e) => {
            if (jornadaSelect.size > 1) {
                const rect = jornadaSelect.getBoundingClientRect();
                const mouseY = e.clientY - rect.top;
                const scrollTop = jornadaSelect.scrollTop || 0;
                const optionHeight = rect.height / Math.min(jornadaSelect.size, jornadaSelect.options.length);
                const hoveredIndex = Math.floor((mouseY + scrollTop) / optionHeight);
                
                if (hoveredIndex >= 0 && hoveredIndex < jornadaSelect.options.length) {
                    limpiarEstilosHover();
                    jornadaSelect.options[hoveredIndex].style.backgroundColor = '#FF4B44';
                    jornadaSelect.options[hoveredIndex].style.color = 'white';
                }
            }
        });
        
        // Limpiar estilos cuando el mouse sale del select
        jornadaSelect.addEventListener('mouseleave', () => {
            if (jornadaSelect.size > 1) {
                limpiarEstilosHover();
            }
        });
        
        // Aplicar estilo rojo cuando se selecciona con el teclado
        jornadaSelect.addEventListener('keydown', (e) => {
            if (jornadaSelect.size > 1) {
                setTimeout(() => {
                    const selectedIndex = jornadaSelect.selectedIndex;
                    const options = jornadaSelect.options;
                    limpiarEstilosHover();
                    if (selectedIndex >= 0 && selectedIndex < options.length) {
                        options[selectedIndex].style.backgroundColor = '#FF4B44';
                        options[selectedIndex].style.color = 'white';
                    }
                }, 10);
            }
        });
        
        // Limpiar estilos cuando se cierra el select (solo en desktop)
        if (!isMobile) {
            jornadaSelect.addEventListener('blur', () => {
                limpiarEstilosHover();
            });
        }
        
        // Event listener para cambio de jornada
        jornadaSelect.addEventListener('change', (e) => {
            isChanging = true;
            if (blurTimeout) {
                clearTimeout(blurTimeout);
            }
            
            const jornada = parseInt(e.target.value);
            
            // Prevenir scroll automático del select
            jornadaSelect.blur();
            
            // Cargar resultados y actualizar título
            // cargarResultados ya maneja el scroll internamente
            cargarResultados(jornada);
            actualizarTituloJornada(jornada);
            
            // Cerrar después de seleccionar solo en desktop
            if (!isMobile) {
                setTimeout(() => {
                    jornadaSelect.size = 1;
                    isChanging = false;
                }, 100);
            } else {
                isChanging = false;
            }
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

    // Guardar posición del scroll antes de cargar
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

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
        
        // Restaurar posición del scroll después de renderizar
        requestAnimationFrame(() => {
            window.scrollTo({
                top: scrollPosition,
                behavior: 'instant'
            });
        });
        
        return Promise.resolve();
    } catch (error) {
        console.error('Error al cargar resultados:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="3" class="error-row">
                    <p>Error al cargar los resultados. Por favor, intenta de nuevo.</p>
                </td>
            </tr>
        `;
        
        // Restaurar posición del scroll incluso si hay error
        requestAnimationFrame(() => {
            window.scrollTo({
                top: scrollPosition,
                behavior: 'instant'
            });
        });
        
        return Promise.reject(error);
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
        
        if (result.success && result.partidos && result.partidos.length > 0) {
            // Función auxiliar para formatear fecha (por si la API no la formateó correctamente)
            const formatearFecha = (fecha) => {
                if (!fecha) return '';
                // Si ya está formateada (contiene "DOM", "LUN", etc.), devolverla tal cual
                if (typeof fecha === 'string' && /^(DOM|LUN|MAR|MIÉ|JUE|VIE|SÁB)\s/.test(fecha)) {
                    return fecha;
                }
                // Si no está formateada, formatearla
                try {
                    let fechaStr = String(fecha);
                    // Extraer la fecha en formato YYYY-MM-DD
                    const fechaMatch = fechaStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
                    if (fechaMatch) {
                        const año = parseInt(fechaMatch[1], 10);
                        const mes = parseInt(fechaMatch[2], 10) - 1; // Los meses van de 0-11
                        const dia = parseInt(fechaMatch[3], 10);
                        const fechaObj = new Date(año, mes, dia);
                        const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
                        const diaSemana = dias[fechaObj.getDay()];
                        const diaFormateado = fechaObj.getDate().toString().padStart(2, '0');
                        const mesFormateado = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
                        const añoFormateado = fechaObj.getFullYear();
                        return `${diaSemana} ${diaFormateado}.${mesFormateado}.${añoFormateado}`;
                    }
                } catch (e) {
                    console.error('Error al formatear fecha en frontend:', e, fecha);
                }
                return String(fecha);
            };
            
            // Convertir formato de la API al formato esperado por renderizarResultados
            return result.partidos.map(partido => ({
                id: partido.id,
                fecha: formatearFecha(partido.fecha || partido.fecha_iso),
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

// Función auxiliar para obtener partidos por jornada (sin crear en BD)
function obtenerPartidosPorJornadaData(jornada) {
    const j = parseInt(jornada, 10);
    // Esta función devuelve los mismos datos que cargarPartidosJornada pero sin la lógica de creación
    // Para evitar duplicar código, usaré una referencia a la lógica existente
    return obtenerTodosPartidosJornada(j);
}

function generarDatosEjemplo(jornada) {
    // Función auxiliar para formatear fecha (usar parseo local para evitar problemas de zona horaria)
    const formatearFecha = (fechaISO) => {
        try {
            // Parsear la fecha como fecha local (YYYY-MM-DD)
            const partesFecha = String(fechaISO).split('-');
            if (partesFecha.length === 3) {
                const año = parseInt(partesFecha[0], 10);
                const mes = parseInt(partesFecha[1], 10) - 1; // Los meses van de 0-11
                const dia = parseInt(partesFecha[2], 10);
                const fechaObj = new Date(año, mes, dia);
                const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
                const diaSemana = dias[fechaObj.getDay()];
                const diaFormateado = fechaObj.getDate().toString().padStart(2, '0');
                const mesFormateado = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
                const añoFormateado = fechaObj.getFullYear();
                return `${diaSemana} ${diaFormateado}.${mesFormateado}.${añoFormateado}`;
            } else {
                return fechaISO;
            }
        } catch (e) {
            return fechaISO;
        }
    };
    
    // Función auxiliar para obtener el resultado formateado
    const obtenerResultado = (golesLocal, golesVisitante) => {
        if (golesLocal === null || golesLocal === undefined || 
            golesVisitante === null || golesVisitante === undefined) {
            return '-';
        }
        if (golesLocal === 0 && golesVisitante === 0) {
            return '-';
        }
        return `${golesLocal}-${golesVisitante}`;
    };
    
    // Obtener datos usando la función auxiliar
    const partidosJornada = obtenerPartidosPorJornadaData(jornada);
    
    if (!partidosJornada || partidosJornada.length === 0) {
        return [];
    }
    
    // Convertir al formato esperado por renderizarResultados
    return partidosJornada.map(partido => ({
        id: null, // No hay ID porque no están en la BD
        fecha: formatearFecha(partido.fecha),
        horario: partido.horario,
        local: partido.local,
        visitante: partido.visitante,
        resultado: obtenerResultado(partido.golesLocal, partido.golesVisitante),
        goles_local: partido.golesLocal !== undefined ? partido.golesLocal : null,
        goles_visitante: partido.golesVisitante !== undefined ? partido.golesVisitante : null
    }));
}

// Función auxiliar para obtener todos los datos de partidos de una jornada
// Esta función contiene TODOS los datos de partidos para jornadas 1-38
// Es reutilizada por generarDatosEjemplo y puede ser usada por cargarPartidosJornada
// Función auxiliar para obtener todos los partidos de una jornada (1-38)
// Esta función es reutilizada por cargarPartidosJornada y generarDatosEjemplo
function obtenerTodosPartidosJornada(jornada) {
    return obtenerDatosPartidosJornada(jornada);
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

// Variables globales para eventos
let eventosPartidos = {}; // Cache de eventos por partido

// Función para obtener el nombre de la tabla de jugadores de un equipo
function obtenerTablaJugadores(nombreEquipo) {
    const mapeo = {
        'ATHLETIC CLUB': 'athletic_club',
        'ATLÉTICO DE MADRID': 'atletico_de_madrid',
        'CA OSASUNA': 'ca_osasuna',
        'CELTA': 'celta_vigo',
        'CELTA DE VIGO': 'celta_vigo',
        'DEPORTIVO ALAVÉS': 'deportivo_alaves',
        'ELCHE CF': 'elche_cf',
        'FC BARCELONA': 'fc_barcelona',
        'GETAFE CF': 'getafe_cf',
        'GIRONA FC': 'girona_fc',
        'LEVANTE UD': 'levante_ud',
        'RAYO VALLECANO': 'rayo_vallecano',
        'RCD ESPANYOL DE BARCELONA': 'rcd_espanyol',
        'RCD MALLORCA': 'rcd_mallorca',
        'REAL BETIS': 'real_betis',
        'REAL MADRID': 'real_madrid',
        'REAL OVIEDO': 'real_oviedo',
        'REAL SOCIEDAD': 'real_sociedad',
        'SEVILLA FC': 'sevilla_fc',
        'VALENCIA CF': 'valencia_cf',
        'VILLARREAL CF': 'villarreal_cf'
    };
    return mapeo[nombreEquipo] || null;
}

// Función para toggle de eventos
async function toggleEventos(partidoId) {
    const eventosRow = document.getElementById(`eventos-row-${partidoId}`);
    if (!eventosRow) return;
    
    if (eventosRow.style.display === 'none') {
        eventosRow.style.display = 'table-row';
        await cargarEventos(partidoId);
    } else {
        eventosRow.style.display = 'none';
    }
}

// Función para cargar eventos de un partido
async function cargarEventos(partidoId) {
    const container = document.getElementById(`eventos-container-${partidoId}`);
    if (!container) return;
    
    container.innerHTML = '<div class="eventos-loading">Cargando eventos...</div>';
    
    try {
        const response = await fetch(`api/eventos_partido.php?partido_id=${partidoId}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Obtener el texto de la respuesta primero
        const text = await response.text();
        
        // Intentar parsear como JSON
        let result;
        try {
            result = JSON.parse(text);
        } catch (parseError) {
            console.error('Error al parsear JSON. Respuesta recibida:', text);
            container.innerHTML = `<div class="eventos-error">Error: La respuesta del servidor no es válida. Ver consola para detalles.</div>`;
            return;
        }
        
        if (result.success) {
            eventosPartidos[partidoId] = result.eventos;
            renderizarEventos(partidoId, result.eventos);
        } else {
            container.innerHTML = `<div class="eventos-error">Error: ${result.error || 'Error desconocido'}</div>`;
        }
    } catch (error) {
        console.error('Error al cargar eventos:', error);
        container.innerHTML = `<div class="eventos-error">Error al cargar eventos: ${error.message}</div>`;
    }
}

// Función para renderizar la línea de tiempo de eventos
function renderizarEventos(partidoId, eventos) {
    const container = document.getElementById(`eventos-container-${partidoId}`);
    if (!container) return;
    
    // Obtener información del partido
    const partidoRow = document.querySelector(`tr[data-partido-id="${partidoId}"]`);
    if (!partidoRow) return;
    
    const partido = resultadosActuales.find(p => p.id === partidoId);
    if (!partido) return;
    
    const carpetaLocal = obtenerCarpetaEquipo(partido.local);
    const carpetaVisitante = obtenerCarpetaEquipo(partido.visitante);
    const rutaLogoLocal = carpetaLocal ? `images/${carpetaLocal}/escudo.png` : 'images/LaligaLogo.jpg';
    const rutaLogoVisitante = carpetaVisitante ? `images/${carpetaVisitante}/escudo.png` : 'images/LaligaLogo.jpg';
    
    // Función auxiliar para convertir minuto a número para ordenar (definida antes de usarse)
    const convertirMinutoANumero = (minuto) => {
        if (typeof minuto === 'number') return minuto;
        const str = String(minuto);
        if (str.includes('+')) {
            const partes = str.split('+');
            return parseInt(partes[0]) + (parseInt(partes[1]) / 100); // Ej: 90+3 = 90.03
        }
        return parseInt(str) || 0;
    };
    
    // Separar eventos por equipo y fin_partido
    const eventosLocal = eventos.filter(e => e.equipo === 'local' && e.tipo_evento !== 'fin_partido').sort((a, b) => {
        return convertirMinutoANumero(a.minuto) - convertirMinutoANumero(b.minuto);
    });
    const eventosVisitante = eventos.filter(e => e.equipo === 'visitante' && e.tipo_evento !== 'fin_partido').sort((a, b) => {
        return convertirMinutoANumero(a.minuto) - convertirMinutoANumero(b.minuto);
    });
    const eventosFinPartido = eventos.filter(e => e.tipo_evento === 'fin_partido').sort((a, b) => {
        return convertirMinutoANumero(a.minuto) - convertirMinutoANumero(b.minuto);
    });
    
    // Obtener todos los minutos únicos y ordenarlos (usando la función ya definida arriba)
    const todosMinutos = [...new Set(eventos.map(e => e.minuto))].sort((a, b) => {
        return convertirMinutoANumero(a) - convertirMinutoANumero(b);
    });
    
    // Botón para agregar evento (solo si está logueado)
    const botonAgregar = usuarioLogueado ? `
        <div class="eventos-header">
            <button class="btn-agregar-evento" onclick="mostrarModalAgregarEvento(${partidoId})">
                + Agregar Evento
            </button>
        </div>
    ` : '';
    
    let html = `
        ${botonAgregar}
        <div class="timeline-container">
            <div class="timeline-line"></div>
            <div class="timeline-events">
                <div class="timeline-team timeline-team-local">
                    <div class="team-logo-container">
                        <img src="${rutaLogoLocal}" alt="${partido.local}" class="team-logo-timeline" onerror="this.onerror=null; this.src='images/LaligaLogo.jpg'">
                    </div>
                    <div class="team-events">
                        ${eventosLocal.map(evento => renderizarEvento(evento, 'local', partidoId, todosMinutos)).join('')}
                    </div>
                </div>
                <div class="timeline-minutes">
                    ${todosMinutos.map(min => `<div class="timeline-minute" style="left: ${calcularPosicionMinuto(min, todosMinutos)}%">${min}'</div>`).join('')}
                </div>
                ${eventosFinPartido.length > 0 ? `
                <div class="timeline-team timeline-team-center">
                    <div class="team-events">
                        ${eventosFinPartido.map(evento => renderizarEvento(evento, 'center', partidoId, todosMinutos)).join('')}
                    </div>
                </div>
                ` : ''}
                <div class="timeline-team timeline-team-visitante">
                    <div class="team-logo-container">
                        <img src="${rutaLogoVisitante}" alt="${partido.visitante}" class="team-logo-timeline" onerror="this.onerror=null; this.src='images/LaligaLogo.jpg'">
                    </div>
                    <div class="team-events">
                        ${eventosVisitante.map(evento => renderizarEvento(evento, 'visitante', partidoId, todosMinutos)).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Agregar event listeners para mover eventos al centro con click
    setTimeout(() => {
        const eventoItems = container.querySelectorAll('.evento-item');
        eventoItems.forEach(item => {
            // Guardar posición original desde el atributo data o el estilo actual
            // IMPORTANTE: Guardar ANTES de cualquier modificación
            const originalLeft = item.getAttribute('data-original-left') || item.style.left || '';
            
            // Detectar si es local o visitante para guardar top/bottom correcto
            const parentTeam = item.closest('.timeline-team-local, .timeline-team-visitante, .timeline-team-center');
            let originalTop = '';
            let originalBottom = '';
            
            if (parentTeam) {
                if (parentTeam.classList.contains('timeline-team-local')) {
                    originalBottom = '0';
                } else if (parentTeam.classList.contains('timeline-team-visitante')) {
                    originalTop = '0';
                }
            } else {
                // Si no se encuentra el parent, usar los valores del estilo
                originalTop = item.style.top || '';
                originalBottom = item.style.bottom || '';
            }
            
            const originalPosition = 'absolute';
            const originalTransform = 'translateX(-50%)';
            const originalZIndex = '';
            
            // Guardar en dataset para uso posterior
            item.dataset.originalLeft = originalLeft;
            item.dataset.originalTop = originalTop;
            item.dataset.originalBottom = originalBottom;
            item.dataset.originalPosition = originalPosition;
            item.dataset.originalTransform = originalTransform;
            item.dataset.originalZIndex = originalZIndex;
            item.dataset.isCentered = 'false';
            
            item.addEventListener('click', function(e) {
                // Evitar que el click se propague (especialmente para el botón de eliminar)
                if (e.target.classList.contains('btn-eliminar-evento')) {
                    return;
                }
                
                e.stopPropagation();
                
                const isCentered = this.dataset.isCentered === 'true';
                
                if (!isCentered) {
                    // Guardar dimensiones originales antes de cambiar
                    const originalWidth = this.style.width || '';
                    const originalHeight = this.style.height || '';
                    const originalMaxWidth = this.style.maxWidth || '';
                    const originalMaxHeight = this.style.maxHeight || '';
                    
                    this.dataset.originalWidth = originalWidth;
                    this.dataset.originalHeight = originalHeight;
                    this.dataset.originalMaxWidth = originalMaxWidth;
                    this.dataset.originalMaxHeight = originalMaxHeight;
                    
                    // Calcular posición centrada en la ventana
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;
                    const itemRect = this.getBoundingClientRect();
                    const itemWidth = itemRect.width;
                    const itemHeight = itemRect.height;
                    
                    // Posición centrada
                    const centerX = (viewportWidth / 2) - (itemWidth / 2);
                    const centerY = (viewportHeight / 2) - (itemHeight / 2);
                    
                    // Aplicar transformación
                    this.style.position = 'fixed';
                    this.style.left = centerX + 'px';
                    this.style.top = centerY + 'px';
                    this.style.bottom = '';
                    this.style.transform = 'translate(0, 0)';
                    this.style.zIndex = '1000';
                    this.style.width = 'auto';
                    this.style.height = 'auto';
                    this.style.maxHeight = 'none';
                    this.classList.add('evento-hover-center');
                    this.dataset.isCentered = 'true';
                } else {
                    // Restaurar posición original - usar los valores guardados
                    const origLeft = this.dataset.originalLeft || this.getAttribute('data-original-left') || '';
                    const origTop = this.dataset.originalTop || '';
                    const origBottom = this.dataset.originalBottom || '';
                    
                    // Asegurarse de que left tenga el formato correcto (porcentaje)
                    const leftValue = origLeft.includes('%') ? origLeft : origLeft + '%';
                    
                    // Restaurar todos los estilos
                    this.style.position = 'absolute';
                    this.style.left = leftValue;
                    if (origTop) {
                        this.style.top = origTop;
                        this.style.bottom = '';
                    } else if (origBottom) {
                        this.style.bottom = origBottom;
                        this.style.top = '';
                    } else {
                        this.style.top = '';
                        this.style.bottom = '';
                    }
                    this.style.transform = 'translateX(-50%)';
                    this.style.zIndex = '';
                    
                    // Restaurar dimensiones originales
                    this.style.width = this.dataset.originalWidth || '';
                    this.style.height = this.dataset.originalHeight || '';
                    this.style.maxWidth = this.dataset.originalMaxWidth || '';
                    this.style.maxHeight = this.dataset.originalMaxHeight || '';
                    
                    this.classList.remove('evento-hover-center');
                    this.dataset.isCentered = 'false';
                    
                    // Forzar reflow para asegurar que los cambios se apliquen
                    this.offsetHeight;
                }
            });
        });
    }, 0);
}

// Función auxiliar para convertir minuto a número
function convertirMinutoANumero(minuto) {
    if (typeof minuto === 'number') return minuto;
    const str = String(minuto);
    if (str.includes('+')) {
        const partes = str.split('+');
        return parseInt(partes[0]) + (parseInt(partes[1]) / 100); // Ej: 90+3 = 90.03
    }
    return parseInt(str) || 0;
}

// Función para calcular la posición de un minuto en la línea de tiempo
function calcularPosicionMinuto(minuto, todosMinutos) {
    if (todosMinutos.length === 0) return 0;
    const minutoNum = convertirMinutoANumero(minuto);
    const minutosNumeros = todosMinutos.map(m => convertirMinutoANumero(m));
    const min = Math.min(...minutosNumeros);
    const max = Math.max(...minutosNumeros);
    if (max === min) return 50;
    return ((minutoNum - min) / (max - min)) * 100;
}

// Función para renderizar un evento individual
function renderizarEvento(evento, equipo, partidoId, todosMinutos) {
    const posicion = calcularPosicionMinuto(evento.minuto, todosMinutos);
    let icono = '';
    let clase = '';
    
    switch (evento.tipo_evento) {
        case 'gol':
            icono = '⚽';
            clase = 'evento-gol';
            break;
        case 'asistencia':
            icono = '🎯';
            clase = 'evento-asistencia';
            break;
        case 'tarjeta_amarilla':
            icono = '🟨';
            clase = 'evento-tarjeta-amarilla';
            break;
        case 'tarjeta_roja':
            icono = '🟥';
            clase = 'evento-tarjeta-roja';
            break;
        case 'sustitucion':
            icono = '🔄';
            clase = 'evento-sustitucion';
            break;
        case 'fin_partido':
            icono = '🏁';
            clase = 'evento-fin-partido';
            break;
    }
    
    const botonEliminar = usuarioLogueado ? `
        <button class="btn-eliminar-evento" onclick="eliminarEvento(${evento.id}, ${partidoId})" title="Eliminar">×</button>
    ` : '';
    
    // Función auxiliar para formatear nombre con dorsal
    const formatearNombreConDorsal = (nombre, dorsal) => {
        if (!nombre) return '';
        if (dorsal) {
            return `${dorsal}. ${nombre}`;
        }
        return nombre;
    };
    
    let contenido = '';
    if (evento.tipo_evento === 'gol') {
        let tipoGol = '';
        if (evento.es_penal) {
            tipoGol = '<div class="evento-tipo-gol">(Penal)</div>';
        } else if (evento.es_autogol) {
            tipoGol = '<div class="evento-tipo-gol">(Autogol)</div>';
        }
        
        const nombreJugador = formatearNombreConDorsal(evento.jugador_nombre, evento.jugador_dorsal);
        const nombreAsistencia = evento.jugador_asistencia_nombre && !evento.es_penal && !evento.es_autogol 
            ? formatearNombreConDorsal(evento.jugador_asistencia_nombre, evento.jugador_asistencia_dorsal)
            : null;
        
        contenido = `
            <div class="evento-nombre">${nombreJugador}</div>
            ${tipoGol}
            ${nombreAsistencia ? `<div class="evento-asistencia-text">Asistencia: ${nombreAsistencia}</div>` : ''}
        `;
    } else if (evento.tipo_evento === 'sustitucion') {
        const nombreSale = formatearNombreConDorsal(evento.jugador_sale_nombre, evento.jugador_sale_dorsal);
        const nombreEntra = formatearNombreConDorsal(evento.jugador_entra_nombre, evento.jugador_entra_dorsal);
        contenido = `
            <div class="evento-nombre">${nombreSale}</div>
            <div class="evento-sustitucion-text">→ ${nombreEntra}</div>
        `;
    } else if (evento.tipo_evento === 'fin_partido') {
        contenido = `<div class="evento-nombre">Fin del Partido</div>`;
    } else {
        const nombreJugador = formatearNombreConDorsal(evento.jugador_nombre, evento.jugador_dorsal);
        contenido = `<div class="evento-nombre">${nombreJugador}</div>`;
    }
    
    return `
        <div class="evento-item ${clase}" data-event-id="${evento.id}" data-original-left="${posicion}" style="left: ${posicion}%">
            <div class="evento-icono">${icono}</div>
            <div class="evento-contenido">
                ${contenido}
                <div class="evento-minuto">${evento.minuto}'</div>
            </div>
            ${botonEliminar}
        </div>
    `;
}

// Función para mostrar modal de agregar evento
async function mostrarModalAgregarEvento(partidoId) {
    const partido = resultadosActuales.find(p => p.id === partidoId);
    if (!partido) return;
    
    // Obtener jugadores de ambos equipos
    const tablaLocal = obtenerTablaJugadores(partido.local);
    const tablaVisitante = obtenerTablaJugadores(partido.visitante);
    
    let jugadoresLocal = [];
    let jugadoresVisitante = [];
    
    try {
        if (tablaLocal) {
            const response = await fetch(`api/jugadores.php?tabla=${tablaLocal}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    jugadoresLocal = result.data || [];
                }
            }
        }
        
        if (tablaVisitante) {
            const response = await fetch(`api/jugadores.php?tabla=${tablaVisitante}`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    jugadoresVisitante = result.data || [];
                }
            }
        }
    } catch (error) {
        console.error('Error al cargar jugadores:', error);
    }
    
    const modalHTML = `
        <div id="modal-evento" class="modal-partido">
            <div class="modal-partido-content modal-evento-content">
                <span class="modal-partido-close" onclick="cerrarModalEvento()">&times;</span>
                <h2>Agregar Evento</h2>
                <form id="form-evento">
                    <input type="hidden" id="evento-partido-id" value="${partidoId}">
                    
                    <div class="form-group">
                        <label>Tipo de Evento *</label>
                        <select id="evento-tipo" required onchange="cambiarTipoEvento()">
                            <option value="">Seleccione...</option>
                            <option value="gol">Gol</option>
                            <option value="tarjeta_amarilla">Tarjeta Amarilla</option>
                            <option value="tarjeta_roja">Tarjeta Roja</option>
                            <option value="sustitucion">Sustitución</option>
                            <option value="fin_partido">Fin del Partido</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="grupo-equipo">
                        <label>Equipo *</label>
                        <select id="evento-equipo" required onchange="cambiarEquipoEvento()">
                            <option value="">Seleccione...</option>
                            <option value="local">${partido.local}</option>
                            <option value="visitante">${partido.visitante}</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Minuto *</label>
                        <input type="text" id="evento-minuto" pattern="[0-9]+(\+[0-9]+)?" placeholder="Ej: 45 o 90+3" required>
                        <small style="color: #666; font-size: 0.75rem;">Puedes usar el signo + para tiempo añadido (ej: 90+3)</small>
                    </div>
                    
                    <div class="form-group" id="grupo-jugador">
                        <label id="label-jugador">Jugador *</label>
                        <select id="evento-jugador" required>
                            <option value="">Seleccione jugador...</option>
                        </select>
                        <input type="text" id="evento-jugador-nombre" placeholder="O escribir nombre manualmente" style="margin-top: 0.5rem;">
                    </div>
                    
                    <div class="form-group" id="grupo-opciones-gol" style="display: none;">
                        <label class="checkbox-label">
                            <input type="checkbox" id="evento-es-penal" onchange="cambiarOpcionesGol()">
                            <span>Es Penal</span>
                        </label>
                        <label class="checkbox-label" style="margin-left: 1rem;">
                            <input type="checkbox" id="evento-es-autogol" onchange="cambiarOpcionesGol()">
                            <span>Es Autogol</span>
                        </label>
                    </div>
                    
                    <div class="form-group" id="grupo-asistencia" style="display: none;">
                        <label>Asistencia</label>
                        <select id="evento-asistencia">
                            <option value="">Sin asistencia</option>
                        </select>
                        <input type="text" id="evento-asistencia-nombre" placeholder="O escribir nombre manualmente" style="margin-top: 0.5rem;">
                    </div>
                    
                    <div class="form-group" id="grupo-sustitucion" style="display: none;">
                        <label>Jugador Sale</label>
                        <select id="evento-jugador-sale">
                            <option value="">Seleccione...</option>
                        </select>
                        <input type="text" id="evento-jugador-sale-nombre" placeholder="O escribir nombre manualmente" style="margin-top: 0.5rem;">
                        
                        <label style="margin-top: 1rem;">Jugador Entra</label>
                        <select id="evento-jugador-entra">
                            <option value="">Seleccione...</option>
                        </select>
                        <input type="text" id="evento-jugador-entra-nombre" placeholder="O escribir nombre manualmente" style="margin-top: 0.5rem;">
                    </div>
                    
                    <div id="evento-error" class="error-message"></div>
                    
                    <div class="form-buttons">
                        <button type="button" class="btn-cancel" onclick="cerrarModalEvento()">Cancelar</button>
                        <button type="submit" class="btn-submit">Guardar Evento</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Eliminar modal anterior si existe
    const modalAnterior = document.getElementById('modal-evento');
    if (modalAnterior) {
        modalAnterior.remove();
    }
    
    // Agregar modal al body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Guardar jugadores para uso en el modal
    window.jugadoresModal = {
        local: jugadoresLocal,
        visitante: jugadoresVisitante,
        partido: partido
    };
    
    // Event listeners
    const modal = document.getElementById('modal-evento');
    const form = document.getElementById('form-evento');
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModalEvento();
        });
    }
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await guardarEvento();
        });
    }
    
    // Inicializar selectores de jugadores
    cambiarEquipoEvento();
    
    // Asegurarse de que los campos ocultos no tengan required
    const grupoJugador = document.getElementById('grupo-jugador');
    const grupoSustitucion = document.getElementById('grupo-sustitucion');
    const selectJugador = document.getElementById('evento-jugador');
    
    if (grupoJugador && grupoJugador.style.display === 'none') {
        if (selectJugador) selectJugador.removeAttribute('required');
    }
    
    if (grupoSustitucion && grupoSustitucion.style.display === 'none') {
        // Los campos de sustitución no deberían tener required inicialmente
    }
}

// Función para cambiar el equipo en el modal
function cambiarEquipoEvento() {
    const equipo = document.getElementById('evento-equipo').value;
    const selectJugador = document.getElementById('evento-jugador');
    const selectAsistencia = document.getElementById('evento-asistencia');
    const selectSale = document.getElementById('evento-jugador-sale');
    const selectEntra = document.getElementById('evento-jugador-entra');
    
    if (!window.jugadoresModal) return;
    
    const jugadores = equipo === 'local' ? window.jugadoresModal.local : window.jugadoresModal.visitante;
    
    // Función auxiliar para obtener el dorsal
    const obtenerDorsal = (jugador) => {
        return jugador.dorsal || jugador.Dorsal || jugador.numero || jugador.Numero || jugador.num || jugador.Num || '';
    };
    
    // Limpiar y poblar selectores
    [selectJugador, selectAsistencia, selectSale, selectEntra].forEach(select => {
        if (select) {
            select.innerHTML = '<option value="">Seleccione...</option>';
            jugadores.forEach(jugador => {
                const nombre = jugador.nombre || jugador.Nombre || jugador.name || '';
                const id = jugador.id || jugador.ID || jugador.dorsal || jugador.Dorsal || '';
                const dorsal = obtenerDorsal(jugador);
                
                if (nombre) {
                    const option = document.createElement('option');
                    option.value = id;
                    // Guardar dorsal como atributo data
                    option.setAttribute('data-dorsal', dorsal);
                    // Mostrar nombre con dorsal si existe
                    option.textContent = dorsal ? `${dorsal}. ${nombre}` : nombre;
                    select.appendChild(option);
                }
            });
        }
    });
}

// Función para cambiar el tipo de evento
function cambiarTipoEvento() {
    const tipo = document.getElementById('evento-tipo').value;
    const grupoJugador = document.getElementById('grupo-jugador');
    const grupoEquipo = document.getElementById('grupo-equipo');
    const grupoOpcionesGol = document.getElementById('grupo-opciones-gol');
    const grupoAsistencia = document.getElementById('grupo-asistencia');
    const grupoSustitucion = document.getElementById('grupo-sustitucion');
    const labelJugador = document.getElementById('label-jugador');
    const checkboxPenal = document.getElementById('evento-es-penal');
    const checkboxAutogol = document.getElementById('evento-es-autogol');
    const selectEquipo = document.getElementById('evento-equipo');
    const selectJugador = document.getElementById('evento-jugador');
    
    // Si es fin_partido, ocultar todos los campos excepto minuto
    if (tipo === 'fin_partido') {
        if (grupoJugador) grupoJugador.style.display = 'none';
        if (grupoEquipo) grupoEquipo.style.display = 'none';
        if (grupoOpcionesGol) grupoOpcionesGol.style.display = 'none';
        if (grupoAsistencia) grupoAsistencia.style.display = 'none';
        if (grupoSustitucion) grupoSustitucion.style.display = 'none';
        if (selectEquipo) selectEquipo.removeAttribute('required');
        if (selectJugador) selectJugador.removeAttribute('required');
    } else {
        // Mostrar/ocultar grupos según el tipo de evento
        if (grupoJugador) grupoJugador.style.display = tipo === 'sustitucion' ? 'none' : 'block';
        if (grupoEquipo) grupoEquipo.style.display = 'block';
        if (grupoOpcionesGol) grupoOpcionesGol.style.display = tipo === 'gol' ? 'block' : 'none';
        if (grupoAsistencia) grupoAsistencia.style.display = tipo === 'gol' ? 'block' : 'none';
        if (grupoSustitucion) grupoSustitucion.style.display = tipo === 'sustitucion' ? 'block' : 'none';
        
        // Manejar atributo required según el tipo de evento
        if (selectEquipo) {
            if (tipo === 'sustitucion' || tipo === 'gol' || tipo === 'tarjeta_amarilla' || tipo === 'tarjeta_roja') {
                selectEquipo.setAttribute('required', 'required');
            } else {
                selectEquipo.removeAttribute('required');
            }
        }
        
        if (selectJugador) {
            if (tipo === 'sustitucion' || tipo === 'fin_partido') {
                selectJugador.removeAttribute('required');
            } else {
                selectJugador.setAttribute('required', 'required');
            }
        }
        
        // Si es sustitución y hay un equipo seleccionado, poblar los selects
        if (tipo === 'sustitucion') {
            const equipoSelect = document.getElementById('evento-equipo');
            if (equipoSelect && equipoSelect.value) {
                cambiarEquipoEvento();
            }
        }
    }
    
    // Resetear checkboxes
    if (checkboxPenal) checkboxPenal.checked = false;
    if (checkboxAutogol) checkboxAutogol.checked = false;
    
    // Actualizar visibilidad de asistencia
    cambiarOpcionesGol();
    
    if (labelJugador) {
        labelJugador.textContent = 'Jugador *';
    }
}

// Función para cambiar opciones de gol (penal/autogol)
function cambiarOpcionesGol() {
    const checkboxPenal = document.getElementById('evento-es-penal');
    const checkboxAutogol = document.getElementById('evento-es-autogol');
    const grupoAsistencia = document.getElementById('grupo-asistencia');
    const tipoEvento = document.getElementById('evento-tipo') ? document.getElementById('evento-tipo').value : '';
    
    if (!checkboxPenal || !checkboxAutogol || !grupoAsistencia) return;
    
    // Si no es gol, no mostrar asistencia
    if (tipoEvento !== 'gol') {
        grupoAsistencia.style.display = 'none';
        return;
    }
    
    const esPenal = checkboxPenal.checked;
    const esAutogol = checkboxAutogol.checked;
    
    // Si es penal o autogol, ocultar asistencia
    if (esPenal || esAutogol) {
        grupoAsistencia.style.display = 'none';
        // Limpiar campos de asistencia
        const selectAsistencia = document.getElementById('evento-asistencia');
        const inputAsistencia = document.getElementById('evento-asistencia-nombre');
        if (selectAsistencia) selectAsistencia.value = '';
        if (inputAsistencia) inputAsistencia.value = '';
    } else {
        // Solo mostrar asistencia si es gol y no es penal ni autogol
        grupoAsistencia.style.display = 'block';
    }
    
    // No permitir que ambos estén marcados a la vez
    if (esPenal && esAutogol) {
        checkboxAutogol.checked = false;
    }
}

// Función para guardar evento
async function guardarEvento() {
    const errorDiv = document.getElementById('evento-error');
    if (errorDiv) {
        errorDiv.textContent = '';
    }
    
    // Remover required de campos ocultos antes de validar
    const grupoJugador = document.getElementById('grupo-jugador');
    const grupoSustitucion = document.getElementById('grupo-sustitucion');
    const selectJugador = document.getElementById('evento-jugador');
    
    if (grupoJugador && grupoJugador.style.display === 'none' && selectJugador) {
        selectJugador.removeAttribute('required');
    }
    
    const partidoId = parseInt(document.getElementById('evento-partido-id').value);
    const tipoEvento = document.getElementById('evento-tipo').value;
    const equipoSelect = document.getElementById('evento-equipo');
    const equipo = tipoEvento === 'fin_partido' ? 'local' : (equipoSelect ? equipoSelect.value : '');
    const minutoInput = document.getElementById('evento-minuto').value.trim();
    
    // Validar formato de minuto (número o número+número)
    if (!/^\d+(\+\d+)?$/.test(minutoInput)) {
        if (errorDiv) {
            errorDiv.textContent = 'El minuto debe ser un número o número+número (ej: 45 o 90+3)';
        }
        return;
    }
    
    const minuto = minutoInput;
    const jugadorSelect = document.getElementById('evento-jugador');
    const jugadorNombreInput = document.getElementById('evento-jugador-nombre');
    const asistenciaSelect = document.getElementById('evento-asistencia');
    const asistenciaNombreInput = document.getElementById('evento-asistencia-nombre');
    const jugadorSaleSelect = document.getElementById('evento-jugador-sale');
    const jugadorSaleNombreInput = document.getElementById('evento-jugador-sale-nombre');
    const jugadorEntraSelect = document.getElementById('evento-jugador-entra');
    const jugadorEntraNombreInput = document.getElementById('evento-jugador-entra-nombre');
    
    // Función auxiliar para obtener dorsal de un select
    const obtenerDorsalDeSelect = (select) => {
        if (select && select.value) {
            const option = select.options[select.selectedIndex];
            return option ? option.getAttribute('data-dorsal') || '' : '';
        }
        return '';
    };
    
    // Obtener nombre y dorsal del jugador
    let jugadorNombre = jugadorNombreInput ? jugadorNombreInput.value.trim() : '';
    let jugadorId = jugadorSelect ? jugadorSelect.value : '';
    let jugadorDorsal = obtenerDorsalDeSelect(jugadorSelect);
    
    if (!jugadorNombre && jugadorSelect && jugadorSelect.value) {
        const option = jugadorSelect.options[jugadorSelect.selectedIndex];
        const textoCompleto = option.textContent;
        // Extraer nombre sin el dorsal (formato: "10. Nombre" o solo "Nombre")
        jugadorNombre = textoCompleto.replace(/^\d+\.\s*/, '');
    }
    
    if (!jugadorNombre && tipoEvento !== 'sustitucion' && tipoEvento !== 'fin_partido') {
        if (errorDiv) {
            errorDiv.textContent = 'Debe especificar el nombre del jugador';
        }
        return;
    }
    
    // Obtener opciones de gol (penal/autogol)
    const checkboxPenal = document.getElementById('evento-es-penal');
    const checkboxAutogol = document.getElementById('evento-es-autogol');
    const esPenal = checkboxPenal ? checkboxPenal.checked : false;
    const esAutogol = checkboxAutogol ? checkboxAutogol.checked : false;
    
    // Obtener asistencia si es gol (solo si no es penal ni autogol)
    let asistenciaNombre = null;
    let asistenciaId = null;
    let asistenciaDorsal = null;
    if (tipoEvento === 'gol' && !esPenal && !esAutogol) {
        asistenciaNombre = asistenciaNombreInput ? asistenciaNombreInput.value.trim() : '';
        asistenciaId = asistenciaSelect ? asistenciaSelect.value : '';
        asistenciaDorsal = obtenerDorsalDeSelect(asistenciaSelect);
        
        if (!asistenciaNombre && asistenciaSelect && asistenciaSelect.value) {
            const option = asistenciaSelect.options[asistenciaSelect.selectedIndex];
            const textoCompleto = option.textContent;
            asistenciaNombre = textoCompleto.replace(/^\d+\.\s*/, '');
        }
    }
    
    // Obtener jugadores de sustitución
    let jugadorSaleNombre = null;
    let jugadorSaleId = null;
    let jugadorSaleDorsal = null;
    let jugadorEntraNombre = null;
    let jugadorEntraId = null;
    let jugadorEntraDorsal = null;
    
    if (tipoEvento === 'sustitucion') {
        jugadorSaleNombre = jugadorSaleNombreInput ? jugadorSaleNombreInput.value.trim() : '';
        jugadorSaleId = jugadorSaleSelect ? jugadorSaleSelect.value : '';
        jugadorSaleDorsal = obtenerDorsalDeSelect(jugadorSaleSelect);
        
        if (!jugadorSaleNombre && jugadorSaleSelect && jugadorSaleSelect.value) {
            const option = jugadorSaleSelect.options[jugadorSaleSelect.selectedIndex];
            const textoCompleto = option.textContent;
            jugadorSaleNombre = textoCompleto.replace(/^\d+\.\s*/, '');
        }
        
        jugadorEntraNombre = jugadorEntraNombreInput ? jugadorEntraNombreInput.value.trim() : '';
        jugadorEntraId = jugadorEntraSelect ? jugadorEntraSelect.value : '';
        jugadorEntraDorsal = obtenerDorsalDeSelect(jugadorEntraSelect);
        
        if (!jugadorEntraNombre && jugadorEntraSelect && jugadorEntraSelect.value) {
            const option = jugadorEntraSelect.options[jugadorEntraSelect.selectedIndex];
            const textoCompleto = option.textContent;
            jugadorEntraNombre = textoCompleto.replace(/^\d+\.\s*/, '');
        }
        
        if (!jugadorSaleNombre || !jugadorEntraNombre) {
            if (errorDiv) {
                errorDiv.textContent = 'Debe especificar el jugador que sale y el que entra';
            }
            return;
        }
    }
    
    // Para sustituciones, usar jugador_sale_nombre como jugador_nombre
    let jugadorNombreFinal = jugadorNombre;
    if (tipoEvento === 'sustitucion' && jugadorSaleNombre) {
        jugadorNombreFinal = jugadorSaleNombre;
    }
    
    // Preparar datos para enviar
    const datosEnvio = {
        partido_id: partidoId,
        tipo_evento: tipoEvento,
        minuto: minuto,
        equipo: equipo,
        jugador_id: jugadorId || null,
        jugador_nombre: jugadorNombreFinal || '',
        jugador_dorsal: jugadorDorsal || null,
        jugador_asistencia_id: asistenciaId || null,
        jugador_asistencia_nombre: asistenciaNombre || null,
        jugador_asistencia_dorsal: asistenciaDorsal || null,
        es_penal: esPenal,
        es_autogol: esAutogol,
        jugador_sale_id: jugadorSaleId || null,
        jugador_sale_nombre: jugadorSaleNombre || null,
        jugador_sale_dorsal: jugadorSaleDorsal || null,
        jugador_entra_id: jugadorEntraId || null,
        jugador_entra_nombre: jugadorEntraNombre || null,
        jugador_entra_dorsal: jugadorEntraDorsal || null
    };
    
    console.log('Enviando datos de evento:', datosEnvio);
    
    try {
        const response = await fetch('api/eventos_partido.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(datosEnvio)
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Obtener el texto de la respuesta primero
        const text = await response.text();
        
        // Intentar parsear como JSON
        let result;
        try {
            result = JSON.parse(text);
        } catch (parseError) {
            console.error('Error al parsear JSON. Respuesta recibida:', text);
            if (errorDiv) {
                errorDiv.textContent = 'Error: La respuesta del servidor no es válida. Ver consola para detalles.';
            }
            return;
        }
        
        console.log('Respuesta del servidor:', result);
        
        if (result.success) {
            cerrarModalEvento();
            await cargarEventos(partidoId);
        } else {
            console.error('Error del servidor:', result.error);
            if (errorDiv) {
                errorDiv.textContent = result.error || 'Error al guardar el evento';
            }
        }
    } catch (error) {
        console.error('Error al guardar evento:', error);
        if (errorDiv) {
            errorDiv.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
        }
    }
}

// Función para eliminar evento
async function eliminarEvento(eventoId, partidoId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        return;
    }
    
    try {
        const response = await fetch(`api/eventos_partido.php?id=${eventoId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.success) {
            await cargarEventos(partidoId);
        } else {
            alert(result.error || 'Error al eliminar el evento');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión. Por favor, intenta de nuevo.');
    }
}

// Función para cerrar modal de evento
function cerrarModalEvento() {
    const modal = document.getElementById('modal-evento');
    if (modal) {
        modal.remove();
    }
    window.jugadoresModal = null;
}

// Hacer funciones disponibles globalmente
window.toggleEventos = toggleEventos;
window.mostrarModalAgregarEvento = mostrarModalAgregarEvento;
window.cambiarEquipoEvento = cambiarEquipoEvento;
window.cambiarTipoEvento = cambiarTipoEvento;
window.cambiarOpcionesGol = cambiarOpcionesGol;
window.eliminarEvento = eliminarEvento;
window.cerrarModalEvento = cerrarModalEvento;

async function renderizarResultados(resultados) {
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

    tbody.innerHTML = '';
    
    for (const partido of resultados) {
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
        
        // Botón para ver/agregar eventos
        const botonEventos = partido.id ? `
            <button class="btn-eventos" onclick="toggleEventos(${partido.id})" title="Ver Eventos">📊</button>
        ` : '';
        
        const row = document.createElement('tr');
        row.className = 'partido-row';
        row.setAttribute('data-partido-id', partido.id || '');
        row.innerHTML = `
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
                        ${botonEventos}
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
        `;
        tbody.appendChild(row);
        
        // Agregar fila expandible para eventos (inicialmente oculta)
        if (partido.id) {
            const eventosRow = document.createElement('tr');
            eventosRow.className = 'eventos-row';
            eventosRow.id = `eventos-row-${partido.id}`;
            eventosRow.style.display = 'none';
            eventosRow.innerHTML = `
                <td colspan="3" class="eventos-col">
                    <div class="eventos-container" id="eventos-container-${partido.id}">
                        <div class="eventos-loading">Cargando eventos...</div>
                    </div>
                </td>
            `;
            tbody.appendChild(eventosRow);
        }
    }
}

// Lista completa de equipos
const listaEquipos = [
    'ATHLETIC CLUB', 'ATLÉTICO DE MADRID', 'CA OSASUNA', 'CELTA', 'DEPORTIVO ALAVÉS',
    'ELCHE CF', 'FC BARCELONA', 'GETAFE CF', 'GIRONA FC', 'LEVANTE UD',
    'RAYO VALLECANO', 'RCD ESPANYOL DE BARCELONA', 'RCD MALLORCA', 'REAL BETIS',
    'REAL MADRID', 'REAL OVIEDO', 'REAL SOCIEDAD', 'SEVILLA FC', 'VALENCIA CF', 'VILLARREAL CF'
];

// Función auxiliar que devuelve los datos de partidos por jornada (1-38)
// Esta función es reutilizada por cargarPartidosJornada y generarDatosEjemplo
function obtenerDatosPartidosJornada(jornada) {
    const j = parseInt(jornada, 10);
    let partidosJornada = [];
    
    if (j === 1) {
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
        return partidosJornada;
    } else if (j === 2) {
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
        return partidosJornada;
    } else if (j === 3) {
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
        return partidosJornada;
    } else if (j === 4) {
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
        return partidosJornada;
    } else if (j === 5) {
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
        return partidosJornada;
    } else if (j === 6) {
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
        return partidosJornada;
    } else if (j === 7) {
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
        return partidosJornada;
    } else if (j === 8) {
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
        return partidosJornada;
    } else if (j === 9) {
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
        return partidosJornada;
    } else if (j === 10) {
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
        return partidosJornada;
    } else if (j === 11) {
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
        return partidosJornada;
    } else if (j === 12) {
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
        return partidosJornada;
    } else if (j === 13) {
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
        return partidosJornada;
    } else if (j === 14) {
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
        return partidosJornada;
    } else if (j === 15) {
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
        return partidosJornada;
    } else if (j === 16) {
        // Jornada 16 según la imagen (12-15 de diciembre 2025)
        partidosJornada = [
            { fecha: '2025-12-12', horario: '14:00', local: 'REAL SOCIEDAD', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-13', horario: '07:00', local: 'ATLÉTICO DE MADRID', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-13', horario: '09:15', local: 'RCD MALLORCA', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-13', horario: '11:30', local: 'FC BARCELONA', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-13', horario: '14:00', local: 'GETAFE CF', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-14', horario: '07:00', local: 'SEVILLA FC', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-14', horario: '09:15', local: 'CELTA', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-14', horario: '11:30', local: 'LEVANTE UD', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-14', horario: '14:00', local: 'DEPORTIVO ALAVÉS', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-15', horario: '14:00', local: 'RAYO VALLECANO', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 17) {
        // Jornada 17 según la imagen (todos los partidos el 20.12.2025, horarios distribuidos)
        partidosJornada = [
            { fecha: '2025-12-20', horario: '07:00', local: 'ATHLETIC CLUB', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-20', horario: '09:15', local: 'REAL BETIS', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-20', horario: '11:30', local: 'ELCHE CF', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-20', horario: '14:00', local: 'LEVANTE UD', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-20', horario: '16:30', local: 'REAL MADRID', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-20', horario: '19:00', local: 'CA OSASUNA', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-20', horario: '21:00', local: 'GIRONA FC', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-20', horario: '23:00', local: 'VILLARREAL CF', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-21', horario: '07:00', local: 'REAL OVIEDO', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-21', horario: '14:00', local: 'VALENCIA CF', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 18) {
        // Jornada 18 según la imagen (todos los partidos el 03.01.2026, horarios distribuidos)
        partidosJornada = [
            { fecha: '2026-01-03', horario: '07:00', local: 'DEPORTIVO ALAVÉS', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-03', horario: '09:15', local: 'CELTA', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-03', horario: '11:30', local: 'ELCHE CF', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-03', horario: '14:00', local: 'CA OSASUNA', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-03', horario: '16:30', local: 'REAL SOCIEDAD', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-03', horario: '19:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-03', horario: '21:00', local: 'REAL MADRID', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-04', horario: '07:00', local: 'RAYO VALLECANO', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-04', horario: '09:15', local: 'RCD MALLORCA', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-04', horario: '14:00', local: 'SEVILLA FC', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 19) {
        // Jornada 19 según la imagen (partidos del 2-3 dic 2025 y 10 ene 2026)
        partidosJornada = [
            { fecha: '2025-12-02', horario: '14:00', local: 'FC BARCELONA', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2025-12-03', horario: '12:00', local: 'ATHLETIC CLUB', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-10', horario: '07:00', local: 'GETAFE CF', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-10', horario: '09:15', local: 'GIRONA FC', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-10', horario: '11:30', local: 'VILLARREAL CF', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-10', horario: '14:00', local: 'REAL OVIEDO', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-10', horario: '16:30', local: 'SEVILLA FC', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-10', horario: '19:00', local: 'VALENCIA CF', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-10', horario: '21:00', local: 'LEVANTE UD', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-11', horario: '14:00', local: 'RAYO VALLECANO', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 20) {
        // Jornada 20 según la imagen (todos los partidos el 17.01.2026)
        partidosJornada = [
            { fecha: '2026-01-17', horario: '07:00', local: 'REAL BETIS', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-17', horario: '09:15', local: 'CELTA', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-17', horario: '11:30', local: 'ELCHE CF', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-17', horario: '14:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-17', horario: '16:30', local: 'GETAFE CF', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-17', horario: '19:00', local: 'CA OSASUNA', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-17', horario: '21:00', local: 'ATLÉTICO DE MADRID', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-18', horario: '07:00', local: 'RCD MALLORCA', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-18', horario: '09:15', local: 'REAL SOCIEDAD', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-18', horario: '14:00', local: 'REAL MADRID', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 21) {
        // Jornada 21 según la imagen (todos los partidos el 24.01.2026)
        partidosJornada = [
            { fecha: '2026-01-24', horario: '07:00', local: 'DEPORTIVO ALAVÉS', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-24', horario: '09:15', local: 'ATLÉTICO DE MADRID', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-24', horario: '11:30', local: 'FC BARCELONA', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-24', horario: '14:00', local: 'SEVILLA FC', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-24', horario: '16:30', local: 'REAL SOCIEDAD', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-24', horario: '19:00', local: 'LEVANTE UD', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-24', horario: '21:00', local: 'VALENCIA CF', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-25', horario: '07:00', local: 'GIRONA FC', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-25', horario: '09:15', local: 'RAYO VALLECANO', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-25', horario: '14:00', local: 'VILLARREAL CF', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 22) {
        // Jornada 22 según la imagen (todos los partidos el 31.01.2026)
        partidosJornada = [
            { fecha: '2026-01-31', horario: '07:00', local: 'ATHLETIC CLUB', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-31', horario: '09:15', local: 'REAL BETIS', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-31', horario: '11:30', local: 'RCD MALLORCA', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-31', horario: '14:00', local: 'CA OSASUNA', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-31', horario: '16:30', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-31', horario: '19:00', local: 'LEVANTE UD', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-01-31', horario: '21:00', local: 'ELCHE CF', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-01', horario: '07:00', local: 'GETAFE CF', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-01', horario: '09:15', local: 'REAL OVIEDO', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-01', horario: '14:00', local: 'REAL MADRID', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 23) {
        // Jornada 23 según la imagen (todos los partidos el 07.02.2026)
        partidosJornada = [
            { fecha: '2026-02-07', horario: '07:00', local: 'DEPORTIVO ALAVÉS', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-07', horario: '09:15', local: 'ATHLETIC CLUB', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-07', horario: '11:30', local: 'ATLÉTICO DE MADRID', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-07', horario: '14:00', local: 'FC BARCELONA', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-07', horario: '16:30', local: 'CELTA', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-07', horario: '19:00', local: 'REAL SOCIEDAD', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-07', horario: '21:00', local: 'VILLARREAL CF', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-08', horario: '07:00', local: 'SEVILLA FC', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-08', horario: '09:15', local: 'VALENCIA CF', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-08', horario: '14:00', local: 'RAYO VALLECANO', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 24) {
        // Jornada 24 según la imagen (todos los partidos el 14.02.2026)
        partidosJornada = [
            { fecha: '2026-02-14', horario: '07:00', local: 'ELCHE CF', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-14', horario: '09:15', local: 'GETAFE CF', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-14', horario: '11:30', local: 'LEVANTE UD', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-14', horario: '14:00', local: 'REAL MADRID', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-14', horario: '16:30', local: 'SEVILLA FC', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-14', horario: '19:00', local: 'REAL OVIEDO', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-14', horario: '21:00', local: 'RAYO VALLECANO', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-15', horario: '07:00', local: 'GIRONA FC', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-15', horario: '09:15', local: 'RCD MALLORCA', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-15', horario: '14:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 25) {
        // Jornada 25 según la imagen (todos los partidos el 21.02.2026)
        partidosJornada = [
            { fecha: '2026-02-21', horario: '07:00', local: 'DEPORTIVO ALAVÉS', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-21', horario: '09:15', local: 'ATHLETIC CLUB', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-21', horario: '11:30', local: 'ATLÉTICO DE MADRID', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-21', horario: '14:00', local: 'FC BARCELONA', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-21', horario: '16:30', local: 'REAL BETIS', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-21', horario: '19:00', local: 'CELTA', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-21', horario: '21:00', local: 'GETAFE CF', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-22', horario: '07:00', local: 'CA OSASUNA', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-22', horario: '09:15', local: 'VILLARREAL CF', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-22', horario: '14:00', local: 'REAL SOCIEDAD', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 26) {
        // Jornada 26 según la imagen (todos los partidos el 28.02.2026)
        partidosJornada = [
            { fecha: '2026-02-28', horario: '07:00', local: 'FC BARCELONA', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-28', horario: '09:15', local: 'REAL BETIS', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-28', horario: '11:30', local: 'ELCHE CF', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-28', horario: '14:00', local: 'RCD MALLORCA', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-28', horario: '16:30', local: 'LEVANTE UD', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-28', horario: '19:00', local: 'RAYO VALLECANO', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-02-28', horario: '21:00', local: 'REAL OVIEDO', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-01', horario: '07:00', local: 'GIRONA FC', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-01', horario: '09:15', local: 'REAL MADRID', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-01', horario: '14:00', local: 'VALENCIA CF', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 27) {
        // Jornada 27 según la imagen (todos los partidos el 07.03.2026)
        partidosJornada = [
            { fecha: '2026-03-07', horario: '07:00', local: 'ATHLETIC CLUB', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-07', horario: '09:15', local: 'ATLÉTICO DE MADRID', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-07', horario: '11:30', local: 'CELTA', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-07', horario: '14:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-07', horario: '16:30', local: 'VALENCIA CF', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-07', horario: '19:00', local: 'GETAFE CF', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-07', horario: '21:00', local: 'VILLARREAL CF', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-08', horario: '07:00', local: 'LEVANTE UD', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-08', horario: '09:15', local: 'CA OSASUNA', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-08', horario: '14:00', local: 'SEVILLA FC', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 28) {
        // Jornada 28 según la imagen (todos los partidos el 14.03.2026)
        partidosJornada = [
            { fecha: '2026-03-14', horario: '07:00', local: 'DEPORTIVO ALAVÉS', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-14', horario: '09:15', local: 'ATLÉTICO DE MADRID', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-14', horario: '11:30', local: 'FC BARCELONA', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-14', horario: '14:00', local: 'REAL BETIS', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-14', horario: '16:30', local: 'REAL OVIEDO', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-14', horario: '19:00', local: 'GIRONA FC', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-14', horario: '21:00', local: 'REAL MADRID', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-15', horario: '07:00', local: 'RCD MALLORCA', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-15', horario: '09:15', local: 'RAYO VALLECANO', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-15', horario: '14:00', local: 'REAL SOCIEDAD', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 29) {
        // Jornada 29 según la imagen (todos los partidos el 21.03.2026)
        partidosJornada = [
            { fecha: '2026-03-21', horario: '07:00', local: 'ATHLETIC CLUB', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-21', horario: '09:15', local: 'FC BARCELONA', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-21', horario: '11:30', local: 'ELCHE CF', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-21', horario: '14:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-21', horario: '16:30', local: 'LEVANTE UD', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-21', horario: '19:00', local: 'SEVILLA FC', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-21', horario: '21:00', local: 'CELTA', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-22', horario: '07:00', local: 'REAL MADRID', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-22', horario: '09:15', local: 'CA OSASUNA', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-03-22', horario: '14:00', local: 'VILLARREAL CF', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 30) {
        // Jornada 30 según la imagen (todos los partidos el 04.04.2026)
        partidosJornada = [
            { fecha: '2026-04-04', horario: '07:00', local: 'DEPORTIVO ALAVÉS', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-04', horario: '09:15', local: 'ATLÉTICO DE MADRID', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-04', horario: '11:30', local: 'REAL BETIS', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-04', horario: '14:00', local: 'GIRONA FC', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-04', horario: '16:30', local: 'RCD MALLORCA', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-04', horario: '19:00', local: 'REAL OVIEDO', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-04', horario: '21:00', local: 'GETAFE CF', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-05', horario: '07:00', local: 'VALENCIA CF', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-05', horario: '09:15', local: 'RAYO VALLECANO', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-05', horario: '14:00', local: 'REAL SOCIEDAD', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 31) {
        // Jornada 31 según la imagen (todos los partidos el 11.04.2026)
        partidosJornada = [
            { fecha: '2026-04-11', horario: '07:00', local: 'ATHLETIC CLUB', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-11', horario: '09:15', local: 'FC BARCELONA', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-11', horario: '11:30', local: 'CELTA', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-11', horario: '14:00', local: 'ELCHE CF', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-11', horario: '16:30', local: 'RCD MALLORCA', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-11', horario: '19:00', local: 'REAL SOCIEDAD', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-11', horario: '21:00', local: 'SEVILLA FC', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-12', horario: '07:00', local: 'CA OSASUNA', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-12', horario: '09:15', local: 'LEVANTE UD', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-12', horario: '14:00', local: 'REAL MADRID', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 32) {
        // Jornada 32 según la imagen (todos los partidos el 18.04.2026)
        partidosJornada = [
            { fecha: '2026-04-18', horario: '07:00', local: 'DEPORTIVO ALAVÉS', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-18', horario: '09:15', local: 'REAL BETIS', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-18', horario: '11:30', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-18', horario: '14:00', local: 'CA OSASUNA', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-18', horario: '16:30', local: 'RAYO VALLECANO', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-18', horario: '19:00', local: 'ATLÉTICO DE MADRID', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-18', horario: '21:00', local: 'GETAFE CF', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-19', horario: '07:00', local: 'VILLARREAL CF', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-19', horario: '09:15', local: 'REAL OVIEDO', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-19', horario: '14:00', local: 'VALENCIA CF', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 33) {
        // Jornada 33 según la imagen (todos los partidos el 21.04.2026)
        partidosJornada = [
            { fecha: '2026-04-21', horario: '07:00', local: 'ATHLETIC CLUB', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-21', horario: '09:15', local: 'FC BARCELONA', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-21', horario: '11:30', local: 'LEVANTE UD', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-21', horario: '14:00', local: 'RCD MALLORCA', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-21', horario: '16:30', local: 'REAL OVIEDO', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-21', horario: '19:00', local: 'REAL MADRID', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-21', horario: '21:00', local: 'ELCHE CF', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-22', horario: '07:00', local: 'GIRONA FC', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-22', horario: '09:15', local: 'RAYO VALLECANO', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-04-22', horario: '14:00', local: 'REAL SOCIEDAD', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 34) {
        // Jornada 34 según la imagen (todos los partidos el 02.05.2026)
        partidosJornada = [
            { fecha: '2026-05-02', horario: '07:00', local: 'DEPORTIVO ALAVÉS', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-02', horario: '09:15', local: 'REAL BETIS', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-02', horario: '11:30', local: 'CELTA', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-02', horario: '14:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-02', horario: '16:30', local: 'GETAFE CF', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-02', horario: '19:00', local: 'GIRONA FC', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-02', horario: '21:00', local: 'VALENCIA CF', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-03', horario: '07:00', local: 'CA OSASUNA', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-03', horario: '09:15', local: 'VILLARREAL CF', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-03', horario: '14:00', local: 'SEVILLA FC', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 35) {
        // Jornada 35 según la imagen (todos los partidos el 09.05.2026)
        partidosJornada = [
            { fecha: '2026-05-09', horario: '07:00', local: 'ATHLETIC CLUB', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-09', horario: '09:15', local: 'ATLÉTICO DE MADRID', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-09', horario: '11:30', local: 'FC BARCELONA', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-09', horario: '14:00', local: 'LEVANTE UD', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-09', horario: '16:30', local: 'RCD MALLORCA', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-09', horario: '19:00', local: 'ELCHE CF', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-09', horario: '21:00', local: 'REAL SOCIEDAD', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-10', horario: '07:00', local: 'SEVILLA FC', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-10', horario: '09:15', local: 'REAL OVIEDO', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-10', horario: '14:00', local: 'RAYO VALLECANO', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 36) {
        // Jornada 36 según la imagen (todos los partidos el 12.05.2026)
        partidosJornada = [
            { fecha: '2026-05-12', horario: '07:00', local: 'DEPORTIVO ALAVÉS', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-12', horario: '09:15', local: 'REAL BETIS', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-12', horario: '11:30', local: 'CELTA', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-12', horario: '14:00', local: 'GETAFE CF', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-12', horario: '16:30', local: 'GIRONA FC', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-12', horario: '19:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-12', horario: '21:00', local: 'CA OSASUNA', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-13', horario: '07:00', local: 'VALENCIA CF', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-13', horario: '09:15', local: 'VILLARREAL CF', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-13', horario: '14:00', local: 'REAL MADRID', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 37) {
        // Jornada 37 según la imagen (todos los partidos el 16.05.2026)
        partidosJornada = [
            { fecha: '2026-05-16', horario: '07:00', local: 'ATHLETIC CLUB', visitante: 'CELTA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-16', horario: '09:15', local: 'ATLÉTICO DE MADRID', visitante: 'GIRONA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-16', horario: '11:30', local: 'FC BARCELONA', visitante: 'REAL BETIS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-16', horario: '14:00', local: 'ELCHE CF', visitante: 'GETAFE CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-16', horario: '16:30', local: 'LEVANTE UD', visitante: 'RCD MALLORCA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-16', horario: '19:00', local: 'RAYO VALLECANO', visitante: 'VILLARREAL CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-16', horario: '21:00', local: 'REAL SOCIEDAD', visitante: 'VALENCIA CF', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-17', horario: '07:00', local: 'REAL OVIEDO', visitante: 'DEPORTIVO ALAVÉS', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-17', horario: '09:15', local: 'CA OSASUNA', visitante: 'RCD ESPANYOL DE BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-17', horario: '14:00', local: 'SEVILLA FC', visitante: 'REAL MADRID', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else if (j === 38) {
        // Jornada 38 según la imagen (última jornada, todos los partidos el 23.05.2026)
        partidosJornada = [
            { fecha: '2026-05-23', horario: '07:00', local: 'DEPORTIVO ALAVÉS', visitante: 'RAYO VALLECANO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-23', horario: '09:15', local: 'REAL BETIS', visitante: 'LEVANTE UD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-23', horario: '11:30', local: 'CELTA', visitante: 'SEVILLA FC', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-23', horario: '14:00', local: 'RCD ESPANYOL DE BARCELONA', visitante: 'REAL SOCIEDAD', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-23', horario: '16:30', local: 'GETAFE CF', visitante: 'CA OSASUNA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-23', horario: '19:00', local: 'RCD MALLORCA', visitante: 'REAL OVIEDO', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-23', horario: '21:00', local: 'REAL MADRID', visitante: 'ATHLETIC CLUB', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-24', horario: '07:00', local: 'VILLARREAL CF', visitante: 'ATLÉTICO DE MADRID', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-24', horario: '09:15', local: 'VALENCIA CF', visitante: 'FC BARCELONA', golesLocal: 0, golesVisitante: 0 },
            { fecha: '2026-05-24', horario: '14:00', local: 'GIRONA FC', visitante: 'ELCHE CF', golesLocal: 0, golesVisitante: 0 }
        ];
        return partidosJornada;
    } else {
        // Si la jornada no está definida, devolver array vacío
        return [];
    }
}

async function cargarPartidosJornada(jornada) {
    // Asegurar que jornada sea un número
    jornada = parseInt(jornada, 10);
    
    if (!confirm(`¿Deseas cargar todos los partidos de la jornada ${jornada}?\n\nEsto creará los 10 partidos de la jornada si no existen.`)) {
        return;
    }
    
    // Obtener datos de partidos usando la función auxiliar
    const partidosJornada = obtenerDatosPartidosJornada(jornada);
    
    if (!partidosJornada || partidosJornada.length === 0) {
        alert(`La jornada ${jornada} aún no tiene datos de ejemplo configurados.`);
        return;
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
    const golesLocalInput = document.getElementById('resultado-goles-local').value;
    const golesVisitanteInput = document.getElementById('resultado-goles-visitante').value;
    
    // Validar que los campos no estén vacíos
    if (golesLocalInput === '' || golesVisitanteInput === '') {
        if (errorDiv) {
            errorDiv.textContent = 'Por favor, ingresa los goles para ambos equipos';
        }
        return;
    }
    
    // Convertir a números enteros
    const golesLocal = parseInt(golesLocalInput);
    const golesVisitante = parseInt(golesVisitanteInput);
    
    // Validar que sean números válidos
    if (isNaN(golesLocal) || isNaN(golesVisitante)) {
        if (errorDiv) {
            errorDiv.textContent = 'Los goles deben ser números válidos';
        }
        return;
    }
    
    // Validar que no sean negativos
    if (golesLocal < 0 || golesVisitante < 0) {
        if (errorDiv) {
            errorDiv.textContent = 'Los goles no pueden ser negativos';
        }
        return;
    }
    
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
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
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
        console.error('Error al guardar resultado:', error);
        if (errorDiv) {
            errorDiv.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
        } else {
            alert('Error al guardar el resultado. Por favor, intenta de nuevo.');
        }
    }
}

function cerrarModalPartido() {
    const modal = document.getElementById('modal-partido') || document.getElementById('modal-resultado');
    if (modal) {
        modal.remove();
    }
}

async function eliminarJornada(jornada) {
    if (!confirm(`¿Estás seguro de que deseas eliminar todos los partidos de la jornada ${jornada}?`)) {
        return;
    }
    
    try {
        const response = await fetch(`api/partidos.php?jornada=${jornada}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(result.message);
            // Recargar resultados si estamos viendo esa jornada
            const jornadaActual = parseInt(document.getElementById('jornada-select')?.value);
            if (jornadaActual === jornada) {
                await cargarResultados(jornada);
            }
        } else {
            alert(result.error || 'Error al eliminar la jornada');
        }
    } catch (error) {
        console.error('Error al eliminar jornada:', error);
        alert('Error al eliminar la jornada');
    }
}

// Eliminar jornadas 1, 4, 15 y 16
async function eliminarJornadasEspecificas() {
    const jornadasAEliminar = [1, 4, 15, 16];
    
    if (!confirm(`¿Estás seguro de que deseas eliminar todos los partidos de las jornadas ${jornadasAEliminar.join(', ')}?`)) {
        return;
    }
    
    let eliminadas = 0;
    let errores = 0;
    
    for (const jornada of jornadasAEliminar) {
        try {
            const response = await fetch(`api/partidos.php?jornada=${jornada}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            
            const result = await response.json();
            
            if (result.success) {
                eliminadas++;
                console.log(`Jornada ${jornada} eliminada: ${result.message}`);
            } else {
                errores++;
                console.error(`Error al eliminar jornada ${jornada}:`, result.error);
            }
        } catch (error) {
            errores++;
            console.error(`Error al eliminar jornada ${jornada}:`, error);
        }
    }
    
    alert(`Proceso completado:\n- Jornadas eliminadas: ${eliminadas}\n- Errores: ${errores}`);
    
    // Recargar resultados si estamos viendo una de esas jornadas
    const jornadaActual = parseInt(document.getElementById('jornada-select')?.value);
    if (jornadasAEliminar.includes(jornadaActual)) {
        await cargarResultados(jornadaActual);
    }
}

// Función disponible globalmente para ejecutar manualmente
window.eliminarJornadasEspecificas = eliminarJornadasEspecificas;

// Hacer funciones disponibles globalmente para onclick
window.editarResultado = editarResultado;
window.cerrarModalPartido = cerrarModalPartido;
window.eliminarJornada = eliminarJornada;

export default ResultadosPage;
export { init };

