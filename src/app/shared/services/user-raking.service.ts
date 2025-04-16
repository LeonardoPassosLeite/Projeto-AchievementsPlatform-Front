import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { UserRanking } from '../models/user-ranking.model';
import { ErrorHandlingService } from './commons/error-handlig.service';

@Injectable({
    providedIn: 'root',
})
export class UserRankingService {
    private readonly baseUrl = `${environment.baseUrl}/userRanking`;

    constructor(
        private http: HttpClient,
        private errorHandlingService: ErrorHandlingService
    ) { }

    getUserRankingByType(type: string): Observable<UserRanking[]> {
        return this.http
            .get<{ message: string; data: UserRanking[] }>(
                `${this.baseUrl}/ranking/${type}`,
                { withCredentials: true }
            )
            .pipe(
                map(response => response.data),
                catchError(error =>
                    throwError(() => new Error(this.errorHandlingService.handleWithLog(error, 'Erro ao buscar ranking')))
                )
            );
    }
}