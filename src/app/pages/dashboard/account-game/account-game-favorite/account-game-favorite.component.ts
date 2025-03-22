import { Component, OnInit } from '@angular/core';
import { AccountGame } from '../../../../shared/models/account-game.model';
import { Observable } from 'rxjs';
import { AccountGameQuery } from '../../../../state/account-game/AccountGame.query';

@Component({
  selector: 'app-account-game-favorite',
  standalone: true,
  imports: [],
  templateUrl: './account-game-favorite.component.html',
  styleUrl: './account-game-favorite.component.scss'
})
export class AccountGameFavoriteComponent implements OnInit {
  accountGames$: Observable<AccountGame[]>;

  ngOnInit(): void {
    console.log("Jogos: ", this.accountGames$)
  }

  constructor(private accountGameQuery: AccountGameQuery) {
    this.accountGames$ = this.accountGameQuery.accountGames$;
  }
}
