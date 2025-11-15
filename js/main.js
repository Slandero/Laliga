// JavaScript principal del Proyecto Liga
// Punto de entrada de la aplicación

import router from './router.js';
import { cargarNavbar } from './navbar.js';

// Función para inicializar la aplicación
function inicializarAplicacion() {
    console.log('Proyecto Liga cargado correctamente');
    
    // Cargar el navbar primero
    cargarNavbar();
    
    // Inicializar el router después de que el navbar esté cargado
    // El router.init() ya maneja la carga inicial de la página
    setTimeout(() => {
        router.init();
        console.log('Aplicación inicializada - Router activo');
    }, 100);
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAplicacion);
} else {
    // Si el DOM ya está cargado, inicializar inmediatamente
    inicializarAplicacion();
}

