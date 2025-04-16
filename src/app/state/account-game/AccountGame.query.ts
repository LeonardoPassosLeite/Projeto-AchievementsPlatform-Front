import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { AccountGameState } from './AccountGame.state';
import { map, Observable, startWith } from 'rxjs';
import { AccountAllGames, AccountGame, AccountGamePlaytimePreview, AccountGameRankingTier, AccountGameStatus, ViewGameRankingTier } from '../../shared/models/account-game.model';
import { GameStatus } from '../../shared/enums/game-status';
import { AccountGameStore } from './AccountGame.store';
import { GameStats, GameStatsBase } from '../../shared/models/game-stats.model';
import { RankingTier } from '../../shared/enums/ranking-tier.enum';


@Injectable({ providedIn: 'root' })
export class AccountGameQuery extends Query<AccountGameState> {
  accountGames$: Observable<AccountGame[]>;
  isLoading$: Observable<boolean>;
  platinumGames$: Observable<AccountGame[]>;
  playtimeGames$: Observable<AccountGame[]>;
  completedGames$: Observable<AccountGame[]>;
  droppedGames$: Observable<AccountGame[]>;
  unrankedTierGames$: Observable<AccountGameRankingTier[]>;
  rankedTierGames$: Observable<AccountGameRankingTier[]>;
  notStarted$: Observable<AccountGameStatus[]>;
  assignedStatus$: Observable<AccountGameStatus[]>;
  allGamesWithRaiting$: Observable<AccountAllGames[]>;
  achievementMatchPercentage$: Observable<number>;

  constructor(protected override store: AccountGameStore) {
    super(store);

    this.accountGames$ = this.select('accountGames').pipe(map(games => games ?? []));
    this.isLoading$ = this.select('isLoading');
    this.platinumGames$ = this.getPlatinumGames();
    this.playtimeGames$ = this.getPlayedGames();
    this.completedGames$ = this.getCompletedGames();
    this.droppedGames$ = this.getDroppedGames();

    this.unrankedTierGames$ = this.getUnrankedTierGames();
    this.rankedTierGames$ = this.getRankedTierGames();

    this.notStarted$ = this.getNotStartedGames();
    this.assignedStatus$ = this.getAssignedStatusGames();

    this.allGamesWithRaiting$ = this.getAllGamesWithRatings();

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

  private transformToGameProgress(game: AccountGame) {
    const { id, gameName, iconUrl, playtimeForever, rankingPosition, gameStats, gameStatusManager } = game;

    return {
      id,
      gameName,
      iconUrl,
      playtimeForever,
      rankingPosition,
      gameStats: {
        id: gameStats.id,
        platinum: gameStats.platinum,
        totalAchievements: gameStats.totalAchievements,
        totalGameSteamPoints: gameStats.totalGameSteamPoints,
        totalUserAchievements: gameStats.totalUserAchievements,
        totalUserSteamPoints: gameStats.totalUserSteamPoints
      },
      gameStatusManager: {
        gameStatus: gameStatusManager.gameStatus
      }
    };
  }

  private getFilteredGames(predicate: (game: AccountGame) => boolean): Observable<AccountGame[]> {
    return this.select(state => {
      return (state.accountGames ?? [])
        .filter(predicate)
        .map(game => this.transformToGameProgress(game));
    }).pipe(map(games => games ?? []));
  }

  private getFilteredTierGames(predicate: (game: AccountGame) => boolean, tier: RankingTier | null): Observable<AccountGameRankingTier[]> {
    return this.accountGames$.pipe(
      map(games =>
        (games || [])
          .filter(predicate)
          .map(game => ({
            id: game.id,
            gameName: game.gameName,
            iconUrl: game.iconUrl,
            rankingTier: tier ?? game.rankingTier!
          }))
      ),
      startWith([])
    );
  }

  private getFilteredStatusGames(predicate: (game: AccountGame) => boolean, fallbackStatus?: GameStatus): Observable<AccountGameStatus[]> {
    return this.accountGames$.pipe(
      map(games =>
        (games || [])
          .filter(predicate)
          .map(game => ({
            id: game.id,
            gameName: game.gameName,
            iconUrl: game.iconUrl,
            playtimeForever: game.playtimeForever,
            gameStatusManager: {
              gameStatus: fallbackStatus ?? game.gameStatusManager!.gameStatus
            }
          }))
      ),
      startWith([])
    );
  }

  //Stats
  private getPlatinumGames(): Observable<AccountGame[]> {
    return this.getFilteredGames(game => !!game.gameStats?.platinum);
  }

  private getCompletedGames(): Observable<AccountGame[]> {
    return this.getFilteredGames(game => game.gameStatusManager?.gameStatus === GameStatus.Completed);
  }

  private getDroppedGames(): Observable<AccountGame[]> {
    return this.getFilteredGames(game => game.gameStatusManager?.gameStatus === GameStatus.Abandoned);
  }

  private getPlayedGames(): Observable<AccountGame[]> {
    return this.getFilteredGames(game => {
      const hasPlaytime = game.playtimeForever > 0;
      const isNotPlatinum = !game.gameStats?.platinum;
      const isNotCompleted = game.gameStatusManager?.gameStatus !== GameStatus.Completed;
      return hasPlaytime && isNotPlatinum && isNotCompleted;
    });
  }

  //Status Manager
  private getNotStartedGames(): Observable<AccountGameStatus[]> {
    return this.getFilteredStatusGames(
      game =>
        game.gameStatusManager?.gameStatus == null ||
        game.gameStatusManager?.gameStatus === GameStatus.NotStarted,
      GameStatus.NotStarted
    );
  }

  private getAssignedStatusGames(): Observable<AccountGameStatus[]> {
    return this.getFilteredStatusGames(
      game =>
        game.gameStatusManager?.gameStatus != null &&
        game.gameStatusManager?.gameStatus !== GameStatus.NotStarted
    );
  }

  //All Games With Comments
  getAllGamesWithRatings(): Observable<AccountAllGames[]> {
    return this.accountGames$.pipe(
      map(games =>
        games
          .filter(game =>
            typeof (game as any).totalFeedbacks === 'number' &&
            typeof (game as any).averageRating === 'number' &&
            typeof game.gameStats?.totalUserAchievements === 'number' &&
            typeof game.gameStats?.totalAchievements === 'number' &&
            typeof game.gameStatusManager?.gameStatus === 'number'
          )
          .map(game => ({
            id: game.id,
            gameName: game.gameName,
            iconUrl: game.iconUrl,
            playtimeForever: game.playtimeForever,
            totalFeedbacks: (game as any).totalFeedbacks,
            averageRating: (game as any).averageRating,
            gameStatusManager: {
              gameStatus: game.gameStatusManager!.gameStatus
            },
            gameStats: {
              totalUserAchievements: game.gameStats!.totalUserAchievements,
              totalAchievements: game.gameStats!.totalAchievements
            }
          }))
      )
    );
  }

  //UserInsights
  getAllGamesPlaytimePreview(): Observable<AccountGamePlaytimePreview[]> {
    return this.accountGames$.pipe(
      map(games =>
        games
          .map(({ id, gameName, iconUrl, playtimeForever }) => ({
            id,
            gameName,
            iconUrl,
            playtimeForever
          }))
          .sort((a, b) => b.playtimeForever - a.playtimeForever)
      )
    );
  }

  getGameStatsList(): GameStats[] {
    return this.getValue().accountGames
      .map(x => x.gameStats)
      .filter((x): x is GameStats => !!x && 'achievements' in x);
  }
  
  //Rankings
  private getUnrankedTierGames(): Observable<AccountGameRankingTier[]> {
    return this.getFilteredTierGames(
      game => game.rankingTier == null || game.rankingTier === RankingTier.Unranked,
      RankingTier.Unranked
    );
  }

  private getRankedTierGames(): Observable<AccountGameRankingTier[]> {
    return this.getFilteredTierGames(
      game => typeof game.rankingTier === 'number' && game.rankingTier > 0,
      null
    );
  }

  getTopPlayedGames$(top: number = 10): Observable<AccountGame[]> {
    return this.accountGames$.pipe(
      map(games => {
        const validGames = games.filter(g => g.playtimeForever > 0);
        const sortedGames = validGames.sort((a, b) => b.playtimeForever - a.playtimeForever);
        return sortedGames.slice(0, top);
      })
    );
  }

  getRankingPosition$(totalPositions: number = 10): Observable<(AccountGame | null)[]> {
    return this.accountGames$.pipe(
      map(games => {
        const ranked = Array.from({ length: totalPositions }, (_, i) =>
          games.find(g => g.rankingPosition === i + 1) || null
        );
        return ranked;
      })
    );
  }
}