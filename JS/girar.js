let lista;
let itemHeight = 50;
let ganadorIndex = 0;
let ganadoresRealizados = 0;
let ruletaYaGiró = false;
let totalGanadores = 1; // Valor por defecto
let contadorGanadores = 0;

// Generar o obtener ID de sesión actual
let sesionActual = localStorage.getItem("sesionActual");
if (!sesionActual) {
	sesionActual = "sesion_" + Date.now();
	localStorage.setItem("sesionActual", sesionActual);
}

// Antes de iniciar nueva sesión (solo si no te interesa mantener histórico)
localStorage.removeItem("ganadores");

window.addEventListener("DOMContentLoaded", () => {
	// Obtener el número de ganadores desde localStorage
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

	// Crear efecto de ruleta larga
	const buffer = [...participantes, ...participantes, ...participantes];
	buffer.forEach((nombre) => {
		const li = document.createElement("li");
		li.textContent = nombre;
		lista.appendChild(li);
	});

	// Mostrar información de premios en consola para verificar
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

		// 🔥 Eliminar ganador del array de participantes en localStorage
		let participantes = JSON.parse(localStorage.getItem("participantes")) || [];
		const index = participantes.indexOf(nombreGanador);
		if (index !== -1) {
			participantes.splice(index, 1); // eliminar al ganador
			localStorage.setItem("participantes", JSON.stringify(participantes));
			console.log(`Participante "${nombreGanador}" eliminado de la lista`);
		}

		mostrarGanador(ganador.textContent);

		contadorGanadores++;
		console.log(`Sorteo ${contadorGanadores} completado. Total ganadores configurado: ${totalGanadores}`);

		// Verificar premios restantes después de mostrar el ganador
		const premiosRestantes = JSON.parse(localStorage.getItem("premios")) || [];
		const participantesRestantes = JSON.parse(localStorage.getItem("participantes")) || [];

		console.log(`Premios restantes: ${premiosRestantes.length}`);
		console.log(`Participantes restantes: ${participantesRestantes.length}`);

		// Lógica: si quedan premios Y participantes, mostrar "Próximo participante"
		// Si no quedan premios O no quedan participantes, mostrar "Ver ganadores"
		if (premiosRestantes.length > 0 && participantesRestantes.length > 0) {
			console.log("Mostrando botón 'Próximo participante'");
			document.getElementById("proximoBtn").style.display = "inline-block";
		} else {
			console.log("Mostrando botón 'Ver ganadores' - No quedan premios o participantes");
			document.getElementById("verGanadores").style.display = "inline-block";
			document.getElementById("volverConfig").style.display = "inline-block";
		}
	}, 4000);
}

// hacer el sigte sorteo
function proximoParticipante() {
	// Verificar si quedan premios antes de continuar
	const premiosRestantes = JSON.parse(localStorage.getItem("premios")) || [];
	if (premiosRestantes.length === 0) {
		alert("No quedan más premios disponibles");
		document.getElementById("verGanadores").style.display = "inline-block";
		return;
	}

	ruletaYaGiró = false;
	lista.style.transition = "none";
	lista.innerHTML = ""; // limpiar ruleta visual

	const participantesActualizados = JSON.parse(localStorage.getItem("participantes")) || [];

	// Verificar si quedan participantes
	if (participantesActualizados.length === 0) {
		alert("No quedan más participantes para el sorteo");
		document.getElementById("verGanadores").style.display = "inline-block";
		return;
	}

	// Repetimos participantes para efecto ruleta
	const buffer = [...participantesActualizados, ...participantesActualizados, ...participantesActualizados];
	buffer.forEach((nombre) => {
		const li = document.createElement("li");
		li.textContent = nombre;
		lista.appendChild(li);
	});

	lista.style.transform = "translateY(0)";
	document.getElementById("proximoBtn").style.display = "none";
	document.getElementById("Girar").style.display = "inline-block";
}

function mostrarGanador(nombre) {
	// Obtener premios desde localStorage
	let premios = JSON.parse(localStorage.getItem("premios")) || [];
	let premioAsignado = "Sin premio";

	// Asignar premio si hay disponibles
	if (premios.length > 0) {
		premioAsignado = premios.shift(); // Tomar el primer premio disponible
		// Actualizar localStorage con los premios restantes
		localStorage.setItem("premios", JSON.stringify(premios));
	}

	// Mostrar el ganador en la sección de ganadores
	const ganadoresContainer = document.getElementById("ganadoresContainer");
	const listaGanadores = document.getElementById("lista-ganadores");
	const listaPremios = document.getElementById("lista-premios");

	// Ya NO limpiamos las listas, así se agregan en orden
	// listaGanadores.innerHTML = "";
	// listaPremios.innerHTML = "";

	// Agregar el ganador a la lista
	const liGanador = document.createElement("li");
	liGanador.textContent = nombre;
	liGanador.style.cssText = `
		background-color: #006938;
		color: white;
		padding: 10px;
		margin: 5px 0;
		border-radius: 5px;
		font-weight: bold;
		list-style: none;
		text-align: center;
		width: 265px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
	`;
	listaGanadores.appendChild(liGanador);

	// Agregar el premio a la lista
	const liPremio = document.createElement("li");
	liPremio.textContent = premioAsignado;
	liPremio.style.cssText = `
		background-color: #F7BE00;
		color: white;
		padding: 10px;
		margin: 5px 0;
		border-radius: 5px;
		font-weight: bold;
		list-style: none;
		text-align: center;
		width: 260px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
	`;
	listaPremios.appendChild(liPremio);

	// Estilo del contenedor de ganadores
	const ContGanador = document.getElementById("ganadoresContainer");
	ContGanador.style.cssText = `
		background-color: #f8f9fa;
		width: 600px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		text-align: center;
		margin: 0 auto;
		padding: 20px;
		border-radius: 10px;
		margin-top: 10px
	`;

	// Mostrar el contenedor de ganadores
	ganadoresContainer.style.display = "block";

	// Guardar ganador en localStorage CON ID DE SESIÓN
	let ganadores = JSON.parse(localStorage.getItem("ganadores")) || [];
	ganadores.push({
		nombre,
		premio: premioAsignado,
		sesion: sesionActual  // ← AGREGAMOS EL ID DE SESIÓN
	});
	localStorage.setItem("ganadores", JSON.stringify(ganadores));

	// Guardar también el último ganador individual
	localStorage.setItem("ultimoGanador", JSON.stringify({
		nombre: nombre,
		premio: premioAsignado,
		sesion: sesionActual
	}));

	console.log("Ganador guardado:", { nombre, premio: premioAsignado, sesion: sesionActual });
	console.log("Premios restantes:", premios);
}

//no auto mostrar el sector de premios "containerPremio" cuando no hay premios definidos en config.html "premiosConfirmados"
if (JSON.parse(localStorage.getItem("premios")).length === 0) {
	document.getElementById("containerPremio").style.display = "none";
}

//cuando no se vea el sector de containerPremio alina automaticamente el sector de ganadores
const containerPremio = document.getElementById("containerPremio");
const ganadoresFlexWrapper = document.getElementById("ganadoresFlexWrapper");

if (!localStorage.getItem("premios") || JSON.parse(localStorage.getItem("premios")).length === 0) {
	containerPremio.style.display = "none";

	// Centrar contenedor de ganadores
	ganadoresFlexWrapper.style.justifyContent = "center";

	// Ajustar ancho y centrado de containerWinner
	const containerWinner = document.getElementById("containerWinner");
	containerWinner.style.margin = "0 auto";
}

function verGanadores() {
	window.location.href = '../ganadores/ganadores.html';
}

// Función para limpiar la sesión (opcional, para empezar una nueva sesión)
function nuevaSesion() {
	sesionActual = "sesion_" + Date.now();
	localStorage.setItem("sesionActual", sesionActual);
	console.log("Nueva sesión iniciada:", sesionActual);
}

//funcion volver a config.html
function volverConfig() {
	window.location.href = '../../index.html'
}