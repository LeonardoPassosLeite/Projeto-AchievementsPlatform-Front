import { PagedResult } from "./coomons/pagination.model";
import { GameAchievement } from "./game-achievement";
import { GameStats } from "./game-stats.model";

export interface AccountGame {
    id: number;
    gameName: string;
    iconUrl: string;
    playtimeForever: number;
    gameStats: GameStats;
}

export interface AccountGameWithAchievements extends AccountGame {
    achievements: PagedResult<GameAchievement>;
}

// export interface AccountGameWithFeedbacks extends AccountGame {
//     feedbacks: GameFeedbackWithSteamUser[];
// }