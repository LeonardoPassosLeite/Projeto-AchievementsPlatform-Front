import { GameAchievement } from "../../shared/models/game-achievement";

export interface GameAchievementsState {
    gameAchievements: GameAchievement[];
    page: number;
    isLoading: boolean;
    hasMore: boolean;
}

export function createInitialState(): GameAchievementsState {
    return {
        gameAchievements: [],
        page: 1,
        isLoading: false,
        hasMore: true,
    };
}