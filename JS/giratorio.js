document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('listaParticipantesfinal');
  const total = document.getElementById('totalParticipantes');
  const participantesJSON = sessionStorage.getItem('participantesFinal');

  if (participantesJSON) {
    try {
      const participantes = JSON.parse(participantesJSON);

      lista.innerHTML = '';
      participantes.forEach((nombre, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${nombre}`;
        li.style.whiteSpace = 'pre'; // Mantiene espacios y tabulaciones
        li.style.wordBreak = 'break-word';
        lista.appendChild(li);
      });

      total.textContent = `Total: ${participantes.length}`;
    } catch (e) {
      console.error("Error al parsear participantesFinal:", e);
    }
  } else {
    console.warn("No se encontraron datos en sessionStorage con la clave 'participantesFinal'");
  }
});

// Función para iniciar la ruleta
function comenzarRulea() {
  const lista = [];
  document.querySelectorAll("#listaParticipantesfinal li").forEach((li) => {
    const texto = li.textContent.replace(/^\d+\.\s*/, ''); // Eliminar numeración si hay
    lista.push(texto.trim());
  });

  // Guardar en localStorage para usar en giratorio.html
  localStorage.setItem("participantes", JSON.stringify(lista));

  // Redirigir
  window.location.href = "opciones/giratorio.html";
}
