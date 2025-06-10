function guardarOpciones() {
  const opciones = {
    titulo: document.getElementById('tituloSorteo').value,
    ganadores: +document.getElementById('numGanadores').value,
    suplentes: +document.getElementById('numSuplentes').value,
    filtrarDuplicados: document.getElementById('filtrarDuplicados').checked,
    excluirParticipantes: document.getElementById('excluirParticipantes').checked,
    animacion: document.getElementById('animacionTipo').value,
    sonidos: document.getElementById('activarSonidos').checked,
    duracion: +document.getElementById('duracionAnimacion').value,
    color: document.getElementById('colorPrincipal').value,
  };

  aplicarColorPrincipal(opciones.color);

  console.log('Opciones guardadas:', opciones);
  alert('¡Opciones guardadas correctamente!');
}

function aplicarColorPrincipal(color) {
  const panel = document.getElementById('panel');
  panel.style.background = `linear-gradient(to bottom, ${color})`;
}

// Cambiar el color dinámicamente mientras el usuario selecciona
document.getElementById('colorPrincipal').addEventListener('input', (e) => {
  aplicarColorPrincipal(e.target.value);
});

// Cambiar el logo del header al seleccionar un archivo
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

      // Opcional: guardar en localStorage para mantenerlo tras recarga
      localStorage.setItem('logoSrc', newLogoSrc);
    };
    reader.readAsDataURL(file);
  }
});

// Al cargar la página, aplicar el logo guardado si existe
window.addEventListener('DOMContentLoaded', () => {
  const savedLogo = localStorage.getItem('logoSrc');
  if (savedLogo) {
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
      logoElement.src = savedLogo;
    }
  }
});

//animacion Si, No
function toggleText(checkbox) {
  // Buscar el contenedor más cercano que tenga la clase .switch-wrapper
  const switchWrapper = checkbox.closest('.switch-wrapper');
  if (!switchWrapper) return;

  // Dentro de ese contenedor, buscar el span con la clase .toggle-text
  const toggleTextSpan = switchWrapper.querySelector('.toggle-text');
  if (!toggleTextSpan) return;

  // Cambiar el texto según el estado del checkbox
  toggleTextSpan.textContent = checkbox.checked ? 'SI' : 'NO';
}


// funcion para botones de subir o bajar numeros
function changeValue(id, delta) {
  const input = document.getElementById(id);
  let value = parseInt(input.value) || 0;
  let min = parseInt(input.min) || 0;

  value += delta;
  if (value >= min) {
    input.value = value;
  }
}

//leer participantes y mostrar
document.addEventListener('DOMContentLoaded', () => {
  const tituloGuardado = sessionStorage.getItem('tituloSorteo');
  const participantesTexto = sessionStorage.getItem('participantesTexto') || '';

  const tituloInput = document.getElementById('tituloSorteo');
  const listaParticipantes = document.getElementById('listaParticipantes');
  const totalParticipantes = document.getElementById('totalParticipantes');

  if (tituloGuardado) {
    tituloInput.value = tituloGuardado;
  }

  if (listaParticipantes && participantesTexto) {
    listaParticipantes.innerHTML = ''; // limpia la lista

    const filas = participantesTexto.split('\n').filter(linea => linea.trim() !== '');
    filas.forEach(linea => {
      const li = document.createElement('li');
      li.textContent = linea; // conserva tabulaciones o espacios
      li.style.fontFamily = '"Segoe UI", sans-serif;'; // usa fuente fija
      li.style.whiteSpace = 'pre'; // conserva tabulaciones y espacios
      listaParticipantes.appendChild(li);
    });

    totalParticipantes.textContent = `Total: ${filas.length}`;
  }
});


//funciones liseas necesarias
document.getElementById('shuffleBtn').addEventListener('click', () => {
  const participantesTexto = sessionStorage.getItem('participantesTexto') || '';
  const filas = participantesTexto.split('\n').filter(linea => linea.trim() !== '');

  // Mezclar las líneas completas, sin alterar su contenido ni formato
  const participantesMezclados = mezclarArray([...filas]);

  listaParticipantes.innerHTML = ''; // limpia la lista actual

  participantesMezclados.forEach(linea => {
    const li = document.createElement('li');
    li.textContent = linea;
    li.style.fontFamily = '"Segoe UI", sans-serif;';
    li.style.whiteSpace = 'pre';
    listaParticipantes.appendChild(li);
  });

  totalParticipantes.textContent = `Total: ${participantesMezclados.length}`;
});

//funcion mezclar participantes
function mezclarArray(array) {
  // Algoritmo de Fisher-Yates para mezclar
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

document.getElementById('shuffleBtn').addEventListener('click', () => {
  const participantesMezclados = mezclarArray([...participantesGuardados]); // copia para no afectar el original
  listaParticipantes.innerHTML = ''; // limpiar la lista actual

  participantesMezclados.forEach(nombre => {
    const li = document.createElement('li');
    li.textContent = nombre;
    listaParticipantes.appendChild(li);
  });
});

//funcion Filtrar duplicados
function mostrarParticipantes(lista, filtrarDuplicados) {
  const listaParticipantes = document.getElementById('listaParticipantes');
  const totalParticipantes = document.getElementById('totalParticipantes');

  let finalLista = [...lista];

  if (filtrarDuplicados) {
    finalLista = [...new Set(finalLista)];
  }

  const tabla = document.createElement('table');
  tabla.classList.add('tabla-participantes');

  const filas = participantesTexto.split('\n');
  filas.forEach(linea => {
    const fila = document.createElement('tr');
    const columnas = linea.split(/\t+/); // usa tabulaciones como separador
    columnas.forEach(col => {
      const celda = document.createElement('td');
      celda.textContent = col;
      fila.appendChild(celda);
    });
    tabla.appendChild(fila);
  });

  listaParticipantes.innerHTML = '';
  listaParticipantes.appendChild(tabla);


  totalParticipantes.textContent = `Total: ${finalLista.length}`;
}


//funcion opcional
document.getElementById('logoInput').addEventListener('change', function (event) {
  const preview = document.getElementById('logoPreview');
  preview.innerHTML = ''; // limpiar
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
