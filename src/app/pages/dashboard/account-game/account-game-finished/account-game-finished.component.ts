import { Component } from '@angular/core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { GameListComponent } from '../../../../shared/components/game-list/game-list.component';
import { Observable } from 'rxjs';
import { AccountGame } from '../../../../shared/models/account-game.model';
import { AccountGameQuery } from '../../../../state/account-game/AccountGame.query';

@Component({
  selector: 'app-account-game-finished',
  standalone: true,
  imports: [GenericModule, GameListComponent],
  templateUrl: './account-game-finished.component.html',
  styleUrl: './account-game-finished.component.scss'
})
export class AccountGameFinishedComponent {
  completedGames$: Observable<AccountGame[]>;

  constructor(private accountGameQuery: AccountGameQuery) {
    this.completedGames$ = this.accountGameQuery.completedGames$;
  }
}