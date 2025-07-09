// Función para limpiar el área de texto de participantes
function limpiarParticipantes() {
  document.getElementById("participantes").value = "";
}

// Evento que se ejecuta cuando la página carga completamente
document.addEventListener('DOMContentLoaded', () => {
  const comenzarBtn = document.getElementById('comenzarBtn');
  const tituloInput = document.getElementById('titulo');
  const participantesInput = document.getElementById('participantes');
  const errorTitulo = document.getElementById('errorTitulo');
  const errorParticipantes = document.getElementById('errorParticipantes');

  // Al hacer clic en el botón "Comenzar"
  comenzarBtn.addEventListener('click', function (e) {
    let hasError = false;

    // Limpiar errores anteriores en pantalla
    errorTitulo.textContent = '';
    errorParticipantes.textContent = '';
    errorTitulo.classList.remove('show');
    errorParticipantes.classList.remove('show');
    tituloInput.classList.remove('error-border');
    participantesInput.classList.remove('error-border');

    // Obtener el valor del título y los participantes ingresados
    const titulo = tituloInput.value.trim();
    const participantesTexto = participantesInput.value.trim();

    // Dividir los participantes por línea
    const participantes = participantesTexto
      .split('\n')
      .map(p => p.trim())
      .filter(p => p !== '');

    // Validar que se haya ingresado un título
    if (titulo === '') {
      errorTitulo.textContent = 'Debes ingresar un título para el sorteo.';
      errorTitulo.classList.add('show');
      tituloInput.classList.add('error-border');
      hasError = true;
    }

    // Validar que al menos haya dos participantes
    if (participantes.length < 2) {
      errorParticipantes.textContent = 'Debes ingresar al menos 2 participantes (uno por línea).';
      errorParticipantes.classList.add('show');
      participantesInput.classList.add('error-border');
      hasError = true;
    }

    // Si hay errores, no se hace la redirección
    if (hasError) {
      e.preventDefault();
    }

    // Si todo está correcto, guardar datos en sessionStorage y avanzar a config.html
    if (!hasError) {
      sessionStorage.setItem('tituloSorteo', titulo);
      sessionStorage.setItem('participantes', JSON.stringify(participantes));
      sessionStorage.setItem('participantesTexto', participantesTexto);
      window.location.href = 'config.html';
    }
  });
});

// Función para abrir el selector de archivos
function importarArchivo() {
  document.getElementById('fileInput').click();
}

// Evento que se ejecuta cuando la página termina de cargar
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const participantesTextarea = document.getElementById('participantes');
  const errorParticipantes = document.getElementById('errorParticipantes');

  // Al seleccionar un archivo
  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const contenido = e.target.result;

      // Separar contenido por líneas no vacías
      const lineasBrutas = contenido
        .split(/\r?\n/)
        .filter(linea => linea.trim() !== '');

      // Detectar el separador más común entre: , ; tabulación o espacios dobles
      let separadorDetectado = '\t';
      const muestras = lineasBrutas.slice(0, 3);
      const separadores = [',', ';', '\t', /\s{2,}/];
      const conteos = separadores.map(sep =>
        muestras.reduce((acc, linea) =>
          acc + (typeof sep === 'string' ? linea.split(sep).length : linea.split(sep).length), 0)
      );
      const maxIndex = conteos.indexOf(Math.max(...conteos));
      const separador = separadores[maxIndex];

      // Dividir cada línea con el separador detectado y unificar con tabulaciones
      const lineasFinales = lineasBrutas.map(linea => {
        let columnas = typeof separador === 'string' ? linea.split(separador) : linea.split(separador);
        return columnas.map(col => col.trim()).join('\t');
      });

      participantesTextarea.value = lineasFinales.join('\n');

      // Validar que haya al menos 2 líneas (participantes)
      if (lineasFinales.length < 2) {
        errorParticipantes.textContent = 'El archivo debe contener al menos 2 participantes.';
        errorParticipantes.classList.add('show');
        participantesTextarea.classList.add('error-border');
      } else {
        errorParticipantes.textContent = '';
        errorParticipantes.classList.remove('show');
        participantesTextarea.classList.remove('error-border');
      }
    };

    reader.onerror = function () {
      alert('Ocurrió un error al leer el archivo.');
    };

    reader.readAsText(file);
  });
});

// Función para mostrar el mensaje de "copiado" al usuario
function showCopyMessage(element, message) {
  const msgSpan = element.querySelector(".copy-msg");
  msgSpan.textContent = message;
  msgSpan.style.display = "inline";

  // Oculta el mensaje después de 2 segundos
  setTimeout(() => {
    msgSpan.style.display = "none";
  }, 2000);
}

// Evento para copiar el primer número de teléfono al portapapeles
document.getElementById("numberPhone1").addEventListener("click", () => {
  navigator.clipboard.writeText("809-575-3854");
  showCopyMessage(document.getElementById("numberPhone1"), "¡Número copiado!");
});

// Evento para copiar el segundo número de teléfono
document.getElementById("numberPhone2").addEventListener("click", () => {
  navigator.clipboard.writeText("829-745-2433");
  showCopyMessage(document.getElementById("numberPhone2"), "¡Número copiado!");
});

/**** *
const traducciones = {
  es: {
    // ... contenido en español
  },
  en: {
    // ... contenido en inglés
  },
  pt: {
    // ... contenido en portugués
  }/
};
/ ****/

// Diccionario de traducciones por idioma
const traducciones = {
  es: {
    titulo: "Sorteo por <strong>Nombres al Azar</strong>",
    descripcion: "Escoge un ganador al azar de una <strong>lista de nombres</strong> con nuestra App",
    ayuda: "Ayuda",
    redes: "Redes Sociales",
    labelTitulo: "Título",
    labelParticipantes: "Participantes",
    phTitulo: "Ingresa el título del sorteo",
    importar: "Importar archivo",
    limpiar: "Limpiar todo",
    comenzar: "Comenzar",
    comoFunciona: "¿Cómo funciona la herramienta Sorteo por <strong>Nombres al Azar?</strong>?",
    parrafo1: "Sorteo de Nombres al Azar es una herramienta online y gratuita que te permite <strong>seleccionar ganadores aleatorios</strong> a partir de una lista.",
    parrafo2: 'Ingresa la lista de participantes y presiona "Comenzar". Puedes <strong>elegir múltiples ganadores</strong> fácilmente.',
    parrafo3: "Al finalizar, se genera una <strong>imagen o certificado</strong> con los resultados."
  },
  en: {
    titulo: "Random <strong>Name Draw</strong>",
    descripcion: "Choose a random winner from a <strong>list of names</strong> with our App",
    ayuda: "Help",
    redes: "Social Media",
    labelTitulo: "Title",
    labelParticipantes: "Participants",
    phTitulo: "Enter the draw title",
    importar: "Import file",
    limpiar: "Clear all",
    comenzar: "Start",
    comoFunciona: "How does the <strong>Random Name Draw</strong> tool work?",
    parrafo1: "This tool lets you <strong>randomly pick winners</strong> from a list of names or elements.",
    parrafo2: 'Enter the list of names and click "Start". You can <strong>pick multiple winners</strong> at once.',
    parrafo3: "At the end, a <strong>certificate image or PDF</strong> will show the results."
  },
  pt: {
    titulo: "Sorteio por <strong>Nome Aleatório</strong>",
    descripcion: "Escolha um vencedor aleatório de uma <strong>lista de nomes</strong> com nosso app",
    ayuda: "Ajuda",
    redes: "Redes Sociais",
    labelTitulo: "Título",
    labelParticipantes: "Participantes",
    phTitulo: "Digite o título do sorteio",
    importar: "Importar arquivo",
    limpiar: "Limpar tudo",
    comenzar: "Começar",
    comoFunciona: "Como funciona a ferramenta de <strong>Sorteio por Nome Aleatório</strong>?",
    parrafo1: "Essa ferramenta permite <strong>escolher ganhadores aleatórios</strong> a partir de uma lista.",
    parrafo2: 'Digite os nomes e clique em "Começar". Você pode <strong>escolher vários ganhadores</strong>.',
    parrafo3: "Ao final, será gerado um <strong>certificado</strong> com os resultados."
  }
};

// Función para cambiar el contenido según el idioma
function cambiarIdioma() {
  const idioma = document.getElementById("idioma").value;
  const t = traducciones[idioma];

  if (!t) return;

  // Cambia los textos visibles
  document.querySelector("main h1").innerHTML = t.titulo;
  document.querySelector("main p").innerHTML = t.descripcion;
  document.querySelectorAll(".btn.ingresar")[0].textContent = t.ayuda;
  document.querySelectorAll(".btn.ingresar")[1].textContent = t.redes;
  document.querySelector("label[for='titulo']").textContent = t.labelTitulo;
  document.getElementById("titulo").placeholder = t.phTitulo;
  document.querySelector("label[for='participantes']").textContent = t.labelParticipantes;
  document.getElementById("importarBtn").textContent = t.importar;
  document.getElementById("limpiarBtn").textContent = t.limpiar;
  document.getElementById("comenzarBtn").textContent = t.comenzar;

  // Sección de ayuda
  document.querySelector("#containerHelp h1").innerHTML = t.comoFunciona;
  document.querySelectorAll("#containerHelp p")[0].innerHTML = t.parrafo1;
  document.querySelectorAll("#containerHelp p")[1].innerHTML = t.parrafo2;
  document.querySelectorAll("#containerHelp p")[2].innerHTML = t.parrafo3;

  // Guardar selección en sessionStorage
  sessionStorage.setItem("idioma", idioma);
}

// Al cargar la página, restaurar el idioma elegido anteriormente
document.addEventListener("DOMContentLoaded", () => {
  const idiomaGuardado = sessionStorage.getItem("idioma");
  if (idiomaGuardado) {
    document.getElementById("idioma").value = idiomaGuardado;
    cambiarIdioma(); // aplicar
  }
});


// Evento para cargar datos previos guardados al escribir o importar
document.addEventListener('DOMContentLoaded', () => {
  const tituloInput = document.getElementById('titulo');
  const participantesInput = document.getElementById('participantes');
  const fileInput = document.getElementById('fileInput');

  // Recuperar título y participantes desde sessionStorage
  const tituloGuardado = sessionStorage.getItem('tituloSorteo');
  const participantesGuardado = sessionStorage.getItem('participantesTexto');

  if (tituloGuardado) tituloInput.value = tituloGuardado;
  if (participantesGuardado) participantesInput.value = participantesGuardado;

  // Guardar automáticamente lo que se escribe en los campos
  tituloInput.addEventListener('input', () => {
    sessionStorage.setItem('tituloSorteo', tituloInput.value.trim());
  });

  participantesInput.addEventListener('input', () => {
    sessionStorage.setItem('participantesTexto', participantesInput.value.trim());
  });

  // Guardar contenido del archivo al importar
  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const contenido = e.target.result;
      const lineasBrutas = contenido.split(/\r?\n/).filter(linea => linea.trim() !== '');

      const muestras = lineasBrutas.slice(0, 3);
      const separadores = [',', ';', '\t', /\s{2,}/];
      const conteos = separadores.map(sep =>
        muestras.reduce((acc, linea) =>
          acc + (typeof sep === 'string' ? linea.split(sep).length : linea.split(sep).length), 0)
      );
      const maxIndex = conteos.indexOf(Math.max(...conteos));
      const separador = separadores[maxIndex];

      const lineasFinales = lineasBrutas.map(linea => {
        let columnas = typeof separador === 'string' ? linea.split(separador) : linea.split(separador);
        return columnas.map(col => col.trim()).join('\t');
      });

      const participantesTexto = lineasFinales.join('\n');
      participantesInput.value = participantesTexto;
      sessionStorage.setItem('participantesTexto', participantesTexto);
    };

    reader.readAsText(file);
  });
});


// Activar/desactivar modo oscuro
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  const body = document.body;
  const logo = document.getElementById('logoPrincipal');

  // Función para aplicar el modo oscuro o claro
  function aplicarModoOscuro(activar) {
    if (activar) {
      body.classList.add('oscuro');
      logo.src = 'Media/Logo-blanco.webp'; // Logo blanco para fondo oscuro
      toggle.textContent = '☀️';
    } else {
      body.classList.remove('oscuro');
      logo.src = 'Media/Log-super-plaza-venezuela_2.webp'; // Logo original
      toggle.textContent = '🌙';
    }
  }

  // Cargar el modo que se usó anteriormente
  const modoGuardado = localStorage.getItem('modo');
  aplicarModoOscuro(modoGuardado === 'oscuro');

  // Cambiar modo al hacer clic
  toggle.addEventListener('click', () => {
    const activarOscuro = !body.classList.contains('oscuro');
    aplicarModoOscuro(activarOscuro);
    localStorage.setItem('modo', activarOscuro ? 'oscuro' : 'claro');
  });
});
