// Página de Clasificación

function ClasificacionPage() {
    return `
        <section id="clasificacion">
            <h1>Clasificación</h1>
            <p>Aquí se mostrará la tabla de clasificación de la liga.</p>
            <div id="clasificacion-content">
                <!-- El contenido de clasificación se cargará aquí -->
            </div>
        </section>
    `;
}

function init() {
    console.log('Página de clasificación cargada');
    // Aquí puedes agregar la lógica para cargar la clasificación
    cargarClasificacion();
}

function cargarClasificacion() {
    // Función para cargar los datos de clasificación
    const content = document.getElementById('clasificacion-content');
    if (content) {
        // Aquí irá la lógica para cargar y mostrar la clasificación
        content.innerHTML = '<p>Cargando clasificación...</p>';
    }
}

export default ClasificacionPage;
export { init };

