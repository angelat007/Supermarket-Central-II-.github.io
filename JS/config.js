// Configura y muestra el modal para definir premios por ganador
const definirBtn = document.querySelector(".premios");
const modal = document.getElementById("IrVentanaFlotante");
const cancelarBtn = document.getElementById("btnCancelar");
const confirmarBtn = document.getElementById("btnConfirmar");
const inputsPremios = document.getElementById("inputsPremios");
const premiosConfirmados = document.getElementById("premiosConfirmados");

// Abre el modal y genera inputs según la cantidad de ganadores
definirBtn.addEventListener("click", e => {
  e.preventDefault();
  modal.style.display = "flex";
  document.body.classList.add("modal-abierto");
  inputsPremios.innerHTML = "";

  const cantidad = parseInt(document.getElementById("numGanadores").value);
  for (let i = 1; i <= cantidad; i++) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = `Premio ${i}`;
    input.className = "premio-input";
    inputsPremios.appendChild(input);
  }
});

// Cierra el modal sin guardar
cancelarBtn.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.classList.remove("modal-abierto");
});

// Confirma los premios escritos y los muestra
confirmarBtn.addEventListener("click", e => {
  e.preventDefault();
  premiosConfirmados.innerHTML = "";

  const inputs = document.querySelectorAll(".premio-input");
  const premiosArray = []; // Array para guardar los premios

  inputs.forEach(input => {
    const valor = input.value.trim();
    if (valor) {
      const li = document.createElement("li");
      li.textContent = valor;
      premiosConfirmados.appendChild(li);
      premiosArray.push(valor); // Agregar al array
    }
  });

  // Guardar premios en localStorage
  localStorage.setItem("premios", JSON.stringify(premiosArray));

  if (inputs.length > 0) premiosConfirmados.style.display = "block";

  modal.style.display = "none";
  document.body.classList.remove("modal-abierto");
});

// Guarda los datos finales antes de iniciar el sorteo y redirige según animación
function guardarOpciones() {
  const mensajeError = document.getElementById('mensajeError');
  const titulo = document.getElementById("tituloSorteo").value;
  localStorage.setItem("tituloSorteo", titulo);
  mensajeError.textContent = '';

  const animacionSeleccionada = document.getElementById('animacionTipo').value;

  const opciones = {
    titulo: titulo,
    ganadores: +document.getElementById('numGanadores').value,
    suplentes: +document.getElementById('numSuplentes').value,
    filtrarDuplicados: document.getElementById('filtrarDuplicados').checked,
    excluirParticipantes: false,
    animacion: animacionSeleccionada,
    sonidos: false,
    duracion: +document.getElementById('duracionAnimacion').value,
    color: document.getElementById('colorPrincipal').value,
  };

  aplicarColorPrincipal(opciones.color);

  const listaItems = document.querySelectorAll('#listaParticipantes li');
  const nombres = Array.from(listaItems).map(li => li.textContent.trim()).filter(n => n !== '');

  if (nombres.length === 0) {
    mensajeError.textContent = 'Error: Debes ingresar al menos un participante.';
    return;
  }

  // Guardar participantes en localStorage también
  localStorage.setItem('participantes', JSON.stringify(nombres));
  sessionStorage.setItem('participantesFinal', JSON.stringify(nombres));
  sessionStorage.setItem('opcionesSorteo', JSON.stringify(opciones));

  // Redirige a la animación seleccionada
  if (animacionSeleccionada === 'ruleta') {
    window.location.href = 'nombresAleatorios/nombresGiratorios.html';
  } else if (animacionSeleccionada === 'fortuna') {
    window.location.href = 'nombresAleatorios/viewRuleta.html';
  } else if (animacionSeleccionada === 'cuenta') {
    window.location.href = 'nombresAleatorios/coldown.html';
  //} else if (animacionSeleccionada === 'numeros') {
    //window.location.href = 'nombresAleatorios/numberAleatorio.html';
  } else {
    mensajeError.textContent = 'Error: Debes seleccionar una animación válida.';
  }
}

// Resto del código existente...
// Guarda todas las configuraciones seleccionadas por el usuario
function aplicarColorPrincipal(color) {
  const panel = document.getElementById('panel');
  panel.style.background = `linear-gradient(to bottom, ${color})`;
}

// Escucha el cambio de color mientras el usuario selecciona
document.getElementById('colorPrincipal').addEventListener('input', (e) => {
  aplicarColorPrincipal(e.target.value);
});

// Cambia el logo del sitio cuando se selecciona una nueva imagen
document.getElementById('logoInput').addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const newLogoSrc = e.target.result;
      const logoElement = document.querySelector('.logo');
      if (logoElement) {
        logoElement.src = newLogoSrc;
      }
      localStorage.setItem('logoSrc', newLogoSrc);
    };
    reader.readAsDataURL(file);
  }
});

// Aplica el logo guardado cuando se carga la página
window.addEventListener('DOMContentLoaded', () => {
  const savedLogo = localStorage.getItem('logoSrc');
  if (savedLogo) {
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
      logoElement.src = savedLogo;
    }
  }
});

// Muestra "SI" o "NO" al activar o desactivar un switch
function toggleText(checkbox) {
  const switchWrapper = checkbox.closest('.switch-wrapper');
  if (!switchWrapper) return;

  const toggleTextSpan = switchWrapper.querySelector('.toggle-text');
  if (!toggleTextSpan) return;

  toggleTextSpan.textContent = checkbox.checked ? 'SI' : 'NO';
}

// Aumenta o disminuye valores numéricos con validación
function changeValue(id, delta) {
  const input = document.getElementById(id);
  let value = parseInt(input.value) || 0;
  let min = parseInt(input.min) || 0;

  value += delta;
  if (value >= min) {
    input.value = value;
  }
}

// Carga los participantes guardados y los muestra en la lista
document.addEventListener('DOMContentLoaded', () => {
  const tituloGuardado = sessionStorage.getItem('tituloSorteo');
  const participantesTexto = sessionStorage.getItem('participantesTexto') || '';

  const tituloInput = document.getElementById('tituloSorteo');
  const listaParticipantes = document.getElementById('listaParticipantes');
  const totalParticipantes = document.getElementById('totalParticipantes');

  if (tituloGuardado) tituloInput.value = tituloGuardado;

  if (listaParticipantes && participantesTexto) {
    listaParticipantes.innerHTML = '';
    const filas = participantesTexto.split('\n').filter(linea => linea.trim() !== '');

    filas.forEach(linea => {
      const li = document.createElement('li');
      li.textContent = linea;
      li.style.fontFamily = '"Segoe UI", sans-serif';
      li.style.whiteSpace = 'pre';
      listaParticipantes.appendChild(li);
    });

    totalParticipantes.textContent = `Total: ${filas.length}`;
  }
});

// Mezcla aleatoriamente la lista de participantes
document.getElementById('shuffleBtn').addEventListener('click', () => {
  const participantesTexto = sessionStorage.getItem('participantesTexto') || '';
  const filas = participantesTexto.split('\n').filter(linea => linea.trim() !== '');
  const participantesMezclados = mezclarArray([...filas]);

  const listaParticipantes = document.getElementById('listaParticipantes');
  const totalParticipantes = document.getElementById('totalParticipantes');

  listaParticipantes.innerHTML = '';
  participantesMezclados.forEach(linea => {
    const li = document.createElement('li');
    li.textContent = linea;
    li.style.fontFamily = '"Segoe UI", sans-serif';
    li.style.whiteSpace = 'pre';
    listaParticipantes.appendChild(li);
  });

  totalParticipantes.textContent = `Total: ${participantesMezclados.length}`;
});

// Algoritmo de Fisher-Yates para mezclar un array
function mezclarArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Muestra una vista previa del logo cargado
document.getElementById('logoInput').addEventListener('change', function (event) {
  const preview = document.getElementById('logoPreview');
  preview.innerHTML = '';
  const file = event.target.files[0];
  if (file) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = '180px';
    img.style.maxHeight = '50px';
    img.style.marginTop = '10px';
    preview.appendChild(img);
  }
});

// Guarda el logo en base64 para que persista tras recargar la página
function guardarLogo() {
  const logoInput = document.getElementById('logoInput');
  const file = logoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      localStorage.setItem('logoSorteo', e.target.result);
    };
    reader.readAsDataURL(file);
  }
}