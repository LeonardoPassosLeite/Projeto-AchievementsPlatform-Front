import { Component } from '@angular/core';
import { AccountGame } from '../../../../shared/models/account-game.model';
import { Observable } from 'rxjs';
import { AccountGameQuery } from '../../../../state/account-game/AccountGame.query';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { GameListComponent } from '../../../../shared/components/game-list/game-list.component';

@Component({
  selector: 'app-account-game-in-progress',
  standalone: true,
  imports: [GenericModule, GameListComponent],
  templateUrl: './account-game-in-progress.component.html',
  styleUrl: './account-game-in-progress.component.scss'
})
export class AccountGameInProgressComponent {
  playtimeGames$: Observable<AccountGame[]>;

  constructor(private accountGameQuery: AccountGameQuery) {
    this.playtimeGames$ = this.accountGameQuery.playtimeGames$;
  }
}