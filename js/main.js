// JavaScript principal del Proyecto Liga
// Punto de entrada de la aplicación

import router from './router.js';
import { cargarNavbar } from './navbar.js';

// Suprimir advertencias de extensiones del navegador (runtime.lastError)
// Estos errores provienen de extensiones (adblockers, DevTools, etc.) y no afectan la aplicación
// Se agrega un filtro para ocultar estos errores comunes de la consola
(function() {
    const originalError = console.error;
    console.error = function(...args) {
        // Filtrar errores de runtime.lastError relacionados con message port closed
        const errorMsg = args.join(' ');
        if (errorMsg.includes('runtime.lastError') || 
            errorMsg.includes('message port closed') ||
            errorMsg.includes('The message port closed before a response was received')) {
            return; // No mostrar estos errores en la consola
        }
        originalError.apply(console, args);
    };
})();

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

