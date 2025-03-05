import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AccountGameState } from './AccountGame.state';
import { AccountGameStore } from './AccountGame.store';
import { map, Observable } from 'rxjs';
import { AccountGame, AccountGamePreview } from '../../shared/models/account-game.model';
import { GameStatus } from '../../shared/enums/GameStatus';
import { GameFeedback } from '../../shared/models/game-feedback.model';

@Injectable({ providedIn: 'root' })
export class AccountGameQuery extends Query<AccountGameState> {
  accountGames$: Observable<AccountGame[]>;
  isLoading$: Observable<boolean>;
  platinumGames$: Observable<AccountGame[]>;

  constructor(protected override store: AccountGameStore) {
    super(store);

    this.accountGames$ = this.select('accountGames').pipe(map(games => games ?? []));
    this.isLoading$ = this.select('isLoading');

    this.platinumGames$ = this.select(state => {
      const perPage = 10;
      const platinumGames = (state.accountGames ?? []).filter(game => game.gameStats?.platinum);
      return platinumGames.slice(0, state.platinumPage * perPage);
    }).pipe(map(games => games ?? []));

  }

  getAllGamesPreview$(): Observable<AccountGamePreview[]> {
    return this.accountGames$.pipe(
      map(games =>
        games.map(({ id, gameName, iconUrl, playtimeForever, totalFeedbacks, averageRating, gameStats, gameStatusManager }) => ({
          id,
          gameName,
          iconUrl,
          playtimeForever,
          totalFeedbacks,
          averageRating,
          gameStats: {
            totalUserAchievements: gameStats.totalUserAchievements,
            totalAchievements: gameStats.totalAchievements
          },
          gameStatusManager: {
            gameStatus: gameStatusManager.gameStatus
          }
        }))
      )
    );
  }

  loadMorePlatinumGames(): void {
    this.store.loadMorePlatinumGames();
  }

  getGamesByStatus$(status: GameStatus): Observable<AccountGame[]> {
    return this.accountGames$.pipe(
      map(games => games.filter(game => game.gameStatusManager?.gameStatus === status))
    );
  }

  getFeedbacksByGameId(gameId: number): Observable<GameFeedback[]> {
    return this.accountGames$.pipe(
      map(games => {
        const game = games.find(g => g.id === gameId);
        return game?.feedbacks ?? [];
      })
    );
  }
}