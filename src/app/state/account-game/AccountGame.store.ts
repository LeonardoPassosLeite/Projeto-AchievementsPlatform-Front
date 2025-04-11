import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { AccountGameState, createInitialState } from './AccountGame.state';
import { AccountGame } from '../../shared/models/account-game.model';
import { GameStatus } from '../../shared/enums/game-status';
import { RankingTier } from '../../shared/enums/ranking-tier';

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

  updateGameRankingPosition(gameId: number, rankingPosition: number) {
    this.update(state => ({
      accountGames: state.accountGames.map(game =>
        game.id === gameId ? { ...game, rankingPosition } : game
      )
    }));
  }  

  updateGameStatus(gameId: number, newStatus: GameStatus) {
    this.update(state => ({
      accountGames: state.accountGames.map(game =>
        game.id === gameId
          ? {
            ...game,
            gameStatusManager: {
              ...game.gameStatusManager,
              gameStatus: newStatus
            }
          }
          : game
      )
    }));
  }

  updateGameTier(gameId: number, newTier: RankingTier) {
    this.update(state => ({
      accountGames: state.accountGames.map(game =>
        game.id === gameId ? { ...game, rankingTier: newTier } : game
      )
    }));
  }
}