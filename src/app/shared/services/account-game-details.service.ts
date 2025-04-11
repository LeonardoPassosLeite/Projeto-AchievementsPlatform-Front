import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlingService } from './commons/error-handlig.service';
import { environment } from '../../../environments/environment';
import { PagedResult, PaginationParams } from '../models/coomons/pagination.model';
import { Achievements, GameAchievement } from '../models/game-achievement';
import { ApiResponse } from '../models/coomons/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AccountGameDetailsService {
  private readonly baseUrl = environment.baseUrl;
  private gameDetails: Achievements | null = null;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  setGameDetails(details: Achievements): void {
    if (!details) {
      console.warn('Tentativa de definir detalhes do jogo com um valor inválido:', details);
      return;
    }
    this.gameDetails = details;
  }

  getStoredGameDetails(): Achievements | null {
    return this.gameDetails;
  }

  getGameDetailsWithPagedAchievements(gameId: number, { page, pageSize }: PaginationParams)
    : Observable<PagedResult<GameAchievement>> {
    return this.http.get<ApiResponse<{ achievements: PagedResult<GameAchievement> }>>(
      `${this.baseUrl}/AccountGame/game-achievements/${gameId}?pageNumber=${page}&pageSize=${pageSize}`,
      { withCredentials: true }
    ).pipe(
      map((response) => {
        if (!response || !response.value?.achievements) {
          console.warn('Resposta inesperada da API:', response);
          throw new Error(response?.message || 'Erro ao carregar conquistas.');
        }
        return response.value.achievements;
      }),
      catchError((error) => {
        const errorMessage = this.errorHandlingService.handleHttpError(error);
        console.error('Erro ao carregar conquistas paginadas:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}