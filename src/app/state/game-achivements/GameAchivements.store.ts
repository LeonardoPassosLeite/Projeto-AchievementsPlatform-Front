import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { AchievementInsightsState, createAchievementInsightsInitialState } from './GameAchievements.state';

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'achievementInsights' })
export class AchievementInsightsStore extends Store<AchievementInsightsState> {
  constructor() {
    super(createAchievementInsightsInitialState());
  }

  override setLoading(loading: boolean): void {
    this.update({ loading });
  }

  setErrorMessage(error: string | null): void {
    this.update({ error });
  }

  setTotals(totalUserAchievements: number, totalAchievements: number): void {
    console.log('[Store] setTotals →', { totalUserAchievements, totalAchievements });
    this.update({ totalUserAchievements, totalAchievements });
  }
  
  setGameStats(totalGamesWithAchievements: number, platinumGames: number): void {
    console.log('[Store] setGameStats →', { totalGamesWithAchievements, platinumGames });
    this.update({ totalGamesWithAchievements, platinumGames });
  }
  

  setAchievementsByYear(data: Record<string, number>): void {
    this.update({ achievementsByYear: data });
  }

  setAchievementsByMonth(data: Record<string, number>): void {
    this.update({ achievementsByMonth: data });
  }

  clearState(): void {
    this.reset();
  }
}
