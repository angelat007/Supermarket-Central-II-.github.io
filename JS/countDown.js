document.addEventListener('DOMContentLoaded', () => {
  const lista = document.getElementById('listaParticipantesfinal');
  const total = document.getElementById('totalParticipantes');

  const participantesJSON = sessionStorage.getItem('participantesFinal');

  if (participantesJSON) {
    const participantes = JSON.parse(participantesJSON);
    
    // Ordenar alfabéticamente
    participantes.sort((a, b) => a.localeCompare(b));

    lista.innerHTML = '';

    participantes.forEach((nombre, index) => {
      const li = document.createElement('li');
      li.textContent = nombre;
      li.style.fontFamily = '"Segoe UI", sans-serif';
      li.style.whiteSpace = 'pre';
      
      // Colorear automáticamente (alternando por posición)
      li.style.backgroundColor = index % 2 === 0 ? '#e3f2fd' : '#bbdefb'; // colores azul claro
      li.style.padding = '6px 12px';
      li.style.borderRadius = '6px';
      li.style.margin = '4px 0';

      lista.appendChild(li);
    });

    total.textContent = `Total: ${participantes.length}`;
  }
});

function comenzarRuleta() {
  const lista = [];
  document.querySelectorAll("#listaParticipantesfinal li").forEach((li) => {
    lista.push(li.textContent.trim());
  });

  // Ordenar y guardar para usar en la ruleta
  const ordenados = [...lista].sort((a, b) => a.localeCompare(b));
  localStorage.setItem("participantes", JSON.stringify(ordenados));

  // Redirigir a cuenta regresiva
  window.location.href = "opciones/countdown.html";
}
