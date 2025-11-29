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
        // Primero obtener todos los partidos para determinar la última jornada
        const partidosResponse = await fetch('api/partidos.php?jornada=all', {
            method: 'GET',
            credentials: 'include'
        });
        
        const partidosData = await partidosResponse.json();
        
        let ultimaJornada = null;
        
        if (partidosData.success && partidosData.partidos && partidosData.partidos.length > 0) {
            // Determinar la última jornada basándose en las fechas de los partidos
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);
            
            // Agrupar partidos por jornada y encontrar la fecha más reciente de cada jornada
            const jornadasConFechas = {};
            
            partidosData.partidos.forEach(partido => {
                const fechaPartido = parsearFechaLocal(partido.fecha_iso);
                fechaPartido.setHours(0, 0, 0, 0);
                
                if (!jornadasConFechas[partido.jornada]) {
                    jornadasConFechas[partido.jornada] = [];
                }
                jornadasConFechas[partido.jornada].push(fechaPartido);
            });
            
            // Encontrar la jornada con la fecha más reciente (que no sea futura)
            let fechaMasReciente = null;
            
            for (const [jornada, fechas] of Object.entries(jornadasConFechas)) {
                // Obtener la fecha más reciente de esta jornada
                const fechaMaxJornada = new Date(Math.max(...fechas.map(f => f.getTime())));
                
                // Solo considerar jornadas que ya han comenzado o están en curso (fecha <= hoy)
                if (fechaMaxJornada <= hoy) {
                    if (!fechaMasReciente || fechaMaxJornada > fechaMasReciente) {
                        fechaMasReciente = fechaMaxJornada;
                        ultimaJornada = parseInt(jornada, 10);
                    }
                }
            }
            
            // Si no hay jornadas pasadas, usar la jornada con la fecha más cercana a hoy (pero no futura)
            if (ultimaJornada === null) {
                let fechaMasCercana = null;
                for (const [jornada, fechas] of Object.entries(jornadasConFechas)) {
                    const fechaMaxJornada = new Date(Math.max(...fechas.map(f => f.getTime())));
                    if (!fechaMasCercana || Math.abs(fechaMaxJornada - hoy) < Math.abs(fechaMasCercana - hoy)) {
                        fechaMasCercana = fechaMaxJornada;
                        ultimaJornada = parseInt(jornada, 10);
                    }
                }
            }
        }
        
        // Obtener todas las noticias
        const response = await fetch('api/noticias.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success && data.noticias && data.noticias.length > 0) {
            console.log('Total noticias recibidas:', data.noticias.length);
            console.log('Última jornada detectada (de partidos):', ultimaJornada);
            
            // Determinar la última jornada que realmente tiene noticias
            const jornadasConNoticias = {};
            console.log('Analizando todas las noticias recibidas:');
            
            data.noticias.forEach((noticia, idx) => {
                console.log(`Noticia ${idx + 1}:`, {
                    id: noticia.id,
                    jornada: noticia.jornada,
                    tipoJornada: typeof noticia.jornada,
                    titulo: noticia.titulo,
                    tieneJornada: noticia.jornada !== null && noticia.jornada !== undefined
                });
                
                // Aceptar jornada como número o string
                if (noticia.jornada !== null && noticia.jornada !== undefined && noticia.jornada !== '') {
                    // Convertir a número si es string
                    const jornada = typeof noticia.jornada === 'number' ? noticia.jornada : parseInt(noticia.jornada, 10);
                    if (!isNaN(jornada) && jornada > 0) {
                        if (!jornadasConNoticias[jornada]) {
                            jornadasConNoticias[jornada] = [];
                        }
                        jornadasConNoticias[jornada].push(noticia);
                    }
                }
            });
            
            // Encontrar la jornada más alta que tenga noticias
            const jornadasDisponibles = Object.keys(jornadasConNoticias).map(j => parseInt(j, 10)).sort((a, b) => b - a);
            const ultimaJornadaConNoticias = jornadasDisponibles.length > 0 ? jornadasDisponibles[0] : null;
            
            console.log('Jornadas con noticias:', jornadasDisponibles);
            console.log('Total jornadas con noticias:', jornadasDisponibles.length);
            console.log('Última jornada con noticias:', ultimaJornadaConNoticias);
            
            // Filtrar noticias para mostrar solo las de la última jornada que tenga noticias
            let noticiasFiltradas = [];
            
            if (ultimaJornadaConNoticias !== null && jornadasConNoticias[ultimaJornadaConNoticias]) {
                noticiasFiltradas = jornadasConNoticias[ultimaJornadaConNoticias];
                console.log('Noticias filtradas por última jornada con noticias:', noticiasFiltradas.length);
                console.log('Detalle noticias filtradas:', noticiasFiltradas.map(n => ({id: n.id, jornada: n.jornada, titulo: n.titulo})));
            } else {
                console.log('No se detectó jornada con noticias válida, mostrando todas las noticias');
                noticiasFiltradas = data.noticias;
                console.log('Mostrando todas las noticias sin filtrar:', noticiasFiltradas.length);
            }
            
            // Obtener usuario actual para mostrar botones de eliminar
            const sessionResponse = await fetch('api/check_session.php', {
                method: 'GET',
                credentials: 'include'
            });
            const sessionData = await sessionResponse.json();
            const usuarioActual = sessionData.success && sessionData.logged_in ? sessionData.usuario : null;
            
            if (noticiasFiltradas.length > 0) {
                mostrarNoticiasEnCarrusel(noticiasFiltradas, usuarioActual);
            } else {
                console.log('No hay noticias filtradas, mostrando mensaje sin noticias');
                mostrarMensajeSinNoticias();
            }
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
    console.log('=== INICIANDO mostrarNoticiasEnCarrusel ===');
    console.log('Cantidad de noticias recibidas:', noticias.length);
    
    // Función auxiliar para intentar mostrar las noticias con retry
    const intentarMostrar = (intentos = 0) => {
        const track = document.getElementById('track-noticias');
        if (!track) {
            if (intentos < 5) {
                console.log(`Track no encontrado, reintentando... (intento ${intentos + 1}/5)`);
                setTimeout(() => intentarMostrar(intentos + 1), 200);
                return;
            } else {
                console.error('ERROR: No se encontró el elemento track-noticias después de 5 intentos');
                console.log('Buscando elemento track-noticias...');
                console.log('Elementos con id track:', document.querySelectorAll('[id*="track"]'));
                console.log('Todos los elementos con class carrusel:', document.querySelectorAll('.carrusel-track'));
                return;
            }
        }
        
        mostrarNoticiasEnTrack(track, noticias, usuarioActual);
    };
    
    intentarMostrar();
}

// Función auxiliar que realmente muestra las noticias en el track
function mostrarNoticiasEnTrack(track, noticias, usuarioActual) {
    console.log('=== MOSTRAR NOTICIAS EN TRACK ===');
    console.log('Track encontrado:', track);
    console.log('Track ID:', track.id);
    
    // CRÍTICO: Resetear el transform INMEDIATAMENTE al encontrar el track
    // Puede tener un transform residual de una carga anterior
    track.style.transform = 'translateX(0%)';
    track.style.transition = 'none'; // Sin transición durante el reset inicial
    
    console.log('Track innerHTML antes:', track.innerHTML.substring(0, 100));
    console.log('Cantidad de noticias:', noticias.length);
    console.log('Noticias a mostrar:', noticias.map(n => ({id: n.id, jornada: n.jornada, titulo: n.titulo})));
    
    if (noticias.length === 0) {
        console.log('No hay noticias para mostrar');
        track.innerHTML = `
            <div class="carrusel-slide active">
                <div class="noticia-card sin-imagen">
                    <div class="noticia-contenido">
                        <p class="sin-contenido">No hay noticias disponibles. ¡Sé el primero en agregar una!</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    const htmlNoticias = noticias.map((noticia, index) => {
        // Mostrar botón eliminar solo si el usuario es el autor o es admin
        const puedeEliminar = usuarioActual && 
            (parseInt(usuarioActual.id, 10) === parseInt(noticia.usuario_id, 10) || usuarioActual.rol === 'admin');
        
        const tieneImagen = noticia.imagen_url && noticia.imagen_url.trim() !== '' ? true : false;
        return `
        <div class="carrusel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
            <div class="noticia-card ${!tieneImagen ? 'sin-imagen' : ''}">
                ${tieneImagen ? `<div class="noticia-imagen-container"><img src="${noticia.imagen_url}" alt="${escapeHtml(noticia.titulo)}" class="noticia-imagen"></div>` : ''}
                <div class="noticia-contenido">
                    <h3 class="noticia-titulo">${escapeHtml(noticia.titulo || 'Sin título')}</h3>
                    <p class="noticia-texto">${escapeHtml(noticia.contenido || 'Sin contenido')}</p>
                    <div class="noticia-footer">
                        <span class="noticia-autor">Por: ${escapeHtml(noticia.usuario_nombre || 'Desconocido')}</span>
                        <span class="noticia-fecha">${noticia.fecha_creacion || ''}</span>
                        ${puedeEliminar ? `<button class="btn-eliminar-noticia" data-id="${noticia.id}">Eliminar</button>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    }).join('');
    
    console.log('HTML generado, longitud:', htmlNoticias.length);
    console.log('Primeros 500 caracteres del HTML:', htmlNoticias.substring(0, 500));
    
    // CRÍTICO: Resetear el transform ANTES de insertar el HTML para evitar desplazamiento
    track.style.transform = 'translateX(0%)';
    track.style.transition = 'none'; // Sin transición durante la inserción inicial
    
    track.innerHTML = htmlNoticias;
    
    console.log('HTML insertado en track');
    console.log('Track innerHTML después:', track.innerHTML.substring(0, 200));
    
    // Esperar un momento para que el DOM se actualice
    setTimeout(() => {
        const slides = track.querySelectorAll('.carrusel-slide');
        console.log('Cantidad de slides encontrados:', slides.length);
        console.log('Cantidad de noticias esperadas:', noticias.length);
        console.log('Slides encontrados:', Array.from(slides).map((s, i) => ({
            index: i,
            hasActive: s.classList.contains('active'),
            innerHTML: s.innerHTML.substring(0, 100)
        })));
        
        // Verificar que el HTML se haya insertado correctamente
        if (track.innerHTML.trim() === '' || slides.length === 0) {
            console.error('ERROR: El track está vacío o no hay slides después de insertar HTML');
            track.innerHTML = `
                <div class="carrusel-slide active">
                    <div class="noticia-card sin-imagen">
                        <div class="noticia-contenido">
                            <p class="error-mensaje">Error al cargar las noticias. Por favor, intenta más tarde.</p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }
        
        // Verificar que se hayan creado todos los slides
        if (slides.length !== noticias.length) {
            console.error(`ERROR: Se esperaban ${noticias.length} slides pero se encontraron ${slides.length}`);
        }
        
        // CRÍTICO: Configurar el ancho del track para que contenga todos los slides
        // El track debe tener un ancho total de: número_de_slides * 100%
        const wrapper = track.closest('.carrusel-wrapper');
        const wrapperWidth = wrapper ? wrapper.offsetWidth : track.offsetWidth || 1000;
        track.style.width = `${noticias.length * 100}%`;
        track.style.minWidth = `${noticias.length * 100}%`;
        
        // Asegurar que cada slide tenga exactamente el ancho correcto
        // Cada slide debe ocupar 100% del wrapper, que es 100/número_de_slides del track
        const porcentajePorSlide = 100 / noticias.length;
        slides.forEach(slide => {
            slide.style.width = `${porcentajePorSlide}%`;
            slide.style.minWidth = `${porcentajePorSlide}%`;
            slide.style.flexShrink = '0';
            slide.style.flexBasis = `${porcentajePorSlide}%`;
        });
        
        // Resetear transform y configurar como carrusel
        track.style.transform = 'translateX(0%)';
        track.style.transition = 'none';
        track.style.display = 'flex';
        track.style.visibility = 'visible';
        track.style.opacity = '1';
        track.style.height = '500px';
        track.style.maxHeight = '500px';
        
        // Configurar wrapper
        if (wrapper) {
            wrapper.style.height = '500px';
            wrapper.style.maxHeight = '500px';
            wrapper.style.overflow = 'hidden';
            wrapper.style.width = '100%';
        }
        
        // Asegurar que solo el primer slide esté activo
        slides.forEach((slide, idx) => {
            if (idx === 0) {
                slide.classList.add('active');
                slide.style.opacity = '1';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0.4';
            }
        });
        
        // Mostrar botones de navegación si hay más de una noticia
        const btnPrev = document.getElementById('btn-prev-noticias');
        const btnNext = document.getElementById('btn-next-noticias');
        const indicators = document.getElementById('indicators-noticias');
        
        if (noticias.length > 1) {
            if (btnPrev) btnPrev.style.display = 'flex';
            if (btnNext) btnNext.style.display = 'flex';
            if (indicators) indicators.style.display = 'flex';
        } else {
            if (btnPrev) btnPrev.style.display = 'none';
            if (btnNext) btnNext.style.display = 'none';
            if (indicators) indicators.style.display = 'none';
        }
        
        // CRÍTICO: Asegurar que el transform esté en 0% ANTES de inicializar
        track.style.transform = 'translateX(0%)';
        track.style.transition = 'none';
        
        // Inicializar indicadores y carrusel
        actualizarIndicadores('noticias', noticias.length);
        inicializarCarrusel('noticias', noticias.length);
        
        // Forzar posición 0 después de inicializar (con un pequeño delay para asegurar que todo esté listo)
        setTimeout(() => {
            // Asegurar que el transform esté en 0% y que la transición esté activa
            track.style.transform = 'translateX(0%)';
            track.style.transition = 'transform 0.6s ease';
            
            // Asegurar que el primer slide esté activo y los demás inactivos
            slides.forEach((slide, idx) => {
                if (idx === 0) {
                    slide.classList.add('active');
                    slide.style.opacity = '1';
                } else {
                    slide.classList.remove('active');
                    slide.style.opacity = '0.4';
                }
            });
            
            if (btnPrev) btnPrev.style.opacity = '0.5';
            if (btnNext && noticias.length > 1) {
                btnNext.style.opacity = '1';
            }
            
            console.log('Carrusel inicializado correctamente');
        }, 150);
        
        console.log('=== FINALIZANDO mostrarNoticiasEnCarrusel ===');
    }, 100);
}

// Mostrar mensaje cuando no hay noticias
function mostrarMensajeSinNoticias() {
    const track = document.getElementById('track-noticias');
    if (!track) {
        console.error('ERROR: No se encontró el elemento track-noticias');
        return;
    }
    
    track.innerHTML = `
        <div class="carrusel-slide active">
            <div class="noticia-card sin-imagen">
                <div class="noticia-contenido">
                    <p class="sin-contenido">No hay noticias disponibles. ¡Sé el primero en agregar una!</p>
                </div>
            </div>
        </div>
    `;
    
    // Asegurar que el track sea visible
    track.style.display = 'flex';
    track.style.visibility = 'visible';
    track.style.opacity = '1';
}

// Mostrar error al cargar noticias
function mostrarErrorNoticias() {
    const track = document.getElementById('track-noticias');
    if (!track) {
        console.error('ERROR: No se encontró el elemento track-noticias');
        return;
    }
    
    track.innerHTML = `
        <div class="carrusel-slide active">
            <div class="noticia-card sin-imagen">
                <div class="noticia-contenido">
                    <p class="error-mensaje">Error al cargar las noticias. Por favor, intenta más tarde.</p>
                </div>
            </div>
        </div>
    `;
    
    // Asegurar que el track sea visible
    track.style.display = 'flex';
    track.style.visibility = 'visible';
    track.style.opacity = '1';
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
    
    // Esperar un momento para que el DOM se actualice
    setTimeout(() => {
        const slides = track.querySelectorAll('.carrusel-slide');
        
        if (slides.length === 0) {
            console.error('ERROR: No hay slides después de insertar HTML');
            return;
        }
        
        // CRÍTICO: Configurar el ancho del track para que contenga todos los slides
        // El track debe tener un ancho total de: número_de_slides * 100%
        const wrapper = track.closest('.carrusel-wrapper');
        track.style.width = `${totalSlides * 100}%`;
        track.style.minWidth = `${totalSlides * 100}%`;
        
        // Asegurar que cada slide tenga exactamente el ancho correcto
        // Cada slide debe ocupar 100% del wrapper, que es 100/número_de_slides del track
        const porcentajePorSlide = 100 / totalSlides;
        slides.forEach(slide => {
            slide.style.width = `${porcentajePorSlide}%`;
            slide.style.minWidth = `${porcentajePorSlide}%`;
            slide.style.flexShrink = '0';
            slide.style.flexBasis = `${porcentajePorSlide}%`;
        });
        
        // Resetear transform y configurar como carrusel
        track.style.transform = 'translateX(0%)';
        track.style.transition = 'none';
        track.style.display = 'flex';
        track.style.visibility = 'visible';
        track.style.opacity = '1';
        track.style.height = '500px';
        track.style.maxHeight = '500px';
        
        // Configurar wrapper
        if (wrapper) {
            wrapper.style.height = '500px';
            wrapper.style.maxHeight = '500px';
            wrapper.style.overflow = 'hidden';
            wrapper.style.width = '100%';
        }
        
        // Asegurar que solo el primer slide esté activo
        slides.forEach((slide, idx) => {
            if (idx === 0) {
                slide.classList.add('active');
                slide.style.opacity = '1';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0.4';
            }
        });
        
        // Inicializar indicadores y carrusel
        actualizarIndicadores('partidos', totalSlides);
        inicializarCarrusel('partidos', totalSlides);
        
        // Forzar posición 0 después de inicializar
        setTimeout(() => {
            track.style.transform = 'translateX(0%)';
            track.style.transition = 'transform 0.6s ease';
        }, 150);
    }, 100);
}

// Mostrar mensaje cuando no hay partidos
function mostrarMensajeSinPartidos() {
    const track = document.getElementById('track-partidos');
    if (!track) {
        console.error('ERROR: No se encontró el elemento track-partidos');
        return;
    }
    
    track.innerHTML = `
        <div class="carrusel-slide active">
            <div class="partido-card">
                <div class="partido-contenido">
                    <p class="sin-contenido">No hay partidos próximos disponibles.</p>
                </div>
            </div>
        </div>
    `;
    
    // Asegurar que el track sea visible
    track.style.display = 'flex';
    track.style.visibility = 'visible';
    track.style.opacity = '1';
}

// Mostrar error al cargar partidos
function mostrarErrorPartidos() {
    const track = document.getElementById('track-partidos');
    if (!track) {
        console.error('ERROR: No se encontró el elemento track-partidos');
        return;
    }
    
    track.innerHTML = `
        <div class="carrusel-slide active">
            <div class="partido-card">
                <div class="partido-contenido">
                    <p class="error-mensaje">Error al cargar los partidos. Por favor, intenta más tarde.</p>
                </div>
            </div>
        </div>
    `;
    
    // Asegurar que el track sea visible
    track.style.display = 'flex';
    track.style.visibility = 'visible';
    track.style.opacity = '1';
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
    
    // CRÍTICO: Asegurar que el transform esté en 0% al inicializar
    track.style.transform = 'translateX(0%)';
    
    // Remover event listeners previos si existen para evitar duplicados
    const prevHandler = btnPrev._carruselHandler;
    const nextHandler = btnNext._carruselHandler;
    if (prevHandler) btnPrev.removeEventListener('click', prevHandler);
    if (nextHandler) btnNext.removeEventListener('click', nextHandler);
    
    // Crear nuevos handlers
    const handlePrev = () => {
        const slides = track.querySelectorAll('.carrusel-slide');
        const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
        if (currentIndex > 0) {
            actualizarCarrusel(tipo, currentIndex - 1);
        }
    };
    
    const handleNext = () => {
        const slides = track.querySelectorAll('.carrusel-slide');
        const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
        if (currentIndex < totalSlides - 1) {
            actualizarCarrusel(tipo, currentIndex + 1);
        }
    };
    
    // Guardar referencias a los handlers para poder removerlos después
    btnPrev._carruselHandler = handlePrev;
    btnNext._carruselHandler = handleNext;
    
    // Agregar los event listeners
    btnPrev.addEventListener('click', handlePrev);
    btnNext.addEventListener('click', handleNext);

    // Auto-avance cada 10 segundos (solo si hay más de un slide)
    if (!window.__carruselTimers) {
        window.__carruselTimers = {};
    }
    if (window.__carruselTimers[tipo]) {
        clearInterval(window.__carruselTimers[tipo]);
    }
    
    // Solo activar auto-avance si hay más de un slide
    if (totalSlides > 1) {
        window.__carruselTimers[tipo] = setInterval(() => {
            const slides = track.querySelectorAll('.carrusel-slide');
            if (!slides.length) return;
            const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
            // Si no se encuentra un slide activo, usar el primero
            if (currentIndex === -1) {
                actualizarCarrusel(tipo, 0);
                return;
            }
            const nextIndex = (currentIndex + 1) % totalSlides;
            actualizarCarrusel(tipo, nextIndex);
        }, 10000);
    }
}

// Actualizar posición del carrusel
function actualizarCarrusel(tipo, index) {
    const track = document.getElementById(`track-${tipo}`);
    if (!track) {
        console.error(`ERROR: No se encontró el elemento track-${tipo}`);
        return;
    }
    
    const slides = track.querySelectorAll('.carrusel-slide');
    if (slides.length === 0) {
        console.warn(`ADVERTENCIA: No hay slides en el carrusel ${tipo}`);
        return;
    }
    
    // Validar que el índice esté dentro del rango válido
    if (index < 0 || index >= slides.length) {
        console.warn(`ADVERTENCIA: Índice ${index} fuera de rango para carrusel ${tipo} (0-${slides.length - 1})`);
        index = 0; // Usar el primer slide como fallback
    }
    
    const indicators = document.querySelectorAll(`#indicators-${tipo} .indicator`);
    const btnPrev = document.getElementById(`btn-prev-${tipo}`);
    const btnNext = document.getElementById(`btn-next-${tipo}`);
    
    slides.forEach((slide, i) => {
        const isActive = i === index;
        slide.classList.toggle('active', isActive);
        // Actualizar opacidad: activo = 1, inactivo = 0.4
        slide.style.opacity = isActive ? '1' : '0.4';
    });
    
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
    
    if (btnPrev) btnPrev.style.opacity = index === 0 ? '0.5' : '1';
    if (btnNext) btnNext.style.opacity = index === slides.length - 1 ? '0.5' : '1';

    // Asegurar que la transición esté activa antes de desplazar
    track.style.transition = 'transform 0.6s ease';
    
    // Calcular el desplazamiento en píxeles basado en el ancho del wrapper
    // Cada slide ocupa el 100% del ancho del wrapper
    const wrapper = track.closest('.carrusel-wrapper');
    if (wrapper && wrapper.offsetWidth > 0) {
        const wrapperWidth = wrapper.offsetWidth;
        const desplazamientoPx = -(index * wrapperWidth);
        track.style.transform = `translateX(${desplazamientoPx}px)`;
    } else {
        // Fallback: usar porcentaje si no se puede obtener el ancho del wrapper
        const porcentajePorSlide = 100 / slides.length;
        const desplazamiento = -(index * porcentajePorSlide);
        track.style.transform = `translateX(${desplazamiento}%)`;
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
        cargarNoticias();
        
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
        cargarNoticias();
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
            // Recargar noticias
            cargarNoticias();
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
    try {
        // Cargar próximos partidos siempre
        cargarProximosPartidos().catch(error => {
            console.error('Error al cargar próximos partidos:', error);
            mostrarErrorPartidos();
        });
        
        // Cargar noticias siempre (todos pueden verlas)
        verificarYMostrarCarruselNoticias().catch(error => {
            console.error('Error al verificar y mostrar carrusel de noticias:', error);
            mostrarErrorNoticias();
        });
    } catch (error) {
        console.error('Error al inicializar carruseles:', error);
        // Asegurar que al menos se muestren mensajes de error
        mostrarErrorNoticias();
        mostrarErrorPartidos();
    }
}

// Exportar funciones para uso en otros módulos
export { crearCarruselNoticias, crearCarruselProximosPartidos };

