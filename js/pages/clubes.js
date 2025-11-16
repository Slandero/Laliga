// Página de Clubes

import router from '../router.js';

// Mapeo de nombres de tablas a nombres de carpetas de imágenes y nombres de clubes
const mapeoClubes = {
    'athletic_club': { nombre: 'Athletic Club', carpeta: 'AthleticClub' },
    'atletico_de_madrid': { nombre: 'Atlético de Madrid', carpeta: 'ClubAtléticodeMadridSAD' },
    'ca_osasuna': { nombre: 'CA Osasuna', carpeta: 'ClubAtléticoOsasuna' },
    'celta_vigo': { nombre: 'Celta de Vigo', carpeta: 'Celta' },
    'deportivo_alaves': { nombre: 'Deportivo Alavés', carpeta: 'DeportivoAlavésSAD' },
    'elche_cf': { nombre: 'Elche CF', carpeta: 'ElcheClubdeFútbolSAD' },
    'fc_barcelona': { nombre: 'FC Barcelona', carpeta: 'FútbolClubBarcelona' },
    'getafe_cf': { nombre: 'Getafe CF', carpeta: 'GetafeClubdeFútbolSAD' },
    'girona_fc': { nombre: 'Girona FC', carpeta: 'GironaFútbolClubSAD' },
    'levante_ud': { nombre: 'Levante UD', carpeta: 'LevanteUniónDeportivaSAD' },
    'rayo_vallecano': { nombre: 'Rayo Vallecano', carpeta: 'RayoVallecanodeMadridSAD' },
    'rcd_espanyol': { nombre: 'RCD Espanyol', carpeta: 'espanyol' },
    'rcd_mallorca': { nombre: 'RCD Mallorca', carpeta: 'mallorca' },
    'real_betis': { nombre: 'Real Betis', carpeta: 'betis' },
    'real_madrid': { nombre: 'Real Madrid', carpeta: 'realmadrid' },
    'real_oviedo': { nombre: 'Real Oviedo', carpeta: 'RealOviedo' },
    'real_sociedad': { nombre: 'Real Sociedad', carpeta: 'realsociedad' },
    'sevilla_fc': { nombre: 'Sevilla FC', carpeta: 'sevilla' },
    'valencia_cf': { nombre: 'Valencia CF', carpeta: 'valencia' },
    'villarreal_cf': { nombre: 'Villarreal CF', carpeta: 'villareal' }
};

function ClubesPage() {
    console.log('🔵 ClubesPage() ejecutada');
    // Ejecutar inmediatamente después de renderizar
    setTimeout(() => {
        console.log('⏰ Ejecutando cargarClubes desde setTimeout');
        cargarClubes();
    }, 100);
    
    return `
        <section id="clubes">
            <h1>Clubes</h1>
            <div id="clubes-content"></div>
        </section>
    `;
}

function cargarClubes() {
    console.log('🔵 cargarClubes() EJECUTÁNDOSE');
    const content = document.getElementById('clubes-content');
    
    if (!content) {
        console.warn('⚠️ No se encontró clubes-content, reintentando...');
        setTimeout(cargarClubes, 100);
        return;
    }
    
    console.log('✅ clubes-content encontrado, generando HTML...');
    
    const clubes = Object.keys(mapeoClubes).slice(0, 20).map(tabla => {
        const info = mapeoClubes[tabla];
        return { tabla, nombre: info.nombre, ruta: `images/${info.carpeta}/escudo.png` };
    });
    
    console.log(`📋 Generando ${clubes.length} clubes`);
    
    let html = '<div class="clubes-grid">';
    clubes.forEach(club => {
        html += `
            <button class="club-item" onclick="window.navegarAEquipo('${club.tabla}')">
                <div class="club-escudo-container">
                    <img src="${club.ruta}" alt="${club.nombre}" class="club-escudo" 
                         onerror="console.error('Error imagen: ${club.ruta}'); this.src='images/LaligaLogo.jpg'">
                </div>
                <p class="club-nombre">${club.nombre}</p>
            </button>
        `;
    });
    html += '</div>';
    
    content.innerHTML = html;
    console.log('✅ HTML insertado correctamente');
}

async function init() {
    console.log('🚀 init() ejecutado');
    setTimeout(() => {
        console.log('⏰ Ejecutando cargarClubes desde init()');
        cargarClubes();
    }, 200);
}

function navegarAEquipo(tabla) {
    sessionStorage.setItem('equipoActual', tabla);
    router.navigate(`equipo/${tabla}`);
}

window.navegarAEquipo = navegarAEquipo;

export default ClubesPage;
export { init };
