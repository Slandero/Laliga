// Página de Fichajes

function FichajesPage() {
    return `
        <section id="fichajes">
            <h1>Fichajes</h1>
            <p>Aquí se mostrará la información sobre los fichajes de la liga.</p>
            <div id="fichajes-content">
                <!-- El contenido de fichajes se cargará aquí -->
            </div>
        </section>
    `;
}

function init() {
    console.log('Página de fichajes cargada');
    // Aquí puedes agregar la lógica para cargar los fichajes
    cargarFichajes();
}

function cargarFichajes() {
    // Función para cargar los datos de fichajes
    const content = document.getElementById('fichajes-content');
    if (content) {
        // Aquí irá la lógica para cargar y mostrar los fichajes
        content.innerHTML = '<p>Cargando fichajes...</p>';
    }
}

export default FichajesPage;
export { init };

