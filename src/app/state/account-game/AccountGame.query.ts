import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AccountGameState } from './AccountGame.state';
import { map, Observable } from 'rxjs';
import { AccountGame, AccountGamePlaytimePreview, AccountGamePreview } from '../../shared/models/account-game.model';
import { GameStatus } from '../../shared/enums/GameStatus';
import { AccountGameStore } from './AccountGame.store';
import { GameStats } from '../../shared/models/game-stats.model';

@Injectable({ providedIn: 'root' })
export class AccountGameQuery extends Query<AccountGameState> {
  accountGames$: Observable<AccountGame[]>;
  isLoading$: Observable<boolean>;
  platinumGames$: Observable<AccountGame[]>;
  playtimeGames$: Observable<AccountGame[]>;
  completedGames$: Observable<AccountGame[]>;
  droppedGames$: Observable<AccountGame[]>;
  achievementMatchPercentage$: Observable<number>;

  constructor(protected override store: AccountGameStore) {
    super(store);

    this.accountGames$ = this.select('accountGames').pipe(map(games => games ?? []));
    this.isLoading$ = this.select('isLoading');
    this.platinumGames$ = this.getPlatinumGames();
    this.playtimeGames$ = this.getPlayedGames();
    this.completedGames$ = this.getCompletedGames();
    this.droppedGames$ = this.getDroppedGames();
    this.achievementMatchPercentage$ = this.calculateAchievementMatchPercentage();
  }

  private calculateAchievementMatchPercentage(): Observable<number> {
    return this.accountGames$.pipe(
      map(games => {
        const gamesWithStats = games.filter(game => game.gameStats?.totalAchievements > 0);
        const totalGames = gamesWithStats.length;
        const platinumGames = gamesWithStats.filter(game => game.gameStats?.platinum).length;

        return totalGames > 0 ? (platinumGames / totalGames) * 100 : 0;
      })
    );
  }

  private getPlatinumGames(): Observable<AccountGame[]> {
    return this.select(state => {
      const platinumGames = (state.accountGames ?? [])
        .filter(game => game.gameStats?.platinum);

      return platinumGames;
    }).pipe(map(games => games ?? []));
  }

  private getPlayedGames(): Observable<AccountGame[]> {
    return this.select(state => {
      const playedGames = (state.accountGames ?? [])
        .filter(game => {
          const hasPlaytime = game.playtimeForever > 0;
          const isNotPlatinum = !game.gameStats?.platinum;
          const isNotCompleted = game.gameStatusManager.gameStatus !== GameStatus.Completed;

          return hasPlaytime && isNotPlatinum && isNotCompleted;
        })
        .sort((a, b) => b.playtimeForever - a.playtimeForever);

      return playedGames;
    }).pipe(map(games => games ?? []));
  }

  private getCompletedGames(): Observable<AccountGame[]> {
    return this.select(state => {
      const completedGames = (state.accountGames ?? [])
        .filter(game => game.gameStatusManager.gameStatus == GameStatus.Completed); 

      return completedGames;
    }).pipe(map(games => games ?? []));
  }

  private getDroppedGames(): Observable<AccountGame[]> {
    return this.select(state => {
      const droppedGames = (state.accountGames ?? [])
        .filter(game => game.gameStatusManager.gameStatus == GameStatus.Abandoned); 

      return droppedGames;
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

  getAllGamesPlaytimePreview(): Observable<AccountGamePlaytimePreview[]> {
    return this.accountGames$.pipe(
      map(games =>
        games
          .map(({ id, gameName, iconUrl, playtimeForever }) => ({
            id,
            gameName,
            iconUrl,
            playTimeForever: playtimeForever
          }))
          .sort((a, b) => b.playTimeForever - a.playTimeForever)
      )
    );
  }

  getGamesByStatus$(status: GameStatus): Observable<AccountGame[]> {
    return this.accountGames$.pipe(
      map(games => games.filter(game => game.gameStatusManager?.gameStatus === status))
    );
  }

  getGameStatsList(): GameStats[] {
    const accountGames = this.getValue().accountGames;

    const gameStatsList = accountGames
      .filter(game => game.gameStats)
      .map(game => game.gameStats);

    return gameStatsList;
  }

  getTopPlayedGames$(top: number = 3): Observable<AccountGame[]> {
    return this.accountGames$.pipe(
      map(games => {
        const validGames = games.filter(game => game.playtimeForever > 0);
        const sortedGames = validGames.sort((a, b) => b.playtimeForever - a.playtimeForever);
        const topGames = sortedGames.slice(0, top);
        return topGames;
      })
    );
  }

  // private getFeedbacksByGameId(gameId: number): Observable<GameFeedback[]> {
  //   return this.accountGames$.pipe(
  //     map(games => {
  //       const game = games.find(g => g.id === gameId);
  //       return game?.feedbacks ?? [];
  //     })
  //   );
  // }
}