// Función para mostrar datos del ganador en el certificado
function mostrarDatosGanador() {
  const ganadorData = JSON.parse(localStorage.getItem("ganador") || "{}");
  const ultimoGanador = JSON.parse(localStorage.getItem("ultimoGanador") || "{}");
  const ganadoresMultiple = JSON.parse(localStorage.getItem("ganadoresMultiple") || "[]");
  const contenedor = document.getElementById("datosGanador");

  // Si hay múltiples ganadores, mostrar todos
  if (ganadoresMultiple.length > 0) {
    mostrarGanadoresMultiples(ganadoresMultiple);
    return;

  // Mostrar un solo ganador (funcionalidad original)
  if (ganadorData.codigo && ganadorData.nombre) {
    const codigo = ganadorData.codigo;
    const nombre = ganadorData.nombre;
    const premio = ultimoGanador.premio || "";

    let mitad = Math.ceil(ganadores.length / 2);
    let columna1 = ganadores.slice(0, mitad);
    let columna2 = ganadores.slice(mitad);

    let contenidoHTML = '<div class="ganadores-grid">';
    contenidoHTML += '<div class="columna">';
    columna1.forEach(ganador => {
      contenidoHTML += generarItemHTML(ganador);
    });
    contenidoHTML += '</div>';

    contenidoHTML += '<div class="columna">';
    columna2.forEach(ganador => {
      contenidoHTML += generarItemHTML(ganador);
    });
    contenidoHTML += '</div>';
    contenidoHTML += '</div>';


    if (premio && premio !== "Sin premio" && premio.trim() !== "") {
      contenidoHTML += `<div class="premio">${premio}</div>`;
    }

    contenedor.innerHTML = contenidoHTML;
  } else {
    contenedor.textContent = "No hay datos del ganador.";
  }
}

// Nueva función para mostrar múltiples ganadores
function mostrarGanadoresMultiples(ganadores) { 
  const certificado = document.getElementById("certificado");
  const titulo = document.querySelector(".titulo");
  const tituloGanador = document.querySelector(".certificado h1");
  const datosGanador = document.getElementById("datosGanador");

  // Cambiar el título
  if (titulo) titulo.textContent = localStorage.getItem("tituloSorteo") || "Sorteo";
  if (tituloGanador) tituloGanador.textContent = "Ganadores";

  // Dividir ganadores en dos columnas
  const mitad = Math.ceil(ganadores.length / 2);
  const columna1 = ganadores.slice(0, mitad);
  const columna2 = ganadores.slice(mitad);

  let contenidoHTML = `<div class="ganadores-grid">
    <div class="columna">`;

  columna1.forEach(ganador => {
    const codigo = ganador.codigo || ``;
    const nombre = ganador.nombre || "Nombre no disponible";
    const premio = ganador.premio || "";

    contenidoHTML += `
      <div class="ganador-item">
        <div class="codigo-ganador">${codigo}</div>
        <div class="nombre-ganador">${nombre}</div>
        ${premio && premio !== "Sin premio" && premio.trim() !== "" ? 
          `<div class="premio-ganador">${premio}</div>` : ''}
      </div>`;
  });

  contenidoHTML += `</div><div class="columna">`;

  columna2.forEach(ganador => {
    const codigo = ganador.codigo || ``;
    const nombre = ganador.nombre || "Nombre no disponible";
    const premio = ganador.premio || "";

    contenidoHTML += `
      <div class="ganador-item">
        <div class="codigo-ganador">${codigo}</div>
        <div class="nombre-ganador">${nombre}</div>
        ${premio && premio !== "Sin premio" && premio.trim() !== "" ? 
          `<div class="premio-ganador">${premio}</div>` : ''}
      </div>`;
  });

  contenidoHTML += `</div></div>`;

  datosGanador.innerHTML = contenidoHTML;

  certificado.classList.add('certificado-multiple');
}


  contenidoHTML += '</div>';

  datosGanador.innerHTML = contenidoHTML;

  // Añadir estilos específicos para múltiples ganadores
  certificado.classList.add('certificado-multiple');
}

// Función para cargar información del sorteo
function cargarInformacionSorteo() {
  const titulo = localStorage.getItem("tituloSorteo") || "Título no definido";
  document.querySelector(".titulo").textContent = titulo;

  const fechaSorteo = localStorage.getItem("fechaSorteo") || new Date().toLocaleDateString();
  const participantes = JSON.parse(localStorage.getItem("participantes") || "[]");
  const ganadorData = JSON.parse(localStorage.getItem("ganador") || "{}");
  const ultimoGanador = JSON.parse(localStorage.getItem("ultimoGanador") || "{}");
  const ganadoresMultiple = JSON.parse(localStorage.getItem("ganadoresMultiple") || "[]");

  // Si hay múltiples ganadores, usar esa información
  if (ganadoresMultiple.length > 0) {
    document.querySelector(".Fecha").textContent = fechaSorteo;
    document.querySelector(".numParticipantes").textContent = participantes.length;
    document.querySelector(".nombreGanador").textContent = `${ganadoresMultiple.length} ganadores`;
    document.querySelector(".premio").textContent = "Múltiples premios";
    return;
  }

  // Funcionalidad original para un solo ganador
  const codigo = ganadorData.codigo || "Código no disponible";
  const nombreCompleto = ganadorData.nombre || "Nombre no disponible";
  const premio = ultimoGanador.premio || "---";

  document.querySelector(".Fecha").textContent = fechaSorteo;
  document.querySelector(".numParticipantes").textContent = participantes.length;
  document.querySelector(".nombreGanador").textContent = nombreCompleto;
  document.querySelector(".premio").textContent = premio;
}

// Función para obtener datos del URL (si vienen de otra página)
function obtenerDatosURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const ganador = urlParams.get('ganador');
  const fecha = urlParams.get('fecha');
  const participantes = urlParams.get('participantes');
  const titulo = urlParams.get('titulo');
  const premio = urlParams.get('premio');

  if (ganador) {
    const [codigo, ...nombrePartes] = ganador.split('|');
    const nombre = nombrePartes.join(' ') || 'Nombre no disponible';

    localStorage.setItem("ganador", JSON.stringify({ codigo, nombre }));

    if (premio) {
      localStorage.setItem("ultimoGanador", JSON.stringify({ premio }));
    }

    document.querySelector('.nombreGanador').textContent = `${nombre} (Código: ${codigo})`;
  }

  if (fecha) {
    document.querySelector('.Fecha').textContent = fecha;
  }

  if (participantes) {
    document.querySelector('.numParticipantes').textContent = participantes;
  }

  if (titulo) {
    document.querySelector('.titulo').textContent = titulo;
  }
}

function descargarPNG() {
  const elemento = document.getElementById("certificado");
  const esMultiple = elemento.classList.contains('certificado-multiple');

  // Agregar clase para remover bordes
  elemento.classList.add('sin-bordes');

  // Ajustar dimensiones según el tipo de certificado
  const config = esMultiple ? {
    scale: 2,
    width: 480,
    height: 800
  } : {
    scale: 3,
    width: 320,
    height: 570
  };

  html2canvas(elemento, {
    scale: config.scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    width: config.width,
    height: config.height,
    scrollX: 0,
    scrollY: 0,
    windowWidth: config.width,
    windowHeight: config.height
  }).then(canvas => {
    elemento.classList.remove('sin-bordes');

    const link = document.createElement('a');
    link.download = esMultiple ? 'certificado-ganadores.png' : 'certificado.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  }).catch(error => {
    elemento.classList.remove('sin-bordes');
    console.error('Error al generar PNG:', error);
    alert('Error al descargar la imagen. Inténtalo de nuevo.');
  });
}

function descargarPDF() {
  const elemento = document.getElementById("certificado");
  const esMultiple = elemento.classList.contains('certificado-multiple');

  elemento.classList.add('sin-bordes');

  const config = esMultiple ? {
    scale: 3,
    width: 480,
    height: 800
  } : {
    scale: 4,
    width: 320,
    height: 570
  };

  html2canvas(elemento, {
    scale: config.scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    width: config.width,
    height: config.height,
    scrollX: 0,
    scrollY: 0,
    windowWidth: config.width,
    windowHeight: config.height
  }).then(canvas => {
    elemento.classList.remove('sin-bordes');

    const imgData = canvas.toDataURL('image/png', 1.0);
    const { jsPDF } = window.jspdf;

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;

    let pdfWidth, pdfHeight;

    if (ratio > 1) {
      pdfWidth = 297;
      pdfHeight = pdfWidth / ratio;
    } else {
      pdfHeight = 210;
      pdfWidth = pdfHeight * ratio;
    }

    const pdf = new jsPDF({
      orientation: ratio > 1 ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, '', 'FAST');
    const filename = esMultiple ? 'certificado-ganadores.pdf' : 'certificado.pdf';
    pdf.save(filename);

  }).catch(error => {
    elemento.classList.remove('sin-bordes');
    console.error('Error al generar PDF:', error);
    alert('Error al descargar el PDF. Inténtalo de nuevo.');
  });
}

// Cambiar fondo de certificado
function configurarCambioFondo() {
  document.getElementById('fondoInput').addEventListener('change', function (e) {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const dataURL = event.target.result;
      const certificado = document.getElementById("certificado");

      certificado.style.backgroundImage = `
              linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
              url('${dataURL}')
          `;
      certificado.style.backgroundSize = "cover";
      certificado.style.backgroundPosition = "center";
      certificado.style.backgroundRepeat = "no-repeat";
    };
    reader.readAsDataURL(archivo);
  });
}

// Cambiar idiomas
const traducciones = {
  es: {
    titulo: "Super Plaza Venezuela Sorteo - Descarga",
    ayuda: "Ayuda",
    redes: "Redes Sociales",
    ganador: "Ganador",
    ganadores: "Ganadores",
    descargarPNG: "Descargar PNG",
    descargarPDF: "Descargar PDF",
    cambiarFondo: "Cambiar fondo",
    detallesSorteo: "Detalles del Sorteo",
    fechaSorteo: "📅 Fecha del sorteo:",
    participantes: "👥 Participantes:",
    ganadorLabel: "🏆 Ganador:",
    fechaDefault: "--/--/----",
    participantesDefault: "0",
    ganadorDefault: "---",
    alertaDescarga: "Error al descargar. Inténtalo de nuevo.",
    alertaDescargaPNG: "Error al descargar la imagen. Inténtalo de nuevo.",
    alertaDescargaPDF: "Error al descargar el PDF. Inténtalo de nuevo."
  },
  en: {
    titulo: "Super Plaza Venezuela Draw - Download",
    ayuda: "Help",
    redes: "Social Media",
    ganador: "Winner",
    ganadores: "Winners",
    descargarPNG: "Download PNG",
    descargarPDF: "Download PDF",
    cambiarFondo: "Change background",
    detallesSorteo: "Draw Details",
    fechaSorteo: "📅 Draw date:",
    participantes: "👥 Participants:",
    ganadorLabel: "🏆 Winner:",
    fechaDefault: "--/--/----",
    participantesDefault: "0",
    ganadorDefault: "---",
    alertaDescarga: "Download error. Please try again.",
    alertaDescargaPNG: "Error downloading image. Please try again.",
    alertaDescargaPDF: "Error downloading PDF. Please try again."
  },
};

function cambiarIdioma() {
  const idioma = document.getElementById('idioma').value;
  const t = traducciones[idioma];

  document.title = t.titulo;

  const botonesIngresar = document.querySelectorAll(".btn.ingresar");
  if (botonesIngresar[0]) botonesIngresar[0].textContent = t.ayuda;
  if (botonesIngresar[1]) botonesIngresar[1].textContent = t.redes;

  const tituloGanador = document.querySelector(".certificado h1");
  if (tituloGanador) {
    const ganadoresMultiple = JSON.parse(localStorage.getItem("ganadoresMultiple") || "[]");
    tituloGanador.textContent = ganadoresMultiple.length > 0 ? t.ganadores : t.ganador;
  }

  const botones = document.querySelectorAll(".botones button");
  if (botones[0]) botones[0].textContent = t.descargarPNG;
  if (botones[1]) botones[1].textContent = t.descargarPDF;
  if (botones[2]) botones[2].textContent = t.cambiarFondo;

  const tituloDetalles = document.querySelector(".detalle-container h2");
  if (tituloDetalles) tituloDetalles.textContent = t.detallesSorteo;

  const labels = document.querySelectorAll(".info-item .label");
  if (labels[0]) labels[0].textContent = t.fechaSorteo;
  if (labels[1]) labels[1].textContent = t.participantes;
  if (labels[2]) labels[2].textContent = t.ganadorLabel;

  const valores = document.querySelectorAll(".info-item .value");
  if (valores[0] && valores[0].textContent === "--/--/----") {
    valores[0].textContent = t.fechaDefault;
  }
  if (valores[1] && valores[1].textContent === "0") {
    valores[1].textContent = t.participantesDefault;
  }
  if (valores[2] && valores[2].textContent === "---") {
    valores[2].textContent = t.ganadorDefault;
  }

  // Guardar idioma seleccionado
  localStorage.setItem('idiomaSeleccionado', idioma);
}

// Cargar idioma guardado al iniciar la página
function cargarIdiomaGuardado() {
  const idiomaGuardado = localStorage.getItem('idiomaSeleccionado');
  if (idiomaGuardado) {
    document.getElementById('idioma').value = idiomaGuardado;
    cambiarIdioma();
  }
}

// Función para limpiar datos de ganadores múltiples al salir
function limpiarDatosMultiples() {
  localStorage.removeItem("ganadoresMultiple");
}

// Ejecutar todas las funciones cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
  obtenerDatosURL();
  cargarInformacionSorteo();
  mostrarDatosGanador();
  configurarCambioFondo();
  cargarIdiomaGuardado();
});

// Limpiar datos cuando se cierre la ventana
window.addEventListener('beforeunload', function () {
  limpiarDatosMultiples();
});