import { GameStatus } from "../enums/GameStatus";
import { PagedResult } from "./coomons/pagination.model";
import { GameAchievement } from "./game-achievement";
import { GameFeedbackWithSteamUser } from "./game-feedback.model";
import { GameStats } from "./game-stats.model";

export interface AccountGameBase {
    id: number;
    gameName: string;
    iconUrl: string;
}

export interface AccountGameSumary extends AccountGameBase {
    playtimeForever: number;
    totalFeedbacks: number;
    averageRating: number;
    gameStatusManager: {
        gameStatus: GameStatus;
    };
}

export interface AccountGame extends AccountGameSumary {
    gameStats: GameStats;
    feedbacks?: GameFeedbackWithSteamUser[];
}

export interface AccountGamePreview extends AccountGameSumary {
    gameStats: {
        totalUserAchievements: number;
        totalAchievements: number;
    };
}

export interface AccountGameWithAchievements extends AccountGame {
    pagination: PagedResult<GameAchievement>;
}