import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ErrorHandlingService } from './commons/error-handlig.service';
import { AccountGame } from '../models/account-game.model';
import { PagedResult } from '../models/coomons/pagination.model';
import { environment } from '../../../environments/environment';
import { BackendResponse } from '../models/coomons/api-response.model';
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
    ) {
        console.log('AccountGameService inicializado', this.accountGameStore);
    }

    addAccountGames(token: string): Observable<BackendResponse<AccountGame[]>> {
        if (!token) {
            console.error('Token ausente ao tentar salvar jogos');
            return throwError(() => new Error('Token ausente'));
        }

        return this.http.post<BackendResponse<AccountGame[]>>(`${this.baseUrl}/store-games`, {}, {
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

                console.log('Dados armazenados no AccountGameStore:', this.accountGameStore.getValue());
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
            .get<PagedResult<AccountGame>>(`${this.baseUrl}/all-games-with-achievements`, {
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
                        'Erro na requisição para all-games-with-achievements:',
                        errorMessage
                    );
                    return throwError(() => new Error(errorMessage));
                })
            );
    }
}