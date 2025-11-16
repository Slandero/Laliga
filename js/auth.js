// Sistema de autenticación - Login y Registro

// Verificar sesión al cargar la página
async function verificarSesion() {
    try {
        const response = await fetch('api/check_session.php', {
            method: 'GET',
            credentials: 'include' // Importante para incluir cookies de sesión
        });
        
        // Verificar que la respuesta sea JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            // Si no es JSON, obtener el texto para ver qué está devolviendo
            const text = await response.text();
            console.error('Respuesta no es JSON:', text.substring(0, 200));
            mostrarBotonAcceder();
            return;
        }
        
        const result = await response.json();
        
        console.log('Resultado verificación sesión:', result);
        
        if (result.success && result.logged_in && result.usuario) {
            mostrarUsuarioLogueado(result.usuario);
        } else {
            mostrarBotonAcceder();
        }
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        // Si hay error, mostrar el botón de acceder por defecto
        mostrarBotonAcceder();
    }
}

function mostrarUsuarioLogueado(usuario) {
    console.log('Mostrando usuario logueado:', usuario);
    const btnAcceder = document.getElementById('btn-acceder');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    
    if (btnAcceder) {
        // Cambiar el texto del botón a "Cerrar Sesión"
        btnAcceder.textContent = 'Cerrar Sesión';
        btnAcceder.dataset.loggedIn = 'true';
        console.log('Botón cambiado a "Cerrar Sesión"');
    }
    if (userInfo) {
        userInfo.style.display = 'flex';
        console.log('Info de usuario mostrada');
    }
    if (userName) {
        const nombreMostrar = usuario.nombre || usuario.username || usuario.email;

        console.log('Nombre de usuario establecido:', nombreMostrar);
    }
}

function mostrarBotonAcceder() {
    const btnAcceder = document.getElementById('btn-acceder');
    const userInfo = document.getElementById('user-info');
    
    if (btnAcceder) {
        // Restaurar el texto del botón a "Acceder"
        btnAcceder.textContent = 'Acceder';
        btnAcceder.dataset.loggedIn = 'false';
        btnAcceder.style.display = 'block';
    }
    if (userInfo) userInfo.style.display = 'none';
}

// Abrir modal al hacer clic en "Acceder"
document.addEventListener('DOMContentLoaded', () => {
    // Verificar sesión al cargar
    verificarSesion();
    
    const btnAcceder = document.getElementById('btn-acceder');
    const modalAuth = document.getElementById('modal-auth');
    const modalClose = document.querySelector('.modal-auth-close');
    const modalTabs = document.querySelectorAll('.modal-tab');
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');
    const loginForm = document.getElementById('login-form');
    const registroForm = document.getElementById('registro-form');

    // Manejar clic en botón Acceder/Cerrar Sesión
    if (btnAcceder) {
        btnAcceder.addEventListener('click', async () => {
            // Si el usuario está logueado, cerrar sesión
            if (btnAcceder.dataset.loggedIn === 'true') {
                try {
                    const response = await fetch('api/logout.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const result = await response.json();

                    if (result.success) {
                        // Recargar página para actualizar el estado
                        window.location.reload();
                    } else {
                        alert('Error al cerrar sesión: ' + (result.error || 'Error desconocido'));
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error de conexión al cerrar sesión');
                }
            } else {
                // Si no está logueado, abrir modal de login
                modalAuth.style.display = 'flex';
                // Mostrar formulario de login por defecto
                cambiarTab('login');
            }
        });
    }

    // Cerrar modal
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modalAuth.style.display = 'none';
            limpiarFormularios();
        });
    }

    // Cerrar al hacer clic fuera del modal
    modalAuth.addEventListener('click', (e) => {
        if (e.target === modalAuth) {
            modalAuth.style.display = 'none';
            limpiarFormularios();
        }
    });

    // Cambiar entre tabs
    modalTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            cambiarTab(tabName);
        });
    });

    function cambiarTab(tabName) {
        // Actualizar tabs
        modalTabs.forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Mostrar formulario correspondiente
        formLogin.classList.remove('active');
        formRegistro.classList.remove('active');
        
        if (tabName === 'login') {
            formLogin.classList.add('active');
        } else {
            formRegistro.classList.add('active');
        }

        // Limpiar errores
        document.getElementById('login-error').textContent = '';
        document.getElementById('registro-error').textContent = '';
    }

    function limpiarFormularios() {
        loginForm.reset();
        registroForm.reset();
        document.getElementById('login-error').textContent = '';
        document.getElementById('registro-error').textContent = '';
    }

    // Manejar login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = '';

        const formData = {
            email: document.getElementById('login-email').value,
            password: document.getElementById('login-password').value
        };

        try {
            const response = await fetch('api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Cerrar modal y recargar página
                modalAuth.style.display = 'none';
                limpiarFormularios();
                window.location.reload();
            } else {
                errorDiv.textContent = result.error || 'Error al iniciar sesión';
            }
        } catch (error) {
            errorDiv.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
            console.error('Error:', error);
        }
    });

    // Manejar registro
    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const errorDiv = document.getElementById('registro-error');
        errorDiv.textContent = '';

        const password = document.getElementById('registro-password').value;
        const passwordConfirm = document.getElementById('registro-password-confirm').value;

        if (password !== passwordConfirm) {
            errorDiv.textContent = 'Las contraseñas no coinciden';
            return;
        }

        const formData = {
            username: document.getElementById('registro-username').value,
            email: document.getElementById('registro-email').value,
            password: password,
            password_confirm: passwordConfirm,
            nombre_completo: document.getElementById('registro-nombre').value
        };

        try {
            const response = await fetch('api/registro.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Cerrar modal y recargar página
                modalAuth.style.display = 'none';
                limpiarFormularios();
                window.location.reload();
            } else {
                errorDiv.textContent = result.error || 'Error al registrarse';
            }
        } catch (error) {
            errorDiv.textContent = 'Error de conexión. Por favor, intenta de nuevo.';
            console.error('Error:', error);
        }
    });
});

