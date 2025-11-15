// Página de Clubes

console.log('📄 ARCHIVO clubes.js CARGADO');

import router from '../router.js';

console.log('✅ Router importado en clubes.js');

function ClubesPage() {
    console.log('🔵 Función ClubesPage() ejecutada');
    return `
        <section id="clubes">
            <h1>Clubes</h1>
            <div id="clubes-content">
                <!-- El contenido de clubes se cargará aquí -->
            </div>
        </section>
    `;
}

async function init() {
    console.log('=== INICIANDO PÁGINA DE CLUBES ===');
    
    // Esperar a que el DOM esté completamente listo
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('Ejecutando cargarClubes desde init()');
    
    // Intentar múltiples veces si es necesario
    let intentos = 0;
    const maxIntentos = 5;
    
    const intentarCargar = () => {
        intentos++;
        console.log(`Intento ${intentos} de cargar clubes...`);
        
        const content = document.getElementById('clubes-content');
        if (content) {
            cargarClubes();
        } else if (intentos < maxIntentos) {
            setTimeout(intentarCargar, 100);
        } else {
            console.error('❌ No se pudo encontrar clubes-content después de varios intentos');
        }
    };
    
    intentarCargar();
}

console.log('📋 Mapeo de clubes definido');

// Mapeo de nombres de tablas a nombres de carpetas de imágenes y nombres de clubes
const mapeoClubes = {
    'athletic_club': {
        nombre: 'Athletic Club',
        carpeta: 'AthleticClub',
        nombreOrden: 'athletic club'
    },
    'atletico_de_madrid': {
        nombre: 'Atlético de Madrid',
        carpeta: 'ClubAtléticodeMadridSAD',
        nombreOrden: 'atletico de madrid'
    },
    'ca_osasuna': {
        nombre: 'CA Osasuna',
        carpeta: 'ClubAtléticoOsasuna',
        nombreOrden: 'ca osasuna'
    },
    'celta_vigo': {
        nombre: 'Celta de Vigo',
        carpeta: 'Celta',
        nombreOrden: 'celta de vigo'
    },
    'deportivo_alaves': {
        nombre: 'Deportivo Alavés',
        carpeta: 'DeportivoAlavésSAD',
        nombreOrden: 'deportivo alaves'
    },
    'elche_cf': {
        nombre: 'Elche CF',
        carpeta: 'ElcheClubdeFútbolSAD',
        nombreOrden: 'elche cf'
    },
    'fc_barcelona': {
        nombre: 'FC Barcelona',
        carpeta: 'FútbolClubBarcelona',
        nombreOrden: 'fc barcelona'
    },
    'getafe_cf': {
        nombre: 'Getafe CF',
        carpeta: 'GetafeClubdeFútbolSAD',
        nombreOrden: 'getafe cf'
    },
    'girona_fc': {
        nombre: 'Girona FC',
        carpeta: 'GironaFútbolClubSAD',
        nombreOrden: 'girona fc'
    },
    'levante_ud': {
        nombre: 'Levante UD',
        carpeta: 'LevanteUniónDeportivaSAD',
        nombreOrden: 'levante ud'
    },
    'rayo_vallecano': {
        nombre: 'Rayo Vallecano',
        carpeta: 'RayoVallecanodeMadridSAD',
        nombreOrden: 'rayo vallecano'
    },
    'rcd_espanyol': {
        nombre: 'RCD Espanyol',
        carpeta: 'espanyol',
        nombreOrden: 'rcd espanyol'
    },
    'rcd_mallorca': {
        nombre: 'RCD Mallorca',
        carpeta: 'mallorca',
        nombreOrden: 'rcd mallorca'
    },
    'real_betis': {
        nombre: 'Real Betis',
        carpeta: 'betis',
        nombreOrden: 'real betis'
    },
    'real_madrid': {
        nombre: 'Real Madrid',
        carpeta: 'realmadrid',
        nombreOrden: 'real madrid'
    },
    'real_oviedo': {
        nombre: 'Real Oviedo',
        carpeta: 'RealOviedo',
        nombreOrden: 'real oviedo'
    },
    'real_sociedad': {
        nombre: 'Real Sociedad',
        carpeta: 'realsociedad',
        nombreOrden: 'real sociedad'
    },
    'sevilla_fc': {
        nombre: 'Sevilla FC',
        carpeta: 'sevilla',
        nombreOrden: 'sevilla fc'
    },
    'valencia_cf': {
        nombre: 'Valencia CF',
        carpeta: 'valencia',
        nombreOrden: 'valencia cf'
    },
    'villarreal_cf': {
        nombre: 'Villarreal CF',
        carpeta: 'villareal',
        nombreOrden: 'villarreal cf'
    }
};

function cargarClubes() {
    console.log('=== EJECUTANDO cargarClubes() ===');
    
    const content = document.getElementById('clubes-content');
    
    if (!content) {
        console.error('❌ ERROR: No se encontró el elemento clubes-content');
        console.log('Buscando elementos en el DOM...');
        console.log('Elementos con id "clubes":', document.getElementById('clubes'));
        console.log('Todos los elementos section:', document.querySelectorAll('section'));
        return;
    }
    
    console.log('✅ Elemento clubes-content encontrado:', content);
    
    // Preparar lista de clubes con información de imágenes
    const clubesLista = Object.keys(mapeoClubes).map(tabla => {
        const info = mapeoClubes[tabla];
        return {
            tabla: tabla,
            nombreCompleto: info.nombre,
            carpetaImagen: info.carpeta,
            nombreOrden: info.nombreOrden,
            rutaEscudo: `images/${info.carpeta}/escudo.png`
        };
    });
    
    console.log('Total de clubes en mapeo:', clubesLista.length);
    
    // Ordenar alfabéticamente
    clubesLista.sort((a, b) => {
        return a.nombreOrden.localeCompare(b.nombreOrden, 'es', { sensitivity: 'base' });
    });
    
    // Limitar a 20 clubes (4 filas x 5 columnas)
    const clubesMostrar = clubesLista.slice(0, 20);
    
    console.log('Clubes a mostrar:', clubesMostrar.length);
    console.log('Primer club ejemplo:', clubesMostrar[0]);
    console.log('Ruta del primer escudo:', clubesMostrar[0]?.rutaEscudo);
    
    const html = `
        <div class="clubes-grid">
            ${clubesMostrar.map(club => `
                <button class="club-item" onclick="navegarAEquipo('${club.tabla}')">
                    <div class="club-escudo-container">
                        <img 
                            src="${club.rutaEscudo}" 
                            alt="${club.nombreCompleto}" 
                            class="club-escudo"
                            onerror="this.src='images/LaligaLogo.jpg'"
                        >
                    </div>
                    <p class="club-nombre">${club.nombreCompleto}</p>
                </button>
            `).join('')}
        </div>
    `;
    
    content.innerHTML = html;
    console.log('HTML insertado en clubes-content');
}

// Función para navegar a la página de un equipo específico
function navegarAEquipo(tabla) {
    // Guardar el nombre de la tabla en sessionStorage para usarlo en la página de equipo
    sessionStorage.setItem('equipoActual', tabla);
    // Navegar a la ruta del equipo (puedes crear una página específica o usar un parámetro)
    router.navigate(`equipo/${tabla}`);
}

// Hacer la función accesible globalmente
window.navegarAEquipo = navegarAEquipo;

console.log('📤 Exportando ClubesPage e init');

export default ClubesPage;
export { init };

console.log('✅ Exports completados en clubes.js');

