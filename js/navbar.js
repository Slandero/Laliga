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
            <div class="logo-container">
                <a href="#" data-route="inicio" class="logo-button" title="Ir al inicio">
                    <img src="images/LaligaLogo.jpg" alt="Logo La Liga" id="logo-navbar">
                </a>
            </div>
            <ul class="nav-menu">
                <li><a href="#" data-route="calendario">Calendarioprueba</a></li>
                <li><a href="#" data-route="resultados">Resultadosprueba</a></li>
                <li><a href="#" data-route="clasificacion">Clasificación</a></li>
                <li><a href="#" data-route="clubes">Clubes</a></li>
                <li><a href="#" data-route="fichajes">Fichajes</a></li>
            </ul>
        </nav>
    `;

    // Insertar el navbar al inicio del body
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
}

// Exportar la función para uso en otros módulos
export { cargarNavbar };

