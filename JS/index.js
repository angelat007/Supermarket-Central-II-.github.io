/*funcion limpiarParticipantes */
function limpiarParticipantes() {
  document.getElementById("participantes").value = "";
}

/*funcion no ir a la otra ventana si no hay titulo ni participante*/
document.addEventListener('DOMContentLoaded', () => {
  const comenzarBtn = document.getElementById('comenzarBtn');
  const tituloInput = document.getElementById('titulo');
  const participantesInput = document.getElementById('participantes');
  const errorTitulo = document.getElementById('errorTitulo');
  const errorParticipantes = document.getElementById('errorParticipantes');

  comenzarBtn.addEventListener('click', function (e) {
    let hasError = false;

    // Limpiar errores previos
    errorTitulo.textContent = '';
    errorParticipantes.textContent = '';
    errorTitulo.classList.remove('show');
    errorParticipantes.classList.remove('show');
    tituloInput.classList.remove('error-border');
    participantesInput.classList.remove('error-border');

    const titulo = tituloInput.value.trim();
    const participantesTexto = participantesInput.value.trim();
    const participantes = participantesTexto
      .split('\n')
      .map(p => p.trim())
      .filter(p => p !== '');

    // Validación de título
    if (titulo === '') {
      errorTitulo.textContent = 'Debes ingresar un título para el sorteo.';
      errorTitulo.classList.add('show');
      tituloInput.classList.add('error-border');
      hasError = true;
    }

    // Validación de participantes
    if (participantes.length < 2) {
      errorParticipantes.textContent = 'Debes ingresar al menos 2 participantes (uno por línea).';
      errorParticipantes.classList.add('show');
      participantesInput.classList.add('error-border');
      hasError = true;
    }

    if (hasError) {
      e.preventDefault(); // Evita que se envíe el formulario
    }
    if (!hasError) {
      // Guardar temporalmente en sessionStorage
      sessionStorage.setItem('tituloSorteo', titulo);
      sessionStorage.setItem('participantes', JSON.stringify(participantes));
      sessionStorage.setItem('participantesTexto', participantesTexto); // guarda todo el texto tabulado


      // Redirigir manualmente
      window.location.href = 'config.html';
    }
  })
});

/*funcion para inportar arcivos*/
function importarArchivo() {
  document.getElementById('fileInput').click();
}

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const participantesTextarea = document.getElementById('participantes');
  const errorParticipantes = document.getElementById('errorParticipantes');

  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const contenido = e.target.result;

      // Convertir CSV o texto en líneas
      const lineasBrutas = contenido
        .split(/\r?\n/)
        .filter(linea => linea.trim() !== '');

      let separadorDetectado = '\t'; // Por defecto: tabulación
      const muestras = lineasBrutas.slice(0, 3); // usa las primeras 3 líneas como muestra

      // Detectar el separador dominante
      const separadores = [',', ';', '\t', /\s{2,}/];
      const conteos = separadores.map(sep => muestras.reduce((acc, linea) => {
        return acc + (typeof sep === 'string' ? linea.split(sep).length : linea.split(sep).length);
      }, 0));

      const maxIndex = conteos.indexOf(Math.max(...conteos));
      const separador = separadores[maxIndex];

      const lineasFinales = lineasBrutas.map(linea => {
        let columnas = typeof separador === 'string' ? linea.split(separador) : linea.split(separador);
        return columnas.map(col => col.trim()).join('\t'); // reemplaza con tabulaciones
      });

      participantesTextarea.value = lineasFinales.join('\n');



      if (lineas.length < 2) {
        errorParticipantes.textContent = 'El archivo debe contener al menos 2 participantes.';
        errorParticipantes.classList.add('show');
        participantesTextarea.classList.add('error-border');
      } else {
        errorParticipantes.textContent = '';
        errorParticipantes.classList.remove('show');
        participantesTextarea.classList.remove('error-border');
      }

      // Poner en el textarea una línea por participante
      participantesTextarea.value = lineas.join('\n');
    };

    reader.onerror = function () {
      alert('Ocurrió un error al leer el archivo.');
    };

    reader.readAsText(file);
  });
});

//copiar numero
function showCopyMessage(element, message) {
    const msgSpan = element.querySelector(".copy-msg");
    msgSpan.textContent = message;
    msgSpan.style.display = "inline";

    setTimeout(() => {
        msgSpan.style.display = "none";
    }, 2000); // Ocultar después de 2 segundos
}

document.getElementById("numberPhone1").addEventListener("click", () => {
    navigator.clipboard.writeText("809-575-3854");
    showCopyMessage(document.getElementById("numberPhone1"), "¡Número copiado!");
});

document.getElementById("numberPhone2").addEventListener("click", () => {
    navigator.clipboard.writeText("829-745-2433");
    showCopyMessage(document.getElementById("numberPhone2"), "¡Número copiado!");
});
