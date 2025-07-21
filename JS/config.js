// Función separada para mostrar participantes
function mostrarParticipantes(participantes, lista, total) {
  // Limpiar lista antes de llenarla
  lista.innerHTML = '';

  // Mostrar solo los primeros 100 participantes en la UI para rendimiento
  const participantesParaMostrar = participantes.slice(0, 100);
  participantesParaMostrar.forEach((nombre, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${nombre}`;
    li.style.fontFamily = '"Segoe UI", sans-serif';
    li.style.whiteSpace = 'pre-wrap';
    li.style.wordBreak = 'break-word';
    lista.appendChild(li);
  });

  // Si hay más de 100 participantes, mostrar indicador
  if (participantes.length > 100) {
    const li = document.createElement('li');
    li.innerHTML = `<em>... y ${(participantes.length - 100).toLocaleString()} participantes más</em>`;
    li.style.fontStyle = 'italic';
    li.style.color = '#666';
    li.style.fontWeight = 'bold';
    lista.appendChild(li);
  }

  total.textContent = `Total: ${participantes.length.toLocaleString()}`;

  // Guardar en localStorage para uso posterior si no existe
  if (!localStorage.getItem('participantes')) {
    try {
      localStorage.setItem('participantes', JSON.stringify(participantes));
      console.log('Participantes guardados en localStorage para uso posterior');
    } catch (error) {
      console.warn('No se pudo guardar en localStorage (quota exceeded)');
    }
  }
}

// Función optimizada para mezclar participantes
function mezclarParticipantes() {
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

  // Fallback a sessionStorage texto
  if (participantes.length === 0) {
    const participantesTexto = sessionStorage.getItem('participantesTexto');
    if (participantesTexto) {
      participantes = participantesTexto.split('\n').map(p => p.trim()).filter(p => p !== '');
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

  // Fallback a localStorage texto
  if (participantes.length === 0) {
    const participantesTexto = localStorage.getItem('participantesTexto');
    if (participantesTexto) {
      participantes = participantesTexto.split('\n').map(p => p.trim()).filter(p => p !== '');
    }
  }

  if (participantes.length === 0) {
    console.log('No hay participantes para mezclar');
    return;
  }

  // Mezclar array
  const participantesMezclados = mezclarArray([...participantes]);

  // Actualizar UI
  const listaParticipantes = document.getElementById('listaParticipantes');
  const totalParticipantes = document.getElementById('totalParticipantes');

  if (!listaParticipantes || !totalParticipantes) {
    console.error('No se encontraron los elementos para mostrar participantes mezclados');
    return;
  }

  mostrarParticipantes(participantesMezclados, listaParticipantes, totalParticipantes);

  // Guardar la lista mezclada
  try {
    sessionStorage.setItem('participantes', JSON.stringify(participantesMezclados));
    localStorage.setItem('participantes', JSON.stringify(participantesMezclados));
    console.log('Lista mezclada guardada exitosamente');
  } catch (error) {
    console.warn('No se pudo guardar la lista mezclada:', error);
  }
}

// Función mejorada para guardar opciones con validación de premios
function guardarOpciones() {
  const mensajeError = document.getElementById('mensajeError');
  const tituloInput = document.getElementById("tituloSorteo");

  // Verificar que los elementos existen
  if (!tituloInput) {
    console.error('No se encontró el elemento tituloSorteo');
    return;
  }

  const titulo = tituloInput.value;
  localStorage.setItem("tituloSorteo", titulo);

  if (mensajeError) {
    mensajeError.textContent = '';
  }

  const animacionElement = document.getElementById('animacionTipo');
  const cantidadElement = document.getElementById('numGanadores');
  const suplentesElement = document.getElementById('numSuplentes');
  const filtrarElement = document.getElementById('filtrarDuplicados');
  const duracionElement = document.getElementById('duracionAnimacion');
  const colorElement = document.getElementById('colorPrincipal');

  // Verificar que los elementos necesarios existen
  if (!animacionElement || !cantidadElement) {
    console.error('Faltan elementos necesarios para guardar opciones');
    return;
  }

  const animacionSeleccionada = animacionElement.value;
  const cantidad = +cantidadElement.value;

  const opciones = {
    titulo: titulo,
    ganadores: cantidad,
    suplentes: suplentesElement ? +suplentesElement.value : 0,
    filtrarDuplicados: filtrarElement ? filtrarElement.checked : false,
    excluirParticipantes: false,
    animacion: animacionSeleccionada,
    sonidos: false,
    duracion: duracionElement ? +duracionElement.value : 3,
    color: colorElement ? colorElement.value : '#007bff',
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
    const participantesTexto = sessionStorage.getItem('participantesTexto');
    if (participantesTexto) {
      participantes = participantesTexto.split('\n').map(p => p.trim()).filter(p => p !== '');
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
    const participantesTexto = localStorage.getItem('participantesTexto');
    if (participantesTexto) {
      participantes = participantesTexto.split('\n').map(p => p.trim()).filter(p => p !== '');
    }
  }

  // Validaciones básicas
  if (participantes.length === 0) {
    if (mensajeError) {
      mensajeError.textContent = 'No hay participantes cargados. Por favor, regresa y carga participantes.';
    }
    return;
  }

  if (opciones.ganadores <= 0) {
    if (mensajeError) {
      mensajeError.textContent = 'Debes seleccionar al menos un ganador.';
    }
    return;
  }

  if (opciones.suplentes < 0) {
    if (mensajeError) {
      mensajeError.textContent = 'La cantidad de suplentes no puede ser negativa.';
    }
    return;
  }

  if (opciones.ganadores + opciones.suplentes > participantes.length) {
    if (mensajeError) {
      mensajeError.textContent = `La suma de ganadores y suplentes (${opciones.ganadores + opciones.suplentes}) excede el número de participantes (${participantes.length}).`;
    }
    return;
  }

  // Validar premios (asumiendo que tienes un input o sección de premios)
  const premiosInputs = document.querySelectorAll('.premioInput');
  const premios = [];

  premiosInputs.forEach((input, index) => {
    const valor = input.value.trim();
    if (valor === '') {
      if (mensajeError) {
        mensajeError.textContent = `El premio #${index + 1} está vacío. Por favor, completa o elimina ese premio.`;
      }
      return;
    }
    premios.push(valor);
  });

  if (premios.length > 0 && premios.length !== opciones.ganadores) {
    if (mensajeError) {
      mensajeError.textContent = `El número de premios (${premios.length}) debe coincidir con la cantidad de ganadores (${opciones.ganadores}).`;
    }
    return;
  }

  // Guardar opciones y premios en localStorage
  try {
    localStorage.setItem('opcionesSorteo', JSON.stringify(opciones));
    localStorage.setItem('premios', JSON.stringify(premios));
    console.log('Opciones y premios guardados exitosamente');
    if (mensajeError) {
      mensajeError.textContent = 'Opciones guardadas correctamente.';
    }
  } catch (error) {
    console.error('Error guardando opciones o premios:', error);
    if (mensajeError) {
      mensajeError.textContent = 'Error al guardar las opciones. Intenta de nuevo.';
    }
    return;
  }

  localStorage.setItem('opcionesSorteo', JSON.stringify(opciones));
  localStorage.setItem('premios', JSON.stringify(premios));

  // También guardar los participantes bajo otra clave para nombresGiratorios.html
  try {
    const listaDOM = document.querySelectorAll('#listaParticipantes li');
    const participantesDOM = Array.from(listaDOM).map(li => li.textContent.replace(/^\d+\.\s*/, '').trim());

    sessionStorage.setItem("participantesFinal", JSON.stringify(participantesDOM));
    console.log("participantesFinal guardados desde el DOM:", participantesDOM.length);
  } catch (e) {
    console.warn("No se pudo guardar participantesFinal desde el DOM:", e);
  }



  // Redirigir según la animación
  switch (animacionSeleccionada) {
    case "ruleta":
      window.open("nombresAleatorios/nombresGiratorios.html", '_blank');
      break;
    case "cuenta":
      window.open("nombresAleatorios/countdown.html", '_blank');
      break;
    case "fortuna":
      window.open("nombresAleatorios/viewRuleta.html", '_blank');
      break;
    default:
      console.warn("Animación no reconocida:", animacionSeleccionada);
  }
}

// Función auxiliar para aplicar color principal
function aplicarColorPrincipal(color) {
  document.documentElement.style.setProperty('--color-principal', color);
}