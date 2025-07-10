const lista = document.getElementById("listaGanadores");
const ganadores = JSON.parse(localStorage.getItem("ganadores")) || [];

// Obtener el ID de la sesión actual (puedes usar timestamp o un ID único)
const sesionActual = localStorage.getItem("sesionActual") || "sesion_" + Date.now();

if (ganadores.length === 0) {
  lista.innerHTML = "<li>No hay ganadores registrados.</li>";
} else {
  // Filtrar solo los ganadores de la sesión actual
  const ganadoresSesionActual = ganadores.filter(g => g.sesion === sesionActual);

  if (ganadoresSesionActual.length === 0) {
    lista.innerHTML = "<li>No hay ganadores en esta sesión.</li>";
  } else {
    ganadoresSesionActual.forEach((g, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div class="ganador-contenedor clickable-ganador" data-ganador-index="${i}">
          <div class="nombre-codigo">${g.nombre}</div>
          ${g.premio && g.premio !== "Sin premio" ? `<div class="premio">${g.premio}</div>` : ""}
        </div>
      `;
      lista.appendChild(li);
    });

    // Agregar event listeners para hacer clickeable cada contenedor
    document.querySelectorAll('.clickable-ganador').forEach(contenedor => {
      contenedor.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-ganador-index'));
        const ganadorSeleccionado = ganadoresSesionActual[index];
        irADescargaConGanador(ganadorSeleccionado);
      });
    });
  }
}

// Función para ir a descarga con un ganador específico
function irADescargaConGanador(ganadorSeleccionado) {
  if (!ganadorSeleccionado) {
    alert("Error: No se pudo encontrar el ganador seleccionado.");
    return;
  }

  const datos = {
    codigo: ganadorSeleccionado.codigo || " ",
    nombre: ganadorSeleccionado.nombre || " ",
  };


  localStorage.setItem("ganador", JSON.stringify(datos));
  localStorage.setItem("ultimoGanador", JSON.stringify(ganadorSeleccionado));
  window.location.href = "descargar.html";
}

// Función original para el botón guardar (mantener por compatibilidad)
function irADescarga() {
  const sesionActual = localStorage.getItem("sesionActual") || "sesion_" + Date.now();
  const ganadoresSesionActual = ganadores.filter(g => g.sesion === sesionActual);

  const ultimoGanador = ganadoresSesionActual[ganadoresSesionActual.length - 1];
  if (!ultimoGanador) {
    alert("No hay ganadores en esta sesión.");
    return;
  }

  irADescargaConGanador(ultimoGanador);
}

// Confeti de fondo
const confettiCanvas = document.getElementById('confetti-canvas');
const myConfetti = confetti.create(confettiCanvas, { resize: true, useWorker: true });

setInterval(() => {
  myConfetti({
    particleCount: 5,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ['#ff0000', '#0000ff', '#ffff00', '#00ff00', '#800080', '#ff69b4', '#ffa500', '#00ffff', '#ff00ff', '#ffffff']
  });
  myConfetti({
    particleCount: 5,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ['#ff0000', '#0000ff', '#ffff00', '#00ff00', '#800080', '#ff69b4', '#ffa500', '#00ffff', '#ff00ff', '#ffffff']
  });
}, 250);