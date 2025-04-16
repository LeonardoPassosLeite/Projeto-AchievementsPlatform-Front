import { Component, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';
import { ChartComponent } from '../../../../../shared/components/chart/chart.component';

@Component({
  selector: 'app-steam-points-insights',
  standalone: true,
  imports: [GenericModule, ChartComponent],
  templateUrl: './steam-points-insights.component.html',
  styleUrl: './steam-points-insights.component.scss'
})
export class SteamPointsInsightsComponent {
  @Input() steamPointsLabels: string[] = [];
  @Input() steamPointsData: number[] = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  selectedChartType: ChartType = 'line';
}