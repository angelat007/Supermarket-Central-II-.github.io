// Función para mostrar datos del ganador en el certificado
function mostrarDatosGanador() {
  const ganadorData = JSON.parse(localStorage.getItem("ganador") || "{}");
  const ultimoGanador = JSON.parse(localStorage.getItem("ultimoGanador") || "{}");
  const contenedor = document.getElementById("datosGanador");

  if (ganadorData.codigo && ganadorData.nombre) {
    const codigo = ganadorData.codigo;
    const nombre = ganadorData.nombre;
    const premio = ultimoGanador.premio || "";

    // Crear el HTML con las clases del CSS existente
    let contenidoHTML = `
      <div class="codigo">${codigo}</div>
      <div class="nombre">${nombre}</div>
    `;

    // Solo agregar el premio si existe y no es "Sin premio"
    if (premio && premio !== "Sin premio" && premio.trim() !== "") {
      contenidoHTML += `<div class="premio">${premio}</div>`;
    }

    contenedor.innerHTML = contenidoHTML;
  } else {
    contenedor.textContent = "No hay datos del ganador.";
  }
}

// Función para cargar información del sorteo
function cargarInformacionSorteo() {
  const titulo = localStorage.getItem("tituloSorteo") || "Título no definido";
  document.querySelector(".titulo").textContent = titulo;

  const fechaSorteo = localStorage.getItem("fechaSorteo") || new Date().toLocaleDateString();
  const participantes = JSON.parse(localStorage.getItem("participantes") || "[]");
  const ganadorData = JSON.parse(localStorage.getItem("ganador") || "{}");
  const ultimoGanador = JSON.parse(localStorage.getItem("ultimoGanador") || "{}");

  const codigo = ganadorData.codigo || "Código no disponible";
  const nombreCompleto = ganadorData.nombre || "Nombre no disponible";
  const premio = ultimoGanador.premio || "---";

  // Actualizar elementos de la página
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
    // Dividir el ganador en código y nombre
    const [codigo, ...nombrePartes] = ganador.split('|'); // ejemplo: T123456|Juan Pérez
    const nombre = nombrePartes.join(' ') || 'Nombre no disponible';

    // Guardar en localStorage
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

  // Agregar clase para remover bordes
  elemento.classList.add('sin-bordes');

  html2canvas(elemento, {
    scale: 3,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    width: 320,  // Dimensión fija
    height: 570, // Dimensión fija
    scrollX: 0,
    scrollY: 0,
    windowWidth: 320,
    windowHeight: 570
  }).then(canvas => {
    // Remover clase temporal
    elemento.classList.remove('sin-bordes');

    const link = document.createElement('a');
    link.download = 'certificado.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  }).catch(error => {
    // Remover clase temporal en caso de error
    elemento.classList.remove('sin-bordes');
    console.error('Error al generar PNG:', error);
    alert('Error al descargar la imagen. Inténtalo de nuevo.');
  });
}

function descargarPDF() {
  const elemento = document.getElementById("certificado");

  // Agregar clase para remover bordes
  elemento.classList.add('sin-bordes');

  html2canvas(elemento, {
    scale: 4,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    width: 320,  // Dimensión fija
    height: 570, // Dimensión fija
    scrollX: 0,
    scrollY: 0,
    windowWidth: 320,
    windowHeight: 570
  }).then(canvas => {
    // Remover clase temporal
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
    pdf.save('certificado.pdf');

  }).catch(error => {
    // Remover clase temporal en caso de error
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
  if (tituloGanador) tituloGanador.textContent = t.ganador;

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

// Ejecutar todas las funciones cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
  obtenerDatosURL();
  cargarInformacionSorteo();
  mostrarDatosGanador(); // Esta es la función principal que muestra los datos
  configurarCambioFondo();
  cargarIdiomaGuardado();
});