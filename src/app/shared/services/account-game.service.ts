import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandlingService } from './commons/error-handlig.service';
import { AccountGame } from '../models/account-game.model';
import { PagedResult } from '../models/coomons/pagination.model';

@Injectable({
    providedIn: 'root',
})
export class AccountGameService {
    private readonly baseUrl = environment.baseUrl;

    constructor(
        private http: HttpClient,
        private errorHandlingService: ErrorHandlingService
    ) { }

    addAccountGames(token: string): Observable<AccountGame> {
        return this.http.post<AccountGame>(`${this.baseUrl}/accountgame/store-games`, {}, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }),
            withCredentials: true,
        }).pipe(
            map(response => {
                console.log('Resposta do servidor:', response);
                return response;
            }),
            catchError(error => {
                const errorMessage = this.errorHandlingService.handleHttpError(error);
                console.error('Erro na requisição para store-games:', errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    getPagedAccountGames(token: string, pageNumber: number = 1, pageSize: number = 10)
        : Observable<PagedResult<AccountGame>> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        return this.http
            .get<PagedResult<AccountGame>>(`${this.baseUrl}/accountgame/stored-games`, {
                headers,
                params: {
                    pageNumber: pageNumber.toString(),
                    pageSize: pageSize.toString(),
                },
                withCredentials: true,
            })
            .pipe(
                catchError((error) => {
                    const errorMessage =
                        this.errorHandlingService.handleHttpError(error);
                    console.error(
                        'Erro na requisição para stored-games (lazy loading):',
                        errorMessage
                    );
                    return throwError(() => new Error(errorMessage));
                })
            );
    }

    getPagedAccountGamesWithAchievements(
        token: string,
        pageNumber: number = 1,
        pageSize: number = 10
    ): Observable<PagedResult<AccountGame>> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        return this.http
            .get<PagedResult<AccountGame>>(`${this.baseUrl}/accountgame/stored-games-with-achievements`, {
                headers,
                params: {
                    pageNumber: pageNumber.toString(),
                    pageSize: pageSize.toString(),
                },
                withCredentials: true,
            })
            .pipe(
                catchError((error) => {
                    const errorMessage =
                        this.errorHandlingService.handleHttpError(error);
                    console.error(
                        'Erro na requisição para stored-games (lazy loading):',
                        errorMessage
                    );
                    return throwError(() => new Error(errorMessage));
                })
            );
    }
}