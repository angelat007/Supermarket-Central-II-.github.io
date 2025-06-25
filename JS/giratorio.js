document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('listaParticipantesfinal');
  const total = document.getElementById('totalParticipantes');

  const participantesJSON = sessionStorage.getItem('participantesFinal');

  if (participantesJSON) {
    const participantes = JSON.parse(participantesJSON);
    lista.innerHTML = '';

    participantes.forEach(nombre => {
      const li = document.createElement('li');
      li.textContent = nombre;
      lista.appendChild(li);
    });

    total.textContent = `Total: ${participantes.length}`;
  }
});

//funcion para mantener tabulaciones y espacios en los nombres
document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('listaParticipantesfinal');
  const total = document.getElementById('totalParticipantes');
  

  const participantesJSON = sessionStorage.getItem('participantesFinal');

  if (participantesJSON) {
    const participantes = JSON.parse(participantesJSON);
    lista.innerHTML = '';

    participantes.forEach(nombre => {
      const li = document.createElement('li');
      li.textContent = nombre;
      li.style.fontFamily = '"Segoe UI", sans-serif;';
      li.style.whiteSpace = 'pre'; //conserva tabulaciones y espacios
      lista.appendChild(li);
    });

    total.textContent = `Total: ${participantes.length}`;
  }
});

function comenzarRulea() {
  const lista = [];
  document.querySelectorAll("#listaParticipantesfinal li").forEach((li) => {
    lista.push(li.textContent.trim());
  });

  // Guardar en localStorage
  localStorage.setItem("participantes", JSON.stringify(lista));

  // Redirigir a giratorio.html
  window.location.href = "opciones/giratorio.html";
}
