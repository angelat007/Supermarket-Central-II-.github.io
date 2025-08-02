let lista;
let itemHeight = 50;
let ganadorIndex = 0;
let ganadoresRealizados = 0;
let ruletaYaGiró = false;
let totalGanadores = 1;
let contadorGanadores = 0;

let sesionActual = localStorage.getItem("sesionActual");
if (!sesionActual) {
	sesionActual = "sesion_" + Date.now();
	localStorage.setItem("sesionActual", sesionActual);
}

localStorage.removeItem("ganadores");

window.addEventListener("DOMContentLoaded", () => {
	const opciones = JSON.parse(localStorage.getItem("opciones")) || {};
	totalGanadores = parseInt(opciones.ganadores) || 1;

	console.log("Total de ganadores configurado:", totalGanadores);
	console.log("ID de sesión actual:", sesionActual);

	const participantes = JSON.parse(localStorage.getItem("participantes")) || [];
	lista = document.getElementById("ruletaLista");

	if (participantes.length === 0) {
		lista.innerHTML = "<li>No hay participantes</li>";
		return;
	}

	const buffer = [...participantes, ...participantes, ...participantes];
	buffer.forEach((nombre) => {
		const li = document.createElement("li");
		const codigo = nombre.trim().substring(0, 17);
		const nombrePersona = nombre.trim().substring(17).trim();

		li.innerHTML = `
			<span class="codigo">${codigo}</span>
			<span class="nombre">${nombrePersona}</span>
		`;

		lista.appendChild(li);
	});

	const premios = JSON.parse(localStorage.getItem("premios")) || [];
	console.log("Premios disponibles:", premios);
});

function girarSorteo() {
	if (ruletaYaGiró) return;

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
		const nombreGanador = ganador.textContent;
		ganador.style.transition = "all 0.5s ease";
		ganador.style.backgroundColor = "green";
		ganador.style.color = "white";
		ganador.style.fontWeight = "bold";

		console.log(`Ganador seleccionado: ${nombreGanador}`);

		let participantes = JSON.parse(localStorage.getItem("participantes")) || [];
		const index = participantes.indexOf(nombreGanador);
		if (index !== -1) {
			participantes.splice(index, 1);
			localStorage.setItem("participantes", JSON.stringify(participantes));
			console.log(`Participante "${nombreGanador}" eliminado de la lista`);
		}

		mostrarGanador(ganador.textContent);

		contadorGanadores++;
		console.log(`Sorteo ${contadorGanadores} completado. Total ganadores configurado: ${totalGanadores}`);

		const premiosRestantes = JSON.parse(localStorage.getItem("premios")) || [];
		const participantesRestantes = JSON.parse(localStorage.getItem("participantes")) || [];

		console.log(`Premios restantes: ${premiosRestantes.length}`);
		console.log(`Participantes restantes: ${participantesRestantes.length}`);

		if (premiosRestantes.length > 0 && participantesRestantes.length > 0) {
			document.getElementById("proximoBtn").style.display = "inline-block";
		} else {
			document.getElementById("verGanadores").style.display = "inline-block";
			document.getElementById("volverConfig").style.display = "inline-block";
		}
	}, 4000);
}

function proximoParticipante() {
	const premiosRestantes = JSON.parse(localStorage.getItem("premios")) || [];
	if (premiosRestantes.length === 0) {
		alert("No quedan más premios disponibles");
		document.getElementById("verGanadores").style.display = "inline-block";
		return;
	}

	ruletaYaGiró = false;
	lista.style.transition = "none";
	lista.innerHTML = "";

	const participantesActualizados = JSON.parse(localStorage.getItem("participantes")) || [];

	if (participantesActualizados.length === 0) {
		alert("No quedan más participantes para el sorteo");
		document.getElementById("verGanadores").style.display = "inline-block";
		return;
	}

	const buffer = [...participantesActualizados, ...participantesActualizados, ...participantesActualizados];
	buffer.forEach((nombre) => {
		const li = document.createElement("li");
		const codigo = nombre.trim().substring(0, 17);
		const nombrePersona = nombre.trim().substring(17).trim();

		li.innerHTML = `
			<span class="codigo">${codigo}</span>
			<span class="nombre">${nombrePersona}</span>
		`;

		lista.appendChild(li);
	});

	lista.style.transform = "translateY(0)";
	document.getElementById("proximoBtn").style.display = "none";
	document.getElementById("Girar").style.display = "inline-block";
}

function mostrarGanador(nombre) {
	let premios = JSON.parse(localStorage.getItem("premios")) || [];
	let premioAsignado = "Sin premio";

	if (premios.length > 0) {
		premioAsignado = premios.shift();
		localStorage.setItem("premios", JSON.stringify(premios));
	}

	const ganadoresContainer = document.getElementById("ganadoresContainer");
	const listaGanadores = document.getElementById("lista-ganadores");
	const listaPremios = document.getElementById("lista-premios");

	const liGanador = document.createElement("li");
	liGanador.classList.add("ganador-item");

	const [codigo, ...resto] = nombre.trim().split(" ");
	const nombrePersona = resto.join(" ");

	liGanador.innerHTML = `
		<div class="id-ganador">${codigo}</div>
		<div class="nombre-ganador">${nombrePersona}</div>
	`;

	listaGanadores.appendChild(liGanador);

	const liPremio = document.createElement("li");
	liPremio.classList.add("premio-item");
	liPremio.textContent = premioAsignado;
	listaPremios.appendChild(liPremio);

	ganadoresContainer.style.display = "block";

	let ganadores = JSON.parse(localStorage.getItem("ganadores")) || [];
	ganadores.push({
		nombre,
		premio: premioAsignado,
		sesion: sesionActual
	});
	localStorage.setItem("ganadores", JSON.stringify(ganadores));

	localStorage.setItem("ultimoGanador", JSON.stringify({
		nombre: nombre,
		premio: premioAsignado,
		sesion: sesionActual
	}));

	console.log("Ganador guardado:", { nombre, premio: premioAsignado, sesion: sesionActual });
	console.log("Premios restantes:", premios);
}

if (JSON.parse(localStorage.getItem("premios")).length === 0) {
	document.getElementById("containerPremio").style.display = "none";
}

const containerPremio = document.getElementById("containerPremio");
const ganadoresFlexWrapper = document.getElementById("ganadoresFlexWrapper");

if (!localStorage.getItem("premios") || JSON.parse(localStorage.getItem("premios")).length === 0) {
	containerPremio.style.display = "none";
	ganadoresFlexWrapper.style.justifyContent = "center";

	const containerWinner = document.getElementById("containerWinner");
	containerWinner.style.margin = "0 auto";
}

function verGanadores() {
	window.location.href = '../ganadores/ganadores.html';
}

function nuevaSesion() {
	sesionActual = "sesion_" + Date.now();
	localStorage.setItem("sesionActual", sesionActual);
	console.log("Nueva sesión iniciada:", sesionActual);
}

function volverConfig() {
	localStorage.setItem("abrirFloatConfig", "true");
	window.location.href = '../../index.html';
}
