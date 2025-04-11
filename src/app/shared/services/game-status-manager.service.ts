import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlingService } from './commons/error-handlig.service';
import { environment } from '../../../environments/environment';
import { GameStatus } from '../enums/game-status';
import { ApiResponse } from '../models/coomons/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class GameStatusManagerService {
  private baseUrl = `${environment.baseUrl}/gamestatusmanager`;

  constructor(
    private http: HttpClient,
    private errorHandlingService: ErrorHandlingService
  ) { }

  updateGameStatus(data: { accountGameId: number, newStatus: GameStatus }): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/update-game-status`, data)
      .pipe(
        map((response) => {
          if (!response?.message) {
            throw new Error('Erro inesperado ao atualizar o status.');
          }
          return response;
        }),
        catchError((error) => {
          const errorMessage = this.errorHandlingService.handleHttpError(error);
          console.error('Erro ao atualizar status:', errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}