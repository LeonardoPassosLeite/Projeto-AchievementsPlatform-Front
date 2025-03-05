import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ErrorHandlingService } from './commons/error-handlig.service';
import { AccountGame } from '../models/account-game.model';
import { PagedResult } from '../models/coomons/pagination.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/coomons/api-response.model';
import { AccountGameStore } from '../../state/account-game/AccountGame.store';
import { GameFeedback, GameFeedbackWithSteamUser } from '../models/game-feedback.model';

@Injectable({
    providedIn: 'root',
})
export class AccountGameService {
    private readonly baseUrl = `${environment.baseUrl}/accountgame`;

    constructor(
        private http: HttpClient,
        private accountGameStore: AccountGameStore,
        private errorHandlingService: ErrorHandlingService
    ) { }

    addAccountGames(token: string): Observable<ApiResponse<AccountGame[]>> {
        if (!token) {
            console.error('Token ausente ao tentar salvar jogos');
            return throwError(() => new Error('Token ausente'));
        }

        return this.http.post<ApiResponse<AccountGame[]>>(`${this.baseUrl}/create-games`, {}, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }),
            withCredentials: true,
        }).pipe(
            tap((response) => {
                if (!response || !response.value) {
                    console.error('Resposta inesperada do backend:', response);
                    throw new Error('Resposta inesperada do backend: "value" não encontrado');
                }

                const newGames = response.value;

                this.accountGameStore.update({
                    accountGames: newGames,
                    isLoading: false
                });

            }),
            catchError((error) => {
                console.error('Erro ao salvar jogos:', error);
                this.accountGameStore.update({ isLoading: false });
                return throwError(() => new Error('Erro ao salvar jogos. Verifique o backend.'));
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
            .get<{ message: string; status: number; pagination: PagedResult<AccountGame> }>(
                `${this.baseUrl}/all-games-with-achievements`,
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

    getPagedGameFeedbacks(
        token: string,
        accountGameId: number,
        pageNumber: number = 1,
        pageSize: number = 10
    ): Observable<PagedResult<GameFeedbackWithSteamUser>> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        });

        return this.http
            .get<{ message: string; status: number; pagination: PagedResult<GameFeedbackWithSteamUser> }>(
                `${this.baseUrl}/game-feedbacks`,
                {
                    headers,
                    params: {
                        accountGameId: accountGameId.toString(),
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
                        throw new Error(response?.message || 'Erro desconhecido ao buscar os feedbacks.');
                    }
                    return response.pagination; 
                }),
                catchError((error) => {
                    const errorMessage = this.errorHandlingService.handleHttpError(error);
                    console.error('Erro na requisição para game-feedbacks:', errorMessage);
                    return throwError(() => new Error(errorMessage));
                })
            );
    }
}