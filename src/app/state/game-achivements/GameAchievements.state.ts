export interface AchievementInsightsState {
    totalAchievements: number;
    totalUserAchievements: number;
    totalGamesWithAchievements: number;
    platinumGames: number;
    achievementsByYear: Record<string, number>;
    achievementsByMonth: Record<string, number>;
    loading: boolean;
    error: string | null;
  }
  
  export function createAchievementInsightsInitialState(): AchievementInsightsState {
    return {
      totalAchievements: 0,
      totalUserAchievements: 0,
      totalGamesWithAchievements: 0,
      platinumGames: 0,
      achievementsByYear: {},
      achievementsByMonth: {},
      loading: false,
      error: null
    };
  }
  