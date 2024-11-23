import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from '../../../shared/models/steam-game.model';
import { Chart } from 'chart.js';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { CheckboxComponent } from '../../../shared/components/forms/checkbox/checkbox.component';
import { DisplayType } from '../../../shared/enums/displayType';

@Component({
  selector: 'app-player-chart',
  standalone: true,
  imports: [
    GenericModule,
    CheckboxComponent
  ],
  templateUrl: './player-chart.component.html',
  styleUrl: './player-chart.component.scss'
})
export class PlayerChartComponent {
  @Input() games: Game[] = [];
  @Input() title: string = 'Jogadores atuais';
  @Input() displayType: DisplayType = DisplayType.CurrentPlayers;
  @Input() showToggleOptions: boolean = true;
  @Output() displayTypeChange = new EventEmitter<DisplayType>();

  readonly DisplayType = DisplayType;
  chart!: Chart;

  ngOnInit(): void {
    this.initializeChart();
  }

  ngOnChanges(): void {
    if (this.chart) {
      this.updateChart();
    }
  }

  onToggleChange(newDisplayType: DisplayType): void {
    this.displayType = newDisplayType;
    this.title = this.displayType === DisplayType.CurrentPlayers ? 'Jogadores atuais' : 'Pico de Jogadores';
    this.displayTypeChange.emit(this.displayType);
    this.updateChart();
  }

  initializeChart(): void {
    const labels = this.games.map((game) => game.name);
    const data =
      this.displayType === DisplayType.CurrentPlayers
        ? this.games.map((game) => game.currentPlayers)
        : this.games.map((game) => game.peakPlayers);

    this.chart = new Chart('playerChartCanvas', {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: this.displayType === DisplayType.CurrentPlayers ? 'Jogadores Atuais' : 'Pico de Jogadores',
            data,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
        scales: {
          x: { ticks: { font: { size: 10 } } },
          y: { ticks: { font: { size: 14 } }, beginAtZero: true },
        },
      },
    });
  }

  updateChart(): void {
    const data =
      this.displayType === DisplayType.CurrentPlayers
        ? this.games.map((game) => game.currentPlayers)
        : this.games.map((game) => game.peakPlayers);

    this.chart.data.labels = this.games.map((game) => game.name);
    this.chart.data.datasets[0].data = data;
    this.chart.data.datasets[0].label =
      this.displayType === DisplayType.CurrentPlayers ? 'Jogadores Atuais' : 'Pico de Jogadores';
    this.chart.update();
  }
}