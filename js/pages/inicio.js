// Página de Inicio

import { crearCarruselNoticias, crearCarruselProximosPartidos, inicializarCarruseles } from '../carruseles.js';
import { crearSeccionEstadisticas, inicializarEstadisticas } from '../estadisticas.js';

function InicioPage() {
    return `
        <section id="inicio">
            <div class="carruseles-section">
                ${crearCarruselNoticias()}
                ${crearCarruselProximosPartidos()}
            </div>
            ${crearSeccionEstadisticas()}
        </section>
        
        <!-- Modal para agregar noticia -->
        <div id="modal-agregar-noticia" class="modal-noticia">
            <div class="modal-noticia-content">
                <span class="modal-noticia-close">&times;</span>
                <h2>Agregar Nueva Noticia</h2>
                <form id="form-agregar-noticia">
                    <div class="form-group">
                        <label for="noticia-titulo">Título:</label>
                        <input type="text" id="noticia-titulo" name="titulo" required maxlength="200">
                    </div>
                    <div class="form-group">
                        <label for="noticia-contenido">Contenido:</label>
                        <textarea id="noticia-contenido" name="contenido" rows="5" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="noticia-imagen-url">URL de Imagen (opcional):</label>
                        <input type="url" id="noticia-imagen-url" name="imagen_url" maxlength="500">
                    </div>
                    <div id="noticia-error" class="error-message"></div>
                    <button type="submit" class="btn-submit">Agregar Noticia</button>
                </form>
            </div>
        </div>
    `;
}

function init() {
    console.log('Página de inicio cargada');
    
    // Inicializar carruseles y estadísticas después de que el DOM esté listo
    setTimeout(() => {
        inicializarCarruseles();
        configurarModalAgregarNoticia();
        inicializarEstadisticas();
    }, 100);
}

function configurarModalAgregarNoticia() {
    const btnAgregar = document.getElementById('btn-agregar-noticia');
    const modal = document.getElementById('modal-agregar-noticia');
    const modalClose = document.querySelector('.modal-noticia-close');
    const form = document.getElementById('form-agregar-noticia');
    
    if (!btnAgregar || !modal || !form) return;
    
    // Abrir modal
    btnAgregar.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
    
    // Cerrar modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            form.reset();
            document.getElementById('noticia-error').textContent = '';
        });
    }
    
    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            form.reset();
            document.getElementById('noticia-error').textContent = '';
        }
    });
    
    // Manejar envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('noticia-error');
        errorDiv.textContent = '';
        
        const formData = {
            titulo: document.getElementById('noticia-titulo').value.trim(),
            contenido: document.getElementById('noticia-contenido').value.trim(),
            imagen_url: document.getElementById('noticia-imagen-url').value.trim() || null
        };
        
        try {
            const response = await fetch('api/noticias.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Cerrar modal y recargar noticias
                modal.style.display = 'none';
                form.reset();
                
                // Recargar noticias con el usuario actual
                const { cargarNoticias } = await import('../carruseles.js');
                const sessionResponse = await fetch('api/check_session.php', {
                    method: 'GET',
                    credentials: 'include'
                });
                const sessionData = await sessionResponse.json();
                const usuarioActual = sessionData.success && sessionData.logged_in ? sessionData.usuario : null;
                
                if (typeof cargarNoticias === 'function') {
                    cargarNoticias(usuarioActual);
                } else {
                    window.location.reload();
                }
            } else {
                errorDiv.textContent = result.error || 'Error al agregar la noticia';
            }
        } catch (error) {
            errorDiv.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
            console.error('Error:', error);
        }
    });
}

export default InicioPage;
export { init };

