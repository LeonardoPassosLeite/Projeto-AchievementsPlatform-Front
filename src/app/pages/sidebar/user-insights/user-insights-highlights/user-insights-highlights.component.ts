import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PodiumGamePlaytimeComponent } from './podium-game-playtime/podium-game-playtime.component';
import { AccountGame } from '../../../../shared/models/account-game.model';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-user-insights-highlights',
  standalone: true,
  templateUrl: './user-insights-highlights.component.html',
  styleUrls: ['./user-insights-highlights.component.scss'],
  imports:
    [
      GenericModule,
      PodiumGamePlaytimeComponent
    ]
})
export class UserInsightsHighlightsComponent {
  @Input() topPlayedGames$!: Observable<AccountGame[]>;
}
