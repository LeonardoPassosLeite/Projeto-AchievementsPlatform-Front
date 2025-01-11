import { Component, Input } from '@angular/core';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';
import { AccountGameWithAchievements } from '../../../../../shared/models/account-game.model';

@Component({
  selector: 'app-game-stats',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss'],
})
export class GameStatsComponent {
  private _gameDetails: AccountGameWithAchievements | null = null;

  @Input()
  set gameDetails(value: AccountGameWithAchievements | null) {
    this._gameDetails = value;
  }

  get gameDetails(): AccountGameWithAchievements | null {
    return this._gameDetails;
  }

  formatPlaytime(playtime: number): string {
    const hours = Math.floor(playtime / 60);
    const minutes = playtime % 60;
    return `${hours}h ${minutes}m`;
  }
}