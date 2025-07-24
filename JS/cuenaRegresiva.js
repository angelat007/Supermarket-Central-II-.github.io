document.addEventListener('DOMContentLoaded', () => {
  // Botón: Ver Ganadores
  document.getElementById('btnVerGanadores').addEventListener('click', () => {
    const ganadoresElements = document.querySelectorAll('#listaGanadores li');
    const ganadoresData = Array.from(ganadoresElements).map(li => {
      const codigo = li.querySelector('.codigo')?.textContent || '';
      const nombre = li.querySelector('.nombre')?.textContent || '';
      const premio = li.querySelector('.premio')?.textContent || '';
      return { codigo, nombre, premio };
    });

    // Guardar en localStorage
    localStorage.setItem('ganadoresMultiple', JSON.stringify(ganadoresData));
    localStorage.setItem('tituloSorteo', document.getElementById('tituloSorteo').textContent);
    localStorage.setItem('fechaSorteo', new Date().toLocaleDateString());
    localStorage.setItem('participantes', JSON.stringify(
      JSON.parse(sessionStorage.getItem('participantesFinal') || '[]')
    ));

    window.location.href = "../ganadores/descargar.html";
  });

  // Cargar opciones y participantes
  const opciones = JSON.parse(sessionStorage.getItem('opcionesSorteo') || '{}');
  const participantes = JSON.parse(sessionStorage.getItem('participantesFinal') || '[]');
  const premios = JSON.parse(localStorage.getItem('premios') || '[]');

  // Pintar título
  const tituloNode = document.getElementById('tituloSorteo');
  tituloNode.textContent = opciones.titulo || 'Cuenta regresiva';

  // Pintar participantes
  const listaNode = document.getElementById('listaParticipantesfinal');
  const totalNode = document.getElementById('totalParticipantes');
  listaNode.innerHTML = '';
  totalNode.textContent = `Total: ${participantes.length}`;

  participantes.sort((a, b) => a.localeCompare(b)).forEach((linea, i) => {
    const li = document.createElement('li');
    li.textContent = linea;
    li.className = `fila ${i % 2 === 0 ? 'par' : 'impar'}`;
    listaNode.appendChild(li);
  });

  // Evento: Iniciar cuenta regresiva
  document.getElementById('btnIniciar')
    .addEventListener('click', () => startCountdown(opciones.duracion || 5));
  document.getElementById('btnVolver')
    .addEventListener('click', () => window.location.href = '../../index.html');
});

/* --------- Lógica de cuenta regresiva --------- */
function startCountdown(segundos) {
  const countdown = document.getElementById('countdown');
  document.getElementById('btnIniciar').style.display = 'none';
  countdown.style.display = 'block';
  let restante = segundos;
  countdown.textContent = restante;

  const intervalo = setInterval(() => {
    restante--;
    if (restante <= 0) {
      clearInterval(intervalo);
      countdown.textContent = '¡GO!';
      setTimeout(() => {
        countdown.style.display = 'none';
        mostrarGanadores();
      }, 800);
    } else {
      countdown.textContent = restante;
    }
  }, 1000);
}

/* --------- Mostrar ganadores y premios --------- */
function mostrarGanadores() {
  const participantes = Array.from(document.querySelectorAll('#listaParticipantesfinal li'))
    .map(li => li.textContent.trim())
    .filter(linea => linea.length > 0);

  const cantidad = (JSON.parse(sessionStorage.getItem('opcionesSorteo'))?.ganadores) || 1;
  const premios = JSON.parse(localStorage.getItem('premios') || '[]');

  const ganadores = shuffle(participantes).slice(0, cantidad);

  const modal = document.getElementById('modalGanadores');
  const listaGan = document.getElementById('listaGanadores');
  const countdown = document.getElementById('countdown');

  listaGan.innerHTML = '';

  ganadores.forEach((g, i) => {
    const li = document.createElement('li');

    // Soporte coma o espacio
    let id = '', nombre = '';
    if (g.includes(',')) {
      const partes = g.split(',');
      id = partes[0].trim();
      nombre = partes.slice(1).join(',').trim();
    } else if (g.match(/^(T\d+)\s+(.+)/)) {
      const match = g.match(/^(T\d+)\s+(.+)/);
      id = match[1];
      nombre = match[2];
    } else {
      nombre = g;
    }

    const premio = premios[i] || '—';

    li.innerHTML = `
      <div class="codigo">${id}</div>
      <div class="nombre">${nombre}</div>
      <div class="premio">${premio}</div>
    `;
    listaGan.appendChild(li);
  });

  countdown.style.display = 'none';
  modal.classList.remove('hidden');
  lanzarConfetti();
}

/* --------- Utilidades --------- */
function shuffle(arr) {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

/*------------Confeti------------*/
function lanzarConfetti() {
  if (typeof confetti === 'function') {
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
  }
}
