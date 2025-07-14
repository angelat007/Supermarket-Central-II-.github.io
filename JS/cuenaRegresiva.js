document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnVerGanadores').addEventListener('click', () => {
    // Guardar los ganadores para la página de descarga
    const ganadoresElements = document.querySelectorAll('#listaGanadores li');
    const ganadoresData = Array.from(ganadoresElements).map(li => {
      const codigo = li.querySelector('.codigo')?.textContent || '';
      const nombre = li.querySelector('.nombre')?.textContent || '';
      const premio = li.querySelector('.premio')?.textContent || '';
      return { codigo, nombre, premio };
    });
    
    // Guardar en localStorage para que descargar.html pueda acceder
    localStorage.setItem('ganadoresMultiple', JSON.stringify(ganadoresData));
    localStorage.setItem('tituloSorteo', document.getElementById('tituloSorteo').textContent);
    localStorage.setItem('fechaSorteo', new Date().toLocaleDateString());
    localStorage.setItem('participantes', JSON.stringify(
      JSON.parse(sessionStorage.getItem('participantesFinal') || '[]')
    ));
    
    // Navegar a descargar.html
    window.location.href = "../ganadores/descargar.html";
  });

  /* ==== 1.  Recuperar datos guardados ==== */
  const participantes  = JSON.parse(sessionStorage.getItem('participantesFinal') || '[]');
  const opciones       = JSON.parse(sessionStorage.getItem('opcionesSorteo')   || '{}');

  /* ==== 2.  Pintar título y lista ==== */
  const tituloNode     = document.getElementById('tituloSorteo');
  const listaNode      = document.getElementById('listaParticipantesfinal');
  const totalNode      = document.getElementById('totalParticipantes');

  tituloNode.textContent = opciones.titulo || 'Cuenta regresiva';

  participantes.sort((a,b) => a.localeCompare(b))
               .forEach((nombre,i)=>{
                  const li = document.createElement('li');
                  li.textContent = nombre;
                  li.className   = `fila ${i%2===0?'par':'impar'}`;
                  listaNode.appendChild(li);
               });
  totalNode.textContent = `Total: ${participantes.length}`;

  /* ==== 3.  Eventos ==== */ 
  document.getElementById('btnIniciar')
          .addEventListener('click', () => startCountdown(opciones.duracion || 5));

  document.getElementById('btnVolver')
          .addEventListener('click', () => window.location.href='../../config.html');
});

/* ----------  LÓGICA DE LA CUENTA ATRÁS  ---------- */
function startCountdown(segundos){
  const countdown   = document.getElementById('countdown');
  const sectionGan  = document.getElementById('ganadoresSection');
  const listaGan    = document.getElementById('listaGanadores');

  // 🔥 OCULTA el botón de "Comenzar"
  document.getElementById('btnIniciar').style.display = 'none';

  countdown.style.display='block';          // aparece el número gigante
  let restante = segundos;
  countdown.textContent = restante;

  const intervalo = setInterval(()=>{
      restante--;
      if(restante<=0){
        clearInterval(intervalo);
        countdown.textContent = '¡GO!';
        setTimeout(()=>{
          countdown.style.display='none';
          mostrarGanadores();
        },800);
      }else{
        countdown.textContent = restante;
      }
  },1000);
}

  /* === elige n ganadores al terminar === */
function mostrarGanadores(){
  const participantes = Array.from(document.querySelectorAll('#listaParticipantesfinal li'))
                             .map(li => li.textContent.trim());
  const cantidad = (JSON.parse(sessionStorage.getItem('opcionesSorteo'))?.ganadores) || 1;
  const ganadores = shuffle(participantes).slice(0, cantidad);

  const modal      = document.getElementById('modalGanadores');
  const listaGan   = document.getElementById('listaGanadores');
  const countdown  = document.getElementById('countdown');

  listaGan.innerHTML = '';
  const premios = JSON.parse(localStorage.getItem('premios') || '[]');

ganadores.forEach((g, i) => {
  const li = document.createElement('li');

  // Extraer ID y Nombre
  const match = g.match(/^(T\d+)\s+(.+)$/);
  const id = match ? match[1] : '';
  const nombre = match ? match[2] : g;

  // Premio asignado (si existe)
  const premio = premios[i] || '—';

  li.innerHTML = `
    <div class="codigo">${id}</div>
    <div class="nombre">${nombre}</div>
    <div class="premio">${premio}</div>
  `;

  listaGan.appendChild(li);
});


  countdown.style.display = 'none'; // Oculta número grande
  modal.classList.remove('hidden'); // Muestra ventana flotante
  lanzarConfetti();
}

/* ----------  utilidades ---------- */
function shuffle(arr){
  const copia=[...arr];
  for(let i=copia.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [copia[i],copia[j]]=[copia[j],copia[i]];
  }
  return copia;
}

function lanzarConfetti(){
  if(typeof confetti==='function'){
     confetti({particleCount:120,spread:90,origin:{y:0.6}});
  }
}