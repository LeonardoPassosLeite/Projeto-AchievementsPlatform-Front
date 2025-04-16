import { UserStats, UserStatsRanking } from "./user-stats.model";

export interface SteamUserFeedback {
    id: number;
    displayName: string;
    avatarUrl: string;
}

export interface SteamUserBase extends SteamUserFeedback {
    profileUrl: string;
}

export interface SteamUser extends SteamUserBase {
    onlineStatus: string;
    lastLogoff: number;
    userStats: UserStats;
}

export interface SteamUserRanking extends SteamUserBase {
    userStats: UserStatsRanking;
}