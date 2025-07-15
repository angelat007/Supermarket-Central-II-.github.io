// Función para crear confeti
function createConfetti() {
    const confettiCount = 50;
    const body = document.body;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        body.appendChild(confetti);

        // Remover confeti después de la animación
        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, 5000);
    }
}

// Función para mostrar números con animación
function mostrarNumeros(numeros) {
    const resultadoDiv = document.getElementById("resultado");

    if (numeros.length === 0) {
        resultadoDiv.innerHTML = '<div class="no-results">No se encontraron resultados.</div>';
        return;
    }

    const numerosContainer = document.createElement('div');
    numerosContainer.className = 'numeros-container';

    numeros.forEach((numero, index) => {
        const card = document.createElement('div');
        card.className = 'numero-card';
        card.innerHTML = `
                    <div class="numero-index">${index + 1}</div>
                    <div class="numero-value">${numero}</div>
                `;
        numerosContainer.appendChild(card);
    });

    resultadoDiv.appendChild(numerosContainer);
}

// Función para obtener números (simulada para demo)
function obtenerNumeros() {
    // Intentar obtener de localStorage
    const numerosGuardados = localStorage.getItem("numerosSorteados");
    if (numerosGuardados) {
        return JSON.parse(numerosGuardados);
    }

    // Si no hay números guardados, generar algunos de ejemplo
    return [68, 56, 75];
}

// Inicializar cuando la página carga
document.addEventListener("DOMContentLoaded", () => {
    // Mostrar el título guardado
    const titulo = localStorage.getItem("tituloNumeros");
    if (titulo) {
        const tituloElemento = document.getElementById("tituloMostrado");
        if (tituloElemento) {
            tituloElemento.textContent = titulo;
        }
    }

    // Crear confeti al cargar la página
    createConfetti();

    // Mostrar los números sorteados después de un pequeño delay
    setTimeout(() => {
        const numeros = obtenerNumeros();
        mostrarNumeros(numeros);
    }, 500);

    // Crear más confeti después de 2 segundos
    setTimeout(createConfetti, 2000);
});
