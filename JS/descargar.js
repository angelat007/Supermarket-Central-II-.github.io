// Cargar datos del ganador desde localStorage
const datos = JSON.parse(localStorage.getItem("ganador"));
if (datos) {
  // Mostrar el código y el nombre completo en el certificado
  document.getElementById("datosGanador").innerText = `${datos.codigo} ${datos.nombre}`;
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

// Función alternativa que crea una copia temporal sin bordes redondeados
function descargarPNGAlternativo() {
  const elementoOriginal = document.getElementById("certificado");
  
  // Crear una copia temporal del elemento
  const elementoCopia = elementoOriginal.cloneNode(true);
  elementoCopia.style.borderRadius = '0px';
  elementoCopia.style.position = 'absolute';
  elementoCopia.style.left = '-9999px';
  elementoCopia.style.top = '0px';
  elementoCopia.id = 'certificado-temp';
  
  // Agregar la copia al documento temporalmente
  document.body.appendChild(elementoCopia);
  
  html2canvas(elementoCopia, {
    scale: 3,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null,
    width: elementoCopia.offsetWidth,
    height: elementoCopia.offsetHeight
  }).then(canvas => {
    // Remover la copia temporal
    document.body.removeChild(elementoCopia);
    
    const link = document.createElement('a');
    link.download = 'certificado_sin_bordes.png';
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  }).catch(error => {
    // Remover la copia temporal en caso de error
    if (document.getElementById('certificado-temp')) {
      document.body.removeChild(elementoCopia);
    }
    console.error('Error al generar PNG:', error);
    alert('Error al descargar la imagen. Inténtalo de nuevo.');
  });
}

// Función adicional para descargar en formato SVG (si es posible)
function descargarSVG() {
  const elemento = document.getElementById("certificado");
  
  // Crear un SVG del elemento
  const serializer = new XMLSerializer();
  const svgData = serializer.serializeToString(elemento);
  
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.download = 'certificado.svg';
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
}

// Función para mostrar un preview antes de descargar
function mostrarPreview() {
  const elemento = document.getElementById("certificado");
  
  html2canvas(elemento, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: null
  }).then(canvas => {
    // Crear ventana modal con el preview
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;
    
    const img = document.createElement('img');
    img.src = canvas.toDataURL();
    img.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      background: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      font-size: 18px;
    `;
    
    closeBtn.onclick = () => document.body.removeChild(modal);
    
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
  });
}

// Función para cargar información del sorteo
document.addEventListener("DOMContentLoaded", () => {
  const titulo = localStorage.getItem("tituloSorteo") || "Título no definido";
  document.querySelector(".titulo").textContent = titulo;

  const fechaSorteo = localStorage.getItem("fechaSorteo") || new Date().toLocaleDateString();
  const participantes = JSON.parse(localStorage.getItem("participantes") || "[]");
  const ganadorData = JSON.parse(localStorage.getItem("ganador") || "{}");

  const codigo = ganadorData.codigo?.split("\t")[0] || "Código no disponible";
  const nombreCompleto = ganadorData.nombre || "Nombre no disponible";

  // Actualizar elementos de la página
  document.querySelector(".Fecha").textContent = fechaSorteo;
  document.querySelector(".numParticipantes").textContent = participantes.length;
  document.querySelector(".nombreGanador").textContent = `${nombreCompleto} (Código: ${codigo})`;
  
  // CAMBIO PRINCIPAL: Mostrar código y nombre completo en el certificado
  document.getElementById("datosGanador").textContent = `${codigo} ${nombreCompleto}`;
});

// Llamar la función cuando se carga la página de descarga
document.addEventListener('DOMContentLoaded', function() {
    // cargarLogo(); // Descomenta si tienes esta función
});

// Cambiar fondo de certificado
document.addEventListener('DOMContentLoaded', function() {
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
});

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
  pt: {
    titulo: "Super Plaza Venezuela Sorteio - Download",
    ayuda: "Ajuda",
    redes: "Redes Sociais",
    ganador: "Vencedor",
    descargarPNG: "Baixar PNG",
    descargarPDF: "Baixar PDF",
    cambiarFondo: "Mudar fundo",
    detallesSorteo: "Detalhes do Sorteio",
    fechaSorteo: "📅 Data do sorteio:",
    participantes: "👥 Participantes:",
    ganadorLabel: "🏆 Vencedor:",
    fechaDefault: "--/--/----",
    participantesDefault: "0",
    ganadorDefault: "---",
    alertaDescarga: "Erro no download. Tente novamente.",
    alertaDescargaPNG: "Erro ao baixar imagem. Tente novamente.",
    alertaDescargaPDF: "Erro ao baixar PDF. Tente novamente."
  }
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
document.addEventListener('DOMContentLoaded', function() {
  const idiomaGuardado = localStorage.getItem('idiomaSeleccionado');
  if (idiomaGuardado) {
    document.getElementById('idioma').value = idiomaGuardado;
    cambiarIdioma();
  }
});

// Función para obtener datos del URL (si vienen de otra página)
function obtenerDatosURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const ganador = urlParams.get('ganador');
  const fecha = urlParams.get('fecha');
  const participantes = urlParams.get('participantes');
  const titulo = urlParams.get('titulo');

  if (ganador) {
    // Mostrar el código y nombre completo en el certificado
    document.getElementById('datosGanador').textContent = ganador;
    document.querySelector('.nombreGanador').textContent = ganador;
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

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', obtenerDatosURL);