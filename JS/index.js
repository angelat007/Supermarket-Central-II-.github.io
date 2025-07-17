// Función para limpiar el área de texto de participantes
function limpiarParticipantes() {
  document.getElementById("participantes").value = "";
  document.getElementById("mensajeCantidad").style.display = "none";
  document.getElementById("mensajeCantidad").textContent = "";
  // Limpiar también el almacenamiento
  sessionStorage.removeItem('participantesTexto');
  sessionStorage.removeItem('participantes');
}

// Función comenzarSorteo movida fuera del DOMContentLoaded para que sea accesible globalmente
function comenzarSorteo() {
  const participantesTextarea = document.getElementById('participantes');
  const participantesTexto = participantesTextarea.value.trim();

  if (!participantesTexto) {
    alert('Por favor ingresa al menos un participante.');
    return;
  }

  // Guardar participantes en sessionStorage en formato array
  const participantesArray = participantesTexto.split('\n')
    .map(p => p.trim())
    .filter(p => p !== '');

  if (participantesArray.length === 0) {
    alert('No hay participantes válidos.');
    return;
  }

  try {
    // Limpiar storage anterior para hacer espacio
    sessionStorage.removeItem('participantesTexto');
    sessionStorage.removeItem('participantes');
    sessionStorage.removeItem('tituloSorteo');

    // Guardar participantes en formato array
    sessionStorage.setItem('participantes', JSON.stringify(participantesArray));

    // Guardar título si existe
    const titulo = document.getElementById('titulo').value.trim();
    if (titulo) {
      sessionStorage.setItem('tituloSorteo', titulo);
    }

    // Si la lista es muy grande, usar memoria en lugar de sessionStorage
    if (participantesArray.length > 1000) {
      sessionStorage.setItem('participantesGrandes', 'true');
      // Guardar en variable global para archivos grandes
      window.participantesEnMemoria = participantesArray;
    } else {
      sessionStorage.setItem('participantesTexto', participantesTexto);
    }

  } catch (error) {
    // Si falla por espacio, usar solo memoria
    console.warn('SessionStorage lleno, usando memoria:', error);
    sessionStorage.setItem('participantesGrandes', 'true');
    window.participantesEnMemoria = participantesArray;

    // Guardar solo lo esencial
    window.participantesGlobal = participantesArray; // guardado global en RAM
  }

  // Redirige a config.html
  window.location.href = 'config.html';
}

// Función para actualizar y mostrar la cantidad de participantes
function actualizarCantidad(texto) {
  function mostrarListaParticipantes(texto) {
    const listaDiv = document.getElementById('listaParticipantes');
    const lineas = texto.split('\n').filter(linea => linea.trim() !== '');

    if (lineas.length === 0) {
      listaDiv.innerHTML = '<em>No hay participantes para mostrar</em>';
      return;
    }

    // Crear una lista HTML
    const listaHTML = lineas.map((nombre, i) => `<div>${i + 1}. ${nombre}</div>`).join('');
    listaDiv.innerHTML = listaHTML;
  }

  textarea.addEventListener('input', () => {
    const texto = textarea.value.trim();
    actualizarCantidad(texto);
    mostrarListaParticipantes(texto); // 👈 Agregado aquí
    guardarParticipantes(texto);
  });


  const lineas = texto.split('\n').filter(linea => linea.trim() !== '');
  const mensajeCantidad = document.getElementById('mensajeCantidad');

  if (lineas.length > 0) {
    mensajeCantidad.textContent = `Participantes ingresados: ${lineas.length.toLocaleString()}`;
    mensajeCantidad.style.display = 'block';
  } else {
    mensajeCantidad.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('participantes');
  const errorParticipantes = document.getElementById('errorParticipantes');
  const mensajeCantidad = document.getElementById('mensajeCantidad');
  const fileInput = document.getElementById('fileInput');
  const comenzarBtn = document.getElementById('comenzarBtn');

  let participantesEnMemoria = null;

  // Cargar participantes guardados previamente
  const participantesGuardado = sessionStorage.getItem('participantesTexto');
  if (participantesGuardado) {
    textarea.value = participantesGuardado;
    actualizarCantidad(participantesGuardado);
  }

  // Evento al escribir
  textarea.addEventListener('input', () => {
    const texto = textarea.value.trim();
    actualizarCantidad(texto);
    guardarParticipantes(texto);
  });

  // Importar archivo
  window.importarArchivo = function () {
    fileInput.click();
  };

  fileInput.addEventListener('change', function () {
    const archivo = this.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = function (e) {
      const contenido = e.target.result;
      textarea.value = contenido;
      actualizarCantidad(contenido); // Mostrar cantidad después de importar
      guardarParticipantes(contenido);
    };
    lector.readAsText(archivo);
  });

  // Limpiar participantes - función global redefinida aquí también
  window.limpiarParticipantes = function () {
    textarea.value = '';
    mensajeCantidad.style.display = 'none';
    mensajeCantidad.textContent = '';
    sessionStorage.removeItem('participantesTexto');
    sessionStorage.removeItem('participantes');
  };

  // Funciones auxiliares
  function guardarParticipantes(texto) {
    const lineas = texto.split('\n').filter(l => l.trim() !== '');

    if (lineas.length <= 1000) {
      try {
        sessionStorage.setItem('participantesTexto', texto);
      } catch (error) {
        console.warn('Error guardando en sessionStorage:', error);
        // Si falla por espacio, limpiar otros datos no esenciales
        sessionStorage.removeItem('idioma');
        sessionStorage.removeItem('modo');
        try {
          sessionStorage.setItem('participantesTexto', texto);
        } catch (e) {
          // Si aún falla, no guardar automáticamente
          console.warn('SessionStorage lleno, no se guardará automáticamente');
        }
      }
    }
  }
});

// Función para obtener participantes (desde memoria o storage)
function obtenerParticipantes() {
  if (sessionStorage.getItem('participantesGrandes') === 'true') {
    return participantesEnMemoria;
  } else {
    const participantesGuardados = sessionStorage.getItem('participantes');
    return participantesGuardados ? JSON.parse(participantesGuardados) : [];
  }
}

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

    // Verificar el tamaño del archivo
    if (file.size > 20 * 1024 * 1024) { // 20MB corregido
      alert('El archivo es demasiado grande. Por favor, usa un archivo menor a 20MB.');
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const contenido = e.target.result;

      // Separar contenido por líneas no vacías
      const lineasBrutas = contenido
        .split(/\r?\n/)
        .filter(linea => linea.trim() !== '');

      // Limitar a 500,000 líneas para evitar problemas de memoria
      if (lineasBrutas.length > 500000) {
        alert('El archivo tiene demasiadas líneas. Máximo permitido: 500,000 líneas.');
        return;
      }

      // Mostrar progreso para archivos grandes
      if (lineasBrutas.length > 50000) {
        const progressDiv = document.createElement('div');
        progressDiv.innerHTML = 'Procesando archivo grande... Por favor espera.';
        progressDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:20px;border:1px solid #ccc;z-index:9999;';
        document.body.appendChild(progressDiv);

        // Procesar en chunks para no bloquear la UI
        setTimeout(() => {
          procesarArchivoGrande(lineasBrutas, participantesTextarea, errorParticipantes);
          document.body.removeChild(progressDiv);
        }, 100);
      } else {
        procesarArchivoNormal(lineasBrutas, participantesTextarea, errorParticipantes);
      }
    };

    reader.onerror = function () {
      alert('Ocurrió un error al leer el archivo.');
    };

    reader.readAsText(file);
  });
});

// Función para procesar archivos normales
function procesarArchivoNormal(lineasBrutas, participantesTextarea, errorParticipantes) {
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

  // Actualizar cantidad después de procesar
  actualizarCantidad(lineasFinales.join('\n'));

  validarParticipantes(lineasFinales, errorParticipantes, participantesTextarea);
}

// Función para procesar archivos grandes
function procesarArchivoGrande(lineasBrutas, participantesTextarea, errorParticipantes) {
  // Para archivos grandes, mostrar solo las primeras 1000 líneas en el textarea
  const muestraLineas = lineasBrutas.slice(0, 1000);

  // Mostrar muestra en el textarea
  participantesTextarea.value = muestraLineas.join('\n') +
    (lineasBrutas.length > 1000 ? '\n... y ' + (lineasBrutas.length - 1000) + ' líneas más' : '');

  // Guardar todas las líneas en memoria
  participantesEnMemoria = lineasBrutas;

  // Actualizar cantidad con el total real
  const mensajeCantidad = document.getElementById('mensajeCantidad');
  mensajeCantidad.textContent = `Participantes cargados: ${lineasBrutas.length.toLocaleString()}`;
  mensajeCantidad.style.display = 'block';

  // Mostrar información adicional del archivo
  const info = document.createElement('div');
  info.innerHTML = `<strong>Archivo procesado:</strong> ${lineasBrutas.length.toLocaleString()} participantes total`;
  info.style.cssText = 'color: #0B6938; margin-top: 10px; font-weight: bold; text-align: center;';

  // Verificar si ya existe un mensaje similar para evitar duplicados
  const existingInfo = participantesTextarea.parentNode.querySelector('.archivo-info');
  if (existingInfo) {
    existingInfo.remove();
  }

  info.classList.add('archivo-info');
  participantesTextarea.parentNode.appendChild(info);

  validarParticipantes(lineasBrutas, errorParticipantes, participantesTextarea);
}

// Función para validar participantes
function validarParticipantes(lineasFinales, errorParticipantes, participantesTextarea) {
  if (lineasFinales.length < 2) {
    errorParticipantes.textContent = 'El archivo debe contener al menos 2 participantes.';
    errorParticipantes.classList.add('show');
    participantesTextarea.classList.add('error-border');
  } else {
    errorParticipantes.textContent = '';
    errorParticipantes.classList.remove('show');
    participantesTextarea.classList.remove('error-border');
  }
}

// Función para mostrar el mensaje de "copiado" al usuario
function showCopyMessage(element, message) {
  const msgSpan = element.querySelector(".copy-msg");
  msgSpan.textContent = message;
  msgSpan.style.display = "inline";

  setTimeout(() => {
    msgSpan.style.display = "none";
  }, 2000);
}

// Eventos para copiar números de teléfono
document.addEventListener('DOMContentLoaded', () => {
  const phone1 = document.getElementById("numberPhone1");
  const phone2 = document.getElementById("numberPhone2");

  if (phone1) {
    phone1.addEventListener("click", () => {
      navigator.clipboard.writeText("809-575-3854");
      showCopyMessage(phone1, "¡Número copiado!");
    });
  }

  if (phone2) {
    phone2.addEventListener("click", () => {
      navigator.clipboard.writeText("829-745-2433");
      showCopyMessage(phone2, "¡Número copiado!");
    });
  }
});

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
  try {
    sessionStorage.setItem("idioma", idioma);
  } catch (e) {
    // Si falla, no pasa nada
  }
}

// Al cargar la página, restaurar el idioma elegido anteriormente
document.addEventListener("DOMContentLoaded", () => {
  const idiomaGuardado = sessionStorage.getItem("idioma");
  if (idiomaGuardado) {
    document.getElementById("idioma").value = idiomaGuardado;
    cambiarIdioma();
  }
});

// Evento para cargar datos previos guardados al escribir o importar
document.addEventListener('DOMContentLoaded', () => {
  const tituloInput = document.getElementById('titulo');
  const participantesInput = document.getElementById('participantes');

  // Recuperar título desde sessionStorage
  const tituloGuardado = sessionStorage.getItem('tituloSorteo');
  if (tituloGuardado) tituloInput.value = tituloGuardado;

  // Solo recuperar participantes si no es un archivo grande
  if (sessionStorage.getItem('participantesGrandes') !== 'true') {
    const participantesGuardado = sessionStorage.getItem('participantesTexto');
    if (participantesGuardado) {
      participantesInput.value = participantesGuardado;
      actualizarCantidad(participantesGuardado); // Mostrar cantidad al cargar
    }
  }

  // Guardar automáticamente el título
  tituloInput.addEventListener('input', () => {
    try {
      sessionStorage.setItem('tituloSorteo', tituloInput.value.trim());
    } catch (e) {
      // Si falla, no pasa nada
    }
  });

  // Para archivos pequeños, guardar automáticamente
  participantesInput.addEventListener('input', () => {
    const texto = participantesInput.value.trim();
    const lineas = texto.split('\n').filter(l => l.trim() !== '');

    if (lineas.length <= 10000) {
      try {
        sessionStorage.setItem('participantesTexto', texto);
      } catch (e) {
        // Si falla por espacio, limpiar otros datos
        sessionStorage.removeItem('participantesTexto');
        sessionStorage.removeItem('participantes');
      }
    }
  });
});

// Activar/desactivar modo oscuro
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  const body = document.body;
  const logo = document.getElementById('logoPrincipal');

  if (!toggle || !logo) return;

  // Función para aplicar el modo oscuro o claro
  function aplicarModoOscuro(activar) {
    if (activar) {
      body.classList.add('oscuro');
      logo.src = 'Media/Logo-blanco.webp';
      toggle.textContent = '☀️';
    } else {
      body.classList.remove('oscuro');
      logo.src = 'Media/Log-super-plaza-venezuela_2.webp';
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

// Función para procesar archivos grandes
function procesarArchivoGrande(lineasBrutas, participantesTextarea, errorParticipantes) {
  // Para archivos grandes, mostrar solo las primeras 1000 líneas en el textarea
  const muestraLineas = lineasBrutas.slice(0, 1000);

  // Guardar todas las líneas en memoria
  participantesEnMemoria = lineasBrutas;

  // Actualizar cantidad con el total real
  const mensajeCantidad = document.getElementById('mensajeCantidad');
  mensajeCantidad.textContent = `Participantes cargados: ${lineasBrutas.length.toLocaleString()}`;
  mensajeCantidad.style.display = 'block';

  // *** CÓDIGO ELIMINADO: Ya no se muestra el mensaje "Archivo procesado" ***
  // El mensaje amarillo de "Archivo procesado: X participantes total" ha sido removido

  validarParticipantes(lineasBrutas, errorParticipantes, participantesTextarea);
}