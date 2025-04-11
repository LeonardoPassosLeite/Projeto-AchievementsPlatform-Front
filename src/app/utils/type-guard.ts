import { GameStats, GameStatsBase } from "../shared/models/game-stats.model";

export function isGameStats(stats: GameStatsBase | GameStats | undefined): stats is GameStats {
    return !!stats && 'achievements' in stats;
}