// Función para limpiar el área de texto de participantes
function limpiarParticipantes() {
  document.getElementById("titulo").value = "";
  document.getElementById("participantes").value = "";
  document.getElementById("mensajeCantidad").style.display = "none";
  document.getElementById("mensajeCantidad").textContent = "";
  // Limpiar también el almacenamiento
  sessionStorage.removeItem('participantesTexto');
  sessionStorage.removeItem('participantes');
  sessionStorage.removeItem('titulo');
}

// Función para mostrar lista de participantes (mejorada)
function mostrarListaParticipantes(texto) {
  const listaDiv = document.getElementById('listaParticipantes');
  const totalParticipantesSpan = document.getElementById('totalParticipantes');

  if (!listaDiv) return;

  const lineas = texto.split('\n').filter(linea => linea.trim() !== '');

  // Actualizar contador total
  if (totalParticipantesSpan) {
    totalParticipantesSpan.textContent = `Total: ${lineas.length.toLocaleString()}`;
  }

  if (lineas.length === 0) {
    listaDiv.innerHTML = '<div class="no-participantes"><em>No hay participantes para mostrar</em></div>';
    return;
  }

  // Mostrar solo los primeros 200 para mejor rendimiento
  const participantesParaMostrar = lineas.slice(0, 5000000);
  let listaHTML = participantesParaMostrar.map((linea, i) => {
    const [codigo, nombre] = linea.split(',');
    return `
    <div class="participante-item">
      <span class="participante-numero">${i + 1}.</span>
      <span class="participante-codigo">${codigo?.trim() || ''}</span>
      <span class="participante-nombre">${nombre?.trim() || ''}</span>
    </div>`;
  }).join('');


  listaDiv.innerHTML = listaHTML;
}

// Función comenzarSorteo mejorada
function comenzarSorteo() {
  const tituloInput = document.getElementById("titulo");
  const participantesInput = document.getElementById("participantes");
  const errorTitulo = document.getElementById("errorTitulo");
  const errorParticipantes = document.getElementById("errorParticipantes");
  const mensajeCantidad = document.getElementById("mensajeCantidad");
  const progressDiv = document.getElementById("progress");

  const titulo = tituloInput.value.trim();
  const participantesTexto = participantesInput.value.trim();

  // Validaciones
  errorTitulo.textContent = "";
  errorParticipantes.textContent = "";
  mensajeCantidad.style.display = "none";

  if (!titulo) {
    errorTitulo.textContent = "Por favor, ingresa un título para el sorteo.";
    return;
  }

  if (!participantesTexto) {
    errorParticipantes.textContent = "Debes ingresar al menos un participante.";
    return;
  }

  const participantes = participantesTexto
    .split("\n")
    .map((nombre) => nombre.trim())
    .filter((nombre) => nombre !== "");

  if (participantes.length < 2) {
    mensajeCantidad.textContent = "Debes ingresar al menos 2 participantes.";
    mensajeCantidad.style.display = "block";
    return;
  }

  // Mostrar mensaje de transferencia (nuevo)
  progressDiv.style.display = "block";
  progressDiv.innerHTML = 'Transfiriendo participantes a config... Por favor espera.';

  // Simular una pequeña espera para mostrar el mensaje
  setTimeout(() => {
    // Llenar el panel flotante con participantes
    const lista = document.getElementById("listaParticipantes");
    const total = document.getElementById("totalParticipantes");
    mostrarParticipantes(participantes, lista, total);

    document.getElementById("tituloSorteo").value = titulo;
    document.getElementById("floatConfig").style.display = "flex";
    document.getElementById("overlay").style.display = "block";

    // Ocultar el mensaje de progreso
    progressDiv.style.display = "none";
  }, 500); // puedes ajustar el tiempo si deseas que se vea más
}

// Esta función debe estar ya definida:
let participantesGlobal = []; // Se guarda globalmente
let cantidadMostrada = 100;   // Inicialmente muestra 100

function mostrarParticipantes(participantes, lista, total) {
  participantesGlobal = participantes; // Guardar para usar en "ver más"
  lista.innerHTML = '';

  const mostrarHasta = Math.min(participantes.length, cantidadMostrada);

  for (let i = 0; i < mostrarHasta; i++) {
    const div = document.createElement('div');
    div.textContent = `${i + 1}. ${participantes[i]}`;
    lista.appendChild(div);
  }

  total.textContent = `Total: ${participantes.length}`;

  // Si hay más de 100, muestra botón "Ver más"
  const verMasBtn = document.createElement('button');
  verMasBtn.textContent = 'Ver más';
  verMasBtn.classList.add('btn', 'ver-mas');
  verMasBtn.style.marginTop = '10px';

  verMasBtn.onclick = () => {
    cantidadMostrada += 100;
    mostrarParticipantes(participantesGlobal, lista, total);
  };

  if (participantes.length > cantidadMostrada) {
    lista.appendChild(verMasBtn);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const btnVerMas = document.getElementById("verMasBtn");
  if (btnVerMas) {
    btnVerMas.addEventListener("click", mostrarMasParticipantes);
  }

  // Llama aquí a cargarParticipantes() o mostrarParticipantes(...) según tu flujo
});


function mostrarMasParticipantes() {
  const lista = document.getElementById('listaParticipantes');
  const fin = participantesMostrados + CANTIDAD_POR_CARGA;
  const nuevos = participantesGlobal.slice(participantesMostrados, fin);

  nuevos.forEach(nombre => {
    const div = document.createElement("div");
    div.className = "participante";
    div.textContent = nombre;
    lista.appendChild(div);
  });

  participantesMostrados += nuevos.length;

  // Ocultar el botón si ya se mostraron todos
  if (participantesMostrados >= participantesGlobal.length) {
    document.getElementById('verMasBtn').style.display = 'none';
  }
}



// Función para mezclar participantes
function mezclarParticipantes() {
  const participantesTextarea = document.getElementById('participantes');
  if (!participantesTextarea) return;

  const texto = participantesTextarea.value.trim();
  if (!texto) return;

  const lineas = texto.split('\n').filter(linea => linea.trim() !== '');

  // Algoritmo Fisher-Yates para mezclar
  for (let i = lineas.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lineas[i], lineas[j]] = [lineas[j], lineas[i]];
  }

  const textoMezclado = lineas.join('\n');
  participantesTextarea.value = textoMezclado;

  // Actualizar la lista mostrada
  mostrarListaParticipantes(textoMezclado);

  // Guardar en sessionStorage
  guardarParticipantes(textoMezclado);
}

// Actualizar el DOMContentLoaded para incluir los nuevos eventos
document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('participantes');
  const errorParticipantes = document.getElementById('errorParticipantes');
  const mensajeCantidad = document.getElementById('mensajeCantidad');
  const fileInput = document.getElementById('fileInput');
  const shuffleBtn = document.getElementById('shuffleBtn');

  // Evento para cerrar floatConfig
  document.getElementById('cerrarFloatConfig').addEventListener('click', () => {
    document.getElementById('floatConfig').style.display = 'none';
  });

  // Evento para mezclar participantes
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', mezclarParticipantes);
  }

  // Cargar participantes guardados previamente
  const participantesGuardado = sessionStorage.getItem('participantesTexto');
  if (participantesGuardado) {
    textarea.value = participantesGuardado;
    actualizarCantidad(participantesGuardado);
  }

  // Evento al escribir - actualizar ambas listas
  textarea.addEventListener('input', () => {
    const texto = textarea.value.trim();
    actualizarCantidad(texto);

    // Si el floatConfig está visible, actualizar también esa lista
    const floatConfig = document.getElementById('floatConfig');
    if (floatConfig && floatConfig.style.display === 'block') {
      mostrarListaParticipantes(texto);
    }

    guardarParticipantes(texto);
  });

  // Resto del código existente...
  // (mantén todas las funciones que ya tienes como importarArchivo, etc.)

  // Función auxiliar para guardar participantes
  function guardarParticipantes(texto) {
    const lineas = texto.split('\n').filter(l => l.trim() !== '');

    try {
      sessionStorage.setItem('participantesTexto', texto);
      sessionStorage.setItem('participantes', JSON.stringify(lineas));
    } catch (error) {
      console.warn('Error guardando en sessionStorage:', error);
    }
  }

  // Función para actualizar cantidad
  function actualizarCantidad(texto) {
    const lineas = texto.split('\n').filter(l => l.trim() !== '');
    const cantidad = lineas.length;

    if (cantidad > 0) {
      mensajeCantidad.textContent = `${cantidad.toLocaleString()} participante${cantidad !== 1 ? 's' : ''}`;
      mensajeCantidad.style.display = 'block';
    } else {
      mensajeCantidad.style.display = 'none';
    }
  }

  // Importar archivo
  window.importarArchivo = function () {
    fileInput.click();
  };

  //inportar archivo
  fileInput.addEventListener('change', function () {
    const archivo = this.files[0];
    if (!archivo) return;

    if (archivo.size > 100 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Por favor, usa un archivo menor a 100MB.');
      return;
    }

    const lector = new FileReader();
    lector.onload = function (e) {
      const contenido = e.target.result;
      const lineasBrutas = contenido
        .split(/\r?\n/)
        .filter(linea => linea.trim() !== '');

      if (lineasBrutas.length > 50000) {
        const progressDiv = document.createElement('div');
        progressDiv.innerHTML = 'Procesando archivo grande... Por favor espera.';
        progressDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:20px;border:1px solid #ccc;z-index:9999;';
        document.body.appendChild(progressDiv);

        setTimeout(() => {
          procesarArchivoGrande(lineasBrutas, textarea, errorParticipantes);
          document.body.removeChild(progressDiv);
        }, 100);
      } else {
        procesarArchivoNormal(lineasBrutas, textarea, errorParticipantes);
      }
    };

    lector.onerror = function () {
      console.log('Ocurrió un error al leer el archivo.');
    };

    lector.readAsText(archivo, 'UTF-8'); // ✅ Forzar codificación correcta
  });

  // Función para procesar archivos normales
  function procesarArchivoNormal(lineasBrutas, participantesTextarea, errorParticipantes) {
    const contenidoFinal = lineasBrutas.join('\n');
    participantesTextarea.value = contenidoFinal;

    actualizarCantidad(contenidoFinal);
    guardarParticipantes(contenidoFinal);

    // Si floatConfig está visible, actualizar también
    const floatConfig = document.getElementById('floatConfig');
    if (floatConfig && floatConfig.style.display === 'block') {
      mostrarListaParticipantes(contenidoFinal);
    }

    validarParticipantes(lineasBrutas, errorParticipantes, participantesTextarea);
  }

  // Función para procesar archivos grandes
  function procesarArchivoGrande(lineasBrutas, participantesTextarea, errorParticipantes) {
    const contenidoFinal = lineasBrutas.join('\n');
    participantesTextarea.value = contenidoFinal;

    participantesEnMemoria = lineasBrutas;
    actualizarCantidad(contenidoFinal);

    // Si floatConfig está visible, actualizar también
    const floatConfig = document.getElementById('floatConfig');
    if (floatConfig && floatConfig.style.display === 'block') {
      mostrarListaParticipantes(contenidoFinal);
    }

    try {
      sessionStorage.setItem('participantesTexto', contenidoFinal);
      sessionStorage.setItem('participantes', JSON.stringify(lineasBrutas));
    } catch (error) {
      console.warn('Error guardando archivo grande:', error);
      sessionStorage.setItem('participantesGrandes', 'true');
      window.participantesEnMemoria = lineasBrutas;
    }

    validarParticipantes(lineasBrutas, errorParticipantes, participantesTextarea);
  }

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

  // Limpiar participantes
  window.limpiarParticipantes = function () {
    textarea.value = '';
    mensajeCantidad.style.display = 'none';
    mensajeCantidad.textContent = '';
    sessionStorage.removeItem('participantesTexto');
    sessionStorage.removeItem('participantes');

    const listaDiv = document.getElementById('listaParticipantes');
    const totalParticipantesSpan = document.getElementById('totalParticipantes');

    if (listaDiv) {
      listaDiv.innerHTML = '<div class="no-participantes"><em>No hay participantes para mostrar</em></div>';
    }

    if (totalParticipantesSpan) {
      totalParticipantesSpan.textContent = 'Total: 0';
    }
  };

  // Resto de tu código existente (traducciones, modo oscuro, etc.)
  // ...
}); istaDiv.innerHTML = listaHTML;

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('participantes');
  const errorParticipantes = document.getElementById('errorParticipantes');
  const mensajeCantidad = document.getElementById('mensajeCantidad');
  const fileInput = document.getElementById('fileInput');
  const comenzarBtn = document.getElementById('comenzarBtn');

  let participantesEnMemoria = null;
  //funcion de la X
  document.getElementById('cerrarFloatConfig').addEventListener('click', () => {
    document.getElementById('floatConfig').style.display = 'none';
  });


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
    mostrarListaParticipantes(texto);
    guardarParticipantes(texto);
  });

  // Importar archivo
  window.importarArchivo = function () {
    fileInput.click();
  };

  fileInput.addEventListener('change', function () {
    const archivo = this.files[0];
    if (!archivo) return;

    if (archivo.size > 100 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Por favor, usa un archivo menor a 100MB.');
      return;
    }

    const lector = new FileReader();
    lector.onload = function (e) {
      const contenido = e.target.result;
      const lineasBrutas = contenido
        .split(/\r?\n/)
        .filter(linea => linea.trim() !== '');

      if (lineasBrutas.length > 50000) {
        const progressDiv = document.createElement('div');
        progressDiv.innerHTML = 'Procesando archivo grande... Por favor espera.';
        progressDiv.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#fff;padding:20px;border:1px solid #ccc;z-index:9999;';
        document.body.appendChild(progressDiv);

        setTimeout(() => {
          procesarArchivoGrande(lineasBrutas, textarea, errorParticipantes);
          document.body.removeChild(progressDiv);
        }, 100);
      } else {
        procesarArchivoNormal(lineasBrutas, textarea, errorParticipantes);
      }
    };

    lector.onerror = function () {
      console.log('Ocurrió un error al leer el archivo.');
    };

    lector.readAsText(archivo, 'UTF-8'); // ✅ <-- AQUI ES LA CLAVE
  });


  // Limpiar participantes - función global redefinida aquí también
  window.limpiarParticipantes = function () {
    textarea.value = '';
    mensajeCantidad.style.display = 'none';
    mensajeCantidad.textContent = '';
    sessionStorage.removeItem('participantesTexto');
    sessionStorage.removeItem('participantes');

    // Limpiar también la lista si existe
    const listaDiv = document.getElementById('listaParticipantes');
    if (listaDiv) {
      listaDiv.innerHTML = '';
    }
  };

  // Funciones auxiliares
  function guardarParticipantes(texto) {
    const lineas = texto.split('\n').filter(l => l.trim() !== '');

    // Guarda todos los participantes originales (sin truncarlos)
    try {
      localStorage.setItem("todosParticipantes", JSON.stringify(participantes));
      console.log("Participantes completos guardados:", participantes.length);
    } catch (e) {
      console.error("Error al guardar todos los participantes:", e);
    }

  }

  // Función para procesar archivos normales
  function procesarArchivoNormal(lineasBrutas, participantesTextarea, errorParticipantes) {
    const contenidoFinal = lineasBrutas.join('\n');
    participantesTextarea.value = contenidoFinal;

    // Actualizar cantidad después de procesar
    actualizarCantidad(contenidoFinal);
    mostrarListaParticipantes(contenidoFinal);
    guardarParticipantes(contenidoFinal);

    validarParticipantes(lineasBrutas, errorParticipantes, participantesTextarea);
  }

  // Función para procesar archivos grandes
  function procesarArchivoGrande(lineasBrutas, participantesTextarea, errorParticipantes) {
    const contenidoFinal = lineasBrutas.join('\n');
    participantesTextarea.value = contenidoFinal;

    // Guardar todas las líneas en memoria
    participantesEnMemoria = lineasBrutas;

    // Actualizar cantidad con el total real
    actualizarCantidad(contenidoFinal);
    mostrarListaParticipantes(contenidoFinal);

    // Guardar en sessionStorage
    try {
      sessionStorage.setItem('participantesTexto', contenidoFinal);
      sessionStorage.setItem('participantes', JSON.stringify(lineasBrutas));
      console.log(`Guardando ${lineasBrutas.length} participantes grandes en sessionStorage`);
    } catch (error) {
      console.warn('Error guardando archivo grande:', error);
      // Fallback a memoria
      sessionStorage.setItem('participantesGrandes', 'true');
      window.participantesEnMemoria = lineasBrutas;
    }

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

  // Función para obtener participantes (desde memoria o storage)
  function obtenerParticipantes() {
    const participantesJSON = localStorage.getItem('participantes');
    if (!participantesJSON) return [];
    try {
      const participantes = JSON.parse(participantesJSON);
      return Array.isArray(participantes) ? participantes : [];
    } catch (error) {
      console.error('Error al obtener participantes:', error);
      return [];
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
  window.cambiarIdioma = function () {
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
  };

  // Al cargar la página, restaurar el idioma elegido anteriormente
  const idiomaGuardado = sessionStorage.getItem("idioma");
  if (idiomaGuardado) {
    document.getElementById("idioma").value = idiomaGuardado;
    cambiarIdioma();
  }

  // Recuperar título desde sessionStorage
  const tituloGuardado = sessionStorage.getItem('tituloSorteo');
  if (tituloGuardado) {
    document.getElementById('titulo').value = tituloGuardado;
  }

  // Guardar automáticamente el título
  document.getElementById('titulo').addEventListener('input', (e) => {
    try {
      sessionStorage.setItem('tituloSorteo', e.target.value.trim());
    } catch (error) {
      // Si falla, no pasa nada
    }
  });

  // Activar/desactivar modo oscuro
  const toggle = document.getElementById('darkModeToggle');
  const body = document.body;
  const logo = document.getElementById('logoPrincipal');

  if (toggle && logo) {
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
  }
});