let participantes = [];
let currentIndex = 0;
const LOTE = 100;

function cargarParticipantes(inicio = 0) {
    const textarea = document.getElementById("participantes");
    const contenedor = document.getElementById("listaParticipantes");

    if (!contenedor || !textarea) return;

    if (participantes.length === 0) {
        participantes = textarea.value.trim().split("\n").filter(Boolean);
    }

    contenedor.innerHTML = ""; // Limpiar antes de agregar

    currentIndex = inicio;
    const fin = Math.min(currentIndex + LOTE, participantes.length);

    for (let i = currentIndex; i < fin; i++) {
        const p = document.createElement("div");
        p.textContent = `${i + 1}. ${participantes[i]}`;
        contenedor.appendChild(p);
    }

    if (fin < participantes.length) {
        const boton = document.createElement("button");
        boton.textContent = "Ver más";
        boton.className = "ver-mas-btn";
        boton.onclick = () => cargarParticipantes(fin);
        contenedor.appendChild(boton);
    }
}
