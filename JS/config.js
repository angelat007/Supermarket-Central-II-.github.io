// Sistema de premios mejorado
let premiosConfirmados = [];

// Función para actualizar los inputs de premios según el número de ganadores
function actualizarInputsPremios() {
    const numGanadores = parseInt(document.getElementById('numGanadores').value) || 1;
    const container = document.getElementById('inputsPremios');

    container.innerHTML = '';

    for (let i = 0; i < numGanadores; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'premioInput';
        input.placeholder = `Premio para el ${i + 1}º ganador`;
        input.id = `premio${i + 1}`;

        // Si ya existe un premio guardado, lo mostramos
        if (premiosConfirmados[i]) {
            input.value = premiosConfirmados[i];
        }

        container.appendChild(input);
    }
}

// Función para mostrar el modal de premios
function mostrarModalPremios() {
    actualizarInputsPremios();
    const modal = document.getElementById('IrVentanaFlotante');
    modal.style.display = 'flex';
    document.body.classList.add('modal-abierto');
}

// Función para cerrar el modal de premios
function cerrarModalPremios() {
    const modal = document.getElementById('IrVentanaFlotante');
    modal.style.display = 'none';
    document.body.classList.remove('modal-abierto');
}

// Función para confirmar los premios
function confirmarPremios() {
    // Guardar los premios definidos
    const numGanadores = parseInt(document.getElementById('numGanadores').value) || 1;
    const nuevosPremios = [];
    for (let i = 0; i < numGanadores; i++) {
        const input = document.getElementById(`premio${i + 1}`);
        const valor = input ? input.value.trim() : '';
        nuevosPremios.push(valor || `Premio ${i + 1}`);
    }
    premiosConfirmados = [...nuevosPremios];
    mostrarPremiosEnLista();

    // Guardar en localStorage
    try {
        localStorage.setItem('premios', JSON.stringify(premiosConfirmados));
    } catch (error) {
        console.error('Error al guardar premios:', error);
    }

    // Obtener participantes (ejemplo: desde textarea de index.html)
    // Ajusta esto según cómo tengas almacenados los participantes
    const participantesTexto = document.getElementById('participantes').value.trim();
    const participantes = participantesTexto ? participantesTexto.split('\n') : [];

    // Actualizar la cantidad total de participantes en el floatConfig
    const totalParticipantesElem = document.querySelector('#floatConfig #totalParticipantes');
    if (totalParticipantesElem) {
        totalParticipantesElem.textContent = `Total: ${participantes.length}`;
    }

    // Cerrar el modal de premios
    cerrarModalPremios();
}

// Función para mostrar los premios en la lista visual
function mostrarPremiosEnLista() {
    const lista = document.getElementById('premiosConfirmados');

    if (!lista) {
        console.error('No se encontró el elemento premiosConfirmados');
        return;
    }

    // Limpiar la lista actual
    lista.innerHTML = '';

    if (premiosConfirmados.length > 0) {
        // Mostrar la lista
        lista.style.display = 'block';

        premiosConfirmados.forEach((premio, index) => {
            const li = document.createElement('li');
            li.textContent = `${index + 1}º: ${premio}`;
            li.title = premio; // Tooltip para premios largos
            lista.appendChild(li);
        });
    } else {
        // Ocultar la lista si no hay premios
        lista.style.display = 'none';
    }
}

// Función para cargar premios desde localStorage
function cargarPremiosGuardados() {
    try {
        const premiosGuardados = localStorage.getItem('premios');
        if (premiosGuardados) {
            premiosConfirmados = JSON.parse(premiosGuardados);
            mostrarPremiosEnLista();
        }
    } catch (error) {
        console.error('Error al cargar premios:', error);
        premiosConfirmados = [];
    }
}

// Función que se ejecuta cuando cambia el número de ganadores
function onNumGanadoresChange() {
    const numGanadores = parseInt(document.getElementById('numGanadores').value) || 1;

    // Si hay menos ganadores que premios, recortar la lista
    if (premiosConfirmados.length > numGanadores) {
        premiosConfirmados = premiosConfirmados.slice(0, numGanadores);
        mostrarPremiosEnLista();

        // Actualizar localStorage
        try {
            localStorage.setItem('premios', JSON.stringify(premiosConfirmados));
        } catch (error) {
            console.error('Error al actualizar premios:', error);
        }
    }
}

// Función para incrementar/decrementar valores numéricos
function changeValue(inputId, increment) {
    const input = document.getElementById(inputId);
    if (!input) return;

    let currentValue = parseInt(input.value) || 0;
    const minValue = parseInt(input.min) || 0;

    currentValue += increment;

    if (currentValue < minValue) {
        currentValue = minValue;
    }

    input.value = currentValue;

    // Si es el número de ganadores, actualizar los premios
    if (inputId === 'numGanadores') {
        onNumGanadoresChange();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Cargar premios guardados al iniciar
    cargarPremiosGuardados();

    // Botón para abrir modal de premios
    const btnPremios = document.querySelector('.premios');
    if (btnPremios) {
        btnPremios.addEventListener('click', function (e) {
            e.preventDefault();
            mostrarModalPremios();
        });
    }

    // Botón confirmar en el modal
    const btnConfirmar = document.getElementById('btnConfirmar');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', confirmarPremios);
    }

    // Botón cancelar en el modal
    const btnCancelar = document.getElementById('btnCancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', cerrarModalPremios);
    }

    // Cerrar modal al hacer clic fuera
    const modal = document.getElementById('IrVentanaFlotante');
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                cerrarModalPremios();
            }
        });
    }

    // Listener para cambios en número de ganadores
    const numGanadores = document.getElementById('numGanadores');
    if (numGanadores) {
        numGanadores.addEventListener('change', onNumGanadoresChange);
        numGanadores.addEventListener('input', onNumGanadoresChange);
    }
});

// Función para obtener los premios (para usar en otras partes del código)
function obtenerPremios() {
    return premiosConfirmados.slice(); // Retorna una copia
}

// Función para limpiar todos los premios
function limpiarPremios() {
    premiosConfirmados = [];
    mostrarPremiosEnLista();
    try {
        localStorage.removeItem('premios');
    } catch (error) {
        console.error('Error al limpiar premios:', error);
    }
}

function guardarOpciones() {
    // Obtener datos desde inputs
    const titulo = document.getElementById("tituloSorteo").value.trim();
    const ganadores = parseInt(document.getElementById("numGanadores").value) || 1;
    const suplentes = parseInt(document.getElementById("numSuplentes").value) || 0;
    const duracion = parseInt(document.getElementById("duracionAnimacion").value) || 5;
    const animacionSeleccionada = document.getElementById("animacionTipo").value;

    // Validar que haya participantes en el textarea principal (fuente de verdad)
    const participantesTexto = document.getElementById('participantes').value.trim();
    if (!participantesTexto) {
        alert('No hay participantes para el sorteo.');
        return;
    }
    const participantes = participantesTexto.split('\n').filter(linea => linea.trim() !== '');

    // Actualizar total participantes en la ventana flotante correspondiente
    let floatId = '';
    if (animacionSeleccionada === 'giratorios') {
        floatId = 'floatGiratorio';
    } else if (animacionSeleccionada === 'regresiva') {
        floatId = 'floatRegresiva';
    } else {
        alert('Animación no válida');
        return;
    }

    // Mostrar solo la ventana flotante seleccionada y overlay
    mostrarVentanaFlotante(animacionSeleccionada, participantes);

    // Actualizar el texto de total participantes en la ventana flotante
    const floatElem = document.getElementById(floatId);
    if (floatElem) {
        const totalSpan = floatElem.querySelector('#totalParticipantes');
        if (totalSpan) {
            totalSpan.textContent = `Total: ${participantes.length}`;
        }
    }

    // Opcional: puedes guardar otras opciones en localStorage o variables si quieres

    // Cerrar la ventana de configuración flotante para mejor UX
    const floatConfig = document.getElementById('floatConfig');
    if (floatConfig) {
        floatConfig.style.display = 'none';
    }
}

//redirigir al sorteo
function btnComenzarGiratorio() {
    const listaDiv = document.querySelector('#floatGiratorio #listaParticipantes');
    const participantesRaw = [];

    if (listaDiv) {
        listaDiv.querySelectorAll('div').forEach(div => {
            const nombre = div.textContent.trim();
            if (nombre) participantesRaw.push(nombre);
        });
    }

    // Barajar aleatoriamente y tomar 3k
    const participantesAleatorios = shuffleArray(participantesRaw).slice(0, 3000);

    try {
        localStorage.setItem('participantes', JSON.stringify(participantesAleatorios));
    } catch (e) {
        alert('❌ No se pudieron guardar los participantes aleatorios. Error de almacenamiento.');
        console.error(e);
        return;
    }

    // Guardar configuración básica
    const opciones = {
        ganadores: parseInt(document.getElementById("numGanadores").value) || 1
    };
    localStorage.setItem("opciones", JSON.stringify(opciones));

    // Redirigir
    window.location.href = 'nombresAleatorios/opciones/giratorio.html';
}

// Función para barajar (Fisher-Yates)
function shuffleArray(array) {
    const copia = [...array];
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function btnComenzarRegresiva() {
    const listaDiv = document.querySelector('#floatRegresiva #listaParticipantes');
    const participantesRaw = [];

    if (listaDiv) {
        listaDiv.querySelectorAll('div').forEach(div => {
            const nombre = div.textContent.trim();
            if (nombre) participantesRaw.push(nombre);
        });
    }

    // Barajar aleatoriamente y tomar hasta 10k
    const participantesAleatorios = shuffleArray(participantesRaw).slice(0, 10000);

    try {
        // Guardar en sessionStorage (lo que usa countdown.html)
        sessionStorage.setItem('participantesFinal', JSON.stringify(participantesAleatorios));

        const opciones = {
            titulo: document.getElementById('tituloSorteo').value.trim() || "Sorteo",
            ganadores: parseInt(document.getElementById("numGanadores").value) || 1,
            suplentes: parseInt(document.getElementById("numSuplentes").value) || 0,
            duracion: parseInt(document.getElementById("duracionAnimacion").value) || 5
        };
        sessionStorage.setItem('opcionesSorteo', JSON.stringify(opciones));

        const premios = premiosConfirmados.slice(); // ya está en memoria
        sessionStorage.setItem('premios', JSON.stringify(premios));
    } catch (e) {
        alert('❌ No se pudieron guardar los datos del sorteo.');
        console.error(e);
        return;
    }

    // Redirigir a la animación
    window.location.href = 'nombresAleatorios/opciones/countdown.html';
}


//mostrar flotante
function mostrarVentanaFlotante(tipo, participantes = []) {
    const flotantes = ['floatGiratorio', 'floatRegresiva'];
    flotantes.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.style.display = 'none';
    });


    const overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'block';

    //const participantesLimitados = [...participantes]; // Sin límite
    // Limitar a 1000 participantes aleatorios
    const participantesLimitados = shuffleArray(participantes).slice(0, 10000); //con limite

    // Ocultar mensaje de transferencia
    const mensaje = document.getElementById('mensajeTransferencia');
    if (mensaje) mensaje.style.display = 'block';

    if (tipo === 'giratorios') {
        const floatGiratorio = document.getElementById('floatGiratorio');
        floatGiratorio.style.display = 'block';
        const lista = floatGiratorio.querySelector('#listaParticipantes');
        if (lista) {
            cargarParticipantesEnLista(lista, participantesLimitados);
        }
    } else if (tipo === 'regresiva') {
        const floatRegresiva = document.getElementById('floatRegresiva');
        floatRegresiva.style.display = 'block';
        const lista = floatRegresiva.querySelector('#listaParticipantes');
        if (lista) {
            cargarParticipantesEnLista(lista, participantesLimitados);
        }
        sessionStorage.setItem('participantesFinal', JSON.stringify(participantesLimitados));

    } else {
        alert('Animación no válida');
    }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnRegresiva = document.getElementById("btnComenzarRegresiva");
  if (btnRegresiva) {
    btnRegresiva.addEventListener("click", () => {
      const listaDiv = document.querySelector('#floatRegresiva #listaParticipantes');
      const participantesRaw = [];

      if (listaDiv) {
        listaDiv.querySelectorAll('div').forEach(div => {
          const nombre = div.textContent.trim();
          if (nombre) participantesRaw.push(nombre);
        });
      }

      // Barajar y limitar a 10k
      const participantesAleatorios = shuffleArray(participantesRaw).slice(0, 10000);

      const opciones = {
        titulo: document.getElementById('tituloSorteo').value.trim() || "Sorteo",
        ganadores: parseInt(document.getElementById("numGanadores").value) || 1,
        suplentes: parseInt(document.getElementById("numSuplentes").value) || 0,
        duracion: parseInt(document.getElementById("duracionAnimacion").value) || 5
      };

      try {
        sessionStorage.setItem('participantesFinal', JSON.stringify(participantesAleatorios));
        sessionStorage.setItem('opcionesSorteo', JSON.stringify(opciones));
        sessionStorage.setItem('premios', JSON.stringify(premiosConfirmados));
        // Redirige a la animación de cuenta regresiva
      } catch (e) {
        alert('Error al guardar los datos del sorteo.');
        console.error(e);
      }
    });
  }
});

// Barajar
function shuffleArray(array) {
  const copia = [...array];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

//mostrar participantes en float
function cargarParticipantesEnLista(lista, participantes) {
    lista.innerHTML = '';

    const fragment = document.createDocumentFragment();
    participantes.forEach(participante => {
        const div = document.createElement('div');
        div.classList.add('participante-item');

        let [codigo, nombre] = participante.split(',');
        codigo = (codigo || '').trim();
        nombre = (nombre || '').trim();

        // Crear subelementos para formato y estilo
        const spanCodigo = document.createElement('span');
        spanCodigo.className = 'codigo';
        spanCodigo.textContent = codigo;

        const spanNombre = document.createElement('span');
        spanNombre.className = 'nombre';
        spanNombre.textContent = nombre;

        div.appendChild(spanCodigo);
        div.appendChild(document.createTextNode(' ')); // espacio entre columnas
        div.appendChild(spanNombre);

        fragment.appendChild(div);
    });

    lista.appendChild(fragment);

    // Estilos comunes
    lista.style.pointerEvents = 'none';
    lista.style.userSelect = 'none';
    lista.style.overflowY = 'hidden';
    lista.style.height = '10em';
    lista.style.lineHeight = '1.2em';
    lista.style.opacity = '0.4';
}

// Función para cerrar ventana flotante y overlay
function cerrarVentanaFlotante() {
    const flotantes = ['floatGiratorio', 'floatRegresiva'];
    flotantes.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) elem.style.display = 'none';
    });

    const overlay = document.getElementById('overlay');
    if (overlay) overlay.style.display = 'none';
}

// Cerrar ventana flotante si hacen click en overlay
document.getElementById('overlay').addEventListener('click', cerrarVentanaFlotante);