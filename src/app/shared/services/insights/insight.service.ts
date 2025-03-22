import { Injectable } from '@angular/core';
import { GameAchievement } from '../../models/game-achievement';
import { GameStats } from '../../models/game-stats.model';
import { InsightSpService } from './insight-sp.service'; // Importe o InsightSpService

@Injectable({
  providedIn: 'root'
})
export class InsightService {

  constructor(private insightSpService: InsightSpService) { } // Injete o InsightSpService

  calculateSummaryStatistics(achievements: GameAchievement[], gameStatsList: GameStats[]): {
    totalAchievements: number,
    totalPlatinas: number,
    totalSteamPoints: number
  } {
    const uniqueAchievements = achievements.filter((achievement, index, self) =>
      index === self.findIndex((a) => a.id === achievement.id) 
    );

    const totalAchievements = uniqueAchievements.length;
    const totalPlatinas = gameStatsList.filter((stats) => stats.platinum).length;
    const steamPointsByYear = this.insightSpService.sumSteamPointsByYear(uniqueAchievements);
    const totalSteamPoints = Object.values(steamPointsByYear).reduce((total, value) => total + value, 0);

    return {
      totalAchievements,
      totalPlatinas,
      totalSteamPoints
    };
  }
}