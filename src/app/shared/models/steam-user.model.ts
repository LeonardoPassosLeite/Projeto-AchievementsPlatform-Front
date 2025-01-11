import { UserStats } from "./user-stats.model";

export interface SteamUser {
    steamUserId: string;
    displayName: string;
    avatarUrl: string;
    profileUrl: string;
    onlineStatus: string;
    lastLogoff: number;
    userStats: UserStats;
    steamLevel: number;
}