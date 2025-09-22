class BresenhamRecta {
      constructor(x0, y0, x1, y1) {
        this.x0 = x0; this.y0 = y0;
        this.x1 = x1; this.y1 = y1;
      }
      calcular() {
        let puntos = [];
        let x0 = this.x0, y0 = this.y0, x1 = this.x1, y1 = this.y1;
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx - dy;

        while (true) {
          puntos.push([x0, y0]);
          if (x0 === x1 && y0 === y1) break;
          let e2 = 2 * err;
          if (e2 > -dy) { err -= dy; x0 += sx; }
          if (e2 < dx) { err += dx; y0 += sy; }
        }
        return puntos;
      }
    }

    class BresenhamCirculo {
      constructor(xc, yc, radio) {
        this.xc = xc; this.yc = yc; this.radio = radio;
      }
      calcular() {
        let puntos = [];
        let x = 0;
        let y = this.radio;
        let p = 3 - 2 * this.radio;

        while (x <= y) {
          puntos.push([ this.xc + x, this.yc + y ]);
          puntos.push([ this.xc - x, this.yc + y ]);
          puntos.push([ this.xc + x, this.yc - y ]);
          puntos.push([ this.xc - x, this.yc - y ]);
          puntos.push([ this.xc + y, this.yc + x ]);
          puntos.push([ this.xc - y, this.yc + x ]);
          puntos.push([ this.xc + y, this.yc - x ]);
          puntos.push([ this.xc - y, this.yc - x ]);

          if (p < 0) {
            p += 4 * x + 6;
          } else {
            p += 4 * (x - y) + 10;
            y--;
          }
          x++;
        }
        return puntos;
      }
    }

    // ==== UI DINÁMICO ====
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

    // ==== CALCULO + RENDER ====
    function calcular() {
      const tipo = document.getElementById("algoritmo").value;
      let puntos = [];

      if (tipo === "recta") {
        let x0 = Number(document.getElementById("x0").value);
        let y0 = Number(document.getElementById("y0").value);
        let x1 = Number(document.getElementById("x1").value);
        let y1 = Number(document.getElementById("y1").value);
        let recta = new BresenhamRecta(x0, y0, x1, y1);
        puntos = recta.calcular();
      } else if (tipo === "circulo") {
        let xc = Number(document.getElementById("xc").value);
        let yc = Number(document.getElementById("yc").value);
        let r = Number(document.getElementById("radio").value);
        let circulo = new BresenhamCirculo(xc, yc, r);
        puntos = circulo.calcular();
      }

      // Mostrar lista
      document.getElementById("resultado").textContent = JSON.stringify(puntos, null, 2);

      // Dibujar en canvas
      dibujar(puntos);
    }

    function dibujar(puntos) {
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Ajuste para que (0,0) esté en el centro
      const offsetX = canvas.width / 2;
      const offsetY = canvas.height / 2;

      ctx.fillStyle = "blue";
      puntos.forEach(([x, y]) => {
        ctx.fillRect(offsetX + x, offsetY - y, 2, 2);
      });
    }