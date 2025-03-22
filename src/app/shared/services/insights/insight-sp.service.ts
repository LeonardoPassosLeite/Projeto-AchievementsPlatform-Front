import { Injectable } from "@angular/core";
import { GameAchievement } from "../../models/game-achievement";

@Injectable({
  providedIn: 'root'
})
export class InsightSpService {

  constructor() { }

  sumSteamPointsByYear(achievements: GameAchievement[]): Record<string, number> {
    const steamPointsByYear: Record<string, number> = {};
  
    achievements.forEach((achievement) => {
      if (achievement.unlockTime && achievement.unlockTime !== 0 && achievement.steamPoints) {
        const date = new Date(achievement.unlockTime * 1000);
        const year = date.getFullYear().toString();
  
        steamPointsByYear[year] = (steamPointsByYear[year] || 0) + achievement.steamPoints;
      }
    });
  
    // Exibe o total de Steam Points por ano no console
    console.log('Total de Steam Points por ano:', steamPointsByYear);
  
    return steamPointsByYear;
  }

  sumSteamPointsByMonth(achievements: GameAchievement[], year: string): Record<string, number> {
    const steamPointsByMonth: Record<string, number> = {};

    achievements.forEach((achievement) => {
      if (achievement.unlockTime && achievement.unlockTime !== 0 && achievement.steamPoints) {
        const date = new Date(achievement.unlockTime * 1000);
        const achievementYear = date.getFullYear().toString();

        if (achievementYear === year) {
          const month = date.toLocaleString('pt-BR', { month: 'long' });
          const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

          steamPointsByMonth[monthCapitalized] = (steamPointsByMonth[monthCapitalized] || 0) + achievement.steamPoints;
        }
      }
    });

    return steamPointsByMonth;
  }
}