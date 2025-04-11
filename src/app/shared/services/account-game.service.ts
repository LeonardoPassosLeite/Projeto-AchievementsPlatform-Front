import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { ErrorHandlingService } from './commons/error-handlig.service';
import { AccountGame } from '../models/account-game.model';
import { PagedResult, PaginationParams } from '../models/coomons/pagination.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/coomons/api-response.model';
import { AccountGameStore } from '../../state/account-game/AccountGame.store';

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

    getPagedAccountGamesWithAchievements({ page, pageSize }: PaginationParams): Observable<PagedResult<AccountGame>> {
        return this.http.get<ApiResponse<PagedResult<AccountGame>>>(
            `${this.baseUrl}/all-games-with-achievements?pageNumber=${page}&pageSize=${pageSize}`,
            { withCredentials: true }
        ).pipe(
            map(response => {
                if (!response || !response.value) {
                    console.warn('Resposta inesperada da API:', response);
                    throw new Error(response?.message || 'Erro desconhecido ao buscar os jogos.');
                }
                return response.value;
            }),
            catchError(error => {
                const errorMessage = this.errorHandlingService.handleHttpError(error);
                console.error('Erro na requisição para all-games-with-achievements:', errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}