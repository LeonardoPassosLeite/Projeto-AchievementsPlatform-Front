import { AccountGameFeedback } from "./account-game.model";
import { SteamUserFeedback } from "./steam-user.model";

export interface GameFeedbackRequest {
    accountGameId: number;
    comment: string;
    rating: number;
    recommend: boolean;
}

export interface GameFeedbackResponseBase {
    id: number;
    comment: string;
    rating: number;
    recommend: boolean;
    createdAt: string;
    updatedAt: string;
    steamUserId: number;
    steamUserFeedback: SteamUserFeedback;
}

export interface GameFeedbackResponse extends GameFeedbackResponseBase {
    accountGameId: number;
}

export interface UserGameFeedbackResponse extends GameFeedbackResponse { 
    accountGameFeedback: AccountGameFeedback;
}