import { Injectable } from '@angular/core';
import { GameAchievement } from '../../models/game-achievement';
import { GameStats } from '../../models/game-stats.model';

@Injectable({
  providedIn: 'root'
})
export class InsightPlatinumService {

  constructor() { }

  countPlatinasByMonth(achievements: GameAchievement[], gameStatsList: GameStats[], year: string): Record<string, number> {
    const platinasByMonth: Record<string, number> = {};
    const countedGames = new Set<number>();

    achievements.forEach((achievement) => {
      if (achievement.unlockTime && achievement.unlockTime !== 0) {
        const date = new Date(achievement.unlockTime * 1000);
        const achievementYear = date.getFullYear().toString();

        if (achievementYear === year) {
          const gameStats = gameStatsList.find((stats) => stats.id === achievement.accountGameId);

          if (gameStats && gameStats.platinum && !countedGames.has(achievement.accountGameId)) {
            countedGames.add(achievement.accountGameId);

            const month = date.toLocaleString('pt-BR', { month: 'long' });
            const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

            if (platinasByMonth[monthCapitalized]) {
              platinasByMonth[monthCapitalized]++;
            } else {
              platinasByMonth[monthCapitalized] = 1;
            }
          }
        }
      }
    });

    return platinasByMonth;
  }

  countPlatinasByYear(achievements: GameAchievement[], gameStatsList: GameStats[]): Record<string, number> {
    const platinasByYear: Record<string, number> = {};
    const countedGames = new Set<number>();

    achievements.forEach((achievement) => {
      if (achievement.unlockTime && achievement.unlockTime !== 0) {
        const date = new Date(achievement.unlockTime * 1000);
        const year = date.getFullYear().toString();

        const gameStats = gameStatsList.find((stats) => stats.id === achievement.accountGameId);

        if (gameStats && gameStats.platinum && !countedGames.has(achievement.accountGameId)) {
          countedGames.add(achievement.accountGameId);

          if (platinasByYear[year]) {
            platinasByYear[year]++;
          } else {
            platinasByYear[year] = 1;
          }
        }
      }
    });

    return platinasByYear;
  }
}