

const datos = JSON.parse(localStorage.getItem("ganador"));
if (datos) {
  document.getElementById("datosGanador").innerText = `${datos.codigo} ${datos.nombre}`;
}

function descargarPNG() {
  html2canvas(document.getElementById("certificado")).then(canvas => {
    const link = document.createElement('a');
    link.download = 'certificado.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

function descargarPDF() {
  html2canvas(document.getElementById("certificado")).then(canvas => {
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('certificado.pdf');
  });
}

//funcion informacion
document.addEventListener("DOMContentLoaded", () => {
  const titulo = localStorage.getItem("tituloSorteo") || "Título no definido";
  document.querySelector(".titulo").textContent = titulo;

  // Ya tienes esto para los demás datos:
  const fechaSorteo = localStorage.getItem("fechaSorteo") || new Date().toLocaleDateString();
  const participantes = JSON.parse(localStorage.getItem("participantes") || "[]");
  const ganadorData = JSON.parse(localStorage.getItem("ganador") || "{}");

  const codigo = ganadorData.codigo?.split("\t")[0] || "Código no disponible";
  const nombreCompleto = ganadorData.nombre || "Nombre no disponible";

  document.querySelector(".Fecha").textContent = fechaSorteo;
  document.querySelector(".numParticipantes").textContent = participantes.length;
  document.querySelector(".nombreGanador").textContent = `${nombreCompleto} (Código: ${codigo})`;
  document.getElementById("datosGanador").textContent = `${codigo} ${nombreCompleto}`;
});

//funcion logo al recargar
function cargarLogo() {
    const logoGuardado = localStorage.getItem('logoSorteo');
    const logoElement = document.querySelector('.logo');
    
    if (logoGuardado && logoElement) {
        // Crear elemento img y añadirlo al li
        const img = document.createElement('img');
        img.src = logoGuardado;
        img.style.maxWidth = '200px';
        img.style.maxHeight = '50px';
        img.style.objectFit = 'contain';
        img.alt = 'Logo del sorteo';
        
        // Limpiar contenido previo y agregar la imagen
        logoElement.innerHTML = '';
        logoElement.appendChild(img);
    } else {
        // Si no hay logo guardado, usar el logo por defecto
        logoElement.innerHTML = '<img src="../../Media/Log-super-plaza-venezuela_2.webp" width="200px" alt="Logo por defecto">';
    }
}

// Llamar la función cuando se carga la página de descarga
document.addEventListener('DOMContentLoaded', function() {
    cargarLogo();
    // Resto del código de inicialización...
});

//cambiar fondo de certificado
document.getElementById('fondoInput').addEventListener('change', function (e) {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const dataURL = event.target.result;
        const certificado = document.getElementById("certificado");

        // Aplica el fondo combinado con gradiente oscuro encima
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
