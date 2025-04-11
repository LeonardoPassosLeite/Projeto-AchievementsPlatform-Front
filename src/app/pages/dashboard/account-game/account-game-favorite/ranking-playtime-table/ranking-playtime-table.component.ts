import { Component } from '@angular/core';
import { AccountGameQuery } from '../../../../../state/account-game/AccountGame.query';
import { AccountGame } from '../../../../../shared/models/account-game.model';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-ranking-playtime-table',
  standalone: true,
  imports:
    [
      GenericModule,
      MatTableModule,
      MatIconModule
    ],
  templateUrl: './ranking-playtime-table.component.html',
  styleUrls: ['./ranking-playtime-table.component.scss']
})
export class RankingPlaytimeTableComponent {
  topPlayTime$: Observable<AccountGame[]>;
  displayedColumns: string[] = ['position', 'icon', 'gameName', 'playtime'];

  constructor(private accountGameQuery: AccountGameQuery) {
    this.topPlayTime$ = this.accountGameQuery.getTopPlayedGames$(10);
  }

  formatPlaytime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  }
}