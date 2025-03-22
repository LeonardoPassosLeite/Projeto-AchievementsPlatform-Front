import { Component, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { ChartComponent } from '../../../../shared/components/chart/chart.component';

@Component({
  selector: 'app-achievements-insights',
  standalone: true,
  imports: [GenericModule, ChartComponent],
  templateUrl: './achievements-insights.component.html',
  styleUrls: ['./achievements-insights.component.scss']
})
export class AchievementsInsightsComponent {
  @Input() achievementLabels: string[] = [];
  @Input() achievementData: number[] = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  selectedChartType: ChartType = 'bar';
}