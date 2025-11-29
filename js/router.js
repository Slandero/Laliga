// Sistema de enrutamiento para la aplicación
// Maneja la navegación entre diferentes secciones

class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        this.initialized = false;
    }
    
    // Mostrar u ocultar el sidebar según la página
    mostrarOcultarSidebar(routeName) {
        const sidebar = document.getElementById('sidebar-clasificacion');
        if (!sidebar) return;
        
        // Solo mostrar el sidebar en la página de inicio
        if (routeName === 'inicio' || routeName === '') {
            sidebar.style.display = 'flex';
            // Asegurar que el wrapper tenga la clase has-sidebar si el sidebar no está colapsado
            const mainWrapper = document.querySelector('.main-wrapper');
            if (mainWrapper && !sidebar.classList.contains('collapsed')) {
                mainWrapper.classList.add('has-sidebar');
            }
        } else {
            sidebar.style.display = 'none';
            // Remover la clase has-sidebar del wrapper cuando el sidebar está oculto
            const mainWrapper = document.querySelector('.main-wrapper');
            if (mainWrapper) {
                mainWrapper.classList.remove('has-sidebar');
            }
        }
    }

    init() {
        if (this.initialized) return;
        
        // Definir las rutas de la aplicación
        this.routes = {
            '': 'inicio',
            'inicio': 'inicio',
            'calendario': 'calendario',
            'resultados': 'resultados',
            'clasificacion': 'clasificacion',
            'clubes': 'clubes',
            'noticias': 'noticias',
            'fichajes': 'fichajes'
        };

        // Escuchar cambios en la URL
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Manejar enlaces de navegación (usando delegación de eventos)
        document.addEventListener('click', (e) => {
            const routeElement = e.target.closest('[data-route]');
            if (routeElement) {
                e.preventDefault();
                const route = routeElement.getAttribute('data-route');
                console.log(`Click detectado en enlace con ruta: ${route}`);
                this.navigate(route);
            }
        });

        this.initialized = true;
        
        // Cargar la ruta inicial después de un pequeño delay para asegurar que el DOM está listo
        setTimeout(() => this.handleRoute(), 100);
    }

    navigate(route) {
        console.log(`Navegando a: ${route}`);
        
        // Asegurar que el router esté inicializado
        if (!this.initialized) {
            console.warn('Router no inicializado, inicializando ahora...');
            this.init();
        }
        
        // Permitir rutas dinámicas de equipo
        if (route && route.startsWith('equipo/')) {
            window.history.pushState({}, '', `#${route}`);
            this.handleRoute();
            return;
        }
        
        // Verificar rutas estáticas
        if (route && this.routes[route]) {
            window.history.pushState({}, '', route ? `#${route}` : '#');
            this.handleRoute();
            return;
        }
        
        // Si no es una ruta válida, mostrar error
        console.error(`Ruta no encontrada: ${route}`);
    }

    handleRoute() {
        // Obtener la ruta actual del hash
        const hash = window.location.hash.slice(1) || '';
        
        // Verificar si es una ruta dinámica de equipo (equipo/nombre_equipo)
        if (hash.startsWith('equipo/')) {
            const equipoTabla = hash.split('/')[1];
            if (equipoTabla) {
                this.currentRoute = 'equipo';
                this.loadEquipoPage(equipoTabla);
                return;
            }
        }
        
        const route = this.routes[hash] || this.routes[''];
        
        if (route !== this.currentRoute) {
            this.currentRoute = route;
            this.loadPage(route);
        }
    }

    async loadPage(pageName) {
        try {
            // Mostrar/ocultar sidebar según la página
            this.mostrarOcultarSidebar(pageName);
            
            const main = document.querySelector('main') || document.querySelector('#app-content');
            
            if (!main) {
                console.error('No se encontró el elemento main');
                return;
            }

            console.log(`Cargando página: ${pageName}`);

            // Mostrar estado de carga
            main.innerHTML = '<section><h1>Cargando...</h1></section>';

            // Importar y cargar el módulo de la página
            console.log(`🔍 Intentando importar: ./pages/${pageName}.js`);
            let pageModule;
            try {
                pageModule = await import(`./pages/${pageName}.js`);
                console.log(`✅ Módulo importado:`, pageModule);
                console.log(`📦 pageModule.default existe:`, !!pageModule.default);
                console.log(`📦 pageModule.init existe:`, !!pageModule.init);
                console.log(`📦 Tipo de pageModule.init:`, typeof pageModule.init);
            } catch (importError) {
                console.error(`❌ ERROR al importar módulo ${pageName}:`, importError);
                throw importError;
            }
            
            if (pageModule && pageModule.default) {
                // Renderizar el contenido de la página
                console.log(`🎨 Renderizando página ${pageName}...`);
                main.innerHTML = pageModule.default();
                console.log(`✅ Página ${pageName} renderizada correctamente`);
                
                // Ejecutar cualquier inicialización de la página después de renderizar
                if (pageModule.init) {
                    console.log(`🚀 Función init encontrada para ${pageName}, ejecutando...`);
                    console.log(`🔍 Tipo de init:`, typeof pageModule.init);
                    // Delay más largo para asegurar que el DOM esté completamente actualizado
                    setTimeout(async () => {
                        try {
                            console.log(`📞 Llamando a init() de ${pageName}...`);
                            const resultado = await pageModule.init();
                            console.log(`✅ Init de ${pageName} ejecutado exitosamente. Resultado:`, resultado);
                        } catch (initError) {
                            console.error(`❌ ERROR en init de ${pageName}:`, initError);
                            console.error('📚 Stack completo:', initError.stack);
                            console.error('📋 Mensaje:', initError.message);
                        }
                    }, 200);
                } else {
                    console.warn(`⚠️ La página ${pageName} NO tiene función init`);
                    console.log(`🔍 Propiedades del módulo:`, Object.keys(pageModule));
                }
            } else {
                throw new Error(`El módulo ${pageName} no exporta una función default`);
            }

            // Actualizar el título de la página
            document.title = `Proyecto Liga - ${this.getPageTitle(pageName)}`;
            
            // Actualizar la clase activa en el navbar (con un pequeño delay para asegurar que el navbar esté cargado)
            setTimeout(() => this.updateActiveNav(), 50);
            
            // Scroll al inicio
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(`Error al cargar la página ${pageName}:`, error);
            console.error('Stack:', error.stack);
            // Cargar página de error o página por defecto
            this.loadErrorPage();
        }
    }

    getPageTitle(pageName) {
        const titles = {
            'inicio': 'Inicio',
            'calendario': 'Calendario',
            'resultados': 'Resultados',
            'clasificacion': 'Clasificación',
            'clubes': 'Clubes',
            'noticias': 'Noticias',
            'fichajes': 'Fichajes'
        };
        return titles[pageName] || 'Inicio';
    }

    updateActiveNav() {
        const navLinks = document.querySelectorAll('.nav-menu a');
        const currentHash = window.location.hash.slice(1) || 'inicio';
        
        navLinks.forEach(link => {
            const route = link.getAttribute('data-route') || '';
            if (route === currentHash || (currentHash === '' && route === 'inicio')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    async loadEquipoPage(equipoTabla) {
        // Ocultar sidebar en página de equipo
        this.mostrarOcultarSidebar('equipo');
        
        try {
            const main = document.querySelector('main') || document.querySelector('#app-content');
            
            if (!main) {
                console.error('No se encontró el elemento main');
                return;
            }

            console.log(`Cargando página de equipo: ${equipoTabla}`);

            // Mostrar estado de carga
            main.innerHTML = '<section><h1>Cargando equipo...</h1></section>';

            // Importar el módulo de equipo
            const equipoModule = await import(`./pages/equipo.js`);
            
            if (equipoModule && equipoModule.default) {
                // Renderizar el contenido pasando el nombre del equipo
                main.innerHTML = equipoModule.default(equipoTabla);
                console.log(`Página de equipo ${equipoTabla} renderizada correctamente`);
                
                // Ejecutar inicialización si existe
                if (equipoModule.init) {
                    setTimeout(async () => {
                        try {
                            await equipoModule.init(equipoTabla);
                            console.log(`Init de equipo ${equipoTabla} ejecutado`);
                        } catch (initError) {
                            console.error(`Error en init de equipo:`, initError);
                        }
                    }, 200);
                }
            } else {
                throw new Error('El módulo equipo no exporta una función default');
            }

            // Actualizar el título
            document.title = `Proyecto Liga - Equipo`;
            
            // Scroll al inicio
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(`Error al cargar la página de equipo:`, error);
            this.loadErrorPage();
        }
    }

    loadErrorPage() {
        const main = document.querySelector('main') || document.querySelector('#app-content');
        if (main) {
            main.innerHTML = `
                <section>
                    <h1>Página no encontrada</h1>
                    <p>La página que buscas no existe.</p>
                    <a href="#" data-route="inicio">Volver al inicio</a>
                </section>
            `;
        }
    }
}

// Crear una instancia del router pero no inicializarla todavía
const router = new Router();

// Hacer el router accesible globalmente para los botones
window.router = router;

// Exportar el router
export default router;

