import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { AccountGameState, createInitialState } from './AccountGame.state';
import { AccountGame } from '../../shared/models/account-game.model';
import { GameStatus } from '../../shared/enums/GameStatus';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'accountGame' })
export class AccountGameStore extends Store<AccountGameState> {

  constructor() {
    super(createInitialState());
  }

  setAccountGames(accountGames: AccountGame[]) {
    this.update(state => ({
      ...state,
      accountGames: [...state.accountGames, ...accountGames],
    }));
  }

  override setLoading(loading: boolean) {
    this.update(state => ({
      ...state,
      isLoading: loading,
    }));
  }

  updateGameStatus(gameId: number, newStatus: GameStatus) {
    const state = this.getValue();
    const updatedGames = state.accountGames.map(game =>
      game.id === gameId ? { ...game, gameStatusManager: { gameStatus: newStatus } } : game
    );
    this.update({ accountGames: updatedGames });
  }
}