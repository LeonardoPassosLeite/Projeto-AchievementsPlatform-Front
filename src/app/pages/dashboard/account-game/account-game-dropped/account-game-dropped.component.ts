import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountGame } from '../../../../shared/models/account-game.model';
import { AccountGameQuery } from '../../../../state/account-game/AccountGame.query';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { GameListComponent } from '../../../../shared/components/games/game-list/game-list.component';

@Component({
  selector: 'app-account-game-dropped',
  standalone: true,
  imports: [GenericModule, GameListComponent],
  templateUrl: './account-game-dropped.component.html',
  styleUrl: './account-game-dropped.component.scss'
})
export class AccountGameDroppedComponent {
  droppedGames$: Observable<AccountGame[]>;

  constructor(private accountGameQuery: AccountGameQuery) {
    this.droppedGames$ = this.accountGameQuery.droppedGames$;
  }
}