import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ErrorHandlingService } from '../commons/error-handlig.service';
import { GameAchievement } from '../../models/game-achievement';
import { PagedResult } from '../../models/coomons/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class InsightAchievementService {
  private readonly baseUrl = `${environment.baseUrl}/GameAchievement`;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  // getAllAchievements(): Observable<GameAchievement[]> {
  //   const pageSize = 100;
  //   let pageNumber = 1;
  //   let allAchievements: GameAchievement[] = [];

  //   const loadPage = (): Observable<GameAchievement[]> => {
  //     return this.getPagedAchievements(pageNumber, pageSize).pipe(
  //       switchMap((pagedResult) => {
  //         allAchievements = [...allAchievements, ...pagedResult.items];

  //         if (pagedResult.items.length === pageSize) {
  //           pageNumber++;
  //           return loadPage();
  //         } else {
  //           return of(allAchievements);
  //         }
  //       })
  //     );
  //   };

  //   return loadPage();
  // }

  // private getPagedAchievements(pageNumber: number, pageSize: number): Observable<PagedResult<GameAchievement>> {
  //   return this.http.get<PagedResult<GameAchievement>>(
  //     `${this.baseUrl}/paged-achievements?pageNumber=${pageNumber}&pageSize=${pageSize}`
  //   ).pipe(
  //     catchError(error => {
  //       const errorMessage = this.errorHandlingService.handleHttpError(error);
  //       console.error('Erro ao buscar achievements paginados:', errorMessage);
  //       return throwError(() => new Error(errorMessage));
  //     })
  //   );
  // }

  countAchievementsByMonth(achievements: GameAchievement[]): Record<string, number> {
    const achievementsByMonth: Record<string, number> = {};

    achievements.forEach((achievement) => {
      if (achievement.unlockTime && achievement.unlockTime !== 0) {
        const date = new Date(achievement.unlockTime * 1000);
        const month = date.toLocaleString('pt-BR', { month: 'long' });
        const monthCapitalized = month.charAt(0).toUpperCase() + month.slice(1);

        achievementsByMonth[monthCapitalized] = (achievementsByMonth[monthCapitalized] || 0) + 1;
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

        achievementsByYear[year] = (achievementsByYear[year] || 0) + 1;
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
