import { GameAchievement } from "./game-achievement";

export interface GameStats {
    id: number;
    totalUserAchievements: number;
    totalAchievements: number;
    totalGameSteamPoints: number;
    totalUserSteamPoints: number;
    platinum: boolean;
    achievements: GameAchievement[]; 
}