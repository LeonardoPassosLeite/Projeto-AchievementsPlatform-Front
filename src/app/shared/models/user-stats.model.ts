export interface UserStats {
    allPlatinum: number;
    allPlaytimeForever: number;
    allGames: number;
    allGamesWithAchievements: number;
    allAchievements: number;
    mostPlayedGame: number;
    platinumGamesPercentage: number;
    totalSteamPoints: number;
    totalFeedbacks: number;
    ranking: number;
    obtainedXp: number;
    totalXp: number;
    level: number;
}

export interface UserStatsRanking {
    ranking: number;
    totalSteamPoints: number;
    allPlatinum: number;
    level: number;
}