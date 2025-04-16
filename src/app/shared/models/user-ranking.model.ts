import { SteamUserRanking } from "./steam-user.model";

export interface UserRanking {
    steamUserId: number;
    steamUser: SteamUserRanking;
}