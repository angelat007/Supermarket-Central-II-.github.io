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

  // Al hacer clic en "Confirmar"
  function guardarOpciones() {
    const mensajeError = document.getElementById('mensajeError');
    const titulo = document.getElementById("tituloSorteo").value;
    localStorage.setItem("tituloSorteo", titulo);
    mensajeError.textContent = ''; // Limpiar mensaje previo

    const animacionSeleccionada = document.getElementById('animacionTipo').value;

    const opciones = {
      titulo: document.getElementById('tituloSorteo').value,
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

    sessionStorage.setItem('participantesFinal', JSON.stringify(nombres));
    sessionStorage.setItem('opcionesSorteo', JSON.stringify(opciones));

    if (animacionSeleccionada === 'ruleta') {
      window.location.href = 'nombresAleatorios/nombresGiratorios.html';
    } else if (animacionSeleccionada === 'fortuna') {
      window.location.href = 'nombresAleatorios/viewRuleta.html';
    } else if (animacionSeleccionada === 'cuenta') {
      window.location.href = 'nombresAleatorios/cuentaRegresiva.html';
    } else {
      mensajeError.textContent = 'Error: Debes seleccionar una animación válida.';
    }
  }

  function guardarLogo() {
    const logoInput = document.getElementById('logoInput');
    const file = logoInput.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // Guardar la imagen como base64 en localStorage
        localStorage.setItem('logoSorteo', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // Modificar el evento del input del logo en config.js
  document.getElementById('logoInput').addEventListener('change', function () {
    guardarLogo();
    // Código existente para mostrar preview...
  });

  //funcion de premios
  //boton cancelar
  const modal = document.getElementById("IrVentanaFlotante");
  const cancelarBtn = document.getElementById("btnCancelar");

  cancelarBtn.addEventListener("click", () => {
    modal.style.display = "none";
    // Opcional: limpiar el input
    document.getElementById("username").value = "";
  });

  // Mostrar el modal al hacer clic en "Definir"
  document.querySelector(".premios").addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
  });

  //no scrool en la ventana
  const definirBtn = document.querySelector(".premios");

  definirBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    document.body.classList.add("modal-abierto");
  });

  cancelarBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.classList.remove("modal-abierto");
    document.getElementById("username").value = "";
  });


  //añadir premios
    const confirmarBtn = document.getElementById("btnConfirmar");
    const inputPremio = document.getElementById("prmios");
    const premiosConfirmados = document.getElementById("premiosConfirmados");

    // Mostrar modal
    definirBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.style.display = "flex";
      document.body.classList.add("modal-abierto");
    });

    // Ocultar modal
    cancelarBtn.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.classList.remove("modal-abierto");
      inputPremio.value = "";
    });

    // Confirmar premio
  confirmarBtn.addEventListener("click", () => {
    const premioTexto = inputPremio.value.trim();

    if (premioTexto !== "") {
      const li = document.createElement("li");
      li.textContent = premioTexto;
      premiosConfirmados.appendChild(li);

      // Mostrar la lista si estaba oculta
      premiosConfirmados.style.display = "block";

      // Limpiar input y cerrar modal
      inputPremio.value = "";
      modal.style.display = "none";
      document.body.classList.remove("modal-abierto");
    }
  });


  //limite de ganadores y premios
  