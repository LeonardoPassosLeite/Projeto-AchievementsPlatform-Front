import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-hourly-players-chart',
  standalone: true,
  templateUrl: './hourly-player-chart.component.html',
  styleUrls: ['./hourly-player-chart.component.scss'],
})
export class HourlyPlayersChartComponent implements OnInit, OnChanges {
  @Input() hourlyData: { [gameName: string]: { time: string[]; players: number[] } } = {};
  @Input() title: string = 'Jogadores por Hora';
  chart!: Chart;

  ngOnInit(): void {
    this.initializeChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.updateChart();
    }
  }

  initializeChart(): void {
    // Filtrando e configurando os dados como antes
    const currentTime = new Date();
    currentTime.setMinutes(0, 0, 0);
  
    const fixedHours = this.getFixedHours();
    const filledData = this.fillDataWithFixedHours(fixedHours);
  
    const datasets = Object.keys(filledData).map((gameName) => ({
      label: gameName,
      data: filledData[gameName].players,
      borderColor: this.getRandomColor(),
      tension: 0.4,
      fill: false,
    }));
  
    this.chart = new Chart('hourlyPlayersChartCanvas', {
      type: 'line',
      data: {
        labels: fixedHours,
        datasets,
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom', // Posição: 'top', 'left', 'right', 'bottom'
            align: 'start', // Alinhamento: 'start', 'center', 'end'
            labels: {
              boxWidth: 20, // Tamanho do quadrado de cor
              boxHeight: 10, // Altura do quadrado
              padding: 15, // Espaçamento interno
              font: {
                size: 12, // Tamanho da fonte
                family: 'Arial', // Fonte
              },
              color: '#FFFFFF', // Cor do texto
            },
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context) {
                const gameName = context.dataset.label;
                const players = context.raw as number;
                const time = context.label;
                return `${gameName}: ${players.toLocaleString()} jogadores (${time})`;
              },
            },
          },
        },
        scales: {
          x: { title: { display: true, text: 'Horário' } },
          y: { title: { display: true, text: 'Jogadores Atuais' }, beginAtZero: true },
        },
      },
    });
  }    
  

  updateChart(): void {
    const fixedHours = this.getFixedHours(); // Gera os horários fixos novamente
    const filteredData = this.fillDataWithFixedHours(fixedHours); // Atualiza os dados para horários fixos

    const datasets = Object.keys(filteredData).map((gameName) => ({
      label: gameName,
      data: filteredData[gameName].players,
      borderColor: this.getRandomColor(),
      tension: 0.4,
      fill: false,
    }));

    this.chart.data.labels = fixedHours;
    this.chart.data.datasets = datasets;
    this.chart.update();
  }

  getFixedHours(): string[] {
    const now = new Date();
    now.setMinutes(0, 0, 0); // Arredonda para a hora cheia (elimina minutos e segundos)

    const fixedHours: string[] = [];
    for (let i = 0; i < 5; i++) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000); // Subtrai 1 hora por iteração
      fixedHours.unshift(hour.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })); // Formata como HH:00
    }
    return fixedHours;
  }

  fillDataWithFixedHours(fixedHours: string[]): { [gameName: string]: { time: string[]; players: number[] } } {
    const filledData: { [gameName: string]: { time: string[]; players: number[] } } = {};

    Object.keys(this.hourlyData).forEach((gameName) => {
      const times = this.hourlyData[gameName].time;
      const players = this.hourlyData[gameName].players;

      const gameData = { time: [...fixedHours], players: Array(fixedHours.length).fill(0) };

      // Preenche jogadores apenas nos horários que existem no banco
      fixedHours.forEach((hour, index) => {
        const dataIndex = times.indexOf(hour);
        if (dataIndex !== -1) {
          gameData.players[index] = players[dataIndex]; // Preenche o valor real
        }
      });

      filledData[gameName] = gameData;
    });

    return filledData;
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}