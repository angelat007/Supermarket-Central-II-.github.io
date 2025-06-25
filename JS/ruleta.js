const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let nombres = JSON.parse(sessionStorage.getItem("listaParticipantes")) || [];
let anguloInicio = 0;
const radio = 200;
let girando = false;

function dibujarRuleta() {
  const num = nombres.length;
  const angulo = (2 * Math.PI) / num;

  for (let i = 0; i < num; i++) {
    const start = anguloInicio + i * angulo;
    const end = start + angulo;

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.arc(canvas.width / 2, canvas.height / 2, radio, start, end);
    ctx.fillStyle = getColor(i);
    ctx.fill();
    ctx.stroke();

    // Escribir nombre
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(start + angulo / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(nombres[i], radio - 10, 5);
    ctx.restore();
  }

  // Dibujar triángulo indicador
  ctx.beginPath();
  ctx.moveTo(250, 10);
  ctx.lineTo(240, 30);
  ctx.lineTo(260, 30);
  ctx.closePath();
  ctx.fillStyle = "gray";
  ctx.fill();
}

function getColor(index) {
  const colores = ["#f00", "#ffa500", "#0f0", "#00f", "#ff0", "#0ff", "#800080"];
  return colores[index % colores.length];
}

function girarRuleta() {
  if (girando) return;
  girando = true;

  let velocidad = Math.random() * 0.3 + 0.25;
  let frenado = 0.002;
  const intervalo = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    anguloInicio += velocidad;
    dibujarRuleta();
    velocidad -= frenado;

    if (velocidad <= 0) {
      clearInterval(intervalo);
      mostrarGanador();
      girando = false;
    }
  }, 20);
}

function mostrarGanador() {
  const anguloFinal = anguloInicio % (2 * Math.PI);
  const sector = (2 * Math.PI) / nombres.length;
  const index = nombres.length - Math.floor((anguloFinal / sector)) - 1;
  alert("🎉 Ganador: " + nombres[(index + nombres.length) % nombres.length]);
}

dibujarRuleta();
