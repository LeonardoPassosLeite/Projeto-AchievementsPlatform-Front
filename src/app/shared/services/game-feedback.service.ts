import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './commons/error-handlig.service';
import { GameFeedbackRequest, GameFeedbackResponse, UserGameFeedbackResponse } from '../models/game-feedback.model';
import { PagedResult, PagedResultWithMeta, PaginationParams } from '../models/coomons/pagination.model';
import { AccountGameFeedback } from '../models/account-game.model';

@Injectable({ providedIn: 'root' })
export class GameFeedbackService {
  private readonly baseUrl = `${environment.baseUrl}/GameFeedback`;

  constructor(private http: HttpClient,
    private errorHandlingService: ErrorHandlingService) { }

  addGameFeedback(feedbackData: GameFeedbackRequest): Observable<GameFeedbackResponse> {
    return this.http.post(`${this.baseUrl}/create-feedback`, feedbackData)
      .pipe(
        map((response: any) => {
          if (!response || !response.message) {
            throw new Error('Erro inesperado ao enviar comentário.');
          }
          return response;
        }),
        catchError((error) => {
          const errorMessage = this.errorHandlingService.handleHttpError(error);
          console.error('Erro na requisição para criar feedback:', errorMessage);

          return throwError(() => ({
            ...error,
            handledMessage: errorMessage,
          }));
        })
      );
  }

  getPagedFeedbacksByGameId(gameId: number, { page, pageSize }: PaginationParams)
    : Observable<PagedResultWithMeta<GameFeedbackResponse, AccountGameFeedback>> {
    return this.http.get<PagedResultWithMeta<GameFeedbackResponse, AccountGameFeedback>>(
      `${this.baseUrl}/feedbacks/${gameId}/paged?pageNumber=${page}&pageSize=${pageSize}`
    ).pipe(
      catchError(error => {
        const errorMessage = this.errorHandlingService.handleHttpError(error);
        console.error('Erro ao buscar comentários paginados:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getPagedFeedbacksByUser({ page, pageSize }: PaginationParams)
    : Observable<PagedResult<UserGameFeedbackResponse>> {
    return this.http.get<PagedResult<UserGameFeedbackResponse>>(
      `${this.baseUrl}/feedbacks-users?pageNumber=${page}&pageSize=${pageSize}`
    ).pipe(
      catchError(error => {
        const errorMessage = this.errorHandlingService.handleHttpError(error);
        console.error('Erro ao buscar comentários do usuário:', errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}