// Página de Fichajes

// Mapeo de países a abreviaciones oficiales (ISO 3166-1 alpha-2)
// Los países están en español para facilitar la búsqueda
const mapeoPaises = {
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
        pais: 'Marruecos',
        jugador: 'AZZ-EDDINE',
        destino: 'MARSEILLE',
        procedencia: 'Girona FC',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Marruecos',
        jugador: 'A. ABQAR',
        destino: 'Deportivo Alavés',
        procedencia: 'Getafe CF',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'MARC BERNAL',
        destino: 'FC BARCELONA JUVENIL',
        procedencia: 'FC Barcelona',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'JUANMI',
        destino: 'Real Betis',
        procedencia: 'Sevilla FC',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Camerún',
        jugador: 'NEYOU',
        destino: 'CD Leganés',
        procedencia: 'Real Sociedad',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'ALEX',
        destino: 'BURGOS CF',
        procedencia: 'RCD Mallorca',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'JAVI MUÑOZ',
        destino: 'UD LAS PALMAS',
        procedencia: 'Levante UD',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'KIKO F.',
        destino: 'Villarreal CF',
        procedencia: 'Levante UD',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Portugal',
        jugador: 'CARDOSO',
        destino: 'OPORTO',
        procedencia: 'Sevilla FC',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Francia',
        jugador: 'MENDY',
        destino: 'TRABZONSPOR',
        procedencia: 'Sevilla FC',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'RAMÓN MARTÍNEZ',
        destino: 'Sevilla Atlético',
        procedencia: 'RCD Mallorca',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'JOEL ROCA',
        destino: 'GIRONA FC B',
        procedencia: 'Girona FC',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'C.SOLER',
        destino: 'PSG',
        procedencia: 'Valencia CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'JAN VIRGILI',
        destino: 'MALLORCA B',
        procedencia: 'RCD Mallorca',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Grecia',
        jugador: 'ALAN MATTURRO',
        destino: 'GENOA',
        procedencia: 'Levante UD',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'NICO GONZÁLEZ',
        destino: 'JUVENTUS',
        procedencia: 'Atlético de Madrid',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Israel',
        jugador: 'SOLOMON',
        destino: 'SPURS',
        procedencia: 'Villarreal CF',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Croacia',
        jugador: 'LIVAKOVIC',
        destino: 'FENERBAHÇE',
        procedencia: 'Girona FC',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Francia',
        jugador: 'MIKAUTADZE',
        destino: 'LYON',
        procedencia: 'Villarreal CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Reino Unido',
        jugador: 'ABU KAMARA',
        destino: 'Hull City AFC',
        procedencia: 'Getafe CF',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'VENCEDOR',
        destino: 'Athletic Club',
        procedencia: 'Levante UD',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Países Bajos',
        jugador: 'S. BECKER',
        destino: 'Real Sociedad',
        procedencia: 'CA Osasuna',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'BRYAN',
        destino: 'SPURS',
        procedencia: 'Girona FC',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Países Bajos',
        jugador: 'AMRABAT',
        destino: 'FENERBAHÇE',
        procedencia: 'Real Betis',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'BELTRÁN',
        destino: 'FIORENTINA',
        procedencia: 'Valencia CF',
        tipo: 'Cesión'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Brasil',
        jugador: 'ALEMÃO',
        destino: 'PACHUCA',
        procedencia: 'Rayo Vallecano',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Camerún',
        jugador: 'ETTA EYONG',
        destino: 'VILLARREAL B',
        procedencia: 'Levante UD',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Brasil',
        jugador: 'ANTONY',
        destino: 'MAN UTD',
        procedencia: 'Real Betis',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Ucrania',
        jugador: 'VANAT',
        destino: 'Dinamo Kiev',
        procedencia: 'Girona FC',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'República Democrática del Congo',
        jugador: 'DIANG',
        destino: 'West Brom',
        procedencia: 'Elche CF',
        tipo: 'Libre'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'ARRIAGA',
        destino: 'PARTIZAN',
        procedencia: 'Levante UD',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Argentina',
        jugador: 'LUCAS BOYÉ',
        destino: 'Granada CF',
        procedencia: 'Deportivo Alavés',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'PEDROSA',
        destino: 'Sevilla FC',
        procedencia: 'Elche CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Comoras',
        jugador: 'KOYALIPOU',
        destino: 'LENS',
        procedencia: 'RCD Mallorca',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Finlandia',
        jugador: 'BERGSTROM',
        destino: 'CHELSEA',
        procedencia: 'Sevilla FC',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'AZPILICUETA',
        destino: 'Atlético de Madrid',
        procedencia: 'Real Sociedad',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'HERRERA',
        destino: 'Girona FC',
        procedencia: 'Real Oviedo',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'JAVI LÓPEZ',
        destino: 'Real Sociedad',
        procedencia: 'Villarreal CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Portugal',
        jugador: 'CARMO',
        destino: 'NOTTINGHAM FOREST',
        procedencia: 'RCD Espanyol de Barcelona',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'DENIS SUÁREZ',
        destino: 'Minnesota United FC',
        procedencia: 'Villarreal CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Nigeria',
        jugador: 'OLUWASEYI',
        destino: 'Unione Sportiva Cremonese',
        procedencia: 'FC Barcelona',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Suiza',
        jugador: 'PICKLE',
        destino: 'NEWCASTLE',
        procedencia: 'FC Barcelona',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'Alemania',
        jugador: 'ODISSEAS',
        destino: 'PSG',
        procedencia: 'FC Barcelona',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/09/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'ARNAU TENAS',
        destino: 'FC BARCELONA B',
        procedencia: 'FC Barcelona',
        tipo: 'Libre'
    },
    {
        fecha: '30/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'MARTÍN',
        destino: 'FC Barcelona',
        procedencia: 'Real Sociedad',
        tipo: 'Traspaso'
    },
    {
        fecha: '29/08/2025',
        competicion: 'LALIGA',
        pais: 'Bélgica',
        jugador: 'RAMAZANI',
        destino: 'Valencia CF',
        procedencia: 'LEEDS',
        tipo: 'Cesión'
    },
    {
        fecha: '29/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        pais: 'España',
        jugador: 'OLASAGASTI',
        destino: 'Levante UD',
        procedencia: 'Real Sociedad',
        tipo: 'Traspaso'
    },
    {
        fecha: '29/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'IÑAKI PEÑA',
        destino: 'Elche CF',
        procedencia: 'FC Barcelona',
        tipo: 'Cesión'
    },
    {
        fecha: '28/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        pais: 'España',
        jugador: 'ALFON',
        destino: 'Sevilla FC',
        procedencia: 'Celta',
        tipo: 'Libre'
    },
    {
        fecha: '24/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'ALEX MORENO',
        destino: 'Girona FC',
        procedencia: 'A VILLA',
        tipo: 'Traspaso'
    },
    {
        fecha: '23/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'IKER',
        destino: 'Levante UD',
        procedencia: 'Real Betis',
        tipo: 'Cesión'
    },
    {
        fecha: '23/08/2025',
        competicion: 'LALIGA',
        pais: 'Países Bajos',
        jugador: 'BREKALO',
        destino: 'Real Oviedo',
        procedencia: 'FIORENTINA',
        tipo: 'Libre'
    },
    {
        fecha: '23/08/2025',
        competicion: 'LALIGA',
        pais: 'Estados Unidos',
        jugador: 'KOLEOSHO',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'BURNLEY',
        tipo: 'Cesión'
    },
    {
        fecha: '23/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        pais: 'Irlanda',
        jugador: 'E. BAILLY',
        destino: 'Real Oviedo',
        procedencia: 'Villarreal CF',
        tipo: 'Libre'
    },
    {
        fecha: '22/08/2025',
        competicion: 'LALIGA',
        pais: 'Bélgica',
        jugador: 'DENDONCKER',
        destino: 'Real Oviedo',
        procedencia: 'A VILLA',
        tipo: 'Libre'
    },
    {
        fecha: '21/08/2025',
        competicion: 'LALIGA',
        pais: 'Italia',
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
        pais: 'España',
        jugador: 'RAFA MIR',
        destino: 'Elche CF',
        procedencia: 'Sevilla FC',
        tipo: 'Cesión'
    },
    {
        fecha: '18/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'REDONDO',
        destino: 'Elche CF',
        procedencia: 'INTER MIAMI CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '16/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'JOAN GARCIA',
        destino: 'FC Barcelona',
        procedencia: 'RCD Espanyol de Barcelona',
        tipo: 'Pago cláusula'
    },
    {
        fecha: '16/08/2025',
        competicion: 'LALIGA',
        pais: 'Reino Unido',
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
        pais: 'Alemania',
        jugador: 'JEREMY TOLJAN',
        destino: 'Levante UD',
        procedencia: 'SASSUOLO',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Rumania',
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
        pais: 'España',
        jugador: 'B. IGLESIAS',
        destino: 'Celta',
        procedencia: 'Real Betis',
        tipo: 'Traspaso'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'Croacia',
        jugador: 'CALETA-CAR',
        destino: 'Real Sociedad',
        procedencia: 'LYON',
        tipo: 'Cesión'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'JAVI RUEDA',
        destino: 'Celta',
        procedencia: 'CELTA DE VIGO B',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'MANU FERNÁNDEZ',
        destino: 'Celta',
        procedencia: 'CELTA DE VIGO B',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'VÍCTOR G.',
        destino: 'Levante UD',
        procedencia: 'CD ELDENSE',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'P. CAMPOS',
        destino: 'Levante UD',
        procedencia: 'ATLÉTICO LEVANTE UD',
        tipo: 'Libre'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'FRAN PÉREZ',
        destino: 'Rayo Vallecano',
        procedencia: 'Valencia CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'MATEO JOSEPH',
        destino: 'RCD Mallorca',
        procedencia: 'LEEDS',
        tipo: 'Cesión'
    },
    {
        fecha: '15/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'MARIO MARTÍN',
        destino: 'Getafe CF',
        procedencia: 'REAL MADRID CASTILLA',
        tipo: 'Cesión'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'M. ROMÁN',
        destino: 'Celta',
        procedencia: 'CELTA DE VIGO B',
        tipo: 'Libre'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'LISO',
        destino: 'Getafe CF',
        procedencia: 'REAL ZARAGOZA',
        tipo: 'Cesión'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Francia',
        jugador: 'LÉO PETRÓT',
        destino: 'Elche CF',
        procedencia: 'SAINT-ÉTIENNE',
        tipo: 'Libre'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Francia',
        jugador: 'BRANDON',
        destino: 'Real Oviedo',
        procedencia: 'Debreceni VSC',
        tipo: 'Traspaso'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Italia',
        jugador: 'RASPADORI',
        destino: 'Atlético de Madrid',
        procedencia: 'NAPOLI',
        tipo: 'Traspaso'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Países Bajos',
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
        pais: 'España',
        jugador: 'MANU SÁNCHEZ',
        destino: 'Levante UD',
        procedencia: 'Celta',
        tipo: 'Cesión'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Bélgica',
        jugador: 'WITSEL',
        destino: 'Girona FC',
        procedencia: 'Atlético de Madrid',
        tipo: 'Libre'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Reino Unido',
        jugador: 'DOLAN',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'BLACKBURN ROVERS',
        tipo: 'Libre'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Brasil',
        jugador: 'CALEBE',
        destino: 'Deportivo Alavés',
        procedencia: 'Fortaleza Esporte Clube',
        tipo: 'Cesión'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Suiza',
        jugador: 'UGRINIC',
        destino: 'Valencia CF',
        procedencia: 'YOUNG BOYS',
        tipo: 'Traspaso'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Marruecos',
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
        pais: 'España',
        jugador: 'PAU LOPEZ',
        destino: 'Real Betis',
        procedencia: 'DEPORTIVO TOLUCA F.C.',
        tipo: 'Libre'
    },
    {
        fecha: '14/08/2025',
        competicion: 'LALIGA',
        pais: 'Brasil',
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
        pais: 'España',
        jugador: 'BRYAN',
        destino: 'Celta',
        procedencia: 'FC BAYERN',
        tipo: 'Cesión'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'GORROTXA',
        destino: 'Real Sociedad',
        procedencia: 'R. SOCIEDAD B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'KARRIKABURU',
        destino: 'Real Sociedad',
        procedencia: 'R. SOCIEDAD B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'A. ALTI',
        destino: 'Villarreal CF',
        procedencia: 'VILLARREAL B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'V. PARADA',
        destino: 'Deportivo Alavés',
        procedencia: 'DEPORTIVO ALAVÉS',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'CARREIRA',
        destino: 'Celta',
        procedencia: 'CELTA DE VIGO B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'GOTI',
        destino: 'Real Sociedad',
        procedencia: 'R. SOCIEDAD B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        pais: 'España',
        jugador: 'ÁLVARO',
        destino: 'Elche CF',
        procedencia: 'REAL MADRID CASTILLA',
        tipo: 'Traspaso'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'MARC VIDAL',
        destino: 'Celta',
        procedencia: 'CELTA DE VIGO B',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'MARIANO',
        destino: 'Deportivo Alavés',
        procedencia: 'Sevilla FC',
        tipo: 'Libre'
    },
    {
        fecha: '13/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        pais: 'España',
        jugador: 'A. FORES',
        destino: 'Real Oviedo',
        procedencia: 'VILLARREAL B',
        tipo: 'Cesión'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        pais: 'Francia',
        jugador: 'SANTAMARIA',
        destino: 'Valencia CF',
        procedencia: 'RENNES',
        tipo: 'Traspaso'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'GERMAN V.',
        destino: 'Elche CF',
        procedencia: 'VALENCIA MESTALLA',
        tipo: 'Libre'
    },
    {
        fecha: '12/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'COLLADO',
        destino: 'Real Betis',
        procedencia: 'Al Akhdoud Saudi Club',
        tipo: 'Libre'
    },
    {
        fecha: '11/08/2025',
        competicion: 'LALIGA',
        pais: 'Rumania',
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
        pais: 'España',
        jugador: 'GONZALO',
        destino: 'Real Madrid',
        procedencia: 'REAL MADRID CASTILLA',
        tipo: 'Libre'
    },
    {
        fecha: '08/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'A. FORTUÑO',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'RCD ESPANYOL B',
        tipo: 'Libre'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'ALEÑÁ',
        destino: 'Deportivo Alavés',
        procedencia: 'Getafe CF',
        tipo: 'Traspaso'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'YOUSSEF',
        destino: 'Deportivo Alavés',
        procedencia: 'REAL MADRID CASTILLA',
        tipo: 'Traspaso'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'RAÚL FERNÁNDEZ',
        destino: 'Deportivo Alavés',
        procedencia: 'CD MIRANDÉS',
        tipo: 'Libre'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'IBAÑEZ',
        destino: 'Deportivo Alavés',
        procedencia: 'CA Osasuna',
        tipo: 'Libre'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'ARESO',
        destino: 'Athletic Club',
        procedencia: 'CA Osasuna',
        tipo: 'Traspaso'
    },
    {
        fecha: '07/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        pais: 'España',
        jugador: 'C. ROMERO',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Villarreal CF',
        tipo: 'Cesión'
    },
    {
        fecha: '05/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'MARC PUBILL',
        destino: 'Atlético de Madrid',
        procedencia: 'UD ALMERÍA',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'RABA',
        destino: 'Valencia CF',
        procedencia: 'CD Leganés',
        tipo: 'Libre'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'VÍCTOR MUÑOZ',
        destino: 'CA Osasuna',
        procedencia: 'REAL MADRID CF C',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Eslovaquia',
        jugador: 'DAVID HANCKO',
        destino: 'Atlético de Madrid',
        procedencia: 'FEYENOORD',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Francia',
        jugador: 'V. ROSIER',
        destino: 'CA Osasuna',
        procedencia: 'CD Leganés',
        tipo: 'Libre'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'I. BENITO',
        destino: 'CA Osasuna',
        procedencia: 'CLUB ATLETICO OSASUNA B',
        tipo: 'Libre'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'Canadá',
        jugador: 'BUCHANAN',
        destino: 'Villarreal CF',
        procedencia: 'INTER',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'J. OTTO',
        destino: 'Deportivo Alavés',
        procedencia: 'PAOK',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'A. MOLEIRO',
        destino: 'Villarreal CF',
        procedencia: 'UD LAS PALMAS',
        tipo: 'Traspaso'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        pais: 'Francia',
        jugador: 'LEMAR',
        destino: 'Girona FC',
        procedencia: 'Atlético de Madrid',
        tipo: 'Cesión'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'H. RINCÓN',
        destino: 'Girona FC',
        procedencia: 'ATHLETIC CLUB B',
        tipo: 'Cesión'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'AGIRREZABALA',
        destino: 'Valencia CF',
        procedencia: 'Athletic Club',
        tipo: 'Cesión'
    },
    {
        fecha: '04/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'COPETE',
        destino: 'Valencia CF',
        procedencia: 'RCD Mallorca',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/08/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'PABLO TORRE',
        destino: 'RCD Mallorca',
        procedencia: 'FC BARCELONA B',
        tipo: 'Traspaso'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        pais: 'Brasil',
        jugador: 'NATAN',
        destino: 'Real Betis',
        procedencia: 'NAPOLI',
        tipo: 'Traspaso'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'NAVARRO',
        destino: 'Athletic Club',
        procedencia: 'MALLORCA B',
        tipo: 'Libre'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'Brasil',
        jugador: 'LUIZ FELIPE',
        destino: 'Rayo Vallecano',
        procedencia: 'MARSEILLE',
        tipo: 'Libre'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'GUMBAU',
        destino: 'Rayo Vallecano',
        procedencia: 'Granada CF',
        tipo: 'Cesión'
    },
    {
        fecha: '31/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'COBA',
        destino: 'Getafe CF',
        procedencia: 'GETAFE CF B',
        tipo: 'Libre'
    },
    {
        fecha: '30/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'RIQUELME',
        destino: 'Real Betis',
        procedencia: 'Atlético de Madrid',
        tipo: 'Traspaso'
    },
    {
        fecha: '30/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'Á.VALLES',
        destino: 'Real Betis',
        procedencia: 'UD LAS PALMAS',
        tipo: 'Libre'
    },
    {
        fecha: '30/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'R. TERRATS',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Villarreal CF',
        tipo: 'Cesión'
    },
    {
        fecha: '30/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'C. ROMERO',
        destino: 'Villarreal CF',
        procedencia: 'VILLARREAL B',
        tipo: 'Libre'
    },
    {
        fecha: '28/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'ASENCIO',
        destino: 'Real Madrid',
        procedencia: 'REAL MADRID CASTILLA',
        tipo: 'Libre'
    },
    {
        fecha: '24/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'C.RIVERO',
        destino: 'Valencia CF',
        procedencia: 'ALBACETE BP',
        tipo: 'Libre'
    },
    {
        fecha: '23/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        pais: 'España',
        jugador: 'A. CARRERAS',
        destino: 'Real Madrid',
        procedencia: 'Benfica',
        tipo: 'Traspaso'
    },
    {
        fecha: '22/07/2025',
        competicion: 'LALIGA',
        pais: 'Estados Unidos',
        jugador: 'JOHNNY',
        destino: 'Atlético de Madrid',
        procedencia: 'Real Betis',
        tipo: 'Traspaso'
    },
    {
        fecha: '21/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'MIGUEL RUBIO',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Granada CF',
        tipo: 'Libre'
    },
    {
        fecha: '21/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'SALINAS',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Elche CF',
        tipo: 'Libre'
    },
    {
        fecha: '21/07/2025',
        competicion: 'LALIGA',
        pais: 'Italia',
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
        pais: 'España',
        jugador: 'KIKE G.',
        destino: 'RCD Espanyol de Barcelona',
        procedencia: 'Deportivo Alavés',
        tipo: 'Libre'
    },
    {
        fecha: '17/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
        jugador: 'JUANLU',
        destino: 'Sevilla FC',
        procedencia: 'Sevilla Atlético',
        tipo: 'Libre'
    },
    {
        fecha: '10/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        pais: 'Reino Unido',
        jugador: 'ALEXANDER-ARNOLD',
        destino: 'Real Madrid',
        procedencia: 'Liverpool',
        tipo: 'Traspaso'
    },
    {
        fecha: '01/07/2025',
        competicion: 'LALIGA',
        pais: 'España',
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
        </section>
    `;
}

function init() {
    console.log('Página de fichajes cargada');
    // Cargar los fichajes después de un pequeño delay para asegurar que el DOM esté listo
    setTimeout(() => {
        configurarFiltros();
        cargarFichajes();
    }, 200);
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
        filtros.fechaDesde = filtroFechaDesde.value.trim();
        paginaActual = 1;
        cargarFichajes();
    });
    
    filtroFechaHasta.addEventListener('input', () => {
        filtros.fechaHasta = filtroFechaHasta.value.trim();
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
        // Filtro por fecha desde
        if (filtros.fechaDesde) {
            const fechaFichaje = convertirFechaFormato(fichaje.fecha);
            const fechaDesde = convertirFechaFormato(filtros.fechaDesde);
            if (!fechaFichaje || !fechaDesde || fechaFichaje < fechaDesde) {
                return false;
            }
        }
        
        // Filtro por fecha hasta
        if (filtros.fechaHasta) {
            const fechaFichaje = convertirFechaFormato(fichaje.fecha);
            const fechaHasta = convertirFechaFormato(filtros.fechaHasta);
            if (!fechaFichaje || !fechaHasta || fechaFichaje > fechaHasta) {
                return false;
            }
        }
        
        // Filtro por nacionalidad
        if (filtros.nacionalidad) {
            const paisFichaje = fichaje.pais.toLowerCase();
            if (!paisFichaje.includes(filtros.nacionalidad)) {
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
    if (!fechaString) return null;
    
    const fecha = fechaString.trim();
    
    // Si ya está en formato YYYY-MM-DD, devolverlo directamente
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fecha;
    }
    
    // Si está en formato DD/MM/YYYY, convertirlo
    const partes = fecha.split('/');
    if (partes.length === 3) {
        const dia = partes[0].padStart(2, '0');
        const mes = partes[1].padStart(2, '0');
        const año = partes[2];
        return `${año}-${mes}-${dia}`;
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

