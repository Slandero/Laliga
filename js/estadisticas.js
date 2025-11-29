

// Componente de estadísticas de la liga

// Mapeo de nombres de equipos a carpetas de imágenes (igual que en resultados.js)
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

function obtenerRutaImagenJugador(equipoNombre, dorsal) {
    if (!equipoNombre || !dorsal) {
        return 'images/LaligaLogo.jpg';
    }
    
    const carpetaEquipo = obtenerCarpetaEquipo(equipoNombre.toUpperCase());
    if (!carpetaEquipo) {
        return 'images/LaligaLogo.jpg';
    }
    
    // Limpiar el dorsal (eliminar espacios y caracteres especiales)
    const dorsalLimpio = String(dorsal).trim().replace(/[^0-9]/g, '');
    if (!dorsalLimpio) {
        return `images/${carpetaEquipo}/escudo.png`;
    }
    
    return `images/${carpetaEquipo}/${dorsalLimpio}.jpg`;
}

// Crear sección de estadísticas
function crearSeccionEstadisticas() {
    return `
        <div id="estadisticas-container" class="estadisticas-container">
            <h2 class="estadisticas-titulo">Estadísticas de La Liga</h2>
            <div class="estadisticas-grid">
                <div class="estadistica-card">
                    <div class="estadistica-header">
                        <h3 class="estadistica-nombre">⚽ Goleadores</h3>
                    </div>
                    <div class="estadistica-lista" id="lista-goleadores">
                        <div class="estadistica-loading">Cargando...</div>
                    </div>
                    <button class="btn-expandir-estadistica" id="btn-expandir-goleadores" style="display: none;">
                        <span class="flecha-expandir">▼</span>
                    </button>
                </div>
                
                <div class="estadistica-card">
                    <div class="estadistica-header">
                        <h3 class="estadistica-nombre">🎯 Asistencias</h3>
                    </div>
                    <div class="estadistica-lista" id="lista-asistencias">
                        <div class="estadistica-loading">Cargando...</div>
                    </div>
                    <button class="btn-expandir-estadistica" id="btn-expandir-asistencias" style="display: none;">
                        <span class="flecha-expandir">▼</span>
                    </button>
                </div>
                
                <div class="estadistica-card">
                    <div class="estadistica-header">
                        <h3 class="estadistica-nombre">🟨 Tarjetas Amarillas</h3>
                    </div>
                    <div class="estadistica-lista" id="lista-tarjetas-amarillas">
                        <div class="estadistica-loading">Cargando...</div>
                    </div>
                    <button class="btn-expandir-estadistica" id="btn-expandir-tarjetas-amarillas" style="display: none;">
                        <span class="flecha-expandir">▼</span>
                    </button>
                </div>
                
                <div class="estadistica-card">
                    <div class="estadistica-header">
                        <h3 class="estadistica-nombre">🟥 Tarjetas Rojas</h3>
                    </div>
                    <div class="estadistica-lista" id="lista-tarjetas-rojas">
                        <div class="estadistica-loading">Cargando...</div>
                    </div>
                    <button class="btn-expandir-estadistica" id="btn-expandir-tarjetas-rojas" style="display: none;">
                        <span class="flecha-expandir">▼</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Cargar estadísticas desde la API
async function cargarEstadisticas() {
    try {
        const response = await fetch('api/estadisticas.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarEstadisticas(data);
        } else {
            mostrarErrorEstadisticas();
        }
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        mostrarErrorEstadisticas();
    }
}

// Mostrar estadísticas en las listas
function mostrarEstadisticas(data) {
    // Goleadores
    mostrarListaEstadistica('lista-goleadores', data.goleadores || [], 'goles');
    
    // Asistencias
    mostrarListaEstadistica('lista-asistencias', data.asistencias || [], 'asistencias');
    
    // Tarjetas amarillas
    mostrarListaEstadistica('lista-tarjetas-amarillas', data.tarjetas_amarillas || [], 'tarjetas');
    
    // Tarjetas rojas
    mostrarListaEstadistica('lista-tarjetas-rojas', data.tarjetas_rojas || [], 'tarjetas');
    
    // Configurar botones después de mostrar las estadísticas
    setTimeout(() => {
        configurarBotonesExpandir();
    }, 100);
}

// Almacenar todos los items para cada lista
const itemsCompletos = {
    'lista-goleadores': [],
    'lista-asistencias': [],
    'lista-tarjetas-amarillas': [],
    'lista-tarjetas-rojas': []
};

// Mapeo de IDs de lista a IDs de botones
const mapeoBotones = {
    'lista-goleadores': 'btn-expandir-goleadores',
    'lista-asistencias': 'btn-expandir-asistencias',
    'lista-tarjetas-amarillas': 'btn-expandir-tarjetas-amarillas',
    'lista-tarjetas-rojas': 'btn-expandir-tarjetas-rojas'
};

// Mostrar una lista de estadísticas
function mostrarListaEstadistica(containerId, items, tipo) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Guardar todos los items
    itemsCompletos[containerId] = items;
    
    if (items.length === 0) {
        container.innerHTML = '<div class="estadistica-vacio">No hay datos disponibles</div>';
        const btnId = mapeoBotones[containerId];
        const btn = document.getElementById(btnId);
        if (btn) btn.style.display = 'none';
        return;
    }
    
    // Mostrar solo los primeros 5
    const itemsVisibles = items.slice(0, 5);
    const hayMas = items.length > 5;
    
    // Mostrar u ocultar botón según si hay más items
    const btnId = mapeoBotones[containerId];
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.style.display = hayMas ? 'flex' : 'none';
        btn.classList.remove('expandido');
        const flecha = btn.querySelector('.flecha-expandir');
        if (flecha) flecha.textContent = '▼';
    }
    
    // Renderizar items visibles
    container.innerHTML = itemsVisibles.map((item, index) => {
        return crearItemEstadistica(item, index + 1, containerId);
    }).join('');
    
    // Agregar clase para ocultar items adicionales si están renderizados
    container.classList.remove('expandido');
}

// Crear un item de estadística
function crearItemEstadistica(item, posicion, containerId) {
    const badgeClass = posicion === 1 ? 'badge-oro' : posicion === 2 ? 'badge-plata' : posicion === 3 ? 'badge-bronce' : '';
    
    // Obtener ruta de imagen del jugador
    const rutaImagen = obtenerRutaImagenJugador(item.equipo, item.dorsal);
    const equipoNombre = item.equipo || 'Sin equipo';
    
    // Ruta del escudo del equipo
    const carpetaEquipo = obtenerCarpetaEquipo(equipoNombre.toUpperCase());
    const rutaEscudo = carpetaEquipo ? `images/${carpetaEquipo}/escudo.png` : 'images/LaligaLogo.jpg';
    
    return `
        <div class="estadistica-item">
            <div class="estadistica-posicion ${badgeClass}">${posicion}</div>
            <div class="estadistica-imagen-container">
                <img src="${rutaImagen}" 
                     alt="${escapeHtml(item.jugador)}" 
                     class="estadistica-imagen-jugador"
                     onerror="this.onerror=null; this.src='${rutaEscudo}'; if(this.onerror) this.src='images/LaligaLogo.jpg';">
            </div>
            <div class="estadistica-info">
                <div class="estadistica-jugador">${escapeHtml(item.jugador)}</div>
                <div class="estadistica-equipo">
                    <img src="${rutaEscudo}" 
                         alt="${escapeHtml(equipoNombre)}" 
                         class="estadistica-escudo"
                         onerror="this.onerror=null; this.src='images/LaligaLogo.jpg';">
                    <span class="estadistica-equipo-nombre">${escapeHtml(equipoNombre)}</span>
                </div>
            </div>
            <div class="estadistica-valor">${item.total}</div>
        </div>
    `;
}

// Expandir/contraer lista de estadísticas
function toggleExpandirLista(containerId) {
    const container = document.getElementById(containerId);
    const btnId = mapeoBotones[containerId];
    const btn = document.getElementById(btnId);
    
    if (!container || !btn) return;
    
    const items = itemsCompletos[containerId] || [];
    const estaExpandido = container.classList.contains('expandido');
    
    if (estaExpandido) {
        // Contraer: mostrar solo los primeros 5
        const itemsVisibles = items.slice(0, 5);
        container.innerHTML = itemsVisibles.map((item, index) => {
            return crearItemEstadistica(item, index + 1, containerId);
        }).join('');
        container.classList.remove('expandido');
        btn.classList.remove('expandido');
        btn.querySelector('.flecha-expandir').textContent = '▼';
    } else {
        // Expandir: mostrar todos
        container.innerHTML = items.map((item, index) => {
            return crearItemEstadistica(item, index + 1, containerId);
        }).join('');
        container.classList.add('expandido');
        btn.classList.add('expandido');
        btn.querySelector('.flecha-expandir').textContent = '▲';
    }
}

// Configurar eventos de los botones de expandir
function configurarBotonesExpandir() {
    Object.keys(mapeoBotones).forEach(containerId => {
        const btnId = mapeoBotones[containerId];
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => {
                toggleExpandirLista(containerId);
            });
        }
    });
}

// Mostrar error al cargar estadísticas
function mostrarErrorEstadisticas() {
    const containers = [
        'lista-goleadores',
        'lista-asistencias',
        'lista-tarjetas-amarillas',
        'lista-tarjetas-rojas'
    ];
    
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = '<div class="estadistica-error">Error al cargar datos</div>';
        }
    });
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Inicializar estadísticas
export function inicializarEstadisticas() {
    cargarEstadisticas();
}

// Exportar función para crear la sección
export { crearSeccionEstadisticas };

