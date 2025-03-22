import { Component, Input } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [GenericModule,NgChartsModule],
  templateUrl: './chart.component.html',
})
export class ChartComponent {
  @Input() labels: string[] = [];
  @Input() datasets: any[] = [];
  @Input() options: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };
  @Input() chartType: ChartType = 'bar';
}