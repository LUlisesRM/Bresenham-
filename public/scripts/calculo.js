class BresenhamRecta {
  constructor(x0, y0, x1, y1) {
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
  }

  calcular() {
    let resultados = [];
    let x0 = this.x0, y0 = this.y0, x1 = this.x1, y1 = this.y1;
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;

    let pk = 2 * dy - dx;

    while (true) {
      resultados.push({ x: x0, y: y0, pk });
      if (x0 === x1 && y0 === y1) break;

      if (pk < 0) {
        pk += 2 * dy;
        x0 += sx;
      } else {
        pk += 2 * (dy - dx);
        x0 += sx;
        y0 += sy;
      }
    }
    return resultados;
  }
}


class BresenhamCirculo {
  constructor(xc, yc, radio) {
    this.xc = xc;
    this.yc = yc;
    this.radio = radio;
  }

  calcular() {
    let cuadrantes = { Q1: [], Q2: [], Q3: [], Q4: [] };
    let x = 0;
    let y = this.radio;
    let p = 3 - 2 * this.radio;

    while (x <= y) {

      cuadrantes.Q1.push([this.xc + x, this.yc + y]);
      cuadrantes.Q2.push([this.xc - x, this.yc + y]);
      cuadrantes.Q3.push([this.xc - x, this.yc - y]);
      cuadrantes.Q4.push([this.xc + x, this.yc - y]);

      cuadrantes.Q1.push([this.xc + y, this.yc + x]);
      cuadrantes.Q2.push([this.xc - y, this.yc + x]);
      cuadrantes.Q3.push([this.xc - y, this.yc - x]);
      cuadrantes.Q4.push([this.xc + y, this.yc - x]);

      if (p < 0) {
        p += 4 * x + 6;
      } else {
        p += 4 * (x - y) + 10;
        y--;
      }
      x++;
    }
    return cuadrantes;
  }
}

function renderInputs() {
  const tipo = document.getElementById("algoritmo").value;
  const inputsDiv = document.getElementById("inputs");
  const botonDiv = document.getElementById("botonCalcular");

  inputsDiv.innerHTML = "";
  botonDiv.innerHTML = "";

  if (tipo === "recta") {
    inputsDiv.innerHTML = `
      <input type="number" id="x0" placeholder="x0">
      <input type="number" id="y0" placeholder="y0">
      <input type="number" id="x1" placeholder="x1">
      <input type="number" id="y1" placeholder="y1">
    `;
  } else if (tipo === "circulo") {
    inputsDiv.innerHTML = `
      <input type="number" id="xc" placeholder="xc">
      <input type="number" id="yc" placeholder="yc">
      <input type="number" id="radio" placeholder="radio">
    `;
  }

  if (tipo) {
    botonDiv.innerHTML = `<button onclick="calcular()">Calcular</button>`;
  }
}

function calcular() {
  const tipo = document.getElementById("algoritmo").value;
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = "";
  let puntos = [];

  if (tipo === "recta") {
    let x0 = Number(document.getElementById("x0").value);
    let y0 = Number(document.getElementById("y0").value);
    let x1 = Number(document.getElementById("x1").value);
    let y1 = Number(document.getElementById("y1").value);

    let recta = new BresenhamRecta(x0, y0, x1, y1);
    puntos = recta.calcular();

    let tabla = "<table border='1' style='margin:auto; border-collapse:collapse'><tr><th>x</th><th>y</th><th>pk</th></tr>";
    puntos.forEach(p => {
      tabla += `<tr><td>${p.x}</td><td>${p.y}</td><td>${p.pk}</td></tr>`;
    });
    tabla += "</table>";
    resultadoDiv.innerHTML = tabla;


    dibujar(puntos.map(p => [p.x, p.y]));

  } else if (tipo === "circulo") {
    let xc = Number(document.getElementById("xc").value);
    let yc = Number(document.getElementById("yc").value);
    let r = Number(document.getElementById("radio").value);

    let circulo = new BresenhamCirculo(xc, yc, r);
    let cuadrantes = circulo.calcular();

    for (let q in cuadrantes) {
      resultadoDiv.innerHTML += `<h4>${q}</h4>`;
      let tabla = "<table border='1' style='margin:auto; border-collapse:collapse'><tr><th>x</th><th>y</th></tr>";
      cuadrantes[q].forEach(([x, y]) => {
        tabla += `<tr><td>${x}</td><td>${y}</td></tr>`;
      });
      tabla += "</table>";
      resultadoDiv.innerHTML += tabla;
    }

    let puntosAll = [].concat(...Object.values(cuadrantes));
    dibujar(puntosAll);
  }
}


function dibujar(puntos) {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const offsetX = canvas.width / 2;
  const offsetY = canvas.height / 2;

  ctx.strokeStyle = "#ddd";
  ctx.lineWidth = 1;

  for (let x = 0; x <= canvas.width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(0, offsetY);
  ctx.lineTo(canvas.width, offsetY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(offsetX, 0);
  ctx.lineTo(offsetX, canvas.height);
  ctx.stroke();

  ctx.fillStyle = "blue";
  puntos.forEach(([x, y]) => {
    ctx.fillRect(offsetX + x, offsetY - y, 2, 2);
  });
}

