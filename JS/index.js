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

//idiomas
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
      comoFunciona: "¿Cómo funciona la herramienta Sorteo por <strong>Nombres al Azar?</strong>",
      parrafo1: "Sorteo de Nombres al Azar es una herramienta online y gratuita que te permite <strong>seleccionar ganadores aleatorios a partir de una lista de participantes</strong>, nombres, objetos, ciudades o cualquier otro elemento que elijas.",
      parrafo2: 'Ingresa la lista de nombres/participantes y presiona el boton "Comenzar". Podrás <strong>aplicar filtros y seleccionar la cantidad de ganadores</strong> que desees. ¡Incluso puedes escoger múltiples ganadores en un solo sorteo!',
      parrafo3: "Al finalizar, se generará una <strong>imagen o documento con un certificado</strong> que muestra los resultados del sorteo."
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
      parrafo1: "Random Name Draw is a free online tool that lets you <strong>select random winners from a list of participants</strong>, names, items, cities or anything you choose.",
      parrafo2: 'Enter the list of names/participants and press the "Start" button. You can <strong>apply filters and select the number of winners</strong> you want. You can even select multiple winners in a single draw!',
      parrafo3: "At the end, an <strong>image or document certificate</strong> showing the draw results will be generated."
    },
    pt: {
      titulo: "Sorteio por <strong>Nome Aleatório</strong>",
      descripcion: "Escolha um vencedor aleatório de uma <strong>lista de nomes</strong> com nosso aplicativo",
      ayuda: "Ajuda",
      redes: "Redes Sociais",
      labelTitulo: "Título",
      labelParticipantes: "Participantes",
      phTitulo: "Insira o título do sorteio",
      importar: "Importar arquivo",
      limpiar: "Limpar tudo",
      comenzar: "Começar",
      comoFunciona: "Como funciona a ferramenta de <strong>Sorteio por Nome Aleatório?</strong>",
      parrafo1: "Sorteio por Nome Aleatório é uma ferramenta online e gratuita que permite <strong>selecionar vencedores aleatórios a partir de uma lista de participantes</strong>, nomes, itens, cidades ou qualquer outro elemento.",
      parrafo2: 'Insira a lista de nomes/participantes e pressione o botão "Começar". Você pode <strong>aplicar filtros e escolher o número de vencedores</strong> desejado. Pode até escolher vários vencedores em um único sorteio!',
      parrafo3: "Ao final, será gerado um <strong>certificado em imagem ou documento</strong> com os resultados do sorteio."
    }
  };

  function cambiarIdioma() {
  const idioma = document.getElementById('idioma').value;
  const t = traducciones[idioma];

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
  document.querySelector("#containerHelp h1").innerHTML = t.comoFunciona;
  document.querySelectorAll("#containerHelp p")[0].innerHTML = t.parrafo1;
  document.querySelectorAll("#containerHelp p")[1].innerHTML = t.parrafo2;
  document.querySelectorAll("#containerHelp p")[2].innerHTML = t.parrafo3;
};

document.addEventListener('DOMContentLoaded', () => {
  const tituloInput = document.getElementById('titulo');
  const participantesInput = document.getElementById('participantes');
  const fileInput = document.getElementById('fileInput');

  // Restaurar datos guardados al cargar
  const tituloGuardado = sessionStorage.getItem('tituloSorteo');
  const participantesGuardado = sessionStorage.getItem('participantesTexto');

  if (tituloGuardado) tituloInput.value = tituloGuardado;
  if (participantesGuardado) participantesInput.value = participantesGuardado;

  // Guardar cambios al escribir
  tituloInput.addEventListener('input', () => {
    sessionStorage.setItem('tituloSorteo', tituloInput.value.trim());
  });

  participantesInput.addEventListener('input', () => {
    sessionStorage.setItem('participantesTexto', participantesInput.value.trim());
  });

  // Guardar también al cargar desde archivo
  fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const contenido = e.target.result;
      const lineasBrutas = contenido.split(/\r?\n/).filter(linea => linea.trim() !== '');

      // Detectar separador
      const muestras = lineasBrutas.slice(0, 3);
      const separadores = [',', ';', '\t', /\s{2,}/];
      const conteos = separadores.map(sep => muestras.reduce((acc, linea) => {
        return acc + (typeof sep === 'string' ? linea.split(sep).length : linea.split(sep).length);
      }, 0));
      const maxIndex = conteos.indexOf(Math.max(...conteos));
      const separador = separadores[maxIndex];

      // Procesar líneas
      const lineasFinales = lineasBrutas.map(linea => {
        let columnas = typeof separador === 'string' ? linea.split(separador) : linea.split(separador);
        return columnas.map(col => col.trim()).join('\t');
      });

      const participantesTexto = lineasFinales.join('\n');
      participantesInput.value = participantesTexto;

      // Guardar en sessionStorage
      sessionStorage.setItem('participantesTexto', participantesTexto);
    };

    reader.readAsText(file);
  });
});

//tema oscuro
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  const body = document.body;
  const logo = document.getElementById('logoPrincipal');

  function aplicarModoOscuro(activar) {
    if (activar) {
      body.classList.add('oscuro');
      logo.src = 'Media/Logo-blanco.webp'; // logo oscuro
      toggle.textContent = '☀️';
    } else {
      body.classList.remove('oscuro');
      logo.src = 'Media/Log-super-plaza-venezuela_2.webp'; // logo claro
      toggle.textContent = '🌙';
    }
  }

  // Cargar modo anterior
  const modoGuardado = localStorage.getItem('modo');
  aplicarModoOscuro(modoGuardado === 'oscuro');

  // Cambiar al hacer clic
  toggle.addEventListener('click', () => {
    const activarOscuro = !body.classList.contains('oscuro');
    aplicarModoOscuro(activarOscuro);
    localStorage.setItem('modo', activarOscuro ? 'oscuro' : 'claro');
  });
});