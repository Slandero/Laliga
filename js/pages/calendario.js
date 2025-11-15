// Página de Calendario

function CalendarioPage() {
    return `
        <section id="calendario">
            <h1>Calendario</h1>
            <p>Aquí se mostrará el calendario de partidos.</p>
            <div id="calendario-content">
                <!-- El contenido del calendario se cargará aquí -->
            </div>
        </section>
    `;
}

function init() {
    console.log('Página de calendario cargada');
    // Aquí puedes agregar la lógica para cargar el calendario
    cargarCalendario();
}

function cargarCalendario() {
    // Función para cargar los datos del calendario
    const content = document.getElementById('calendario-content');
    if (content) {
        // Aquí irá la lógica para cargar y mostrar el calendario
        content.innerHTML = '<p>Cargando calendario...</p>';
    }
}

export default CalendarioPage;
export { init };

