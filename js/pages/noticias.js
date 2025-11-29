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
    cargarNoticiasPagina();
}

async function cargarNoticiasPagina() {
    const content = document.getElementById('noticias-content');
    if (!content) {
        console.warn('No se encontró noticias-content, reintentando...');
        setTimeout(cargarNoticiasPagina, 100);
        return;
    }

    try {
        const response = await fetch('api/noticias.php');
        const data = await response.json();

        if (!data.success) {
            content.innerHTML = `<p class="noticias-error">Error al cargar las noticias: ${data.error || 'Error desconocido'}</p>`;
            return;
        }

        const noticias = data.noticias || [];

        if (noticias.length === 0) {
            content.innerHTML = `<p class="noticias-vacia">No hay noticias disponibles por el momento.</p>`;
            return;
        }

        const html = `
            <div class="noticias-grid">
                ${noticias
                    .map(
                        (n) => `
                    <article class="noticia-card">
                        <div class="noticia-header">
                            <h2>${n.titulo}</h2>
                            <span class="noticia-fecha">${n.fecha_creacion}</span>
                        </div>
                        ${
                            n.imagen_url
                                ? `<div class="noticia-imagen">
                                     <img src="${n.imagen_url}" alt="${n.titulo}" onerror="this.style.display='none'">
                                   </div>`
                                : ''
                        }
                        <p class="noticia-contenido">${n.contenido}</p>
                        <p class="noticia-autor">Por ${n.usuario_nombre}</p>
                    </article>
                `
                    )
                    .join('')}
            </div>
        `;

        content.innerHTML = html;
    } catch (error) {
        console.error('Error al cargar noticias:', error);
        content.innerHTML = `<p class="noticias-error">Error de conexión al cargar las noticias.</p>`;
    }
}

export default NoticiasPage;
export { init };


