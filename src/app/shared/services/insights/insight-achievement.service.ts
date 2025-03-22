
import { Injectable } from '@angular/core';
import { GameAchievement } from '../../models/game-achievement';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { GameAchievementService } from '../game-achievement.service';

@Injectable({
  providedIn: 'root'
})
export class InsightAchievementService {
  private readonly baseUrl = `${environment.baseUrl}/GameAchievement`;

  constructor(private gameAchievementService: GameAchievementService) { }

  getAllAchievements(token: string): Observable<GameAchievement[]> {
    const pageSize = 100;
    let pageNumber = 1;
    let allAchievements: GameAchievement[] = [];

    const loadPage = (): Observable<GameAchievement[]> => {
      return this.gameAchievementService.getPagedAchievements(token, pageNumber, pageSize).pipe(
        switchMap((pagedResult) => {
          allAchievements = [...allAchievements, ...pagedResult.items];

          if (pagedResult.items.length === pageSize) {
            pageNumber++;
            return loadPage();
          } else {
            return of(allAchievements);
          }
        })
      );
    };

    return loadPage();
  }

  countAchievementsByMonth(achievements: GameAchievement[]): Record<string, number> {
    const achievementsByMonth: Record<string, number> = {};

    achievements.forEach((achievement) => {
      if (achievement.unlockTime && achievement.unlockTime !== 0) {
        const date = new Date(achievement.unlockTime * 1000);
        const month = date.toLocaleString('pt-BR', { month: 'long' });
        const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

        if (achievementsByMonth[monthCapitalized]) {
          achievementsByMonth[monthCapitalized]++;
        } else {
          achievementsByMonth[monthCapitalized] = 1;
        }
      }
    });

    return achievementsByMonth;
  }

  countAchievementsByYear(achievements: GameAchievement[]): Record<string, number> {
    const achievementsByYear: Record<string, number> = {};

    achievements.forEach((achievement) => {
      if (achievement.unlockTime && achievement.unlockTime !== 0) {
        const date = new Date(achievement.unlockTime * 1000);
        const year = date.getFullYear().toString();

        if (achievementsByYear[year]) {
          achievementsByYear[year]++;
        } else {
          achievementsByYear[year] = 1;
        }
      }
    });

    return achievementsByYear;
  }

  filterAchievementsByYearLocal(achievements: GameAchievement[], year: string): GameAchievement[] {
    return achievements.filter((achievement) => {
      if (achievement.unlockTime && achievement.unlockTime !== 0) {
        const date = new Date(achievement.unlockTime * 1000);
        return date.getFullYear().toString() === year;
      }
      return false;
    });
  }
}