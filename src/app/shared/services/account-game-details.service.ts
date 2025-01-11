import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AccountGameWithAchievements } from '../models/account-game.model';
import { ErrorHandlingService } from './commons/error-handlig.service';

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
  ): Observable<AccountGameWithAchievements> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .get<{
        message: string;
        status: number;
        data: AccountGameWithAchievements;
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
          console.log('Resposta do backend:', response);
          return response.data; // Retorna apenas os dados do jogo
        }),
        catchError((error) => {
          const errorMessage = this.errorHandlingService.handleHttpError(error);
          console.error('Erro ao carregar os detalhes do jogo e conquistas:', errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}