import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AccountGameWithAchievements } from '../models/account-game.model';
import { ErrorHandlingService } from './commons/error-handlig.service';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/coomons/pagination.model';
import { GameAchievement } from '../models/game-achievement';

@Injectable({
  providedIn: 'root',
})
export class AccountGameDetailsService {
  private readonly baseUrl = environment.baseUrl;
  private gameDetails: AccountGameWithAchievements | null = null;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  setGameDetails(details: AccountGameWithAchievements): void {
    if (!details) {
      console.warn('Tentativa de definir detalhes do jogo com um valor inválido:', details);
      return;
    }
    this.gameDetails = details;
  }


  getStoredGameDetails(): AccountGameWithAchievements | null {
    return this.gameDetails;
  }

  clearGameDetails(): void {
    this.gameDetails = null;
  }

  getGameDetailsWithPagedAchievements(
    token: string,
    gameId: number,
    pageNumber: number,
    pageSize: number
  ): Observable<PagedResult<GameAchievement>> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .get<{
        message: string;
        status: number;
        pagination: PagedResult<GameAchievement>;
      }>(`${this.baseUrl}/AccountGame/game-achievements/${gameId}`, {
        headers,
        params: {
          pageNumber: pageNumber.toString(),
          pageSize: pageSize.toString(),
        },
        withCredentials: true,
      })
      .pipe(
        map((response) => {
          if (!response.pagination)
            throw new Error('Dados de paginação ausentes na resposta da API.');

          return response.pagination;
        }),
        catchError((error) => {
          const errorMessage = this.errorHandlingService.handleHttpError(error);
          console.error('Erro ao carregar os detalhes do jogo e conquistas:', errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}