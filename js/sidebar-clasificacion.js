// Sidebar de clasificación - Tabla de posiciones compacta

// Mapeo de nombres de equipos a carpetas de imágenes
const mapeoEquiposSidebar = {
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

function obtenerCarpetaEquipoSidebar(nombreEquipo) {
    return mapeoEquiposSidebar[nombreEquipo] || null;
}

function obtenerRutaLogoSidebar(nombreEquipo) {
    const carpeta = obtenerCarpetaEquipoSidebar(nombreEquipo);
    return carpeta ? `images/${carpeta}/escudo.png` : 'images/LaligaLogo.jpg';
}

// Función auxiliar para parsear fecha local
function parsearFechaLocalSidebar(fechaISO) {
    const partesFecha = String(fechaISO).split('-');
    if (partesFecha.length === 3) {
        const año = parseInt(partesFecha[0], 10);
        const mes = parseInt(partesFecha[1], 10) - 1;
        const dia = parseInt(partesFecha[2], 10);
        return new Date(año, mes, dia);
    }
    return new Date(fechaISO);
}

// Calcular clasificación (misma lógica que en clasificacion.js)
function calcularClasificacionSidebar(partidos) {
    const estadisticas = {};
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);

    partidos.forEach(partido => {
        if (partido.fecha_iso) {
            const fechaPartido = parsearFechaLocalSidebar(partido.fecha_iso);
            fechaPartido.setHours(0, 0, 0, 0);
            if (fechaPartido > fechaActual) {
                return;
            }
        }
        
        if (partido.goles_local === null || partido.goles_visitante === null) {
            return;
        }

        const local = partido.local;
        const visitante = partido.visitante;
        const golesLocal = partido.goles_local;
        const golesVisitante = partido.goles_visitante;

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

        estadisticas[local].PJ++;
        estadisticas[local].GF += golesLocal;
        estadisticas[local].GC += golesVisitante;

        estadisticas[visitante].PJ++;
        estadisticas[visitante].GF += golesVisitante;
        estadisticas[visitante].GC += golesLocal;

        if (golesLocal > golesVisitante) {
            estadisticas[local].PG++;
            estadisticas[local].PUNTOS += 3;
            estadisticas[visitante].PP++;
        } else if (golesLocal < golesVisitante) {
            estadisticas[visitante].PG++;
            estadisticas[visitante].PUNTOS += 3;
            estadisticas[local].PP++;
        } else {
            estadisticas[local].PE++;
            estadisticas[local].PUNTOS += 1;
            estadisticas[visitante].PE++;
            estadisticas[visitante].PUNTOS += 1;
        }
    });

    Object.keys(estadisticas).forEach(equipo => {
        estadisticas[equipo].DG = estadisticas[equipo].GF - estadisticas[equipo].GC;
    });

    const clasificacion = Object.values(estadisticas);
    clasificacion.sort((a, b) => {
        if (b.PUNTOS !== a.PUNTOS) {
            return b.PUNTOS - a.PUNTOS;
        }
        return b.DG - a.DG;
    });

    return clasificacion;
}

// Crear el sidebar de clasificación
function crearSidebarClasificacion() {
    return `
        <aside id="sidebar-clasificacion" class="sidebar-clasificacion">
            <div class="sidebar-header">
                <h3 class="sidebar-titulo">
                    <a href="#clasificacion" class="sidebar-titulo-link" id="sidebar-titulo-link">Clasificación</a>
                </h3>
                <button class="btn-toggle-sidebar" id="btn-toggle-sidebar" title="Ocultar/Mostrar clasificación">
                    <span class="icono-toggle">‹</span>
                </button>
            </div>
            <div class="sidebar-content" id="sidebar-clasificacion-content">
                <div class="sidebar-loading">Cargando...</div>
            </div>
        </aside>
    `;
}

// Cargar y mostrar clasificación en el sidebar
async function cargarClasificacionSidebar() {
    const content = document.getElementById('sidebar-clasificacion-content');
    if (!content) return;

    try {
        const response = await fetch('api/partidos.php?jornada=all', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.partidos) {
            const clasificacion = calcularClasificacionSidebar(result.partidos);
            mostrarClasificacionSidebar(content, clasificacion);
        } else {
            content.innerHTML = '<div class="sidebar-vacio">No hay datos disponibles</div>';
        }
    } catch (error) {
        console.error('Error al cargar clasificación sidebar:', error);
        content.innerHTML = '<div class="sidebar-error">Error al cargar</div>';
    }
}

// Mostrar clasificación en el sidebar (versión compacta)
function mostrarClasificacionSidebar(content, clasificacion) {
    if (clasificacion.length === 0) {
        content.innerHTML = '<div class="sidebar-vacio">No hay datos disponibles</div>';
        return;
    }

    let html = `
        <div class="sidebar-table-container">
            <table class="sidebar-table">
                <thead>
                    <tr>
                        <th>POS</th>
                        <th>EQUIPO</th>
                        <th>PTS</th>
                    </tr>
                </thead>
                <tbody>
    `;

    clasificacion.forEach((equipo, index) => {
        const posicion = index + 1;
        const rutaLogo = obtenerRutaLogoSidebar(equipo.equipo);
        
        // Determinar clase según posición
        let claseFila = '';
        if (posicion <= 4) {
            claseFila = 'fila-champions';
        } else if (posicion === 5) {
            claseFila = 'fila-europa';
        } else if (posicion === 6) {
            claseFila = 'fila-conference';
        } else if (posicion >= clasificacion.length - 2) {
            claseFila = 'fila-descenso';
        }
        
        // Abreviar nombre del equipo si es muy largo
        const nombreEquipo = equipo.equipo.length > 15 
            ? equipo.equipo.substring(0, 12) + '...' 
            : equipo.equipo;
        
        html += `
            <tr class="${claseFila}">
                <td class="sidebar-posicion">${posicion}</td>
                <td class="sidebar-equipo">
                    <img src="${rutaLogo}" 
                         alt="${escapeHtml(equipo.equipo)}" 
                         class="sidebar-logo"
                         onerror="this.src='images/LaligaLogo.jpg';"
                         title="${escapeHtml(equipo.equipo)}">
                    <span class="sidebar-nombre-equipo">${escapeHtml(nombreEquipo)}</span>
                </td>
                <td class="sidebar-puntos">${equipo.PUNTOS}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    content.innerHTML = html;
}

// Escapar HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Variable para evitar múltiples listeners
let toggleConfigurado = false;

// Configurar botón de toggle del sidebar
function configurarToggleSidebar() {
    const btnToggle = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.getElementById('sidebar-clasificacion');
    const mainWrapper = document.querySelector('.main-wrapper');
    
    if (!btnToggle || !sidebar) {
        // Reintentar si los elementos no están disponibles aún
        if (!toggleConfigurado) {
            setTimeout(configurarToggleSidebar, 100);
        }
        return;
    }
    
    // Si ya está configurado, solo actualizar el estado
    if (toggleConfigurado) {
        actualizarEstadoSidebar(sidebar, mainWrapper, btnToggle);
        return;
    }
    
    // Función para actualizar el estado del wrapper
    const actualizarEstadoWrapper = (sidebarEl, wrapper) => {
        if (wrapper) {
            if (sidebarEl.classList.contains('collapsed')) {
                wrapper.classList.remove('has-sidebar');
            } else {
                wrapper.classList.add('has-sidebar');
            }
        }
    };
    
    // Función para actualizar el icono
    const actualizarIcono = (sidebarEl, btn) => {
        const icono = btn.querySelector('.icono-toggle');
        if (icono) {
            icono.textContent = sidebarEl.classList.contains('collapsed') ? '›' : '‹';
        }
        // Actualizar título del botón
        btn.title = sidebarEl.classList.contains('collapsed') 
            ? 'Mostrar clasificación' 
            : 'Ocultar clasificación';
    };
    
    // Función para actualizar estado completo
    const actualizarEstadoSidebar = (sidebarEl, wrapper, btn) => {
        actualizarIcono(sidebarEl, btn);
        actualizarEstadoWrapper(sidebarEl, wrapper);
    };
    
    // Estado inicial
    actualizarEstadoSidebar(sidebar, mainWrapper, btnToggle);
    
    // Función para manejar el toggle
    const handleToggle = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }
        
        sidebar.classList.toggle('collapsed');
        actualizarEstadoSidebar(sidebar, mainWrapper, btnToggle);
        
        return false;
    };
    
    // Agregar listener al botón
    btnToggle.onclick = handleToggle;
    btnToggle.addEventListener('click', handleToggle, true); // Usar capture phase
    
    // Asegurar que el botón siempre sea clickeable
    btnToggle.style.pointerEvents = 'auto';
    btnToggle.style.cursor = 'pointer';
    btnToggle.style.zIndex = '1002';
    btnToggle.style.position = 'relative';
    btnToggle.setAttribute('tabindex', '0'); // Hacerlo accesible por teclado
    
    // También asegurar que el header sea clickeable cuando está colapsado
    const sidebarHeader = sidebar.querySelector('.sidebar-header');
    if (sidebarHeader) {
        sidebarHeader.style.pointerEvents = 'auto';
        
        // Agregar listener también al header completo cuando está colapsado
        sidebarHeader.addEventListener('click', (e) => {
            if (sidebar.classList.contains('collapsed')) {
                handleToggle(e);
            }
        });
    }
    
    // Agregar soporte para teclado
    btnToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle(e);
        }
    });
    
    toggleConfigurado = true;
}

// Configurar enlace del título
function configurarEnlaceTitulo() {
    const tituloLink = document.getElementById('sidebar-titulo-link');
    if (!tituloLink) return;
    
    tituloLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Navegar a la página de clasificación usando el router
        if (window.router) {
            window.router.navigate('clasificacion');
        } else {
            // Fallback: usar hash directamente
            window.location.hash = '#clasificacion';
        }
    });
}

// Inicializar sidebar de clasificación
export function inicializarSidebarClasificacion() {
    cargarClasificacionSidebar();
    
    // Configurar el toggle inmediatamente y también después de un delay
    configurarToggleSidebar();
    setTimeout(() => {
        configurarToggleSidebar();
    }, 200);
    
    // También configurar después de que se cargue el contenido
    setTimeout(() => {
        configurarToggleSidebar();
    }, 1000);
    
    // Configurar enlace del título
    configurarEnlaceTitulo();
    setTimeout(() => {
        configurarEnlaceTitulo();
    }, 200);
}

// Exportar función para crear el sidebar
export { crearSidebarClasificacion };

