import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { ErrorHandlingService } from "./commons/error-handlig.service";
import { GameAchievement } from "../models/game-achievement";
import { PagedResult } from "../models/coomons/pagination.model";
import { catchError, map, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class GameAchievementService {
  private readonly baseUrl = `${environment.baseUrl}/GameAchievement`;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  getPagedAchievements(
    token: string,
    pageNumber: number = 1,
    pageSize: number = 10
  ): Observable<PagedResult<GameAchievement>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .get<{ message: string; status: number; pagination: PagedResult<GameAchievement> }>(
        `${this.baseUrl}/user-achievements`,
        {
          headers,
          params: {
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
          },
          withCredentials: true,
        }
      )
      .pipe(
        map((response) => {
          if (!response || response.status !== 200 || !response.pagination) {
            console.warn('Resposta inesperada da API:', response);
            throw new Error(response?.message || 'Erro desconhecido ao buscar os jogos.');
          }
          return response.pagination;
        }),
        catchError((error) => {
          const errorMessage = this.errorHandlingService.handleHttpError(error);
          console.error('Erro na requisição para all-games-with-achievements:', errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }


}