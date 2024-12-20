<script>
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  data() {
    return {
      X: 1000,
      Y: 1000,
      d: 1.9,
      n: 60000,
      R: 4,
      sX: 3,
      sY: 4,
      rs: [],
      previousPoint: null,
      diagonalLength: Math.sqrt(1000 * 1000 + 1000 * 1000) / 2, // Половина длины диагонали
      performanceData: {
        n: [],
        d: [],
        R: [],
        sX: [],
        sY: [],
        time: []
      }
    }
  },
  methods: {
    drawN() {
      this.rs = [];
      let vertices = this.calculateVertices();
      let points = [vertices[0]];

      let startTime = performance.now();

      for (let i = 0; i < this.n; i++) {
        let randomVertex = vertices[Math.floor(Math.random() * vertices.length)];
        let randomPoint = points[Math.floor(Math.random() * points.length)];

        let newPoint = this.calculateNewPoint(randomVertex, randomPoint);
        let color = this.getPointColor(newPoint);
        this.rs.push({
          x: newPoint.x,
          y: newPoint.y,
          color: color
        });
        points.push([newPoint.x / (this.X / 20), newPoint.y / (this.Y / 20)]);
      }

      let endTime = performance.now();
      let timeTaken = endTime - startTime;

      this.performanceData.n.push(this.n);
      this.performanceData.d.push(this.d);
      this.performanceData.R.push(this.R);
      this.performanceData.sX.push(this.sX);
      this.performanceData.sY.push(this.sY);
      this.performanceData.time.push(timeTaken);

      this.updateChart();

      let now = new Date();
      console.log("Завершено построение: " + now + " мс: " + now.getMilliseconds());
    },
    calculateVertices() {
      let vertices = [];
      for (let i = 0; i < 3; i++) {
        let angle = 2 * Math.PI * i / 3;
        let x = this.R * Math.cos(angle) + this.sX;
        let y = this.R * Math.sin(angle) + this.sY;
        vertices.push([x, y]);
      }
      return vertices;
    },
    calculateNewPoint(vertex, point) {
      let dx = Math.abs(vertex[0] - point[0]) / this.d;
      let dy = Math.abs(vertex[1] - point[1]) / this.d;
      let nx = vertex[0] > point[0] ? point[0] + dx : point[0] - dx;
      let ny = vertex[1] > point[1] ? point[1] + dy : point[1] - dy;

      return {
        x: nx * (this.X / 20),
        y: ny * (this.Y / 20)
      };
    },
    getPointColor(newPoint) {
      if (this.previousPoint) {
        let distance = Math.sqrt(Math.pow(newPoint.x - this.previousPoint.x, 2) + Math.pow(newPoint.y - this.previousPoint.y, 2));
        if (distance > this.diagonalLength) {
          return this.getRandomColor();
        }
      }
      this.previousPoint = newPoint;
      return "#000000";
    },
    getRandomColor() {
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    },
    updateChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(document.getElementById('performanceChart').getContext('2d'), {
        type: 'bar',
        data: {
          labels: this.performanceData.time.map((_, i) => `Run ${i + 1}`),
          datasets: [{
            label: 'Время выполнения (мс)',
            data: this.performanceData.time,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  },
  mounted() {
    let now = new Date();
    console.log("Начато построение: " + now + " мс: " + now.getMilliseconds());
    this.drawN();
    now = new Date();
    console.log("Отображено на странице: " + now + " мс: " + now.getMilliseconds());
  }
}
</script>

<template>
  <main style="width: 80vw">
    <header style="justify-self: center; padding: 0">
      <img alt="Vue logo" src="./assets/logo.svg" width="125" height="125" />
    </header>

    <div style="display: flex; flex-direction: column; align-items: center">
      <label for="d">Коэффициент (d): </label>
      <br>
      <input type="number" v-model.number="d" min="1" max="10" step="0.1" id="d">
      <br>
      <button @click="drawN">Перерисовать</button>
      <br>
      <div class="svg-container">
        <svg :width="X * 0.1" :height="Y * 0.1">
          <rect v-for="r in rs"
                :fill="r.color"
                fill-opacity="1"
                :x="r.x"
                :y="r.y"
                width="1"
                height="1"/>
        </svg>

        <svg :width="X * 0.2" :height="Y * 0.2">
          <rect v-for="r in rs"
                :fill="r.color"
                fill-opacity="1"
                :x="r.x"
                :y="r.y"
                width="1"
                height="1"/>
        </svg>

        <svg :width="X * 0.3" :height="Y * 0.3">
          <rect v-for="r in rs"
                :fill="r.color"
                fill-opacity="1"
                :x="r.x"
                :y="r.y"
                width="1"
                height="1"/>
        </svg>

        <svg :width="X * 0.4" :height="Y * 0.4">
          <rect v-for="r in rs"
                :fill="r.color"
                fill-opacity="1"
                :x="r.x"
                :y="r.y"
                width="1"
                height="1"/>
        </svg>
      </div>
      <div class="chart-container">
        <canvas id="performanceChart"></canvas>
      </div>
    </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }
}
</style>
