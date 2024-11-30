export interface AccountGame {
    appId: number;
    gameName: string;
    iconUrl: string;
    playtimeForever: number;
    achievementsCount: number;
    totalAchievements: number;
    formattedPlaytime?: string;
}