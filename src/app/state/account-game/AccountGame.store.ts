import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { AccountGameState, createInitialState } from './AccountGame.state';
import { GameStatus } from '../../shared/enums/GameStatus';
import { AccountGame } from '../../shared/models/account-game.model';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'accountGame' })
export class AccountGameStore extends Store<AccountGameState> {
  constructor() {
    super(createInitialState());
  }

  loadMorePlatinumGames(): void {
    const state = this.getValue();
    const perPage = 10;
    const totalPlatinumGames = state.accountGames.filter(game => game.gameStats.platinum);

    const nextPage = state.platinumPage + 1;
    const gamesToShow = totalPlatinumGames.slice(0, nextPage * perPage);

    this.update({
      accountGames: state.accountGames,
      platinumPage: nextPage,
    });
  }

  updateGameStatus(gameId: number, newStatus: GameStatus): void {
    const state = this.getValue();
    const updatedGames = state.accountGames.map(game =>
      game.id === gameId ? { ...game, gameStatusManager: { gameStatus: newStatus } } : game
    );

    this.update({ accountGames: updatedGames });
  }

}