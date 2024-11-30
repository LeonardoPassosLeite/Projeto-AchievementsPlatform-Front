import { AccountGame } from "../account-game.model";

export interface ApiResponse {
    success: boolean;
    games: AccountGame[];
    message?: string;
}