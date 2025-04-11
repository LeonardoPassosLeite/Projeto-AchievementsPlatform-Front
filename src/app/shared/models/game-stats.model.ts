import { GameAchievement } from "./game-achievement";

export interface GameStatsBase {
    id: number;
    totalUserAchievements: number;
    totalAchievements: number;
    totalGameSteamPoints: number;
    totalUserSteamPoints: number;
    platinum: boolean;
}
export interface GameStats extends GameStatsBase{
    achievements: GameAchievement[]; 
}