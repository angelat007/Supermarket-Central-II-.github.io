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
  }
}

// Función para ir a descarga con múltiples ganadores
function irADescargaMultiple() {
  const sesionActual = localStorage.getItem("sesionActual") || "sesion_" + Date.now();
  const ganadores = JSON.parse(localStorage.getItem("ganadores")) || [];
  const ganadoresSesion = ganadores.filter(g => g.sesion === sesionActual);

  if (ganadoresSesion.length === 0) {
    alert("No hay ganadores en esta sesión.");
    return;
  }

  // Limpiar datos previos de un solo ganador
  localStorage.removeItem("ganador");
  localStorage.removeItem("ultimoGanador");

  // Guardar los ganadores múltiples
  localStorage.setItem("ganadoresMultiple", JSON.stringify(ganadoresSesion));
  
  // Redirigir a la página de descarga
  window.open("descargar.html", "_blank");
}

// Función para ir a descarga con un ganador específico (funcionalidad original)
function irADescargaIndividual(index) {
  const sesionActual = localStorage.getItem("sesionActual") || "sesion_" + Date.now();
  const ganadores = JSON.parse(localStorage.getItem("ganadores")) || [];
  const ganadoresSesion = ganadores.filter(g => g.sesion === sesionActual);

  if (ganadoresSesion[index]) {
    const ganador = ganadoresSesion[index];
    
    // Limpiar datos de múltiples ganadores
    localStorage.removeItem("ganadoresMultiple");
    
    // Guardar el ganador individual
    localStorage.setItem("ganador", JSON.stringify({
      codigo: ganador.codigo,
      nombre: ganador.nombre
    }));
    
    localStorage.setItem("ultimoGanador", JSON.stringify({
      premio: ganador.premio || "Sin premio"
    }));
    
    // Redirigir a la página de descarga
    window.open("descargar.html", "_blank");
  }
}

// Event listener para clicks en ganadores individuales
document.addEventListener('click', function(e) {
  const ganadorElement = e.target.closest('.clickable-ganador');
  if (ganadorElement) {
    const index = parseInt(ganadorElement.dataset.ganadorIndex);
    irADescargaIndividual(index);
  }
});

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