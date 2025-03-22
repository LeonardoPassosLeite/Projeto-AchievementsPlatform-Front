import { Component, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { ChartComponent } from '../../../../shared/components/chart/chart.component';

@Component({
  selector: 'app-platinum-insights',
  standalone: true,
  imports: [GenericModule, ChartComponent],
  templateUrl: './platinum-insights.component.html',
  styleUrl: './platinum-insights.component.scss'
})
export class PlatinumInsightsComponent {
  @Input() platinumLabels: string[] = [];
  @Input() platinumData: number[] = [];

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
