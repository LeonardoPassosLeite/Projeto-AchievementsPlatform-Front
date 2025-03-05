import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './commons/error-handlig.service';

@Injectable({ providedIn: 'root' })
export class GameFeedbackService {
  private readonly baseUrl = `${environment.baseUrl}/gamefeedback`;

  constructor(private http: HttpClient,
    private errorHandlingService: ErrorHandlingService) { }

  addGameFeedback(token: string, feedbackData: { accountGameId: number, comment: string, rating: number, recommend: boolean }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(`${this.baseUrl}/create-feedback`, feedbackData, { headers, withCredentials: true })
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
          return throwError(() => new Error(errorMessage));
        })
      );
  }
}