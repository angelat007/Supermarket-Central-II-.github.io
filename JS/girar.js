let lista;
let itemHeight = 50;
let ganadorIndex = 0;
let ruletaYaGiró = false;

window.addEventListener("DOMContentLoaded", () => {
	const participantes = JSON.parse(localStorage.getItem("participantes")) || [];
	lista = document.getElementById("ruletaLista");

	if (participantes.length === 0) {
		lista.innerHTML = "<li>No hay participantes</li>";
		return;
	}

	// Crear efecto de ruleta larga
	const buffer = [...participantes, ...participantes, ...participantes];
	buffer.forEach((nombre) => {
		const li = document.createElement("li");
		li.textContent = nombre;
		lista.appendChild(li);
	});
});

function girarSorteo() {
	if (ruletaYaGiró) return;

	// Ocultar el botón Girar inmediatamente
	document.getElementById("Girar").style.display = "none";

	const totalItems = lista.children.length;
	const itemHeight = 50;
	const visibleCount = 5;
	const centerOffset = Math.floor(visibleCount / 2);

	const ganadorIndex = 50 + Math.floor(Math.random() * 10);
	const distancia = (ganadorIndex - centerOffset) * itemHeight;

	lista.style.transition = "transform 4.3s cubic-bezier(0.1, 0.1, 0.2, 1)";
	lista.style.transform = `translateY(-${distancia}px)`;

	ruletaYaGiró = true;

	setTimeout(() => {
		const ganador = lista.children[ganadorIndex];

		ganador.style.transition = "all 0.5s ease";
		ganador.style.backgroundColor = "green";
		ganador.style.color = "white";
		ganador.style.fontWeight = "bold";
		// Mostrar overlay y guardar ganador
		mostrarGanador(ganador.textContent);

		// Mostrar botón de Ver Ganadores
		document.getElementById("verGanadores").style.display = "inline-block";

	}, 4000); // después de que termine la animación
}


function mostrarGanador(nombre) {
	const existing = document.getElementById("ganadorOverlay");
	if (existing) existing.remove();

	const overlay = document.createElement("div");
	overlay.id = "ganadorOverlay";
	overlay.className = "ganador-overlay";

	document.body.appendChild(overlay);

	// Guardar en localStorage
	let ganadores = JSON.parse(localStorage.getItem("ganadores")) || [];
	ganadores.push(nombre);
	localStorage.setItem("ganadores", JSON.stringify(ganadores));

	// Mostrar botón de Ver Ganadores
	document.getElementById("Girar").style.display = "none";
	document.getElementById("verGanadores").style.display = "inline-block";
}

function verGanadores() {
	window.location.href = '../ganadores/ganadores.html';
}

