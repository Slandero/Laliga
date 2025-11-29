// Página de Fichajes

// Mapeo de países a abreviaciones oficiales (ISO 3166-1 alpha-2)
// Soporta nombres en inglés y español
const mapeoPaises = {
    // Nombres en inglés (usados en los datos)
    'Spain': 'ES',
    'United States': 'US',
    'Italy': 'IT',
    'Serbia': 'RS',
    'Argentina': 'AR',
    'United Kingdom': 'GB',
    'Brazil': 'BR',
    'Slovakia': 'SK',
    'Canada': 'CA',
    'Uruguay': 'UY',
    'France': 'FR',
    'Romania': 'RO',
    'Ghana': 'GH',
    'Portugal': 'PT',
    'Venezuela': 'VE',
    'Nigeria': 'NG',
    'Switzerland': 'CH',
    'Morocco': 'MA',
    'Guinea': 'GN',
    'Netherlands': 'NL',
    'Colombia': 'CO',
    'Belgium': 'BE',
    'Germany': 'DE',
    'Croatia': 'HR',
    'Australia': 'AU',
    'Chile': 'CL',
    'Ireland': 'IE',
    'Comoros': 'KM',
    'Finland': 'FI',
    'Israel': 'IL',
    'DR Congo': 'CD',
    'Cameroon': 'CM',
    'Ukraine': 'UA',
    'Greece': 'GR',
    'Dominican Republic': 'DO',
    // Nombres en español (para compatibilidad)
    'España': 'ES',
    'Estados Unidos': 'US',
    'Italia': 'IT',
    'Serbia': 'RS',
    'Argentina': 'AR',
    'Reino Unido': 'GB',
    'Brasil': 'BR',
    'Eslovaquia': 'SK',
    'Canadá': 'CA',
    'Uruguay': 'UY',
    'Francia': 'FR',
    'Rumania': 'RO',
    'Ghana': 'GH',
    'Portugal': 'PT',
    'Venezuela': 'VE',
    'Nigeria': 'NG',
    'Suiza': 'CH',
    'Marruecos': 'MA',
    'Guinea': 'GN',
    'Países Bajos': 'NL',
    'Colombia': 'CO',
    'Bélgica': 'BE',
    'Alemania': 'DE',
    'Croacia': 'HR',
    'Australia': 'AU',
    'Chile': 'CL',
    'Irlanda': 'IE',
    'Comoras': 'KM',
    'Finlandia': 'FI',
    'Israel': 'IL',
    'República Democrática del Congo': 'CD',
    'Camerún': 'CM',
    'Ucrania': 'UA',
    'Grecia': 'GR'
};

// Mapeo de países en español a inglés (para búsqueda)
const mapeoPaisesEspaIng = {
    'España': 'Spain',
    'Estados Unidos': 'United States',
    'Italia': 'Italy',
    'Serbia': 'Serbia',
    'Argentina': 'Argentina',
    'Reino Unido': 'United Kingdom',
    'Brasil': 'Brazil',
    'Eslovaquia': 'Slovakia',
    'Canadá': 'Canada',
    'Uruguay': 'Uruguay',
    'Francia': 'France',
    'Rumania': 'Romania',
    'Ghana': 'Ghana',
    'Portugal': 'Portugal',
    'Venezuela': 'Venezuela',
    'Nigeria': 'Nigeria',
    'Suiza': 'Switzerland',
    'Marruecos': 'Morocco',
    'Guinea': 'Guinea',
    'Países Bajos': 'Netherlands',
    'Colombia': 'Colombia',
    'Bélgica': 'Belgium',
    'Alemania': 'Germany',
    'Croacia': 'Croatia',
    'Australia': 'Australia',
    'Chile': 'Chile',
    'Irlanda': 'Ireland',
    'Comoras': 'Comoros',
    'Finlandia': 'Finland',
    'Israel': 'Israel',
    'República Democrática del Congo': 'DR Congo',
    'Camerún': 'Cameroon',
    'Ucrania': 'Ukraine',
    'Grecia': 'Greece'
};

// Función para convertir nombre de país en español a inglés (para búsqueda)
function convertirPaisEspaIng(paisEsp) {
    // Buscar coincidencia exacta
    if (mapeoPaisesEspaIng[paisEsp]) {
        return mapeoPaisesEspaIng[paisEsp];
    }
    // Buscar coincidencia parcial (case-insensitive)
    const paisLower = paisEsp.toLowerCase();
    for (const [esp, ing] of Object.entries(mapeoPaisesEspaIng)) {
        if (esp.toLowerCase().includes(paisLower) || paisLower.includes(esp.toLowerCase())) {
            return ing;
        }
    }
    return null;
}

// Función para convertir nombre de país en inglés a español
function convertirPaisIngAEsp(paisIng) {
    // Buscar en el mapeo inverso
    for (const [esp, ing] of Object.entries(mapeoPaisesEspaIng)) {
        if (ing.toLowerCase() === paisIng.toLowerCase()) {
            return esp;
        }
    }
    return null;
}

// Función para buscar país en ambos idiomas (retorna el nombre en inglés del país)
function buscarPaisEnAmbosIdiomas(busqueda) {
    const busquedaLower = busqueda.toLowerCase();
    
    // Buscar en nombres en inglés
    for (const paisIng of Object.keys(mapeoPaises)) {
        if (paisIng.toLowerCase().includes(busquedaLower)) {
            // Verificar que no sea español (si tiene mapeo inverso, es español)
            if (!mapeoPaisesEspaIng[paisIng]) {
                return paisIng;
            }
        }
    }
    
    // Buscar en nombres en español y convertir a inglés
    for (const [esp, ing] of Object.entries(mapeoPaisesEspaIng)) {
        if (esp.toLowerCase().includes(busquedaLower)) {
            return ing;
        }
    }
    
    return null;
}

// Mapeo de equipos a carpetas de imágenes
const mapeoEquipos = {
    'Real Madrid': 'realmadrid',
    'Atlético de Madrid': 'ClubAtléticodeMadridSAD',
    'RCD Espanyol de Barcelona': 'espanyol',
    'Sevilla FC': 'sevilla',
    'Villarreal CF': 'villareal',
    'Real Betis': 'betis',
    'Deportivo Alavés': 'DeportivoAlavésSAD',
    'Elche CF': 'ElcheClubdeFútbolSAD',
    'Athletic Club': 'AthleticClub',
    'Rayo Vallecano': 'RayoVallecanodeMadridSAD',
    'Getafe CF': 'GetafeClubdeFútbolSAD',
    'Valencia CF': 'valencia',
    'Granada CF': null, // No hay carpeta para este equipo
    'CD Leganés': null, // No hay carpeta para este equipo
    'Sevilla Atlético': null, // No hay carpeta para este equipo
    'Benfica': null, // Equipo externo
    'Atalanta': null, // Equipo externo
    'Liverpool': null, // Equipo externo
    'Bournemouth': null, // Equipo externo
    'NAPOLI': null, // Equipo externo
    'BOTAFOGO DE FUTEBOL E REGATAS': null, // Equipo externo
    'MALLORCA B': null, // Equipo filial
    'MARSEILLE': null, // Equipo externo
    'GETAFE CF B': null, // Equipo filial
    'UD LAS PALMAS': null, // No hay carpeta para este equipo
    'VILLARREAL B': null, // Equipo filial
    'REAL MADRID CASTILLA': null, // Equipo filial
    'ALBACETE BP': null, // No hay carpeta para este equipo
    'BRAGA': null, // Equipo externo
    'RIVER PLATE': null, // Equipo externo
    'CA Osasuna': 'ClubAtléticoOsasuna',
    'Girona FC': 'GironaFútbolClubSAD',
    'RCD Mallorca': 'mallorca',
    'CD Leganés': null, // No hay carpeta para este equipo
    'REAL MADRID CF C': null, // Equipo filial
    'FEYENOORD': null, // Equipo externo
    'CLUB ATLETICO OSASUNA B': null, // Equipo filial
    'INTER': null, // Equipo externo
    'PAOK': null, // Equipo externo
    'ATHLETIC CLUB B': null, // Equipo filial
    'FC BARCELONA B': null, // Equipo filial
    'Real Oviedo': 'RealOviedo',
    'VALENCIA MESTALLA': null, // Equipo filial
    'Al Akhdoud Saudi Club': null, // Equipo externo
    'ARSENAL': null, // Equipo externo
    'RCD ESPANYOL B': null, // Equipo filial
    'CD MIRANDÉS': null, // No hay carpeta para este equipo
    'UD ALMERÍA': null, // No hay carpeta para este equipo
    'Celta': 'Celta',
    'CELTA': 'Celta',
    'CLUB BRUJAS': null, // Equipo externo
    'CELTA DE VIGO B': null, // Equipo filial
    'CÁDIZ CF': null, // No hay carpeta para este equipo
    'CLUB LEÓN': null, // Equipo externo
    'PACHUCA': null, // Equipo externo
    'ESTRELLA ROJA': null, // Equipo externo
    'CLUB NACIONAL DE FOOTBALL DE MONTEVIDEO': null, // Equipo externo
    'RENNES': null, // Equipo externo
    'Real Sociedad': 'realsociedad',
    'BLACKBURN ROVERS': null, // Equipo externo
    'Fortaleza Esporte Clube': null, // Equipo externo
    'YOUNG BOYS': null, // Equipo externo
    'GIRONA FC B': null, // Equipo filial
    'VÉLEZ': null, // Equipo externo
    'DEPORTIVO TOLUCA F.C.': null, // Equipo externo
    'MAN CITY': null, // Equipo externo
    'RB LEIPZIG': null, // Equipo externo
    'FC BAYERN': null, // Equipo externo
    'R. SOCIEDAD B': null, // Equipo filial
    'Levante UD': 'LevanteUniónDeportivaSAD',
    'CD ELDENSE': null, // No hay carpeta para este equipo
    'ATLÉTICO LEVANTE UD': null, // Equipo filial
    'LEEDS': null, // Equipo externo
    'REAL ZARAGOZA': null, // No hay carpeta para este equipo
    'SAINT-ÉTIENNE': null, // Equipo externo
    'Debreceni VSC': null, // Equipo externo
    'MONTERREY': null, // Equipo externo
    'FC Barcelona': 'FútbolClubBarcelona',
    'A VILLA': null, // Equipo externo
    'ROMA': null, // Equipo externo
    'INTER MIAMI CF': null, // Equipo externo
    'MAN UTD': null, // Equipo externo
    'FIORENTINA': null, // Equipo externo
    'READING F.C.': null, // Equipo externo
    'SASSUOLO': null, // Equipo externo
    'VENEZIA FC': null, // Equipo externo
    'WOLVES': null, // Equipo externo
    'LYON': null, // Equipo externo
    'LENS': null, // Equipo externo
    'TOULOUSE': null, // Equipo externo
    'BURNLEY': null, // Equipo externo
    'CHELSEA': null, // Equipo externo
    'PARTIZAN': null, // Equipo externo
    'Granada CF': null, // No hay carpeta para este equipo
    'NOTTINGHAM FOREST': null, // Equipo externo
    'Minnesota United FC': null, // Equipo externo
    'Unione Sportiva Cremonese': null, // Equipo externo
    'NEWCASTLE': null, // Equipo externo
    'PSG': null, // Equipo externo
    'JUVENTUS': null, // Equipo externo
    'SPURS': null, // Equipo externo
    'FENERBAHÇE': null, // Equipo externo
    'Hull City AFC': null, // Equipo externo
    'Dinamo Kiev': null, // Equipo externo
    'West Brom': null, // Equipo externo
    'FC BARCELONA JUVENIL': null, // Equipo filial
    'BURGOS CF': null, // No hay carpeta para este equipo
    'OPORTO': null, // Equipo externo
    'TRABZONSPOR': null, // Equipo externo
    'GENOA': null // Equipo externo
};

function obtenerRutaLogoEquipo(nombreEquipo) {
    const carpeta = mapeoEquipos[nombreEquipo];
    if (carpeta) {
        return `images/${carpeta}/escudo.png`;
    }
    return null; // No mostrar imagen si no se encuentra
}

function obtenerAbreviaturaPais(pais) {
    return mapeoPaises[pais] || pais;
}

// Datos de fichajes
const fichajes = [
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Morocco',
        jugador: 'AZZ-EDDINE',
        destino: 'Girona FC',
        procedencia: 'MARSEILLE',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Morocco',
        jugador: 'A. ABQAR',
        destino: 'Getafe CF',
        procedencia: 'Deportivo Alavés',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'MARC BERNAL',
        destino: 'FC Barcelona',
        procedencia: 'FC BARCELONA JUVENIL',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'JUANMI',
        destino: 'Getafe CF',
        procedencia: 'Real Betis',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Cameroon',
        jugador: 'NEYOU',
        destino: 'Getafe CF',
        procedencia: 'CD Leganés',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ALEX',
        destino: 'Getafe CF',
        procedencia: 'BURGOS CF',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'JAVI MUÑOZ',
        destino: 'Getafe CF',
        procedencia: 'UD LAS PALMAS',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'KIKO F.',
        destino: 'Getafe CF',
        procedencia: 'Villarreal CF',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Portugal',
        jugador: 'CARDOSO',
        destino: 'Sevilla FC',
        procedencia: 'OPORTO',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'France',
        jugador: 'MENDY',
        destino: 'Sevilla FC',
        procedencia: 'TRABZONSPOR',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'RAMÓN MARTÍNEZ',
        destino: 'Sevilla FC',
        procedencia: 'Sevilla Atlético',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'JOEL ROCA',
        destino: 'Girona FC',
        procedencia: 'GIRONA FC B',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'C.SOLER',
        destino: 'Real Sociedad',
        procedencia: 'PSG',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'JAN VIRGILI',
        destino: 'RCD Mallorca',
        procedencia: 'MALLORCA B',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Greece',
        jugador: 'ALAN MATTURRO',
        destino: 'Levante UD',
        procedencia: 'GENOA',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'NICO GONZÁLEZ',
        destino: 'Atlético de Madrid',
        procedencia: 'JUVENTUS',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Israel',
        jugador: 'SOLOMON',
        destino: 'Villarreal CF',
        procedencia: 'SPURS',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Croatia',
        jugador: 'LIVAKOVIC',
        destino: 'Girona FC',
        procedencia: 'FENERBAHÇE',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'France',
        jugador: 'MIKAUTADZE',
        destino: 'Villarreal CF',
        procedencia: 'LYON',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'United Kingdom',
        jugador: 'ABU KAMARA',
        destino: 'Getafe CF',
        procedencia: 'Hull City AFC',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'VENCEDOR',
        destino: 'Levante UD',
        procedencia: 'Athletic Club',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Netherlands',
        jugador: 'S. BECKER',
        destino: 'CA Osasuna',
        procedencia: 'Real Sociedad',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'BRYAN',
        destino: 'Girona FC',
        procedencia: 'SPURS',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Netherlands',
        jugador: 'AMRABAT',
        destino: 'Real Betis',
        procedencia: 'FENERBAHÇE',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'BELTRÁN',
        destino: 'Valencia CF',
        procedencia: 'FIORENTINA',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Brazil',
        jugador: 'ALEMÃO',
        destino: 'Rayo Vallecano',
        procedencia: 'PACHUCA',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Cameroon',
        jugador: 'ETTA EYONG',
        destino: 'Levante UD',
        procedencia: 'VILLARREAL B',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Brazil',
        jugador: 'ANTONY',
        destino: 'Real Betis',
        procedencia: 'MAN UTD',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Ukraine',
        jugador: 'VANAT',
        destino: 'Girona FC',
        procedencia: 'Dinamo Kiev',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'DR Congo',
        jugador: 'DIANG',
        destino: 'Elche CF',
        procedencia: 'West Brom',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ARRIAGA',
        destino: 'Levante UD',
        procedencia: 'PARTIZAN',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'LUCAS BOYÉ',
        destino: 'Deportivo Alavés',
        procedencia: 'Granada CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'PEDROSA',
        destino: 'Elche CF',
        procedencia: 'Sevilla FC',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Comoros',
        jugador: 'KOYALIPOU',
        destino: 'Levante UD',
        procedencia: 'LENS',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Finland',
        jugador: 'BERGSTROM',
        destino: 'RCD Mallorca',
        procedencia: 'CHELSEA',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'AZPILICUETA',
        destino: 'Sevilla Atlético',
        procedencia: 'Real Sociedad',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'HERRERA',
        destino: 'Real Sociedad',
        procedencia: 'Girona FC',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'JAVI LÓPEZ',
        destino: 'Real Oviedo',
        procedencia: 'Real Sociedad',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Portugal',
        jugador: 'CARMO',
        destino: 'Real Oviedo',
        procedencia: 'NOTTINGHAM FOREST',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'DENIS SUÁREZ',
        destino: 'Deportivo Alavés',
        procedencia: 'Villarreal CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Nigeria',
        jugador: 'OLUWASEYI',
        destino: 'Villarreal CF',
        procedencia: 'Minnesota United FC',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Switzerland',
        jugador: 'PICKLE',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Unione Sportiva Cremonese',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Germany',
        jugador: 'ODISSEAS',
        destino: 'Sevilla FC',
        procedencia: 'NEWCASTLE',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ARNAU TENAS',
        destino: 'Villarreal CF',
        procedencia: 'PSG',
        tipo: 'Libre'
    },
    {
        fecha: '30/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'MARTÍN',
        destino: 'FC Barcelona',
        procedencia: 'Real Sociedad',
        tipo: 'Traspaso'
    },
    {
        fecha: '29/08/2025',
        competicion: 'LALIGA',
        pais: 'Belgium',
        jugador: 'RAMAZANI',
        destino: 'Valencia CF',
        procedencia: 'LEEDS',
        tipo: 'Cesión'
    },
    {
        fecha: '29/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'URKO',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Real Sociedad',
        tipo: 'Traspaso'
    },
    {
        fecha: '29/08/2025',
        competicion: 'LALIGA',
        pais: 'Australia',
        jugador: 'RYAN',
        destino: 'Levante UD',
        procedencia: 'LENS',
        tipo: 'Libre'
    },
    {
        fecha: '29/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'OLASAGASTI',
        destino: 'Levante UD',
        procedencia: 'Real Sociedad',
        tipo: 'Traspaso'
    },
    {
        fecha: '29/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'IÑAKI PEÑA',
        destino: 'Elche CF',
        procedencia: 'FC Barcelona',
        tipo: 'Cesión'
    },
    {
        fecha: '28/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'PACHECO',
        destino: 'Deportivo Alavés',
        procedencia: 'Real Sociedad',
        tipo: 'Cesión'
    },
    {
        fecha: '28/08/2025',
        competicion: 'LALIGA',
        pais: 'Chile',
        jugador: 'SUAZO',
        destino: 'Sevilla FC',
        procedencia: 'TOULOUSE',
        tipo: 'Libre'
    },
    {
        fecha: '28/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ALFON',
        destino: 'Sevilla FC',
        procedencia: 'Celta',
        tipo: 'Libre'
    },
    {
        fecha: '24/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ALEX MORENO',
        destino: 'Girona FC',
        procedencia: 'A VILLA',
        tipo: 'Traspaso'
    },
    {
        fecha: '23/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'IKER',
        destino: 'Levante UD',
        procedencia: 'Real Betis',
        tipo: 'Cesión'
    },
    {
        fecha: '23/08/2025',
        competicion: 'LALIGA',
        pais: 'Netherlands',
        jugador: 'BREKALO',
        destino: 'Real Oviedo',
        procedencia: 'FIORENTINA',
        tipo: 'Libre'
    },
    {
        fecha: '23/08/2025',
        competicion: 'LALIGA',
        pais: 'United States',
        jugador: 'KOLEOSHO',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'BURNLEY',
        tipo: 'Cesión'
    },
    {
        fecha: '23/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'DAWDA',
        destino: 'Girona FC',
        procedencia: 'GIRONA FC B',
        tipo: 'Libre'
    },
    {
        fecha: '22/08/2025',
        competicion: 'LALIGA',
        pais: 'Portugal',
        jugador: 'RENATO VEIGA',
        destino: 'Villarreal CF',
        procedencia: 'CHELSEA',
        tipo: 'Traspaso'
    },
    {
        fecha: '22/08/2025',
        competicion: 'LALIGA',
        pais: 'Ireland',
        jugador: 'E. BAILLY',
        destino: 'Real Oviedo',
        procedencia: 'Villarreal CF',
        tipo: 'Libre'
    },
    {
        fecha: '22/08/2025',
        competicion: 'LALIGA',
        pais: 'Belgium',
        jugador: 'DENDONCKER',
        destino: 'Real Oviedo',
        procedencia: 'A VILLA',
        tipo: 'Libre'
    },
    {
        fecha: '21/08/2025',
        competicion: 'LALIGA',
        pais: 'Italy',
        jugador: 'KUMBULLA',
        destino: 'RCD Mallorca',
        procedencia: 'ROMA',
        tipo: 'Cesión'
    },
    {
        fecha: '18/08/2025',
        competicion: 'LALIGA',
        pais: 'Portugal',
        jugador: 'ANDRÉ SILVA',
        destino: 'Elche CF',
        procedencia: 'RB LEIPZIG',
        tipo: 'Traspaso'
    },
    {
        fecha: '18/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'RAFA MIR',
        destino: 'Elche CF',
        procedencia: 'Sevilla FC',
        tipo: 'Cesión'
    },
    {
        fecha: '18/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'REDONDO',
        destino: 'Elche CF',
        procedencia: 'INTER MIAMI CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '16/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'JOAN GARCIA',
        destino: 'FC Barcelona',
        procedencia: 'RCD Espanyol de Barcelona',
        tipo: 'Pago cláusula'
    },
    {
        fecha: '16/08/2025',
        competicion: 'LALIGA',
        pais: 'United Kingdom',
        jugador: 'RASHFORD',
        destino: 'FC Barcelona',
        procedencia: 'MAN UTD',
        tipo: 'Cesión'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'MATIAS MORENO',
        destino: 'Levante UD',
        procedencia: 'FIORENTINA',
        tipo: 'Cesión'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Nigeria',
        jugador: 'EJARIA',
        destino: 'Real Oviedo',
        procedencia: 'READING F.C.',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Germany',
        jugador: 'JEREMY TOLJAN',
        destino: 'Levante UD',
        procedencia: 'SASSUOLO',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Romania',
        jugador: 'RADU',
        destino: 'Celta',
        procedencia: 'VENEZIA FC',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Portugal',
        jugador: 'GUEDES',
        destino: 'Real Sociedad',
        procedencia: 'WOLVES',
        tipo: 'Traspaso'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'B. IGLESIAS',
        destino: 'Celta',
        procedencia: 'Real Betis',
        tipo: 'Traspaso'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Croatia',
        jugador: 'CALETA-CAR',
        destino: 'Real Sociedad',
        procedencia: 'LYON',
        tipo: 'Cesión'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'JAVI RUEDA',
        destino: 'Celta',
        procedencia: 'CELTA DE VIGO B',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'MANU FERNÁNDEZ',
        destino: 'Celta',
        procedencia: 'CELTA DE VIGO B',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'VÍCTOR G.',
        destino: 'Levante UD',
        procedencia: 'CD ELDENSE',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'P. CAMPOS',
        destino: 'Levante UD',
        procedencia: 'ATLÉTICO LEVANTE UD',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'FRAN PÉREZ',
        destino: 'Rayo Vallecano',
        procedencia: 'Valencia CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'MATEO JOSEPH',
        destino: 'RCD Mallorca',
        procedencia: 'LEEDS',
        tipo: 'Cesión'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'MARIO MARTÍN',
        destino: 'Getafe CF',
        procedencia: 'REAL MADRID CASTILLA',
        tipo: 'Cesión'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'M. ROMÁN',
        destino: 'Celta',
        procedencia: 'CELTA DE VIGO B',
        tipo: 'Libre'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'LISO',
        destino: 'Getafe CF',
        procedencia: 'REAL ZARAGOZA',
        tipo: 'Cesión'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'France',
        jugador: 'LÉO PETRÓT',
        destino: 'Elche CF',
        procedencia: 'SAINT-ÉTIENNE',
        tipo: 'Libre'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'France',
        jugador: 'BRANDON',
        destino: 'Real Oviedo',
        procedencia: 'Debreceni VSC',
        tipo: 'Traspaso'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Italy',
        jugador: 'RASPADORI',
        destino: 'Atlético de Madrid',
        procedencia: 'NAPOLI',
        tipo: 'Traspaso'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Dominican Republic',
        jugador: 'JUNIOR',
        destino: 'Real Betis',
        procedencia: 'LEEDS',
        tipo: 'Libre'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Colombia',
        jugador: 'DEOSSA',
        destino: 'Real Betis',
        procedencia: 'MONTERREY',
        tipo: 'Traspaso'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'MANU SÁNCHEZ',
        destino: 'Levante UD',
        procedencia: 'Celta',
        tipo: 'Cesión'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Belgium',
        jugador: 'WITSEL',
        destino: 'Girona FC',
        procedencia: 'Atlético de Madrid',
        tipo: 'Libre'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'United Kingdom',
        jugador: 'DOLAN',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'BLACKBURN ROVERS',
        tipo: 'Libre'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Brazil',
        jugador: 'CALEBE',
        destino: 'Deportivo Alavés',
        procedencia: 'Fortaleza Esporte Clube',
        tipo: 'Cesión'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Switzerland',
        jugador: 'UGRINIC',
        destino: 'Valencia CF',
        procedencia: 'YOUNG BOYS',
        tipo: 'Traspaso'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Morocco',
        jugador: 'ILYAS',
        destino: 'Real Oviedo',
        procedencia: 'GIRONA FC B',
        tipo: 'Traspaso'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'VALENTIN GOMEZ',
        destino: 'Real Betis',
        procedencia: 'VÉLEZ',
        tipo: 'Pago cláusula'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'PAU LOPEZ',
        destino: 'Real Betis',
        procedencia: 'DEPORTIVO TOLUCA F.C.',
        tipo: 'Libre'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Brazil',
        jugador: 'VITOR REIS',
        destino: 'Girona FC',
        procedencia: 'MAN CITY',
        tipo: 'Cesión'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Guinea',
        jugador: 'ILAIX MORIBA',
        destino: 'Celta',
        procedencia: 'RB LEIPZIG',
        tipo: 'Traspaso'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'BRYAN',
        destino: 'Celta',
        procedencia: 'FC BAYERN',
        tipo: 'Cesión'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'GORROTXA',
        destino: 'Real Sociedad',
        procedencia: 'R. SOCIEDAD B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'KARRIKABURU',
        destino: 'Real Sociedad',
        procedencia: 'R. SOCIEDAD B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'A. ALTI',
        destino: 'Villarreal CF',
        procedencia: 'VILLARREAL B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'V. PARADA',
        destino: 'Deportivo Alavés',
        procedencia: 'DEPORTIVO ALAVÉS',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'CARREIRA',
        destino: 'Celta',
        procedencia: 'CELTA DE VIGO B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'GOTI',
        destino: 'Real Sociedad',
        procedencia: 'R. SOCIEDAD B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'FERRAN',
        destino: 'Celta',
        procedencia: 'CLUB BRUJAS',
        tipo: 'Traspaso'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Portugal',
        jugador: 'MARTIM NETO',
        destino: 'Elche CF',
        procedencia: 'BENFICA',
        tipo: 'Traspaso'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ÁLVARO',
        destino: 'Elche CF',
        procedencia: 'REAL MADRID CASTILLA',
        tipo: 'Traspaso'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'MARC VIDAL',
        destino: 'Celta',
        procedencia: 'CELTA DE VIGO B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'MARIANO',
        destino: 'Deportivo Alavés',
        procedencia: 'Sevilla FC',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'V. CHUST',
        destino: 'Elche CF',
        procedencia: 'CÁDIZ CF',
        tipo: 'Cesión'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'COLOMBATTO',
        destino: 'Real Oviedo',
        procedencia: 'CLUB LEÓN',
        tipo: 'Cesión'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'Venezuela',
        jugador: 'RONDON',
        destino: 'Real Oviedo',
        procedencia: 'PACHUCA',
        tipo: 'Cesión'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'Serbia',
        jugador: 'ILIC',
        destino: 'Real Oviedo',
        procedencia: 'ESTRELLA ROJA',
        tipo: 'Libre'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'Uruguay',
        jugador: 'F. VIÑAS',
        destino: 'Real Oviedo',
        procedencia: 'CLUB LEÓN',
        tipo: 'Cesión'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'A. FORES',
        destino: 'Real Oviedo',
        procedencia: 'VILLARREAL B',
        tipo: 'Cesión'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'A. REINA',
        destino: 'Real Oviedo',
        procedencia: 'CD MIRANDÉS',
        tipo: 'Libre'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'Uruguay',
        jugador: 'GONZALO PETIT',
        destino: 'Real Betis',
        procedencia: 'CLUB NACIONAL DE FOOTBALL DE MONTEVIDEO',
        tipo: 'Traspaso'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'Nigeria',
        jugador: 'DANJUMA',
        destino: 'Valencia CF',
        procedencia: 'Villarreal CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'France',
        jugador: 'SANTAMARIA',
        destino: 'Valencia CF',
        procedencia: 'RENNES',
        tipo: 'Traspaso'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'GERMAN V.',
        destino: 'Elche CF',
        procedencia: 'VALENCIA MESTALLA',
        tipo: 'Libre'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'COLLADO',
        destino: 'Real Betis',
        procedencia: 'Al Akhdoud Saudi Club',
        tipo: 'Libre'
    },
    {
        fecha: '11/08/2025',
        competicion: 'LALIGA',
        pais: 'Romania',
        jugador: 'MOLDOVAN',
        destino: 'Real Oviedo',
        procedencia: 'Atlético de Madrid',
        tipo: 'Cesión'
    },
    {
        fecha: '11/08/2025',
        competicion: 'LALIGA',
        pais: 'Ghana',
        jugador: 'THOMAS',
        destino: 'Villarreal CF',
        procedencia: 'ARSENAL',
        tipo: 'Libre'
    },
    {
        fecha: '09/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'GONZALO',
        destino: 'Real Madrid',
        procedencia: 'REAL MADRID CASTILLA',
        tipo: 'Libre'
    },
    {
        fecha: '08/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'A. FORTUÑO',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'RCD ESPANYOL B',
        tipo: 'Libre'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ALEÑÁ',
        destino: 'Deportivo Alavés',
        procedencia: 'Getafe CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'YOUSSEF',
        destino: 'Deportivo Alavés',
        procedencia: 'REAL MADRID CASTILLA',
        tipo: 'Traspaso'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'RAÚL FERNÁNDEZ',
        destino: 'Deportivo Alavés',
        procedencia: 'CD MIRANDÉS',
        tipo: 'Libre'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'IBAÑEZ',
        destino: 'Deportivo Alavés',
        procedencia: 'CA Osasuna',
        tipo: 'Libre'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ARESO',
        destino: 'Athletic Club',
        procedencia: 'CA Osasuna',
        tipo: 'Traspaso'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'A. ROCA',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'RCD ESPANYOL B',
        tipo: 'Libre'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'Uruguay',
        jugador: 'MOURIÑO',
        destino: 'Villarreal CF',
        procedencia: 'Atlético de Madrid',
        tipo: 'Traspaso'
    },
    {
        fecha: '06/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'C. ROMERO',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Villarreal CF',
        tipo: 'Cesión'
    },
    {
        fecha: '05/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'MARC PUBILL',
        destino: 'Atlético de Madrid',
        procedencia: 'UD ALMERÍA',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'RABA',
        destino: 'Valencia CF',
        procedencia: 'CD Leganés',
        tipo: 'Libre'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'VÍCTOR MUÑOZ',
        destino: 'CA Osasuna',
        procedencia: 'REAL MADRID CF C',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Slovakia',
        jugador: 'DAVID HANCKO',
        destino: 'Atlético de Madrid',
        procedencia: 'FEYENOORD',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'France',
        jugador: 'V. ROSIER',
        destino: 'CA Osasuna',
        procedencia: 'CD Leganés',
        tipo: 'Libre'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'I. BENITO',
        destino: 'CA Osasuna',
        procedencia: 'CLUB ATLETICO OSASUNA B',
        tipo: 'Libre'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Canada',
        jugador: 'BUCHANAN',
        destino: 'Villarreal CF',
        procedencia: 'INTER',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'J. OTTO',
        destino: 'Deportivo Alavés',
        procedencia: 'PAOK',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'A. MOLEIRO',
        destino: 'Villarreal CF',
        procedencia: 'UD LAS PALMAS',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ADAMA',
        destino: 'Athletic Club',
        procedencia: 'ATHLETIC CLUB B',
        tipo: 'Libre'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Uruguay',
        jugador: 'MOURIÑO',
        destino: 'Atlético de Madrid',
        procedencia: 'Deportivo Alavés',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'France',
        jugador: 'LEMAR',
        destino: 'Girona FC',
        procedencia: 'Atlético de Madrid',
        tipo: 'Cesión'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'H. RINCÓN',
        destino: 'Girona FC',
        procedencia: 'ATHLETIC CLUB B',
        tipo: 'Cesión'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'AGIRREZABALA',
        destino: 'Valencia CF',
        procedencia: 'Athletic Club',
        tipo: 'Cesión'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'COPETE',
        destino: 'Valencia CF',
        procedencia: 'RCD Mallorca',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/08/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'PABLO TORRE',
        destino: 'RCD Mallorca',
        procedencia: 'FC BARCELONA B',
        tipo: 'Traspaso'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'RAFA MARÍN',
        destino: 'Villarreal CF',
        procedencia: 'NAPOLI',
        tipo: 'Cesión'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'ALMADA',
        destino: 'Atlético de Madrid',
        procedencia: 'BOTAFOGO DE FUTEBOL E REGATAS',
        tipo: 'Traspaso'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'Brazil',
        jugador: 'NATAN',
        destino: 'Real Betis',
        procedencia: 'NAPOLI',
        tipo: 'Traspaso'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'NAVARRO',
        destino: 'Athletic Club',
        procedencia: 'MALLORCA B',
        tipo: 'Libre'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'Brazil',
        jugador: 'LUIZ FELIPE',
        destino: 'Rayo Vallecano',
        procedencia: 'MARSEILLE',
        tipo: 'Libre'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'GUMBAU',
        destino: 'Rayo Vallecano',
        procedencia: 'Granada CF',
        tipo: 'Cesión'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'COBA',
        destino: 'Getafe CF',
        procedencia: 'GETAFE CF B',
        tipo: 'Libre'
    },
    {
        fecha: '30/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'RIQUELME',
        destino: 'Real Betis',
        procedencia: 'Atlético de Madrid',
        tipo: 'Traspaso'
    },
    {
        fecha: '30/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'Á.VALLES',
        destino: 'Real Betis',
        procedencia: 'UD LAS PALMAS',
        tipo: 'Libre'
    },
    {
        fecha: '30/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'R. TERRATS',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Villarreal CF',
        tipo: 'Cesión'
    },
    {
        fecha: '30/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'C. ROMERO',
        destino: 'Villarreal CF',
        procedencia: 'VILLARREAL B',
        tipo: 'Libre'
    },
    {
        fecha: '28/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ASENCIO',
        destino: 'Real Madrid',
        procedencia: 'REAL MADRID CASTILLA',
        tipo: 'Libre'
    },
    {
        fecha: '24/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'C.RIVERO',
        destino: 'Valencia CF',
        procedencia: 'ALBACETE BP',
        tipo: 'Libre'
    },
    {
        fecha: '23/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ROBERTO',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'BRAGA',
        tipo: 'Traspaso'
    },
    {
        fecha: '23/07/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'A. BATALLA',
        destino: 'Rayo Vallecano',
        procedencia: 'RIVER PLATE',
        tipo: 'Traspaso'
    },
    {
        fecha: '22/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'A. CARRERAS',
        destino: 'Real Madrid',
        procedencia: 'Benfica',
        tipo: 'Traspaso'
    },
    {
        fecha: '22/07/2025',
        competicion: 'LALIGA',
        pais: 'United States',
        jugador: 'JOHNNY',
        destino: 'Atlético de Madrid',
        procedencia: 'Real Betis',
        tipo: 'Traspaso'
    },
    {
        fecha: '21/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'MIGUEL RUBIO',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Granada CF',
        tipo: 'Libre'
    },
    {
        fecha: '21/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'SALINAS',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Elche CF',
        tipo: 'Libre'
    },
    {
        fecha: '21/07/2025',
        competicion: 'LALIGA',
        pais: 'Italy',
        jugador: 'RUGGERI',
        destino: 'Atlético de Madrid',
        procedencia: 'Atalanta',
        tipo: 'Traspaso'
    },
    {
        fecha: '21/07/2025',
        competicion: 'LALIGA',
        pais: 'Serbia',
        jugador: 'DMITROVIC',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'CD Leganés',
        tipo: 'Libre'
    },
    {
        fecha: '21/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'KIKE G.',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Deportivo Alavés',
        tipo: 'Libre'
    },
    {
        fecha: '17/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'JUANLU',
        destino: 'Sevilla FC',
        procedencia: 'Sevilla Atlético',
        tipo: 'Libre'
    },
    {
        fecha: '10/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'ALEX. B',
        destino: 'Atlético de Madrid',
        procedencia: 'Villarreal CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/07/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'J. MUSSO',
        destino: 'Atlético de Madrid',
        procedencia: 'Atalanta',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/07/2025',
        competicion: 'LALIGA',
        pais: 'United Kingdom',
        jugador: 'ALEXANDER-ARNOLD',
        destino: 'Real Madrid',
        procedencia: 'Liverpool',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/07/2025',
        competicion: 'LALIGA',
        pais: 'Spain',
        jugador: 'HUIJSEN',
        destino: 'Real Madrid',
        procedencia: 'Bournemouth',
        tipo: 'Traspaso'
    }
];

// Variable para mantener el estado de la página actual
let paginaActual = 1;
const fichajesPorPagina = 12;

// Variables para los filtros
let filtros = {
    fechaDesde: '',
    fechaHasta: '',
    nacionalidad: '',
    jugador: '',
    destino: '',
    procedencia: '',
    tipo: ''
};

function FichajesPage() {
    // Resetear a la primera página cuando se carga la página
    paginaActual = 1;
    // Resetear filtros
    filtros = {
        fechaDesde: '',
        fechaHasta: '',
        nacionalidad: '',
        jugador: '',
        destino: '',
        procedencia: '',
        tipo: ''
    };
    
    return `
        <section id="fichajes">
            <h1>ÚLTIMOS FICHAJES DE LALIGA EA SPORTS 2025/26</h1>
            <div id="fichajes-filtros" class="fichajes-filtros">
                <div class="filtros-row filtros-row-1">
                    <div class="filtro-group">
                        <div class="filtro-input-wrapper">
                            <svg class="calendar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3h10v10H3V3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5 1v4M11 1v4M2 6h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <input type="text" id="filtro-fecha-desde" class="filtro-input" placeholder="Desde" />
                        </div>
                    </div>
                    <div class="filtro-group">
                        <div class="filtro-input-wrapper">
                            <svg class="calendar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3h10v10H3V3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M5 1v4M11 1v4M2 6h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <input type="text" id="filtro-fecha-hasta" class="filtro-input" placeholder="Hasta" />
                        </div>
                    </div>
                    <div class="filtro-group filtro-group-search">
                        <div class="filtro-input-wrapper">
                            <input type="text" id="filtro-nacionalidad" class="filtro-input" placeholder="Nacionalidad" />
                            <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.5"/>
                                <path d="M11 11l-3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class="filtros-row filtros-row-2">
                    <div class="filtro-group">
                        <input type="text" id="filtro-jugador" class="filtro-input" placeholder="Jugador" />
                    </div>
                    <div class="filtro-group">
                        <input type="text" id="filtro-destino" class="filtro-input" placeholder="Destino" />
                    </div>
                    <div class="filtro-group">
                        <input type="text" id="filtro-procedencia" class="filtro-input" placeholder="Procedencia" />
                    </div>
                    <div class="filtro-group">
                        <select id="filtro-tipo" class="filtro-input filtro-select">
                            <option value="">Tipo</option>
                            <option value="Traspaso">Traspaso</option>
                            <option value="Cesión">Cesión</option>
                            <option value="Libre">Libre</option>
                            <option value="Pago cláusula">Pago cláusula</option>
                        </select>
                    </div>
                    <div class="filtro-group filtro-group-button">
                        <button id="btn-nuevo-fichaje" class="btn-limpiar-filtros btn-nuevo-fichaje">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Nuevo fichaje
                        </button>
                        <button id="btn-limpiar-filtros" class="btn-limpiar-filtros">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                            Limpiar filtros
                        </button>
                    </div>
                </div>
            </div>
            <div id="fichajes-content">
                <div class="fichajes-table-container">
                    <table class="fichajes-table">
                        <thead>
                            <tr>
                                <th>FECHA</th>
                                <th>COMPETICIÓN</th>
                                <th>PAÍS</th>
                                <th>JUGADOR</th>
                                <th>DESTINO</th>
                                <th>PROCEDENCIA</th>
                                <th>TIPO</th>
                            </tr>
                        </thead>
                        <tbody id="fichajes-table-body">
                            <!-- Los datos de fichajes se cargarán aquí -->
                        </tbody>
                    </table>
                </div>
                <div id="fichajes-paginacion" class="fichajes-paginacion">
                    <!-- Los controles de paginación se cargarán aquí -->
                </div>
            </div>
            <!-- Modal flotante para crear nuevo fichaje -->
            <div id="modal-fichaje" class="modal-fichaje-overlay" style="display: none;">
                <div class="modal-fichaje">
                    <div class="modal-fichaje-header">
                        <h2>Nuevo fichaje</h2>
                        <button type="button" id="btn-cerrar-modal-fichaje" class="modal-fichaje-close">&times;</button>
                    </div>
                    <form id="form-nuevo-fichaje" class="modal-fichaje-body">
                        <div class="modal-fichaje-row">
                            <label for="fichaje-fecha">Fecha</label>
                            <input type="text" id="fichaje-fecha" class="filtro-input" placeholder="DD/MM/YYYY" required />
                        </div>
                        <div class="modal-fichaje-row">
                            <label for="fichaje-competicion">Competición</label>
                            <input type="text" id="fichaje-competicion" class="filtro-input" value="LALIGA" required />
                        </div>
                        <div class="modal-fichaje-row">
                            <label for="fichaje-pais">País (en inglés, ej: Spain, France)</label>
                            <input type="text" id="fichaje-pais" class="filtro-input" required />
                        </div>
                        <div class="modal-fichaje-row">
                            <label for="fichaje-jugador">Jugador</label>
                            <input type="text" id="fichaje-jugador" class="filtro-input" required />
                        </div>
                        <div class="modal-fichaje-row modal-fichaje-row-two-cols">
                            <div>
                                <label for="fichaje-destino">Destino</label>
                                <input type="text" id="fichaje-destino" class="filtro-input" required />
                            </div>
                            <div>
                                <label for="fichaje-procedencia">Procedencia</label>
                                <input type="text" id="fichaje-procedencia" class="filtro-input" required />
                            </div>
                        </div>
                        <div class="modal-fichaje-row">
                            <label for="fichaje-tipo">Tipo</label>
                            <select id="fichaje-tipo" class="filtro-input filtro-select" required>
                                <option value="Traspaso">Traspaso</option>
                                <option value="Cesión">Cesión</option>
                                <option value="Libre">Libre</option>
                                <option value="Pago cláusula">Pago cláusula</option>
                            </select>
                        </div>
                        <div class="modal-fichaje-footer">
                            <button type="button" id="btn-cancelar-fichaje" class="btn-limpiar-filtros modal-fichaje-btn-cancelar">
                                Cancelar
                            </button>
                            <button type="submit" id="btn-guardar-fichaje" class="btn-limpiar-filtros modal-fichaje-btn-guardar">
                                Guardar fichaje
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    `;
}

function init() {
    console.log('Página de fichajes cargada');
    // Cargar los fichajes después de un pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
        configurarFiltros();
        configurarBotonNuevoFichaje();
        configurarModalFichaje();
        cargarFichajes();
    }, 200);
}

function configurarBotonNuevoFichaje() {
    const btnNuevo = document.getElementById('btn-nuevo-fichaje');
    if (!btnNuevo) {
        console.warn('No se encontró el botón de nuevo fichaje, reintentando...');
        setTimeout(configurarBotonNuevoFichaje, 100);
        return;
    }

    btnNuevo.addEventListener('click', () => {
        crearNuevoFichajeInteractivo();
    });
}

function configurarModalFichaje() {
    const modal = document.getElementById('modal-fichaje');
    const btnCerrar = document.getElementById('btn-cerrar-modal-fichaje');
    const btnCancelar = document.getElementById('btn-cancelar-fichaje');
    const form = document.getElementById('form-nuevo-fichaje');

    if (!modal || !btnCerrar || !btnCancelar || !form) {
        console.warn('No se encontraron todos los elementos del modal de fichaje, reintentando...');
        setTimeout(configurarModalFichaje, 100);
        return;
    }

    const cerrarModal = () => {
        modal.style.display = 'none';
    };

    btnCerrar.addEventListener('click', cerrarModal);
    btnCancelar.addEventListener('click', (e) => {
        e.preventDefault();
        cerrarModal();
    });

    // Cerrar al hacer click fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const fecha = document.getElementById('fichaje-fecha').value.trim();
        const competicion = document.getElementById('fichaje-competicion').value.trim() || 'LALIGA';
        const pais = document.getElementById('fichaje-pais').value.trim();
        const jugador = document.getElementById('fichaje-jugador').value.trim();
        const destino = document.getElementById('fichaje-destino').value.trim();
        const procedencia = document.getElementById('fichaje-procedencia').value.trim();
        const tipo = document.getElementById('fichaje-tipo').value.trim() || 'Traspaso';

        if (!fecha || !pais || !jugador || !destino || !procedencia) {
            alert('Por favor, rellena todos los campos obligatorios.');
            return;
        }

        // Validar que la fecha esté dentro del periodo de mercado
        if (!esFechaDentroDePeriodoDeFichajes(fecha)) {
            mostrarMensajeMercadoCerrado();
            return;
        }

        const nuevoFichaje = {
            fecha,
            competicion,
            pais,
            jugador,
            destino,
            procedencia,
            tipo
        };

        // Añadir al principio para que aparezca primero
        fichajes.unshift(nuevoFichaje);
        paginaActual = 1;
        cargarFichajes();
        cerrarModal();
        form.reset();
        document.getElementById('fichaje-competicion').value = 'LALIGA';
        document.getElementById('fichaje-tipo').value = 'Traspaso';
    });
}

// Comprueba si la fecha (DD/MM/YYYY o YYYY-MM-DD) está dentro del periodo 02/01/2026 - 02/02/2026
function esFechaDentroDePeriodoDeFichajes(fechaString) {
    const iso = convertirFechaFormato(fechaString);
    if (!iso) {
        return false;
    }
    const fecha = new Date(iso);
    const inicio = new Date('2026-01-02');
    const fin = new Date('2026-02-02');
    return fecha >= inicio && fecha <= fin;
}

// Muestra un mensaje flotante indicando que el mercado está cerrado
function mostrarMensajeMercadoCerrado() {
    let toast = document.getElementById('toast-mercado-cerrado');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-mercado-cerrado';
        toast.className = 'toast-mercado-cerrado';
        toast.textContent = 'El mercado de transferencias está cerrado';
        document.body.appendChild(toast);
    }

    toast.classList.add('visible');

    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

function crearNuevoFichajeInteractivo() {
    // Comprobar si el usuario está logueado usando el botón global de auth
    const btnAcceder = document.getElementById('btn-acceder');
    const estaLogueado = btnAcceder && btnAcceder.dataset.loggedIn === 'true';

    if (!estaLogueado) {
        alert('Debes iniciar sesión para agregar un nuevo fichaje.');
        // Abrir el modal de login si existe (simulando click en "Acceder")
        if (btnAcceder) {
            btnAcceder.click();
        }
        return;
    }

    // Abrir el formulario flotante (modal) y poner valores por defecto
    const modal = document.getElementById('modal-fichaje');
    const form = document.getElementById('form-nuevo-fichaje');
    if (!modal || !form) {
        console.error('No se encontró el modal de fichaje');
        return;
    }

    form.reset();
    const inputCompeticion = document.getElementById('fichaje-competicion');
    const selectTipo = document.getElementById('fichaje-tipo');
    if (inputCompeticion) inputCompeticion.value = 'LALIGA';
    if (selectTipo) selectTipo.value = 'Traspaso';

    modal.style.display = 'flex';
}

function configurarFiltros() {
    // Obtener referencias a los inputs de filtro
    const filtroFechaDesde = document.getElementById('filtro-fecha-desde');
    const filtroFechaHasta = document.getElementById('filtro-fecha-hasta');
    const filtroNacionalidad = document.getElementById('filtro-nacionalidad');
    const filtroJugador = document.getElementById('filtro-jugador');
    const filtroDestino = document.getElementById('filtro-destino');
    const filtroProcedencia = document.getElementById('filtro-procedencia');
    const filtroTipo = document.getElementById('filtro-tipo');
    const btnLimpiar = document.getElementById('btn-limpiar-filtros');
    
    if (!filtroFechaDesde || !filtroFechaHasta || !filtroNacionalidad || !filtroJugador || 
        !filtroDestino || !filtroProcedencia || !filtroTipo || !btnLimpiar) {
        console.warn('No se encontraron todos los elementos de filtro, reintentando...');
        setTimeout(configurarFiltros, 100);
        return;
    }
    
    // Agregar event listeners para filtros en tiempo real
    filtroFechaDesde.addEventListener('input', () => {
        const valor = filtroFechaDesde.value.trim();
        filtros.fechaDesde = valor;
        paginaActual = 1;
        cargarFichajes();
    });
    
    filtroFechaHasta.addEventListener('input', () => {
        const valor = filtroFechaHasta.value.trim();
        filtros.fechaHasta = valor;
        paginaActual = 1;
        cargarFichajes();
    });
    
    filtroNacionalidad.addEventListener('input', () => {
        filtros.nacionalidad = filtroNacionalidad.value.trim().toLowerCase();
        paginaActual = 1;
        cargarFichajes();
    });
    
    filtroJugador.addEventListener('input', () => {
        filtros.jugador = filtroJugador.value.trim().toLowerCase();
        paginaActual = 1;
        cargarFichajes();
    });
    
    filtroDestino.addEventListener('input', () => {
        filtros.destino = filtroDestino.value.trim().toLowerCase();
        paginaActual = 1;
        cargarFichajes();
    });
    
    filtroProcedencia.addEventListener('input', () => {
        filtros.procedencia = filtroProcedencia.value.trim().toLowerCase();
        paginaActual = 1;
        cargarFichajes();
    });
    
    filtroTipo.addEventListener('change', () => {
        filtros.tipo = filtroTipo.value;
        // Actualizar estilo del select según si tiene valor o no
        if (filtroTipo.value === '') {
            filtroTipo.style.color = '#999';
        } else {
            filtroTipo.style.color = '#333';
        }
        paginaActual = 1;
        cargarFichajes();
    });
    
    // Inicializar color del select según su valor inicial
    if (filtroTipo.value === '') {
        filtroTipo.style.color = '#999';
    }
    
    // Botón limpiar filtros
    btnLimpiar.addEventListener('click', limpiarFiltros);
}

function limpiarFiltros() {
    filtros = {
        fechaDesde: '',
        fechaHasta: '',
        nacionalidad: '',
        jugador: '',
        destino: '',
        procedencia: '',
        tipo: ''
    };
    
    // Limpiar los inputs
    const filtroFechaDesde = document.getElementById('filtro-fecha-desde');
    const filtroFechaHasta = document.getElementById('filtro-fecha-hasta');
    const filtroNacionalidad = document.getElementById('filtro-nacionalidad');
    const filtroJugador = document.getElementById('filtro-jugador');
    const filtroDestino = document.getElementById('filtro-destino');
    const filtroProcedencia = document.getElementById('filtro-procedencia');
    const filtroTipo = document.getElementById('filtro-tipo');
    
    if (filtroFechaDesde) filtroFechaDesde.value = '';
    if (filtroFechaHasta) filtroFechaHasta.value = '';
    if (filtroNacionalidad) filtroNacionalidad.value = '';
    if (filtroJugador) filtroJugador.value = '';
    if (filtroDestino) filtroDestino.value = '';
    if (filtroProcedencia) filtroProcedencia.value = '';
    if (filtroTipo) {
        filtroTipo.value = '';
        filtroTipo.style.color = '#999'; // Resetear color a placeholder
    }
    
    paginaActual = 1;
    cargarFichajes();
}

function aplicarFiltros() {
    return fichajes.filter(fichaje => {
        // Filtro por fecha desde - busca coincidencias mientras se escribe
        if (filtros.fechaDesde && filtros.fechaDesde.trim()) {
            const fechaDesdeInput = filtros.fechaDesde.trim();
            const fechaFichajeStr = fichaje.fecha;
            
            // Si la fecha ingresada está completa y es válida, hacer comparación numérica
            const fechaDesde = convertirFechaFormato(fechaDesdeInput);
            if (fechaDesde) {
                const fechaFichaje = convertirFechaFormato(fichaje.fecha);
                if (!fechaFichaje || fechaFichaje < fechaDesde) {
                    return false;
                }
            } else {
                // Si la fecha está incompleta, buscar por coincidencia de texto
                // Buscar si la fecha del fichaje comienza con lo que se está escribiendo
                if (!fechaFichajeStr.toLowerCase().startsWith(fechaDesdeInput.toLowerCase())) {
                    return false;
                }
            }
        }
        
        // Filtro por fecha hasta - busca coincidencias mientras se escribe
        if (filtros.fechaHasta && filtros.fechaHasta.trim()) {
            const fechaHastaInput = filtros.fechaHasta.trim();
            const fechaFichajeStr = fichaje.fecha;
            
            // Si la fecha ingresada está completa y es válida, hacer comparación numérica
            const fechaHasta = convertirFechaFormato(fechaHastaInput);
            if (fechaHasta) {
                const fechaFichaje = convertirFechaFormato(fichaje.fecha);
                if (!fechaFichaje || fechaFichaje > fechaHasta) {
                    return false;
                }
            } else {
                // Si la fecha está incompleta, buscar por coincidencia de texto
                // Buscar si la fecha del fichaje comienza con lo que se está escribiendo
                if (!fechaFichajeStr.toLowerCase().startsWith(fechaHastaInput.toLowerCase())) {
                    return false;
                }
            }
        }
        
        // Filtro por nacionalidad - busca en español e inglés
        if (filtros.nacionalidad) {
            const busqueda = filtros.nacionalidad.toLowerCase().trim();
            const paisFichajeIng = fichaje.pais.toLowerCase();
            
            // Buscar coincidencia directa en inglés (como está almacenado en los datos)
            let coincide = paisFichajeIng.includes(busqueda);
            
            // Si no hay coincidencia en inglés, buscar en español
            if (!coincide) {
                // Convertir el país del fichaje a español y buscar
                const paisFichajeEsp = convertirPaisIngAEsp(fichaje.pais);
                if (paisFichajeEsp) {
                    coincide = paisFichajeEsp.toLowerCase().includes(busqueda);
                }
            }
            
            // También buscar si la búsqueda coincide con algún país conocido
            if (!coincide) {
                const paisEncontrado = buscarPaisEnAmbosIdiomas(filtros.nacionalidad);
                if (paisEncontrado) {
                    coincide = fichaje.pais.toLowerCase() === paisEncontrado.toLowerCase();
                }
            }
            
            if (!coincide) {
                return false;
            }
        }
        
        // Filtro por jugador
        if (filtros.jugador) {
            const jugadorFichaje = fichaje.jugador.toLowerCase();
            if (!jugadorFichaje.includes(filtros.jugador)) {
                return false;
            }
        }
        
        // Filtro por destino
        if (filtros.destino) {
            const destinoFichaje = fichaje.destino.toLowerCase();
            if (!destinoFichaje.includes(filtros.destino)) {
                return false;
            }
        }
        
        // Filtro por procedencia
        if (filtros.procedencia) {
            const procedenciaFichaje = fichaje.procedencia.toLowerCase();
            if (!procedenciaFichaje.includes(filtros.procedencia)) {
                return false;
            }
        }
        
        // Filtro por tipo
        if (filtros.tipo) {
            if (fichaje.tipo !== filtros.tipo) {
                return false;
            }
        }
        
        return true;
    });
}

function convertirFechaFormato(fechaString) {
    // Convertir formato DD/MM/YYYY a YYYY-MM-DD para comparación
    // También maneja YYYY-MM-DD directamente
    if (!fechaString || typeof fechaString !== 'string') return null;
    
    const fecha = fechaString.trim();
    if (!fecha) return null;
    
    // Si ya está en formato YYYY-MM-DD, devolverlo directamente
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fecha;
    }
    
    // Si está en formato DD/MM/YYYY, convertirlo
    const partes = fecha.split('/');
    if (partes.length === 3) {
        const dia = partes[0].trim().padStart(2, '0');
        const mes = partes[1].trim().padStart(2, '0');
        const año = partes[2].trim();
        
        // Validar que el año tenga 4 dígitos y los valores sean numéricos
        if (año.length === 4 && !isNaN(dia) && !isNaN(mes) && !isNaN(año)) {
            return `${año}-${mes}-${dia}`;
        }
    }
    
    return null;
}

function cargarFichajes() {
    const tbody = document.getElementById('fichajes-table-body');
    const paginacionContainer = document.getElementById('fichajes-paginacion');
    
    if (!tbody || !paginacionContainer) {
        console.warn('No se encontraron elementos necesarios, reintentando...');
        setTimeout(cargarFichajes, 100);
        return;
    }

    // Aplicar filtros
    const fichajesFiltrados = aplicarFiltros();

    if (fichajesFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-row">
                <td colspan="7">
                    <p>No se encontraron fichajes con los filtros aplicados.</p>
                </td>
            </tr>
        `;
        paginacionContainer.innerHTML = '';
        return;
    }

    // Calcular paginación
    const totalPaginas = Math.ceil(fichajesFiltrados.length / fichajesPorPagina);
    const inicio = (paginaActual - 1) * fichajesPorPagina;
    const fin = inicio + fichajesPorPagina;
    const fichajesPagina = fichajesFiltrados.slice(inicio, fin);

    // Renderizar fichajes de la página actual
    let html = '';
    fichajesPagina.forEach(fichaje => {
        const rutaLogoDestino = obtenerRutaLogoEquipo(fichaje.destino);
        const rutaLogoProcedencia = obtenerRutaLogoEquipo(fichaje.procedencia);
        const abreviaturaPais = obtenerAbreviaturaPais(fichaje.pais);

        // Generar HTML para el logo de destino
        const logoDestinoHTML = rutaLogoDestino 
            ? `<img src="${rutaLogoDestino}" alt="${fichaje.destino}" class="logo-equipo" 
                     onerror="this.style.display='none'">`
            : '';

        // Generar HTML para el logo de procedencia
        const logoProcedenciaHTML = rutaLogoProcedencia 
            ? `<img src="${rutaLogoProcedencia}" alt="${fichaje.procedencia}" class="logo-equipo" 
                     onerror="this.style.display='none'">`
            : '';

        html += `
            <tr>
                <td>${fichaje.fecha}</td>
                <td>
                    <div class="fichaje-competicion">
                        <img src="images/Laliga.jpg" alt="${fichaje.competicion}" class="logo-competicion" 
                             onerror="this.style.display='none'">
                    </div>
                </td>
                <td class="fichaje-pais">${abreviaturaPais}</td>
                <td class="fichaje-jugador">${fichaje.jugador}</td>
                <td>
                    <div class="fichaje-equipo">
                        ${logoDestinoHTML}
                        <span>${fichaje.destino}</span>
                    </div>
                </td>
                <td>
                    <div class="fichaje-equipo">
                        ${logoProcedenciaHTML}
                        <span>${fichaje.procedencia}</span>
                    </div>
                </td>
                <td class="fichaje-tipo">${fichaje.tipo}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;

    // Renderizar controles de paginación
    renderizarPaginacion(paginacionContainer, totalPaginas);
}

function renderizarPaginacion(container, totalPaginas) {
    if (totalPaginas <= 1) {
        container.innerHTML = '';
        return;
    }

    let html = '<div class="paginacion-controls">';
    
    // Botón Anterior
    html += `
        <button class="btn-paginacion ${paginaActual === 1 ? 'disabled' : ''}" 
                ${paginaActual === 1 ? 'disabled' : ''} 
                onclick="window.cambiarPagina(${paginaActual - 1})">
            Anterior
        </button>
    `;

    // Números de página
    html += '<div class="paginacion-numeros">';
    
    // Mostrar páginas cercanas a la actual
    const paginasAMostrar = [];
    const maxPaginasVisibles = 5;
    
    let inicioPaginas = Math.max(1, paginaActual - Math.floor(maxPaginasVisibles / 2));
    let finPaginas = Math.min(totalPaginas, inicioPaginas + maxPaginasVisibles - 1);
    
    // Ajustar si estamos cerca del final
    if (finPaginas - inicioPaginas < maxPaginasVisibles - 1) {
        inicioPaginas = Math.max(1, finPaginas - maxPaginasVisibles + 1);
    }
    
    // Primera página si no está visible
    if (inicioPaginas > 1) {
        html += `<button class="btn-paginacion-numero" onclick="window.cambiarPagina(1)">1</button>`;
        if (inicioPaginas > 2) {
            html += `<span class="paginacion-ellipsis">...</span>`;
        }
    }
    
    // Páginas visibles
    for (let i = inicioPaginas; i <= finPaginas; i++) {
        html += `
            <button class="btn-paginacion-numero ${i === paginaActual ? 'active' : ''}" 
                    onclick="window.cambiarPagina(${i})">
                ${i}
            </button>
        `;
    }
    
    // Última página si no está visible
    if (finPaginas < totalPaginas) {
        if (finPaginas < totalPaginas - 1) {
            html += `<span class="paginacion-ellipsis">...</span>`;
        }
        html += `<button class="btn-paginacion-numero" onclick="window.cambiarPagina(${totalPaginas})">${totalPaginas}</button>`;
    }
    
    html += '</div>';

    // Botón Siguiente
    html += `
        <button class="btn-paginacion ${paginaActual === totalPaginas ? 'disabled' : ''}" 
                ${paginaActual === totalPaginas ? 'disabled' : ''} 
                onclick="window.cambiarPagina(${paginaActual + 1})">
            Siguiente
        </button>
    `;

    // Información de página
    const fichajesFiltrados = aplicarFiltros();
    const inicio = (paginaActual - 1) * fichajesPorPagina + 1;
    const fin = Math.min(paginaActual * fichajesPorPagina, fichajesFiltrados.length);
    html += `<div class="paginacion-info">Mostrando ${inicio}-${fin} de ${fichajesFiltrados.length} fichajes</div>`;

    html += '</div>';
    container.innerHTML = html;
}

function cambiarPagina(nuevaPagina) {
    const fichajesFiltrados = aplicarFiltros();
    const totalPaginas = Math.ceil(fichajesFiltrados.length / fichajesPorPagina);
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
        paginaActual = nuevaPagina;
        cargarFichajes();
        // Scroll al inicio de la tabla
        const tabla = document.querySelector('.fichajes-table-container');
        if (tabla) {
            tabla.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Hacer la función accesible globalmente
window.cambiarPagina = cambiarPagina;

export default FichajesPage;
export { init };

