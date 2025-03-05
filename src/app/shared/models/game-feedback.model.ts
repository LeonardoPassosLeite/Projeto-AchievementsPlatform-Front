import { AccountGameBase, } from "./account-game.model";
import { SteamUserFeedback } from "./steam-user.model";

export interface GameFeedback {
    id: number;
    accountGameId: number;
    accountGame: AccountGameBase
    comment: string;
    rating: number;
    recommend: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GameFeedbackWithSteamUser extends GameFeedback {
    steamUserId: number;
    steamUserFeedback: SteamUserFeedback;
}

export interface AccountGameMeta {
    gameName: string;
    iconUrl: string;
    playtimeForever: number;
}

export interface GameFeedbackWithMeta {
    items: GameFeedbackWithSteamUser[];
    totalItems: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    meta?: AccountGameMeta;
}