// Componentes de carrusel para noticias y próximos partidos

// Carrusel de noticias (visible para todos, botón agregar solo para logueados)
function crearCarruselNoticias() {
    return `
        <div id="carrusel-noticias-container" class="carrusel-container">
            <div class="carrusel-header">
                <h2 class="carrusel-titulo">Noticias</h2>
                <button id="btn-agregar-noticia" class="btn-agregar-noticia" style="display: none;">+ Agregar Noticia</button>
            </div>
            <div class="carrusel-wrapper">
                <button class="carrusel-btn carrusel-btn-prev" id="btn-prev-noticias">‹</button>
                <div class="carrusel-track" id="track-noticias">
                    <div class="carrusel-slide">
                        <div class="carrusel-loading">Cargando noticias...</div>
                    </div>
                </div>
                <button class="carrusel-btn carrusel-btn-next" id="btn-next-noticias">›</button>
            </div>
            <div class="carrusel-indicators" id="indicators-noticias"></div>
        </div>
    `;
}

// Carrusel de próximos partidos
function crearCarruselProximosPartidos() {
    return `
        <div id="carrusel-partidos-container" class="carrusel-container">
            <div class="carrusel-header">
                <h2 class="carrusel-titulo">Próximos Partidos</h2>
            </div>
            <div class="carrusel-wrapper">
                <button class="carrusel-btn carrusel-btn-prev" id="btn-prev-partidos">‹</button>
                <div class="carrusel-track" id="track-partidos">
                    <div class="carrusel-slide">
                        <div class="carrusel-loading">Cargando partidos...</div>
                    </div>
                </div>
                <button class="carrusel-btn carrusel-btn-next" id="btn-next-partidos">›</button>
            </div>
            <div class="carrusel-indicators" id="indicators-partidos"></div>
        </div>
    `;
}

// Exportar función para recargar noticias
export async function cargarNoticias() {
    try {
        const response = await fetch('api/noticias.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success && data.noticias && data.noticias.length > 0) {
            mostrarNoticiasEnCarrusel(data.noticias);
        } else {
            mostrarMensajeSinNoticias();
        }
    } catch (error) {
        console.error('Error al cargar noticias:', error);
        mostrarErrorNoticias();
    }
}

// Mostrar noticias en el carrusel
function mostrarNoticiasEnCarrusel(noticias, usuarioActual = null) {
    const track = document.getElementById('track-noticias');
    if (!track) return;
    
    if (noticias.length === 0) {
        mostrarMensajeSinNoticias();
        return;
    }
    
    track.innerHTML = noticias.map((noticia, index) => {
        // Mostrar botón eliminar solo si el usuario es el autor o es admin
        const puedeEliminar = usuarioActual && 
            (usuarioActual.id === noticia.usuario_id || usuarioActual.rol === 'admin');
        
        return `
        <div class="carrusel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
            <div class="noticia-card">
                ${noticia.imagen_url ? `<img src="${noticia.imagen_url}" alt="${noticia.titulo}" class="noticia-imagen">` : ''}
                <div class="noticia-contenido">
                    <h3 class="noticia-titulo">${escapeHtml(noticia.titulo)}</h3>
                    <p class="noticia-texto">${escapeHtml(noticia.contenido.substring(0, 150))}${noticia.contenido.length > 150 ? '...' : ''}</p>
                    <div class="noticia-footer">
                        <span class="noticia-autor">Por: ${escapeHtml(noticia.usuario_nombre)}</span>
                        <span class="noticia-fecha">${noticia.fecha_creacion}</span>
                    </div>
                    ${puedeEliminar ? `<button class="btn-eliminar-noticia" data-id="${noticia.id}">Eliminar</button>` : ''}
                </div>
            </div>
        </div>
    `;
    }).join('');
    
    actualizarIndicadores('noticias', noticias.length);
    inicializarCarrusel('noticias', noticias.length);
}

// Mostrar mensaje cuando no hay noticias
function mostrarMensajeSinNoticias() {
    const track = document.getElementById('track-noticias');
    if (!track) return;
    
    track.innerHTML = `
        <div class="carrusel-slide active">
            <div class="noticia-card">
                <div class="noticia-contenido">
                    <p class="sin-contenido">No hay noticias disponibles. ¡Sé el primero en agregar una!</p>
                </div>
            </div>
        </div>
    `;
}

// Mostrar error al cargar noticias
function mostrarErrorNoticias() {
    const track = document.getElementById('track-noticias');
    if (!track) return;
    
    track.innerHTML = `
        <div class="carrusel-slide active">
            <div class="noticia-card">
                <div class="noticia-contenido">
                    <p class="error-mensaje">Error al cargar las noticias. Por favor, intenta más tarde.</p>
                </div>
            </div>
        </div>
    `;
}

// Cargar próximos partidos desde la API
async function cargarProximosPartidos() {
    try {
        const response = await fetch('api/partidos.php?jornada=all', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success && data.partidos && data.partidos.length > 0) {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            // Encontrar la jornada siguiente basándose en la fecha actual
            // Primero, obtener todas las jornadas únicas ordenadas
            const jornadasUnicas = [...new Set(data.partidos.map(p => p.jornada))].sort((a, b) => a - b);
            
            // Encontrar la jornada siguiente (la primera jornada que tiene partidos futuros)
            let jornadaSiguiente = null;
            
            for (const jornada of jornadasUnicas) {
                const partidosJornada = data.partidos.filter(p => p.jornada === jornada);
                // Verificar si hay algún partido de esta jornada que sea futuro o de hoy
                const tienePartidosFuturos = partidosJornada.some(partido => {
                    const fechaPartido = parsearFechaLocal(partido.fecha_iso);
                    fechaPartido.setHours(0, 0, 0, 0);
                    return fechaPartido >= hoy;
                });
                
                if (tienePartidosFuturos) {
                    jornadaSiguiente = jornada;
                    break;
                }
            }
            
            // Si no se encontró jornada siguiente, usar la última jornada disponible
            if (jornadaSiguiente === null && jornadasUnicas.length > 0) {
                jornadaSiguiente = jornadasUnicas[jornadasUnicas.length - 1];
            }
            
            if (jornadaSiguiente !== null) {
                // Filtrar partidos de la jornada siguiente sin resultado
                const proximosPartidos = data.partidos
                    .filter(partido => {
                        return partido.jornada === jornadaSiguiente && !partido.resultado;
                    })
                    .sort((a, b) => {
                        // Ordenar por fecha y hora (usando parseo local)
                        const fechaA = parsearFechaLocal(a.fecha_iso);
                        const horaA = a.horario.split(':');
                        fechaA.setHours(parseInt(horaA[0] || 0, 10), parseInt(horaA[1] || 0, 10), 0, 0);
                        
                        const fechaB = parsearFechaLocal(b.fecha_iso);
                        const horaB = b.horario.split(':');
                        fechaB.setHours(parseInt(horaB[0] || 0, 10), parseInt(horaB[1] || 0, 10), 0, 0);
                        
                        return fechaA - fechaB;
                    });
                
                if (proximosPartidos.length > 0) {
                    mostrarPartidosEnCarrusel(proximosPartidos);
                } else {
                    mostrarMensajeSinPartidos();
                }
            } else {
                mostrarMensajeSinPartidos();
            }
        } else {
            mostrarMensajeSinPartidos();
        }
    } catch (error) {
        console.error('Error al cargar partidos:', error);
        mostrarErrorPartidos();
    }
}

// Mapeo de nombres de equipos a carpetas de imágenes (igual que en resultados.js)
const mapeoEquiposPartidos = {
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

function obtenerCarpetaEquipoPartido(nombreEquipo) {
    return mapeoEquiposPartidos[nombreEquipo] || null;
}

function obtenerAbreviaturaEquipo(nombreEquipo) {
    // Obtener las primeras 3 letras en mayúsculas
    const palabras = nombreEquipo.toUpperCase().split(' ');
    if (palabras.length >= 2) {
        // Si tiene múltiples palabras, tomar primera letra de cada una
        return palabras.map(p => p[0]).join('').substring(0, 3);
    }
    return nombreEquipo.substring(0, 3).toUpperCase();
}

function formatearFecha(fechaISO) {
    // Parsear la fecha como fecha local para evitar problemas de zona horaria
    const partesFecha = String(fechaISO).split('-');
    if (partesFecha.length === 3) {
        const año = parseInt(partesFecha[0], 10);
        const mes = parseInt(partesFecha[1], 10) - 1; // Los meses van de 0-11
        const dia = parseInt(partesFecha[2], 10);
        const fecha = new Date(año, mes, dia);
        const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
        const diaSemana = dias[fecha.getDay()];
        const diaFormateado = fecha.getDate().toString().padStart(2, '0');
        const mesFormateado = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const añoFormateado = fecha.getFullYear();
        return `${diaSemana} ${diaFormateado}.${mesFormateado}.${añoFormateado}`;
    }
    // Fallback si el formato no es el esperado
    const fecha = new Date(fechaISO);
    const dias = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${diaSemana} ${dia}.${mes}.${año}`;
}

// Función auxiliar para parsear fecha ISO como fecha local (sin problemas de zona horaria)
function parsearFechaLocal(fechaISO) {
    const partesFecha = String(fechaISO).split('-');
    if (partesFecha.length === 3) {
        const año = parseInt(partesFecha[0], 10);
        const mes = parseInt(partesFecha[1], 10) - 1; // Los meses van de 0-11
        const dia = parseInt(partesFecha[2], 10);
        return new Date(año, mes, dia);
    }
    // Fallback: intentar parsear normalmente
    return new Date(fechaISO);
}

// Mostrar partidos en el carrusel
function mostrarPartidosEnCarrusel(partidos) {
    const track = document.getElementById('track-partidos');
    if (!track) return;
    
    if (partidos.length === 0) {
        mostrarMensajeSinPartidos();
        return;
    }
    
    const partidosPorSlide = 3;
    const totalSlides = Math.ceil(partidos.length / partidosPorSlide);

    let html = '';
    for (let i = 0; i < totalSlides; i++) {
        const inicio = i * partidosPorSlide;
        const grupo = partidos.slice(inicio, inicio + partidosPorSlide);

        html += `
        <div class="carrusel-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
            <div class="partidos-slide-grid">
        `;

        grupo.forEach((partido) => {
            const carpetaLocal = obtenerCarpetaEquipoPartido(partido.local);
            const carpetaVisitante = obtenerCarpetaEquipoPartido(partido.visitante);
            const rutaLogoLocal = carpetaLocal ? `images/${carpetaLocal}/escudo.png` : 'images/LaligaLogo.jpg';
            const rutaLogoVisitante = carpetaVisitante ? `images/${carpetaVisitante}/escudo.png` : 'images/LaligaLogo.jpg';
            
            const abrevLocal = obtenerAbreviaturaEquipo(partido.local);
            const abrevVisitante = obtenerAbreviaturaEquipo(partido.visitante);
            
            const fechaFormateada = formatearFecha(partido.fecha_iso);
            const hashtag = `#${partido.local.replace(/\s+/g, '')}${partido.visitante.replace(/\s+/g, '')}`;

            html += `
                <div class="partido-card-moderno">
                    <div class="partido-header-moderno">
                        <div class="partido-fecha-moderna">${fechaFormateada}</div>
                        <div class="partido-hora-moderna">${partido.horario}</div>
                    </div>
                    <div class="partido-contenido-moderno">
                        <div class="partido-info-moderna">
                            <div class="partido-equipo-moderno">
                                <div class="equipo-abrev-moderna">${abrevLocal}</div>
                                <img src="${rutaLogoLocal}" 
                                     alt="${escapeHtml(partido.local)}" 
                                     class="equipo-logo-moderno"
                                     onerror="this.onerror=null; this.src='images/LaligaLogo.jpg';">
                            </div>
                            <div class="partido-marcador-moderno">
                                <span class="marcador-vacio">-</span>
                            </div>
                            <div class="partido-equipo-moderno">
                                <div class="equipo-abrev-moderna">${abrevVisitante}</div>
                                <img src="${rutaLogoVisitante}" 
                                     alt="${escapeHtml(partido.visitante)}" 
                                     class="equipo-logo-moderno"
                                     onerror="this.onerror=null; this.src='images/LaligaLogo.jpg';">
                            </div>
                        </div>
                        <div class="partido-hashtag-moderno">${hashtag}</div>
                        <div class="partido-menu-moderno">
                            <div class="menu-item-moderno" data-partido-id="${partido.id}" data-partido-jornada="${partido.jornada}" onclick="navegarAResultadoPartido(${partido.id}, ${partido.jornada})">
                                <span class="menu-icono-moderno">⚽</span>
                                <span class="menu-texto-moderno">Resultado</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
            </div>
        </div>
        `;
    }

    track.innerHTML = html;
    
    actualizarIndicadores('partidos', totalSlides);
    inicializarCarrusel('partidos', totalSlides);
}

// Mostrar mensaje cuando no hay partidos
function mostrarMensajeSinPartidos() {
    const track = document.getElementById('track-partidos');
    if (!track) return;
    
    track.innerHTML = `
        <div class="carrusel-slide active">
            <div class="partido-card">
                <div class="partido-contenido">
                    <p class="sin-contenido">No hay partidos próximos disponibles.</p>
                </div>
            </div>
        </div>
    `;
}

// Mostrar error al cargar partidos
function mostrarErrorPartidos() {
    const track = document.getElementById('track-partidos');
    if (!track) return;
    
    track.innerHTML = `
        <div class="carrusel-slide active">
            <div class="partido-card">
                <div class="partido-contenido">
                    <p class="error-mensaje">Error al cargar los partidos. Por favor, intenta más tarde.</p>
                </div>
            </div>
        </div>
    `;
}

// Inicializar carrusel con navegación
function inicializarCarrusel(tipo, totalSlides) {
    const btnPrev = document.getElementById(`btn-prev-${tipo}`);
    const btnNext = document.getElementById(`btn-next-${tipo}`);
    const track = document.getElementById(`track-${tipo}`);
    
    if (!btnPrev || !btnNext || !track || totalSlides <= 1) {
        if (btnPrev) btnPrev.style.display = 'none';
        if (btnNext) btnNext.style.display = 'none';
        return;
    }
    
    btnPrev.addEventListener('click', () => {
        const slides = track.querySelectorAll('.carrusel-slide');
        const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
        if (currentIndex > 0) {
            actualizarCarrusel(tipo, currentIndex - 1);
        }
    });
    
    btnNext.addEventListener('click', () => {
        const slides = track.querySelectorAll('.carrusel-slide');
        const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
        if (currentIndex < totalSlides - 1) {
            actualizarCarrusel(tipo, currentIndex + 1);
        }
    });

    // Auto-avance cada 10 segundos
    if (!window.__carruselTimers) {
        window.__carruselTimers = {};
    }
    if (window.__carruselTimers[tipo]) {
        clearInterval(window.__carruselTimers[tipo]);
    }
    window.__carruselTimers[tipo] = setInterval(() => {
        const slides = track.querySelectorAll('.carrusel-slide');
        if (!slides.length) return;
        const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
        const nextIndex = (currentIndex + 1) % totalSlides;
        actualizarCarrusel(tipo, nextIndex);
    }, 10000);
}

// Actualizar posición del carrusel
function actualizarCarrusel(tipo, index) {
    const track = document.getElementById(`track-${tipo}`);
    const slides = track ? track.querySelectorAll('.carrusel-slide') : [];
    const indicators = document.querySelectorAll(`#indicators-${tipo} .indicator`);
    const btnPrev = document.getElementById(`btn-prev-${tipo}`);
    const btnNext = document.getElementById(`btn-next-${tipo}`);
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    if (btnPrev) btnPrev.style.opacity = index === 0 ? '0.5' : '1';
    if (btnNext) btnNext.style.opacity = index === slides.length - 1 ? '0.5' : '1';

    // Desplazar el track para crear efecto de movimiento
    if (track) {
        track.style.transform = `translateX(-${index * 100}%)`;
    }
}

// Actualizar indicadores del carrusel
function actualizarIndicadores(tipo, total) {
    const container = document.getElementById(`indicators-${tipo}`);
    if (!container) return;
    
    if (total <= 1) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = Array.from({ length: total }, (_, i) => 
        `<span class="indicator ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');
    
    // Agregar eventos a los indicadores
    container.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            actualizarCarrusel(tipo, index);
        });
    });
}

// Escapar HTML para prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Función global para navegar al resultado de un partido
window.navegarAResultadoPartido = function(partidoId, jornada) {
    // Navegar a la página de resultados usando el router
    if (window.router) {
        window.router.navigate('resultados');
    } else {
        // Si el router no está disponible, usar hash directamente
        window.location.hash = '#resultados';
    }
    
    // Esperar a que la página se cargue y luego seleccionar la jornada
    const seleccionarJornada = () => {
        const jornadaSelect = document.getElementById('jornada-select');
        if (jornadaSelect) {
            jornadaSelect.value = jornada;
            
            // Disparar evento change para cargar los resultados de esa jornada
            const event = new Event('change', { bubbles: true });
            jornadaSelect.dispatchEvent(event);
            
            // Esperar a que se carguen los resultados y luego hacer scroll al partido
            setTimeout(() => {
                const partidoRow = document.querySelector(`tr[data-partido-id="${partidoId}"]`);
                if (partidoRow) {
                    partidoRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Resaltar el partido brevemente
                    partidoRow.style.backgroundColor = '#fff3cd';
                    setTimeout(() => {
                        partidoRow.style.backgroundColor = '';
                    }, 2000);
                }
            }, 800);
            return true;
        }
        return false;
    };
    
    // Intentar seleccionar la jornada inmediatamente
    if (!seleccionarJornada()) {
        // Si no está disponible, intentar después de un delay
        setTimeout(() => {
            if (!seleccionarJornada()) {
                // Último intento después de más tiempo
                setTimeout(seleccionarJornada, 1000);
            }
        }, 500);
    }
};

// Verificar si el usuario está logueado y mostrar botón agregar noticia
async function verificarYMostrarCarruselNoticias() {
    try {
        const response = await fetch('api/check_session.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        const btnAgregar = document.getElementById('btn-agregar-noticia');
        
        // Cargar noticias siempre (con o sin usuario)
        const usuarioActual = data.success && data.logged_in ? data.usuario : null;
        cargarNoticias(usuarioActual);
        
        // Mostrar botón agregar solo si el usuario está logueado
        if (btnAgregar) {
            if (data.success && data.logged_in) {
                btnAgregar.style.display = 'block';
                // Configurar botones de eliminar solo para el usuario logueado
                configurarBotonesEliminarNoticia(data.usuario);
            } else {
                btnAgregar.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        // Cargar noticias sin usuario si hay error
        cargarNoticias(null);
    }
}

// Configurar botones para eliminar noticias
function configurarBotonesEliminarNoticia(usuario) {
    // Los botones se mostrarán solo si el usuario es admin o el autor de la noticia
    // Esto se manejará cuando se carguen las noticias
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-eliminar-noticia')) {
            const noticiaId = e.target.getAttribute('data-id');
            if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
                await eliminarNoticia(noticiaId);
            }
        }
    });
}

// Eliminar noticia
async function eliminarNoticia(id) {
    try {
        const response = await fetch(`api/noticias.php?id=${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Noticia eliminada correctamente');
            // Recargar noticias con el usuario actual
            const sessionResponse = await fetch('api/check_session.php', {
                method: 'GET',
                credentials: 'include'
            });
            const sessionData = await sessionResponse.json();
            const usuarioActual = sessionData.success && sessionData.logged_in ? sessionData.usuario : null;
            cargarNoticias(usuarioActual);
        } else {
            alert('Error al eliminar la noticia: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error al eliminar noticia:', error);
        alert('Error al eliminar la noticia');
    }
}

// Inicializar todos los carruseles
export function inicializarCarruseles() {
    // Cargar próximos partidos siempre
    cargarProximosPartidos();
    
    // Cargar noticias siempre (todos pueden verlas)
    verificarYMostrarCarruselNoticias();
}

// Exportar funciones para uso en otros módulos
export { crearCarruselNoticias, crearCarruselProximosPartidos };

