import { AccountGame } from "./account-game.model";
import { PagedResult } from "./coomons/pagination.model";

export interface GameAchievement {
    id: number;
    name: string;
    achieved: boolean;
    unlockTime: number;
    icon: string;
    description: string;
    rarity: number;
    steamPoints: number;
    accountGameId: number;
}

export interface Achievements extends AccountGame {
    pagination: PagedResult<GameAchievement>;
}