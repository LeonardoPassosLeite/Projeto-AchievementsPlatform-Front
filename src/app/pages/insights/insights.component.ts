import { Component } from '@angular/core';
import { GenericModule } from '../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [
    GenericModule
  ],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent {

}
