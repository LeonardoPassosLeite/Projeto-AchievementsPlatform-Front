import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountGame } from '../../../../shared/models/account-game.model';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { AccountGameQuery } from '../../../../state/account-game/AccountGame.query';
import { GameListComponent } from '../../../../shared/components/game-list/game-list.component';

@Component({
  selector: 'app-account-game-platinum',
  standalone: true,
  imports: [GenericModule, GameListComponent],
  templateUrl: './account-game-platinum.component.html',
  styleUrl: './account-game-platinum.component.scss'
})
export class AccountGamePlatinumComponent {
  platinumGames$: Observable<AccountGame[]>;

  constructor(private accountGameQuery: AccountGameQuery) {
    this.platinumGames$ = this.accountGameQuery.platinumGames$;
  }
}