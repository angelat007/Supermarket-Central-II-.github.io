// Función optimizada para cargar participantes desde sessionStorage o localStorage
function cargarParticipantes() {
  const lista = document.getElementById('listaParticipantes');
  const total = document.getElementById('totalParticipantes');

  let participantes = [];

  // Prioridad 1: Intentar cargar desde sessionStorage (datos más recientes)
  const participantesSessionJSON = sessionStorage.getItem('participantes');
  if (participantesSessionJSON) {
    try {
      participantes = JSON.parse(participantesSessionJSON);
      console.log('Participantes cargados desde sessionStorage:', participantes.length);
    } catch (error) {
      console.error('Error parsing sessionStorage participants:', error);
    }
  }

  // Prioridad 2: Si no hay en sessionStorage, intentar desde localStorage
  if (participantes.length === 0) {
    const participantesLocalJSON = localStorage.getItem('participantes');
    if (participantesLocalJSON) {
      try {
        participantes = JSON.parse(participantesLocalJSON);
        console.log('Participantes cargados desde localStorage:', participantes.length);
      } catch (error) {
        console.error('Error parsing localStorage participants:', error);
      }
    }
  }

  // Prioridad 3: Si no hay participantes en arrays, intentar cargar desde texto
  if (participantes.length === 0) {
    const participantesTexto = sessionStorage.getItem('participantesTexto') || localStorage.getItem('participantesTexto');
    if (participantesTexto) {
      participantes = participantesTexto.split('\n').map(p => p.trim()).filter(p => p !== '');
      console.log('Participantes cargados desde texto:', participantes.length);
    }
  }

  // Si no hay participantes, mostrar mensaje
  if (participantes.length === 0) {
    lista.innerHTML = '<li>No se cargaron participantes.</li>';
    total.textContent = '';
    return;
  }

  // Mostrar solo los primeros 100 participantes en la UI para rendimiento
  // pero mantener el conteo total correcto
  lista.innerHTML = '';
  
  const participantesParaMostrar = participantes.slice(0, 100);
  participantesParaMostrar.forEach(nombre => {
    const li = document.createElement('li');
    li.textContent = nombre;
    lista.appendChild(li);
  });

  // Si hay más de 100 participantes, mostrar indicador
  if (participantes.length > 100) {
    const li = document.createElement('li');
    li.innerHTML = `<em>... y ${(participantes.length - 100).toLocaleString()} participantes más</em>`;
    li.style.fontStyle = 'italic';
    li.style.color = '#666';
    lista.appendChild(li);
  }

  total.textContent = `Total: ${participantes.length.toLocaleString()}`;

  // Guardar en localStorage para uso posterior si no existe
  if (!localStorage.getItem('participantes')) {
    try {
      localStorage.setItem('participantes', JSON.stringify(participantes));
    } catch (error) {
      console.warn('No se pudo guardar en localStorage (quota exceeded)');
    }
  }
}

// Función optimizada para mezclar participantes
document.getElementById('shuffleBtn').addEventListener('click', () => {
  let participantes = [];

  // Cargar participantes desde la fuente más confiable
  const participantesSessionJSON = sessionStorage.getItem('participantes');
  if (participantesSessionJSON) {
    try {
      participantes = JSON.parse(participantesSessionJSON);
    } catch (error) {
      console.error('Error parsing participants for shuffle:', error);
    }
  }

  // Fallback a localStorage
  if (participantes.length === 0) {
    const participantesLocalJSON = localStorage.getItem('participantes');
    if (participantesLocalJSON) {
      try {
        participantes = JSON.parse(participantesLocalJSON);
      } catch (error) {
        console.error('Error parsing localStorage participants for shuffle:', error);
      }
    }
  }

  // Fallback a texto
  if (participantes.length === 0) {
    const participantesTexto = sessionStorage.getItem('participantesTexto') || localStorage.getItem('participantesTexto');
    if (participantesTexto) {
      participantes = participantesTexto.split('\n').map(p => p.trim()).filter(p => p !== '');
    }
  }

  if (participantes.length === 0) {
    alert('No hay participantes para mezclar');
    return;
  }

  // Mezclar array
  const participantesMezclados = mezclarArray([...participantes]);

  // Actualizar UI
  const listaParticipantes = document.getElementById('listaParticipantes');
  const totalParticipantes = document.getElementById('totalParticipantes');

  listaParticipantes.innerHTML = '';
  
  // Mostrar solo los primeros 100 mezclados
  const participantesParaMostrar = participantesMezclados.slice(0, 100);
  participantesParaMostrar.forEach(nombre => {
    const li = document.createElement('li');
    li.textContent = nombre;
    li.style.fontFamily = '"Segoe UI", sans-serif';
    li.style.whiteSpace = 'pre';
    listaParticipantes.appendChild(li);
  });

  // Indicador de más participantes
  if (participantesMezclados.length > 100) {
    const li = document.createElement('li');
    li.innerHTML = `<em>... y ${(participantesMezclados.length - 100).toLocaleString()} participantes más (mezclados)</em>`;
    li.style.fontStyle = 'italic';
    li.style.color = '#666';
    listaParticipantes.appendChild(li);
  }

  totalParticipantes.textContent = `Total: ${participantesMezclados.length.toLocaleString()}`;

  // Guardar la lista mezclada
  try {
    sessionStorage.setItem('participantes', JSON.stringify(participantesMezclados));
    localStorage.setItem('participantes', JSON.stringify(participantesMezclados));
  } catch (error) {
    console.warn('No se pudo guardar la lista mezclada:', error);
  }
});

// Función mejorada para guardar opciones con validación de premios
function guardarOpciones() {
  const mensajeError = document.getElementById('mensajeError');
  const titulo = document.getElementById("tituloSorteo").value;
  localStorage.setItem("tituloSorteo", titulo);
  mensajeError.textContent = '';

  const animacionSeleccionada = document.getElementById('animacionTipo').value;
  const cantidad = +document.getElementById('numGanadores').value;

  const opciones = {
    titulo: titulo,
    ganadores: cantidad,
    suplentes: +document.getElementById('numSuplentes').value,
    filtrarDuplicados: document.getElementById('filtrarDuplicados').checked,
    excluirParticipantes: false,
    animacion: animacionSeleccionada,
    sonidos: false,
    duracion: +document.getElementById('duracionAnimacion').value,
    color: document.getElementById('colorPrincipal').value,
  };

  aplicarColorPrincipal(opciones.color);

  // Cargar participantes desde la fuente más confiable
  let participantes = [];
  
  const participantesSessionJSON = sessionStorage.getItem('participantes');
  if (participantesSessionJSON) {
    try {
      participantes = JSON.parse(participantesSessionJSON);
    } catch (error) {
      console.error('Error parsing participants:', error);
    }
  }

  if (participantes.length === 0) {
    const participantesLocalJSON = localStorage.getItem('participantes');
    if (participantesLocalJSON) {
      try {
        participantes = JSON.parse(participantesLocalJSON);
      } catch (error) {
        console.error('Error parsing localStorage participants:', error);
      }
    }
  }

  if (participantes.length === 0) {
    const participantesTexto = sessionStorage.getItem('participantesTexto') || localStorage.getItem('participantesTexto');
    if (participantesTexto) {
      participantes = participantesTexto.split('\n').map(p => p.trim()).filter(p => p !== '');
    }
  }

  if (participantes.length === 0) {
    mensajeError.textContent = 'Error: No se encontraron participantes cargados.';
    return;
  }

  if (!titulo.trim()) {
    mensajeError.textContent = 'Error: Debes ingresar un título para el sorteo.';
    return;
  }

  // Validar premios si están definidos
  const premiosGuardados = localStorage.getItem("premios");
  if (premiosGuardados) {
    try {
      const premiosArray = JSON.parse(premiosGuardados);
      if (premiosArray.length !== cantidad) {
        mensajeError.textContent = `Error: Debes definir exactamente ${cantidad} premios.`;
        return;
      }
    } catch (error) {
      console.error('Error parsing premios:', error);
    }
  }

  // Guardar participantes en localStorage para el sorteo
  try {
    localStorage.setItem('participantes', JSON.stringify(participantes));
    localStorage.setItem('opcionesSorteo', JSON.stringify(opciones));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    mensajeError.textContent = 'Error: No se pudieron guardar las opciones.';
    return;
  }

  console.log(`Guardando ${participantes.length} participantes para el sorteo`);

  // Redirige a la animación seleccionada
  if (animacionSeleccionada === 'ruleta') {
    window.location.href = 'nombresAleatorios/nombresGiratorios.html';
  } else if (animacionSeleccionada === 'fortuna') {
    window.location.href = 'nombresAleatorios/viewRuleta.html';
  } else if (animacionSeleccionada === 'cuenta') {
    window.location.href = 'nombresAleatorios/coldown.html';
  } else {
    mensajeError.textContent = 'Error: Debes seleccionar una animación válida.';
  }
}

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

// Resto de funciones existentes...
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

// Inicializar cuando se carga la página
window.addEventListener('DOMContentLoaded', () => {
  cargarParticipantes();
  
  // Cargar logo guardado si existe
  const logoGuardado = localStorage.getItem('logoSrc');
  if (logoGuardado) {
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
      logoElement.src = logoGuardado;
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