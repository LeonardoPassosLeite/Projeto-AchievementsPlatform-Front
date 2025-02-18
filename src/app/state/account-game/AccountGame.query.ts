import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AccountGameState } from './AccountGame.state';
import { AccountGameStore } from './AccountGame.store';
import { map, Observable } from 'rxjs';
import { AccountGame } from '../../shared/models/account-game.model';

@Injectable({ providedIn: 'root' })
export class AccountGameQuery extends Query<AccountGameState> {
  accountGames$: Observable<AccountGame[]>;
  isLoading$: Observable<boolean>;
  platinumGames$: Observable<AccountGame[]>;

  constructor(protected override store: AccountGameStore) {
    super(store);

    this.accountGames$ = this.select('accountGames').pipe(
      map(games => games ?? []) 
    );

    this.isLoading$ = this.select('isLoading');

    this.platinumGames$ = this.select(state => {
      const perPage = 10;
      const platinumGames = (state.accountGames ?? []).filter(game => game.gameStats?.platinum);
      return platinumGames.slice(0, state.platinumPage * perPage);
    }).pipe(map(games => games ?? []));  
  }

  loadMorePlatinumGames(): void {
    this.store.loadMorePlatinumGames();
  }
}
