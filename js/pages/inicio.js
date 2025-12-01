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
                        <label for="noticia-imagen-url">URL de Imagen:</label>
                        <input type="url" id="noticia-imagen-url" name="imagen_url" maxlength="500">
                    </div>
                    <div class="form-group">
                        <label for="noticia-imagen-file">O subir imagen desde tu equipo:</label>
                        <input type="file" id="noticia-imagen-file" name="imagen_file" accept="image/jpeg,image/jpg,image/png,image/gif,image/webp">
                        <small class="form-hint">Formatos permitidos: JPG, PNG, GIF, WEBP (máx. 5MB)</small>
                    </div>
                    <div id="noticia-imagen-preview" class="imagen-preview" style="display: none;">
                        <img id="noticia-imagen-preview-img" src="" alt="Vista previa">
                        <button type="button" id="noticia-imagen-remove" class="btn-remove-preview">×</button>
                    </div>
                    <div class="form-group">
                        <label for="noticia-jornada">Jornada:</label>
                        <select id="noticia-jornada" name="jornada">
                            <option value="">Selecciona jornada</option>
                            ${Array.from({ length: 38 }, (_, i) => i + 1)
                                .map(j => `<option value="${j}">Jornada ${j}</option>`)
                                .join('')}
                        </select>
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
    const jornadaSelect = document.getElementById('noticia-jornada');
    
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

    // Comportamiento del combo de jornada: al abrir, mostrar 5 opciones con scroll
    if (jornadaSelect) {
        jornadaSelect.size = 1; // dropdown normal

        jornadaSelect.addEventListener('focus', () => {
            jornadaSelect.size = 5;
        });

        jornadaSelect.addEventListener('blur', () => {
            setTimeout(() => {
                jornadaSelect.size = 1;
            }, 150);
        });
    }
    
    // Configurar vista previa de imagen
    const imagenFileInput = document.getElementById('noticia-imagen-file');
    const imagenPreview = document.getElementById('noticia-imagen-preview');
    const imagenPreviewImg = document.getElementById('noticia-imagen-preview-img');
    const imagenRemoveBtn = document.getElementById('noticia-imagen-remove');
    const imagenUrlInput = document.getElementById('noticia-imagen-url');
    const errorDiv = document.getElementById('noticia-error');

    // En entorno Vercel no se puede usar upload_imagen.php (no hay PHP ni escritura en disco).
    // Ocultamos y deshabilitamos el input de archivo para evitar llamadas que terminen en 404.
    const isVercelEnv = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app');
    if (isVercelEnv && imagenFileInput) {
        const fileGroup = imagenFileInput.closest('.form-group');
        if (fileGroup) {
            fileGroup.style.display = 'none';
        }
        imagenFileInput.disabled = true;
    }
    
    if (imagenFileInput && imagenPreview && imagenPreviewImg && imagenRemoveBtn && !isVercelEnv) {
        // Mostrar vista previa cuando se selecciona un archivo
        imagenFileInput.addEventListener('change', (e) => {
            const archivo = e.target.files[0];
            if (archivo) {
                // Validar tipo de archivo
                const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                if (!tiposPermitidos.includes(archivo.type)) {
                    if (errorDiv) {
                        errorDiv.textContent = 'Tipo de archivo no permitido. Solo se permiten imágenes (JPG, PNG, GIF, WEBP)';
                    }
                    imagenFileInput.value = '';
                    return;
                }
                
                // Validar tamaño (máximo 5MB)
                if (archivo.size > 5 * 1024 * 1024) {
                    if (errorDiv) {
                        errorDiv.textContent = 'El archivo es demasiado grande. Tamaño máximo: 5MB';
                    }
                    imagenFileInput.value = '';
                    return;
                }
                
                // Limpiar URL si hay archivo seleccionado
                if (imagenUrlInput) {
                    imagenUrlInput.value = '';
                }
                
                // Mostrar vista previa
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagenPreviewImg.src = event.target.result;
                    imagenPreview.style.display = 'block';
                };
                reader.readAsDataURL(archivo);
            }
        });
        
        // Remover vista previa
        imagenRemoveBtn.addEventListener('click', () => {
            imagenFileInput.value = '';
            imagenPreview.style.display = 'none';
            imagenPreviewImg.src = '';
        });
        
        // Limpiar vista previa cuando se ingresa una URL
        if (imagenUrlInput) {
            imagenUrlInput.addEventListener('input', () => {
                if (imagenUrlInput.value.trim()) {
                    imagenFileInput.value = '';
                    imagenPreview.style.display = 'none';
                    imagenPreviewImg.src = '';
                }
            });
        }
    }
    
    // Limpiar vista previa al cerrar el modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            if (imagenPreview) {
                imagenPreview.style.display = 'none';
            }
            if (imagenFileInput) {
                imagenFileInput.value = '';
            }
        });
    }
    
    // Manejar envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (errorDiv) {
            errorDiv.textContent = '';
        }

        const jornadaSelect = document.getElementById('noticia-jornada');
        const jornadaVal = jornadaSelect ? jornadaSelect.value : '';
        const jornadaNum = parseInt(jornadaVal, 10);
        if (!Number.isFinite(jornadaNum) || jornadaNum <= 0) {
            errorDiv.textContent = 'Debes seleccionar la jornada de la noticia.';
            return;
        }

        let imagenUrl = null;
        
        // Si NO estamos en Vercel y hay un archivo seleccionado, subirlo primero
        const archivoImagen = !isVercelEnv && imagenFileInput && imagenFileInput.files.length > 0 ? imagenFileInput.files[0] : null;
        
        if (archivoImagen) {
            try {
                // Subir la imagen vía PHP (solo funcionará en XAMPP/entorno con PHP)
                const formDataUpload = new FormData();
                formDataUpload.append('imagen', archivoImagen);
                
                const uploadResponse = await fetch('api/upload_imagen.php', {
                    method: 'POST',
                    credentials: 'include',
                    body: formDataUpload
                });
                
                const uploadResult = await uploadResponse.json();
                
                if (uploadResult.success) {
                    imagenUrl = uploadResult.url;
                } else {
                    errorDiv.textContent = uploadResult.error || 'Error al subir la imagen';
                    return;
                }
            } catch (error) {
                errorDiv.textContent = 'Error de conexión al subir la imagen. Por favor, intenta de nuevo.';
                console.error('Error:', error);
                return;
            }
        } else {
            // Si no hay archivo (o estamos en Vercel), usar la URL proporcionada
            imagenUrl = imagenUrlInput ? imagenUrlInput.value.trim() || null : null;
        }

        const formData = {
            titulo: document.getElementById('noticia-titulo').value.trim(),
            contenido: document.getElementById('noticia-contenido').value.trim(),
            imagen_url: imagenUrl,
            jornada: jornadaNum
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
                if (imagenPreview) {
                    imagenPreview.style.display = 'none';
                }
                
                // Recargar noticias
                const { cargarNoticias } = await import('../carruseles.js');
                
                if (typeof cargarNoticias === 'function') {
                    cargarNoticias();
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

