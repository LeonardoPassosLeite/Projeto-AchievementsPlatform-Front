import { GameStatus } from "../enums/game-status";
import { RankingTier } from "../enums/ranking-tier";
import { GameStatsBase } from "./game-stats.model";

export interface AccountGameBase {
    id: number;
    gameName: string;
    iconUrl?: string;
}

export interface AccountGameRankingTier extends AccountGameBase {
    rankingTier: RankingTier;
}

export interface AccountGamePlaytimePreview extends AccountGameBase {
    playtimeForever: number;
}

export interface AccountGameFeedback extends AccountGamePlaytimePreview { }

export interface AccountGameStatus extends AccountGameBase {
    playtimeForever: number;
    gameStatusManager: {
        gameStatus: GameStatus;
    };
}

export interface AccountGame extends AccountGameBase {
    playtimeForever: number;
    rankingPosition: number;
    rankingTier?: RankingTier;
    gameStats: GameStatsBase;
    gameStatusManager: {
        gameStatus: GameStatus;
    };
}

export interface AccountGameWithAchievements extends AccountGameBase {
    gameStats: GameStatsBase;
}

export interface AccountAllGames extends AccountGameStatus {
    playtimeForever: number;
    totalFeedbacks: number;
    averageRating: number;
    gameStats: {
        totalUserAchievements: number;
        totalAchievements: number;
    };
}

export interface ViewGameRankingPosition extends AccountGameBase {
    accountGameId: number;
    rankingPosition: number;
}

export interface ViewGameRankingTier extends AccountGameBase {
    accountGameId: number;
    rankingTier: RankingTier;
}