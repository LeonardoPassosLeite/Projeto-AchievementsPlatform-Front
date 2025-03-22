import { AccountGame } from "../../shared/models/account-game.model";

export interface AccountGameState {
    accountGames: AccountGame[];
    platinumPage: number;
    isLoading: boolean;
    hasMore: boolean;
}

export function createInitialState(): AccountGameState {
    return {
        accountGames: [],
        platinumPage: 1,
        isLoading: false,
        hasMore: true,
    };
}