// Página de Equipo Individual

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

function EquipoPage(equipoTabla) {
    const equipoInfo = mapeoClubes[equipoTabla] || { nombre: 'Equipo', carpeta: '' };
    
    return `
        <section id="equipo">
            <div class="equipo-header">
                <button class="btn-volver" onclick="window.router.navigate('clubes')" data-route="clubes">
                    ← Volver a Clubes
                </button>
                <div class="equipo-info">
                    <img src="images/${equipoInfo.carpeta}/escudo.png" 
                         alt="${equipoInfo.nombre}" 
                         class="equipo-escudo-grande"
                         onerror="this.src='images/LaligaLogo.jpg'">
                    <h1>${equipoInfo.nombre}</h1>
                </div>
            </div>
            <div id="equipo-content">
                <p>Cargando información del equipo...</p>
            </div>
        </section>
    `;
}

async function init(equipoTabla) {
    console.log('Inicializando página de equipo:', equipoTabla);
    
    // Guardar el equipo actual en sessionStorage
    sessionStorage.setItem('equipoActual', equipoTabla);
    
    // Cargar información del equipo después de un pequeño delay
    setTimeout(() => {
        cargarInfoEquipo(equipoTabla);
    }, 100);
}

async function cargarInfoEquipo(equipoTabla) {
    const content = document.getElementById('equipo-content');
    if (!content) {
        setTimeout(() => cargarInfoEquipo(equipoTabla), 100);
        return;
    }
    
    const equipoInfo = mapeoClubes[equipoTabla];
    if (!equipoInfo) {
        content.innerHTML = '<p>Equipo no encontrado.</p>';
        return;
    }
    
    // Mostrar estado de carga
    content.innerHTML = '<p>Cargando jugadores...</p>';
    
    try {
        // Obtener jugadores desde la API
        const response = await fetch(`api/jugadores.php?tabla=${equipoTabla}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        console.log('Respuesta de la API:', result);
        
        if (result.success && result.data) {
            mostrarJugadores(result.data, equipoInfo.carpeta);
        } else {
            const errorMsg = result.error || 'Error desconocido';
            console.error('Error de la API:', result);
            content.innerHTML = `
                <div class="error-mensaje">
                    <p><strong>Error al cargar jugadores:</strong> ${errorMsg}</p>
                    ${result.file ? `<p><small>Archivo: ${result.file} (línea ${result.line})</small></p>` : ''}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al cargar jugadores:', error);
        content.innerHTML = `
            <div class="error-mensaje">
                <p><strong>Error al cargar los jugadores:</strong></p>
                <p>${error.message}</p>
                <p><small>Verifica la consola (F12) para más detalles.</small></p>
            </div>
        `;
    }
}

function mostrarJugadores(jugadores, carpetaImagen) {
    const content = document.getElementById('equipo-content');
    
    if (!jugadores || jugadores.length === 0) {
        content.innerHTML = '<p>No hay jugadores registrados para este equipo.</p>';
        return;
    }
    
    // Detectar automáticamente el campo del dorsal - buscar en todos los registros
    const posiblesCamposDorsal = ['dorsal', 'numero', 'num', 'Dorsal', 'Numero', 'Num', 'dorsal_numero', 'dorsal_num'];
    let campoDorsal = null;
    
    // Buscar el campo dorsal en todos los registros (puede que los entrenadores no lo tengan)
    for (const jugador of jugadores) {
        for (const campo of posiblesCamposDorsal) {
            if (jugador.hasOwnProperty(campo) && jugador[campo] !== null && jugador[campo] !== '') {
                campoDorsal = campo;
                break;
            }
        }
        if (campoDorsal) break;
    }
    
    // Si no encontramos el campo, buscar cualquier campo que contenga "dorsal" o "numero"
    if (!campoDorsal) {
        for (const jugador of jugadores) {
            for (const key in jugador) {
                const keyLower = key.toLowerCase();
                if ((keyLower.includes('dorsal') || keyLower.includes('numero') || keyLower.includes('num')) && 
                    jugador[key] !== null && jugador[key] !== '') {
                    campoDorsal = key;
                    break;
                }
            }
            if (campoDorsal) break;
        }
    }
    
    // Detectar campo de posición - buscar en todos los registros
    const posiblesCamposPosicion = ['posicion', 'Posicion', 'posición', 'Posición', 'position', 'Position', 'puesto', 'Puesto'];
    let campoPosicion = null;
    
    for (const jugador of jugadores) {
        for (const campo of posiblesCamposPosicion) {
            if (jugador.hasOwnProperty(campo) && jugador[campo] !== null && jugador[campo] !== '') {
                campoPosicion = campo;
                break;
            }
        }
        if (campoPosicion) break;
    }
    
    // Si no encontramos, buscar cualquier campo que contenga "posicion" o "puesto"
    if (!campoPosicion) {
        for (const jugador of jugadores) {
            for (const key in jugador) {
                const keyLower = key.toLowerCase();
                if ((keyLower.includes('posicion') || keyLower.includes('posición') || keyLower.includes('puesto') || keyLower.includes('position')) && 
                    jugador[key] !== null && jugador[key] !== '') {
                    campoPosicion = key;
                    break;
                }
            }
            if (campoPosicion) break;
        }
    }
    
    // Obtener el primer registro para mostrar en logs (puede ser entrenador o jugador)
    const primerJugador = jugadores[0];
    
    console.log('Campo del dorsal detectado:', campoDorsal);
    console.log('Campo de posición detectado:', campoPosicion);
    
    // Función para categorizar posición
    const categorizarPosicion = (posicion) => {
        if (!posicion) return 'otros';
        const pos = String(posicion).toLowerCase().trim();
        
        // Porteros
        if (pos.includes('portero') || pos.includes('gk') || pos.includes('goalkeeper') || pos === '1' || pos === 'p') {
            return 'porteros';
        }
        // Defensas
        if (pos.includes('defensa') || pos.includes('defender') || pos.includes('def') || 
            pos.includes('central') || pos.includes('lateral') || pos.includes('zaguero') ||
            pos === '2' || pos === '3' || pos === '4' || pos === '5') {
            return 'defensas';
        }
        // Centrocampistas
        if (pos.includes('centrocampista') || pos.includes('mediocampista') || pos.includes('medio') ||
            pos.includes('midfielder') || pos.includes('volante') || pos.includes('interior') ||
            pos === '6' || pos === '8' || pos === '10' || pos === '11') {
            return 'centrocampistas';
        }
        // Delanteros
        if (pos.includes('delantero') || pos.includes('forward') || pos.includes('atacante') ||
            pos.includes('extremo') || pos.includes('winger') || pos === '7' || pos === '9') {
            return 'delanteros';
        }
        return 'otros';
    };
    
    // Detectar campo "Cargo" que contiene "Entrenador" o "Asistente"
    let campoCargo = null;
    
    // Buscar el campo "Cargo" en todos los registros (puede estar en entrenadores o jugadores)
    for (const jugador of jugadores) {
        for (const key in jugador) {
            const keyLower = key.toLowerCase();
            if (keyLower === 'cargo' || keyLower.includes('cargo')) {
                campoCargo = key;
                break;
            }
        }
        if (campoCargo) break;
    }
    
    // Si no encontramos "Cargo", buscar cualquier campo que contenga valores como "Entrenador" o "Asistente"
    if (!campoCargo) {
        for (const jugador of jugadores) {
            for (const key in jugador) {
                const valor = String(jugador[key] || '').toLowerCase().trim();
                if (valor === 'entrenador' || valor === 'asistente' || valor === 'coach' || valor === 'assistant') {
                    campoCargo = key;
                    break;
                }
            }
            if (campoCargo) break;
        }
    }
    
    console.log('Campo Cargo detectado:', campoCargo);
    console.log('Todos los campos disponibles:', Object.keys(primerJugador));
    console.log('Primer jugador completo:', primerJugador);
    
    // Mostrar algunos valores del campo Cargo si existe
    if (campoCargo) {
        const valoresCargo = jugadores
            .map(j => j[campoCargo])
            .filter(v => v !== null && v !== '' && v !== undefined)
            .slice(0, 5);
        console.log('Valores del campo Cargo encontrados (primeros 5):', valoresCargo);
    }
    
    // Separar entrenadores y asistentes
    const entrenadores = [];
    const asistentes = [];
    
    // Agrupar jugadores por posición (sin entrenadores)
    const jugadoresPorPosicion = {
        'porteros': [],
        'defensas': [],
        'centrocampistas': [],
        'delanteros': [],
        'otros': []
    };
    
    jugadores.forEach(jugador => {
        // Verificar si es entrenador o asistente usando el campo "Cargo"
        let esEntrenador = false;
        let esAsistente = false;
        
        if (campoCargo) {
            const valorCargo = String(jugador[campoCargo] || '').trim();
            const valorCargoLower = valorCargo.toLowerCase();
            
            // Verificar si es "Entrenador" o "Coach"
            if (valorCargoLower === 'entrenador' || valorCargoLower === 'coach' || valorCargoLower === 'manager') {
                esEntrenador = true;
                entrenadores.push(jugador);
            }
            // Verificar si es "Asistente" o "Assistant"
            else if (valorCargoLower === 'asistente' || valorCargoLower === 'assistant' || valorCargoLower === 'asistente entrenador') {
                esAsistente = true;
                asistentes.push(jugador);
            }
        }
        
        // Si es entrenador o asistente, NO agregarlo a ninguna categoría de jugadores
        if (!esEntrenador && !esAsistente) {
            const posicion = campoPosicion ? (jugador[campoPosicion] || '') : '';
            const categoria = categorizarPosicion(posicion);
            jugadoresPorPosicion[categoria].push(jugador);
        }
    });
    
    console.log('Jugadores por posición:', {
        porteros: jugadoresPorPosicion['porteros'].length,
        defensas: jugadoresPorPosicion['defensas'].length,
        centrocampistas: jugadoresPorPosicion['centrocampistas'].length,
        delanteros: jugadoresPorPosicion['delanteros'].length
    });
    
    // Función para renderizar una tarjeta de entrenador/asistente
    const renderizarEntrenador = (persona, carpetaImagen, esAsistente = false) => {
        // Obtener nombre
        const nombre = persona.nombre || persona.Nombre || persona.name || '';
        const apellido = persona.apellido || persona.Apellido || persona.surname || persona.lastname || '';
        const nombreCompleto = nombre && apellido ? `${nombre} ${apellido}` : (nombre || apellido || 'Sin nombre');
        
        // Construir ruta de la imagen
        // Si es asistente, usar "sentrenador", si no, usar "entrenador"
        let nombreImagen = esAsistente ? 'sentrenador' : 'entrenador';
        let rutaImagen = `images/${carpetaImagen}/${nombreImagen}.png`;
        
        // Función para formatear nombres de campos
        const formatearCampo = (campo) => {
            let formateado = campo.replace(/_/g, ' ');
            const palabrasMinusculas = ['de', 'del', 'la', 'el', 'los', 'las', 'y', 'o', 'en', 'con', 'por', 'para'];
            formateado = formateado.split(' ').map((palabra, index) => {
                const palabraLower = palabra.toLowerCase();
                if (index === 0 || !palabrasMinusculas.includes(palabraLower)) {
                    return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
                } else {
                    return palabraLower;
                }
            }).join(' ');
            return formateado;
        };
        
        let html = `
            <div class="jugador-card">
                <div class="jugador-imagen-container">
                    <img src="${rutaImagen}" 
                         alt="${nombreCompleto}" 
                         class="jugador-imagen"
                         onerror="this.onerror=null; this.src='images/${carpetaImagen}/${nombreImagen}.jpg'; if(this.onerror) this.src='images/LaligaLogo.jpg';">
                </div>
                <div class="jugador-info">
                    <h3 class="jugador-nombre">${nombreCompleto}</h3>
                    <div class="jugador-datos">
        `;
        
        // Mostrar todos los datos del entrenador/asistente
        Object.keys(persona).forEach(key => {
            if (key !== campoCargo &&
                key !== 'nombre' && key !== 'Nombre' && key !== 'name' &&
                key !== 'apellido' && key !== 'Apellido' && key !== 'surname' && key !== 'lastname') {
                const valor = persona[key];
                if (valor !== null && valor !== '' && valor !== undefined) {
                    const campoFormateado = formatearCampo(key);
                    html += `<p><strong>${campoFormateado}:</strong> ${valor}</p>`;
                }
            }
        });
        
        html += `
                    </div>
                </div>
            </div>
        `;
        
        return html;
    };
    
    // Títulos de las secciones
    const titulosSecciones = {
        'porteros': 'Porteros',
        'defensas': 'Defensas',
        'centrocampistas': 'Centrocampistas',
        'delanteros': 'Delanteros',
        'otros': 'Otros'
    };
    
    // Orden de las secciones (sin entrenadores)
    const ordenSecciones = ['porteros', 'defensas', 'centrocampistas', 'delanteros', 'otros'];
    
    let html = `
        <div class="equipo-detalles">
            <h2>Plantilla del Equipo</h2>
    `;
    
    // Renderizar sección de entrenadores ANTES de los porteros
    if (entrenadores.length > 0 || asistentes.length > 0) {
        html += `
            <div class="seccion-posicion">
                <h3 class="titulo-seccion">Cuerpo Técnico</h3>
                <div class="jugadores-grid">
        `;
        
        // Mostrar primero los entrenadores
        entrenadores.forEach(entrenador => {
            html += renderizarEntrenador(entrenador, carpetaImagen, false);
        });
        
        // Luego los asistentes (con imagen de "sentrenadores")
        asistentes.forEach(asistente => {
            html += renderizarEntrenador(asistente, carpetaImagen, true);
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Renderizar cada sección de jugadores
    ordenSecciones.forEach(seccion => {
        const jugadoresSeccion = jugadoresPorPosicion[seccion];
        if (jugadoresSeccion.length > 0) {
            html += `
                <div class="seccion-posicion">
                    <h3 class="titulo-seccion">${titulosSecciones[seccion]}</h3>
                    <div class="jugadores-grid">
            `;
            
            jugadoresSeccion.forEach(jugador => {
                // Obtener el dorsal del campo detectado
                const dorsal = campoDorsal ? (jugador[campoDorsal] || '') : '';
                const dorsalLimpio = dorsal ? String(dorsal).trim() : '';
                
                // Obtener nombre
                const nombre = jugador.nombre || jugador.Nombre || jugador.name || '';
                const apellido = jugador.apellido || jugador.Apellido || jugador.surname || jugador.lastname || '';
                const nombreCompleto = nombre && apellido ? `${nombre} ${apellido}` : (nombre || apellido || 'Sin nombre');
                
                // Construir ruta de la imagen usando el dorsal
                let rutaImagen = 'images/LaligaLogo.jpg';
                if (dorsalLimpio) {
                    rutaImagen = `images/${carpetaImagen}/${dorsalLimpio}.png`;
                }
                
                // Determinar texto de error para la imagen
                const onerrorImagen = `this.onerror=null; this.src='images/${carpetaImagen}/${dorsalLimpio}.jpg'; if(this.onerror) this.src='images/LaligaLogo.jpg';`;
                
                html += `
                    <div class="jugador-card">
                        <div class="jugador-imagen-container">
                            <img src="${rutaImagen}" 
                                 alt="${nombreCompleto}" 
                                 class="jugador-imagen"
                                 onerror="${onerrorImagen}">
                            ${dorsalLimpio ? `<span class="jugador-dorsal">${dorsalLimpio}</span>` : ''}
                        </div>
                        <div class="jugador-info">
                            <h3 class="jugador-nombre">${nombreCompleto}</h3>
                            <div class="jugador-datos">
                `;
                
                // Función para formatear nombres de campos
                const formatearCampo = (campo) => {
                    let formateado = campo.replace(/_/g, ' ');
                    const palabrasMinusculas = ['de', 'del', 'la', 'el', 'los', 'las', 'y', 'o', 'en', 'con', 'por', 'para'];
                    formateado = formateado.split(' ').map((palabra, index) => {
                        const palabraLower = palabra.toLowerCase();
                        if (index === 0 || !palabrasMinusculas.includes(palabraLower)) {
                            return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
                        } else {
                            return palabraLower;
                        }
                    }).join(' ');
                    return formateado;
                };
                
                // Mostrar todos los datos del jugador
                Object.keys(jugador).forEach(key => {
                    if (key !== campoDorsal && key !== campoPosicion &&
                        key !== campoCargo &&
                        key !== 'nombre' && key !== 'Nombre' && key !== 'name' &&
                        key !== 'apellido' && key !== 'Apellido' && key !== 'surname' && key !== 'lastname') {
                        const valor = jugador[key];
                        if (valor !== null && valor !== '' && valor !== undefined) {
                            const campoFormateado = formatearCampo(key);
                            html += `<p><strong>${campoFormateado}:</strong> ${valor}</p>`;
                        }
                    }
                });
                
                html += `
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
    });
    
    html += `
        </div>
    `;
    
    content.innerHTML = html;
}

export default EquipoPage;
export { init };