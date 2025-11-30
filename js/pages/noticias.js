// Página de Noticias

function NoticiasPage() {
    return `
        <section id="noticias">
            <h1>Noticias</h1>
            <div id="noticias-content" class="noticias-content">
                <p class="noticias-loading">Cargando noticias...</p>
            </div>
        </section>
    `;
}

async function init() {
    console.log('Página de noticias cargada');
    // Obtener usuario actual para mostrar botones de eliminar
    try {
        const sessionResponse = await fetch('api/check_session.php', {
            method: 'GET',
            credentials: 'include'
        });
        const sessionData = await sessionResponse.json();
        const usuarioActual = sessionData.success && sessionData.logged_in ? sessionData.usuario : null;
        cargarNoticiasPagina(usuarioActual);
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        cargarNoticiasPagina(null);
    }
}

// Función auxiliar para parsear fechas ISO a Date local
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

async function cargarNoticiasPagina(usuarioActual = null) {
    const content = document.getElementById('noticias-content');
    if (!content) {
        console.warn('No se encontró noticias-content, reintentando...');
        setTimeout(cargarNoticiasPagina, 100);
        return;
    }

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
        const response = await fetch('api/noticias.php');
        const data = await response.json();

        if (!data.success) {
            content.innerHTML = `<p class="noticias-error">Error al cargar las noticias: ${data.error || 'Error desconocido'}</p>`;
            return;
        }

        const todasLasNoticias = data.noticias || [];

        console.log('Total de noticias recibidas:', todasLasNoticias.length);

        if (todasLasNoticias.length === 0) {
            content.innerHTML = `<p class="noticias-vacia">No hay noticias disponibles por el momento.</p>`;
            return;
        }

        // Agrupar noticias por jornada
        const noticiasPorJornada = {};
        const noticiasSinJornada = [];

        todasLasNoticias.forEach(noticia => {
            if (noticia.jornada !== null && noticia.jornada !== undefined && noticia.jornada !== '') {
                const jornadaNum = parseInt(noticia.jornada, 10);
                if (!isNaN(jornadaNum)) {
                    if (!noticiasPorJornada[jornadaNum]) {
                        noticiasPorJornada[jornadaNum] = [];
                    }
                    noticiasPorJornada[jornadaNum].push(noticia);
                } else {
                    console.log('Noticia con jornada inválida:', noticia.jornada, noticia);
                    noticiasSinJornada.push(noticia);
                }
            } else {
                console.log('Noticia sin jornada:', noticia);
                noticiasSinJornada.push(noticia);
            }
        });

        console.log('Noticias agrupadas por jornada:', Object.keys(noticiasPorJornada));
        console.log('Cantidad de jornadas con noticias:', Object.keys(noticiasPorJornada).length);
        console.log('Detalle de noticias por jornada:', noticiasPorJornada);
        console.log('Noticias sin jornada:', noticiasSinJornada.length);

        // Ordenar jornadas de mayor a menor
        const jornadasOrdenadas = Object.keys(noticiasPorJornada)
            .map(j => parseInt(j, 10))
            .sort((a, b) => b - a);

        // Debug: ver qué jornadas se detectaron
        console.log('Jornadas detectadas:', jornadasOrdenadas);
        console.log('Total de jornadas:', jornadasOrdenadas.length);

        // Construir HTML agrupado por jornadas
        let html = '';

        // Determinar qué jornadas mostrar expandidas por defecto (las 2 más recientes)
        const jornadasExpandidas = jornadasOrdenadas.slice(0, 2);
        
        console.log('Jornadas expandidas por defecto:', jornadasExpandidas);
        console.log('Usuario actual:', usuarioActual);

        // Mostrar noticias agrupadas por jornada
        jornadasOrdenadas.forEach(jornada => {
            const noticiasJornada = noticiasPorJornada[jornada];
            const estaExpandida = jornadasExpandidas.includes(jornada);
            const cantidadNoticias = noticiasJornada.length;
            
            html += `
                <div class="jornada-seccion">
                    <div class="jornada-header" data-jornada="${jornada}">
                        <h2 class="jornada-titulo">
                            <span class="jornada-icono">${estaExpandida ? '▼' : '▶'}</span>
                            Jornada ${jornada}
                            <span class="jornada-contador">(${cantidadNoticias} ${cantidadNoticias === 1 ? 'noticia' : 'noticias'})</span>
                        </h2>
                    </div>
                    <div class="jornada-contenido ${estaExpandida ? 'expandida' : 'colapsada'}">
                        <div class="noticias-grid">
                            ${noticiasJornada
                                .map(
                                    (n) => {
                                        // Verificar si el usuario puede eliminar esta noticia
                                        const esAutor = usuarioActual && parseInt(usuarioActual.id) === parseInt(n.usuario_id);
                                        const esAdmin = usuarioActual && usuarioActual.rol === 'admin';
                                        const puedeEliminar = esAutor || esAdmin;
                                        
                                        // Debug: Solo loggear para la primera noticia
                                        if (noticiasJornada.indexOf(n) === 0 && jornadasOrdenadas.indexOf(jornada) === 0) {
                                            console.log('Debug primera noticia:', {
                                                usuarioActual: usuarioActual ? {id: usuarioActual.id, rol: usuarioActual.rol} : null,
                                                noticia: {id: n.id, usuario_id: n.usuario_id},
                                                esAutor,
                                                esAdmin,
                                                puedeEliminar
                                            });
                                        }
                                        const tieneImagen = n.imagen_url ? true : false;
                                        
                                        return `
                            <article class="noticia-card ${!tieneImagen ? 'sin-imagen' : ''}" data-noticia-id="${n.id}" onclick="mostrarNoticiaCompleta(${n.id})">
                                ${tieneImagen ? `<div class="noticia-imagen-container"><img src="${n.imagen_url}" alt="${n.titulo}" class="noticia-imagen" onerror="this.style.display='none'"></div>` : ''}
                                <div class="noticia-contenido">
                                    <div class="noticia-header">
                                        <h2>${n.titulo}</h2>
                                        <span class="noticia-fecha">${n.fecha_creacion}</span>
                                    </div>
                                    <p class="noticia-texto">${n.contenido}</p>
                                    <div class="noticia-footer-card">
                                        <p class="noticia-autor">Por ${n.usuario_nombre}</p>
                                        ${puedeEliminar ? `<button class="btn-eliminar-noticia" data-id="${n.id}" onclick="event.stopPropagation(); eliminarNoticia(${n.id})">Eliminar</button>` : ''}
                                    </div>
                                </div>
                            </article>
                        `;
                                    }
                                )
                                .join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        // Mostrar noticias sin jornada al final (si las hay)
        if (noticiasSinJornada.length > 0) {
            html += `
                <div class="jornada-seccion">
                    <div class="jornada-header" data-jornada="sin-jornada">
                        <h2 class="jornada-titulo">
                            <span class="jornada-icono">▼</span>
                            Otras Noticias
                            <span class="jornada-contador">(${noticiasSinJornada.length} ${noticiasSinJornada.length === 1 ? 'noticia' : 'noticias'})</span>
                        </h2>
                    </div>
                    <div class="jornada-contenido expandida">
                        <div class="noticias-grid">
                            ${noticiasSinJornada
                                .map(
                                    (n) => {
                                        // Verificar si el usuario puede eliminar esta noticia
                                        const esAutor = usuarioActual && parseInt(usuarioActual.id) === parseInt(n.usuario_id);
                                        const esAdmin = usuarioActual && usuarioActual.rol === 'admin';
                                        const puedeEliminar = esAutor || esAdmin;
                                        
                                        // Debug: Solo loggear para la primera noticia
                                        if (noticiasJornada.indexOf(n) === 0 && jornadasOrdenadas.indexOf(jornada) === 0) {
                                            console.log('Debug primera noticia:', {
                                                usuarioActual: usuarioActual ? {id: usuarioActual.id, rol: usuarioActual.rol} : null,
                                                noticia: {id: n.id, usuario_id: n.usuario_id},
                                                esAutor,
                                                esAdmin,
                                                puedeEliminar
                                            });
                                        }
                                        const tieneImagen = n.imagen_url ? true : false;
                                        
                                        return `
                            <article class="noticia-card ${!tieneImagen ? 'sin-imagen' : ''}" data-noticia-id="${n.id}" onclick="mostrarNoticiaCompleta(${n.id})">
                                ${tieneImagen ? `<div class="noticia-imagen-container"><img src="${n.imagen_url}" alt="${n.titulo}" class="noticia-imagen" onerror="this.style.display='none'"></div>` : ''}
                                <div class="noticia-contenido">
                                    <div class="noticia-header">
                                        <h2>${n.titulo}</h2>
                                        <span class="noticia-fecha">${n.fecha_creacion}</span>
                                    </div>
                                    <p class="noticia-texto">${n.contenido}</p>
                                    <div class="noticia-footer-card">
                                        <p class="noticia-autor">Por ${n.usuario_nombre}</p>
                                        ${puedeEliminar ? `<button class="btn-eliminar-noticia" data-id="${n.id}" onclick="event.stopPropagation(); eliminarNoticia(${n.id})">Eliminar</button>` : ''}
                                    </div>
                                </div>
                            </article>
                        `;
                                    }
                                )
                                .join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        content.innerHTML = html;
        
        // Guardar noticias en variable global para acceso desde modal
        window.todasLasNoticias = [...noticias];
        
        // Configurar eventos para acordeón de jornadas
        configurarAcordeonJornadas();
        
        // Configurar eventos para botones de eliminar
        configurarBotonesEliminarNoticia(usuarioActual);
    } catch (error) {
        console.error('Error al cargar noticias:', error);
        content.innerHTML = `<p class="noticias-error">Error de conexión al cargar las noticias.</p>`;
    }
}

// Configurar acordeón para jornadas
function configurarAcordeonJornadas() {
    const headers = document.querySelectorAll('.jornada-header');
    
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const jornada = header.getAttribute('data-jornada');
            const contenido = header.nextElementSibling;
            const icono = header.querySelector('.jornada-icono');
            
            if (contenido) {
                const estaExpandida = contenido.classList.contains('expandida');
                
                if (estaExpandida) {
                    contenido.classList.remove('expandida');
                    contenido.classList.add('colapsada');
                    if (icono) icono.textContent = '▶';
                } else {
                    contenido.classList.remove('colapsada');
                    contenido.classList.add('expandida');
                    if (icono) icono.textContent = '▼';
                }
            }
        });
        
        // Hacer que el header sea clickeable visualmente
        header.style.cursor = 'pointer';
    });
}

// Configurar botones para eliminar noticias
function configurarBotonesEliminarNoticia(usuario) {
    // Remover listeners anteriores para evitar duplicados
    const botones = document.querySelectorAll('.btn-eliminar-noticia');
    botones.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    
    // Agregar nuevo listener
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('btn-eliminar-noticia')) {
            const noticiaId = e.target.getAttribute('data-id');
            if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
                await eliminarNoticia(noticiaId);
            }
        }
    });
}

// Mostrar noticia completa en modal
async function mostrarNoticiaCompleta(noticiaId) {
    const noticia = window.todasLasNoticias.find(n => n.id === noticiaId);
    if (!noticia) {
        console.error('Noticia no encontrada:', noticiaId);
        return;
    }
    
    // Verificar si el usuario puede eliminar esta noticia
    try {
        const sessionResponse = await fetch('api/check_session.php', {
            method: 'GET',
            credentials: 'include'
        });
        const sessionData = await sessionResponse.json();
        const usuarioActual = sessionData.success && sessionData.logged_in ? sessionData.usuario : null;
        const esAutor = usuarioActual && parseInt(usuarioActual.id) === parseInt(noticia.usuario_id);
        const esAdmin = usuarioActual && usuarioActual.rol === 'admin';
        const puedeEliminar = esAutor || esAdmin;
        
        const modalHTML = `
            <div class="modal-noticia-completa" id="modal-noticia-${noticiaId}">
                <div class="modal-noticia-completa-content">
                    <span class="modal-noticia-completa-close" onclick="cerrarNoticiaCompleta(${noticiaId})">&times;</span>
                    ${noticia.imagen_url ? `<div class="modal-noticia-imagen-container"><img src="${noticia.imagen_url}" alt="${noticia.titulo}" class="modal-noticia-imagen" onerror="this.style.display='none'"></div>` : ''}
                    <div class="modal-noticia-header">
                        <h2>${noticia.titulo}</h2>
                        <span class="modal-noticia-fecha">${noticia.fecha_creacion}</span>
                    </div>
                    <div class="modal-noticia-contenido">
                        <p>${noticia.contenido}</p>
                    </div>
                    <div class="modal-noticia-footer">
                        <p class="modal-noticia-autor">Por ${noticia.usuario_nombre}</p>
                        ${puedeEliminar ? `<button class="btn-eliminar-noticia-modal" onclick="eliminarNoticia(${noticiaId})">Eliminar</button>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Remover modal anterior si existe
        const modalAnterior = document.querySelector('.modal-noticia-completa');
        if (modalAnterior) {
            modalAnterior.remove();
        }
        
        // Agregar modal al body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Cerrar al hacer clic fuera del modal
        const modal = document.getElementById(`modal-noticia-${noticiaId}`);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarNoticiaCompleta(noticiaId);
            }
        });
        
        // Prevenir scroll del body cuando el modal está abierto
        document.body.style.overflow = 'hidden';
    } catch (error) {
        console.error('Error al cargar sesión:', error);
        // Mostrar modal sin verificación de permisos
        const modalHTML = `
            <div class="modal-noticia-completa" id="modal-noticia-${noticiaId}">
                <div class="modal-noticia-completa-content">
                    <span class="modal-noticia-completa-close" onclick="cerrarNoticiaCompleta(${noticiaId})">&times;</span>
                    ${noticia.imagen_url ? `<div class="modal-noticia-imagen-container"><img src="${noticia.imagen_url}" alt="${noticia.titulo}" class="modal-noticia-imagen" onerror="this.style.display='none'"></div>` : ''}
                    <div class="modal-noticia-header">
                        <h2>${noticia.titulo}</h2>
                        <span class="modal-noticia-fecha">${noticia.fecha_creacion}</span>
                    </div>
                    <div class="modal-noticia-contenido">
                        <p>${noticia.contenido}</p>
                    </div>
                    <div class="modal-noticia-footer">
                        <p class="modal-noticia-autor">Por ${noticia.usuario_nombre}</p>
                    </div>
                </div>
            </div>
        `;
        
        const modalAnterior = document.querySelector('.modal-noticia-completa');
        if (modalAnterior) {
            modalAnterior.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.getElementById(`modal-noticia-${noticiaId}`);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                cerrarNoticiaCompleta(noticiaId);
            }
        });
        
        document.body.style.overflow = 'hidden';
    }
}

// Cerrar modal de noticia completa
function cerrarNoticiaCompleta(noticiaId) {
    const modal = document.getElementById(`modal-noticia-${noticiaId}`);
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

// Eliminar noticia
async function eliminarNoticia(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
        return;
    }
    
    try {
        const response = await fetch(`api/noticias.php?id=${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Cerrar modal si está abierto
            const modal = document.querySelector(`#modal-noticia-${id}`);
            if (modal) {
                cerrarNoticiaCompleta(id);
            }
            
            alert('Noticia eliminada correctamente');
            // Recargar noticias con el usuario actual
            const sessionResponse = await fetch('api/check_session.php', {
                method: 'GET',
                credentials: 'include'
            });
            const sessionData = await sessionResponse.json();
            const usuarioActual = sessionData.success && sessionData.logged_in ? sessionData.usuario : null;
            cargarNoticiasPagina(usuarioActual);
        } else {
            alert('Error al eliminar la noticia: ' + (data.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error al eliminar noticia:', error);
        alert('Error al eliminar la noticia');
    }
}

// Hacer funciones globales para acceso desde HTML
window.mostrarNoticiaCompleta = mostrarNoticiaCompleta;
window.cerrarNoticiaCompleta = cerrarNoticiaCompleta;
window.eliminarNoticia = eliminarNoticia;

export default NoticiasPage;
export { init };


