import { Component, Input } from '@angular/core';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';
import { Achievements } from '../../../../../shared/models/game-achievement';
import { formatPlaytimeForever } from '../../../../../utils/playtime.utils';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-game-stats',
  standalone: true,
  imports: [GenericModule, MatIconModule],
  templateUrl: './game-stats.component.html',
  styleUrls: ['./game-stats.component.scss'],
})
export class GameStatsComponent {
  private _gameDetails: Achievements | null = null;

  @Input()
  set gameDetails(value: Achievements | null) {
    this._gameDetails = value;
  }

  get gameDetails(): Achievements | null {
    return this._gameDetails;
  }

  formatPlaytime(playtime: number): string {
    return formatPlaytimeForever(playtime);
  }
}