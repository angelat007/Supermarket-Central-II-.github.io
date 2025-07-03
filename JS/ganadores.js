const lista = document.getElementById("listaGanadores");
const ganadores = JSON.parse(localStorage.getItem("ganadores")) || [];

if (ganadores.length === 0) {
  lista.innerHTML = "<li>No hay ganadores aún.</li>";
} else {
  const ultimoGanador = ganadores[ganadores.length - 1];
  const li = document.createElement("li");
  li.textContent = ultimoGanador;
  lista.appendChild(li);
}

// Función mejorada para ir a descarga
function irADescarga() {
    const primerGanador = document.querySelector("#listaGanadores li");
    if (!primerGanador) {
        alert("No hay ganadores en la lista.");
        return;
    }

    const textoCompleto = primerGanador.innerText.trim();
    const partes = textoCompleto.split("\n").filter(p => p.trim() !== "");

    const codigo = partes[0] || " ";
    const nombre = partes.length >= 2 ? partes[1] : " ";

    const datos = { codigo, nombre };
    localStorage.setItem("ganador", JSON.stringify(datos));

    window.location.href = "descargar.html";
}

// Animación confeti de fondo 
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