// Componente de navegación reutilizable
// Este archivo carga la barra de navegación y usa el sistema de rutas

function cargarNavbar() {
    // Verificar si el navbar ya existe para evitar duplicados
    if (document.querySelector('.navbar')) {
        console.log('Navbar ya existe, no se cargará de nuevo');
        return;
    }

    const navbarHTML = `
        <nav class="navbar">
            <div class="nav-section nav-section-left">
                <ul class="nav-menu nav-menu-left">
                    <li><a href="#" data-route="clubes">Clubes</a></li>
                    <li><a href="#" data-route="clasificacion">Clasificación</a></li>
                    <li><a href="#" data-route="resultados">Resultados</a></li>
                </ul>
            </div>
            <div class="nav-section nav-section-center">
                <div class="logo-container">
                    <a href="#" data-route="inicio" class="logo-button" title="Ir al inicio">
                        <img src="images/LaligaLogo.jpg" alt="Logo La Liga" id="logo-navbar">
                    </a>
                </div>
            </div>
            <div class="nav-section nav-section-right">
                <ul class="nav-menu nav-menu-right">
                    <li><a href="#" data-route="calendario">Calendario</a></li>
                    <li><a href="#" data-route="noticias">Noticias</a></li>
                    <li><a href="#" data-route="fichajes">Fichajes</a></li>
                </ul>
            </div>
        </nav>
    `;

    // Insertar el navbar al inicio del body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
}

// Exportar la función para uso en otros módulos
export { cargarNavbar };

