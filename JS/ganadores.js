const lista = document.getElementById("listaGanadores");
const ganadores = JSON.parse(localStorage.getItem("ganadores")) || [];

if (ganadores.length === 0) {
  lista.innerHTML = "<li>No hay ganadores registrados.</li>";
} else {
  ganadores.forEach((g, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="ganador-contenedor">
        <div class="nombre-codigo">${i + 1}. ${g.nombre}</div>
        ${g.premio && g.premio !== "Sin premio" ? `<div class="premio">${g.premio}</div>` : ""}
      </div>
    `;
    lista.appendChild(li);
  });
}

// Botón guardar descarga con el último ganador
function irADescarga() {
  const ultimoGanador = ganadores[ganadores.length - 1];
  if (!ultimoGanador) {
    alert("No hay ganadores en la lista.");
    return;
  }

  const partesNombre = ultimoGanador.nombre.trim().split(" ");
  const codigo = partesNombre[0] || "Código no disponible";
  const nombre = partesNombre.slice(1).join(" ") || "Nombre no disponible";

  const datos = {
    codigo: codigo,
    nombre: nombre
  };

  localStorage.setItem("ganador", JSON.stringify(datos));
  localStorage.setItem("ultimoGanador", JSON.stringify(ultimoGanador));
  window.location.href = "descargar.html";
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
