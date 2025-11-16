// Página de Calendario

import router from '../router.js';

function CalendarioPage() {
    return `
        <section id="calendario">
            <div id="calendario-content">
                
            </div>
        </section>
    `;
}

function init() {
    console.log('Página de calendario cargada');
    setTimeout(() => {
        cargarCalendario();
    }, 100);
}

// Límites del calendario: agosto 2025 a mayo 2026
const MES_INICIO = 7; // Agosto (0-indexed)
const AÑO_INICIO = 2025;
const MES_FIN = 4; // Mayo (0-indexed)
const AÑO_FIN = 2026;

function cargarCalendario() {
    const content = document.getElementById('calendario-content');
    if (!content) {
        console.warn('No se encontró calendario-content, reintentando...');
        setTimeout(cargarCalendario, 100);
        return;
    }
    
    try {
        // Fecha actual
        let fechaActual = new Date();
        let mesActual = fechaActual.getMonth();
        let añoActual = fechaActual.getFullYear();
        
        // Validar y ajustar al rango permitido
        if (añoActual < AÑO_INICIO || (añoActual === AÑO_INICIO && mesActual < MES_INICIO)) {
            // Si está antes del rango, mostrar el mes de inicio
            mesActual = MES_INICIO;
            añoActual = AÑO_INICIO;
        } else if (añoActual > AÑO_FIN || (añoActual === AÑO_FIN && mesActual > MES_FIN)) {
            // Si está después del rango, mostrar el mes de fin
            mesActual = MES_FIN;
            añoActual = AÑO_FIN;
        }
        
        // Renderizar calendario
        renderizarCalendario(mesActual, añoActual, content);
        console.log('Calendario renderizado correctamente');
    } catch (error) {
        console.error('Error al cargar el calendario:', error);
        if (content) {
            content.innerHTML = '<p>Error al cargar el calendario. Por favor, recarga la página.</p>';
        }
    }
}

function renderizarCalendario(mes, año, container) {
    if (!container) {
        console.error('Container no válido para renderizar calendario');
        return;
    }
    
    // Validar mes y año dentro del rango permitido
    if (mes < 0 || mes > 11) {
        console.error('Mes inválido:', mes);
        return;
    }
    
    // Validar que esté dentro del rango permitido (agosto 2025 - mayo 2026)
    if (año < AÑO_INICIO || (año === AÑO_INICIO && mes < MES_INICIO)) {
        mes = MES_INICIO;
        año = AÑO_INICIO;
    } else if (año > AÑO_FIN || (año === AÑO_FIN && mes > MES_FIN)) {
        mes = MES_FIN;
        año = AÑO_FIN;
    }
    
    // Verificar si se puede navegar hacia atrás o adelante
    const puedeAnterior = !(año === AÑO_INICIO && mes === MES_INICIO);
    const puedeSiguiente = !(año === AÑO_FIN && mes === MES_FIN);
    
    // Nombres de los meses en español
    const nombresMeses = [
        'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
        'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
    ];
    
    // Nombres de los días en español
    const nombresDias = ['LUN.', 'MAR.', 'MIÉ.', 'JUE.', 'VIE.', 'SÁB.', 'DOM.'];
    
    // Obtener el primer día del mes y cuántos días tiene
    const primerDia = new Date(año, mes, 1);
    const ultimoDia = new Date(año, mes + 1, 0);
    const diasEnMes = ultimoDia.getDate();
    const diaInicioSemana = (primerDia.getDay() + 6) % 7; // Ajustar para que lunes sea 0
    
    // Obtener días del mes anterior para completar la primera semana
    const mesAnterior = new Date(año, mes, 0);
    const diasMesAnterior = mesAnterior.getDate();
    
    // Generar HTML del calendario
    let html = `
        <div class="calendario-container">
            <div class="calendario-header">
                <button class="calendario-nav-btn ${!puedeAnterior ? 'calendario-nav-btn-disabled' : ''}" 
                        onclick="${puedeAnterior ? 'window.cambiarMes(-1)' : ''}"
                        ${!puedeAnterior ? 'disabled' : ''}>
                    &lt;
                </button>
                <h2 class="calendario-titulo">${nombresMeses[mes]} ${año}</h2>
                <button class="calendario-nav-btn ${!puedeSiguiente ? 'calendario-nav-btn-disabled' : ''}" 
                        onclick="${puedeSiguiente ? 'window.cambiarMes(1)' : ''}"
                        ${!puedeSiguiente ? 'disabled' : ''}>
                    &gt;
                </button>
            </div>
            
            <div class="calendario-dias-semana">
                ${nombresDias.map(dia => `<div class="dia-semana">${dia}</div>`).join('')}
            </div>
            
            <div class="calendario-grid">
    `;
    
    // Días del mes anterior (para completar la primera semana)
    for (let i = diaInicioSemana - 1; i >= 0; i--) {
        const dia = diasMesAnterior - i;
        html += `<div class="calendario-dia dia-otro-mes">${dia}</div>`;
    }
    
    // Días del mes actual
    for (let dia = 1; dia <= diasEnMes; dia++) {
        const fecha = new Date(año, mes, dia);
        const diaSemana = fecha.getDay();
        const esHoy = fecha.toDateString() === new Date().toDateString();
        
        // Obtener eventos para este día
        const eventos = obtenerEventosDia(año, mes, dia);
        
        html += `
            <div class="calendario-dia ${esHoy ? 'dia-hoy' : ''}">
                <div class="dia-numero">${dia}</div>
                <div class="dia-eventos">
                    ${eventos.map(evento => renderizarEvento(evento)).join('')}
                </div>
            </div>
        `;
    }
    
    // Calcular días restantes para completar la última semana
    const totalCeldas = diaInicioSemana + diasEnMes;
    const celdasRestantes = 7 - (totalCeldas % 7);
    if (celdasRestantes < 7) {
        for (let dia = 1; dia <= celdasRestantes; dia++) {
            html += `<div class="calendario-dia dia-otro-mes">${dia}</div>`;
        }
    }
    
    html += `
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Guardar mes y año actuales para la navegación
    window.mesActual = mes;
    window.añoActual = año;
}

function obtenerEventosDia(año, mes, dia) {
    const eventos = [];
    const fechaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    
    // Función auxiliar para agregar eventos en un rango de fechas
    const agregarEventoEnRango = (inicio, fin, jornada, competicion, tipo) => {
        const [inicioAño, inicioMes, inicioDia] = inicio.split('-').map(Number);
        const [finAño, finMes, finDia] = fin.split('-').map(Number);
        const fechaActual = new Date(año, mes, dia);
        const fechaInicio = new Date(inicioAño, inicioMes - 1, inicioDia);
        const fechaFin = new Date(finAño, finMes - 1, finDia);
        
        if (fechaActual >= fechaInicio && fechaActual <= fechaFin) {
            eventos.push({ jornada, competicion, tipo });
        }
    };
    
    // Función auxiliar para agregar evento en una fecha específica
    const agregarEventoEnFecha = (fecha, jornada, competicion, tipo) => {
        if (fechaStr === fecha) {
            eventos.push({ jornada, competicion, tipo });
        }
    };
    
    // Jornadas de La Liga 2025
    // Jornada 1: 15-19 de agosto
    agregarEventoEnRango('2025-08-15', '2025-08-19', 'J1', 'LALIGA', 'laliga');
    
    // Jornada 2: 22-25 de agosto
    agregarEventoEnRango('2025-08-22', '2025-08-25', 'J2', 'LALIGA', 'laliga');
    
    // Jornada 6: 27 de agosto
    agregarEventoEnFecha('2025-08-27', 'J6', 'LALIGA', 'laliga');
    
    // Jornada 3: 29-31 de agosto
    agregarEventoEnRango('2025-08-29', '2025-08-31', 'J3', 'LALIGA', 'laliga');
    
    // Jornada 4: 12-15 de septiembre
    agregarEventoEnRango('2025-09-12', '2025-09-15', 'J4', 'LALIGA', 'laliga');
    
    // Jornada 5: 19-21 de septiembre
    agregarEventoEnRango('2025-09-19', '2025-09-21', 'J5', 'LALIGA', 'laliga');
    
    // Jornada 6: 23-28 de septiembre
    agregarEventoEnRango('2025-09-23', '2025-09-28', 'J6', 'LALIGA', 'laliga');
    
    // Jornada 7: 30 de septiembre
    agregarEventoEnFecha('2025-09-30', 'J7', 'LALIGA', 'laliga');
    
    // Jornada 8: 3-6 de octubre
    agregarEventoEnRango('2025-10-03', '2025-10-06', 'J8', 'LALIGA', 'laliga');
    
    // Jornada 9: 17-20 de octubre
    agregarEventoEnRango('2025-10-17', '2025-10-20', 'J9', 'LALIGA', 'laliga');
    
    // Jornada 10: 24-27 de octubre
    agregarEventoEnRango('2025-10-24', '2025-10-27', 'J10', 'LALIGA', 'laliga');
    
    // Jornada 11: 31 de octubre y 1-3 de noviembre
    agregarEventoEnFecha('2025-10-31', 'J11', 'LALIGA', 'laliga');
    agregarEventoEnRango('2025-11-01', '2025-11-03', 'J11', 'LALIGA', 'laliga');
    
    // Jornada 12: 7-9 de noviembre
    agregarEventoEnRango('2025-11-07', '2025-11-09', 'J12', 'LALIGA', 'laliga');
    
    // Jornada 13: 21-24 de noviembre
    agregarEventoEnRango('2025-11-21', '2025-11-24', 'J13', 'LALIGA', 'laliga');
    
    // Jornada 14: 1-3 de diciembre
    agregarEventoEnRango('2025-12-01', '2025-12-03', 'J14', 'LALIGA', 'laliga');
    
    // Jornada 15: 6-8 de diciembre
    agregarEventoEnRango('2025-12-06', '2025-12-08', 'J15', 'LALIGA', 'laliga');
    
    // Jornada 16: 12-15 de diciembre
    agregarEventoEnRango('2025-12-12', '2025-12-15', 'J16', 'LALIGA', 'laliga');
    
    // Jornada 17: 21 de diciembre
    agregarEventoEnFecha('2025-12-21', 'J17', 'LALIGA', 'laliga');
    
    // Jornada 18: 4 de enero
    agregarEventoEnFecha('2026-01-04', 'J18', 'LALIGA', 'laliga');
    
    // Jornada 19: 11 de enero
    agregarEventoEnFecha('2026-01-11', 'J19', 'LALIGA', 'laliga');
    
    // Jornada 20: 18 de enero
    agregarEventoEnFecha('2026-01-18', 'J20', 'LALIGA', 'laliga');
    
    // Jornada 21: 25 de enero
    agregarEventoEnFecha('2026-01-25', 'J21', 'LALIGA', 'laliga');
    
    // Jornada 22: 1 de febrero
    agregarEventoEnFecha('2026-02-01', 'J22', 'LALIGA', 'laliga');
    
    // Jornada 23: 8 de febrero
    agregarEventoEnFecha('2026-02-08', 'J23', 'LALIGA', 'laliga');
    
    // Jornada 24: 15 de febrero
    agregarEventoEnFecha('2026-02-15', 'J24', 'LALIGA', 'laliga');
    
    // Jornada 25: 22 de febrero
    agregarEventoEnFecha('2026-02-22', 'J25', 'LALIGA', 'laliga');
    
    // Jornada 26: 1 de marzo
    agregarEventoEnFecha('2026-03-01', 'J26', 'LALIGA', 'laliga');
    
    // Jornada 27: 8 de marzo
    agregarEventoEnFecha('2026-03-08', 'J27', 'LALIGA', 'laliga');
    
    // Jornada 28: 15 de marzo
    agregarEventoEnFecha('2026-03-15', 'J28', 'LALIGA', 'laliga');
    
    // Jornada 29: 22 de marzo
    agregarEventoEnFecha('2026-03-22', 'J29', 'LALIGA', 'laliga');
    
    // Jornada 30: 5 de abril
    agregarEventoEnFecha('2026-04-05', 'J30', 'LALIGA', 'laliga');
    
    // Jornada 31: 12 de marzo (nota: cronológicamente antes que J30)
    agregarEventoEnFecha('2026-03-12', 'J31', 'LALIGA', 'laliga');
    
    // Jornada 32: 19 de marzo (nota: cronológicamente antes que J30)
    agregarEventoEnFecha('2026-03-19', 'J32', 'LALIGA', 'laliga');
    
    // Jornada 33: 22 de marzo
    agregarEventoEnFecha('2026-03-22', 'J33', 'LALIGA', 'laliga');
    
    // Jornada 34: 3 de mayo
    agregarEventoEnFecha('2026-05-03', 'J34', 'LALIGA', 'laliga');
    
    // Jornada 35: 10 de mayo
    agregarEventoEnFecha('2026-05-10', 'J35', 'LALIGA', 'laliga');
    
    // Jornada 36: 13 de mayo
    agregarEventoEnFecha('2026-05-13', 'J36', 'LALIGA', 'laliga');
    
    // Jornada 37: 17 de mayo
    agregarEventoEnFecha('2026-05-17', 'J37', 'LALIGA', 'laliga');
    
    // Jornada 38: 24 de mayo
    agregarEventoEnFecha('2026-05-24', 'J38', 'LALIGA', 'laliga');
    
    // Copa del Rey
    // Jornada 1: 27 de septiembre
    agregarEventoEnFecha('2025-09-27', 'J1', 'COPA DEL REY', 'copa-rey');
    
    // Jornada 2: 4 de octubre
    agregarEventoEnFecha('2025-10-04', 'J2', 'COPA DEL REY', 'copa-rey');
    
    // Jornada 3: 28-30 de octubre
    agregarEventoEnRango('2025-10-28', '2025-10-30', 'J3', 'COPA DEL REY', 'copa-rey');
    
    // Jornada 4: 2-4 de diciembre
    agregarEventoEnRango('2025-12-02', '2025-12-04', 'J4', 'COPA DEL REY', 'copa-rey');
    
    // Supercopa de España
    // Semifinales: 7 y 8 de enero
    agregarEventoEnFecha('2026-01-07', 'Semifinal', 'SUPERCOPA DE ESPAÑA', 'supercopa');
    agregarEventoEnFecha('2026-01-08', 'Semifinal', 'SUPERCOPA DE ESPAÑA', 'supercopa');
    
    // Final: 11 de enero
    agregarEventoEnFecha('2026-01-11', 'Final', 'SUPERCOPA DE ESPAÑA', 'supercopa');
    
    return eventos;
}

function renderizarEvento(evento) {
    const clases = `evento evento-${evento.tipo}`;
    const texto = evento.competicion 
        ? `${evento.jornada} ${evento.competicion}` 
        : evento.jornada;
    
    return `<div class="${clases}">${texto}</div>`;
}

function cambiarMes(direccion) {
    try {
        let mes = window.mesActual;
        let año = window.añoActual;
        
        // Si no están definidos, usar el mes de inicio
        if (mes === undefined || año === undefined) {
            mes = MES_INICIO;
            año = AÑO_INICIO;
        }
        
        mes += direccion;
        
        // Ajustar mes y año
        if (mes < 0) {
            mes = 11;
            año--;
        } else if (mes > 11) {
            mes = 0;
            año++;
        }
        
        // Validar que no se salga del rango permitido
        if (año < AÑO_INICIO || (año === AÑO_INICIO && mes < MES_INICIO)) {
            // No permitir ir antes del rango
            return;
        }
        
        if (año > AÑO_FIN || (año === AÑO_FIN && mes > MES_FIN)) {
            // No permitir ir después del rango
            return;
        }
        
        const content = document.getElementById('calendario-content');
        if (content) {
            renderizarCalendario(mes, año, content);
        } else {
            console.error('No se encontró el elemento calendario-content');
        }
    } catch (error) {
        console.error('Error al cambiar mes:', error);
    }
}

// Hacer funciones accesibles globalmente
window.cambiarMes = cambiarMes;

export default CalendarioPage;
export { init };
