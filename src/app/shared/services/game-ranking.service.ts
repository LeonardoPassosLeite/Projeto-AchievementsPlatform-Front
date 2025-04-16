import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ErrorHandlingService } from './commons/error-handlig.service';
import { ViewGameRankingPosition, ViewGameRankingTier } from '../models/account-game.model';
import { RankingTier } from '../enums/ranking-tier.enum';
import { ApiResponse } from '../models/coomons/api-response.model';

@Injectable({ providedIn: 'root' })
export class GameRankingService {
    private readonly baseUrl = `${environment.baseUrl}/gameranking`;

    constructor(
        private http: HttpClient,
        private errorHandlingService: ErrorHandlingService
    ) { }

    //position
    updateRanking(rankingData: { accountGameId: number, rankingPosition: number }): Observable<ApiResponse<null>> {
        return this.http.put<ApiResponse<null>>(`${this.baseUrl}/update-ranking`, rankingData)
            .pipe(
                map((response) => {
                    if (!response?.message) {
                        throw new Error('Erro inesperado ao atualizar o ranking.');
                    }
                    return response;
                }),
                catchError((error) => {
                    const errorMessage = this.errorHandlingService.handleHttpError(error);
                    console.error('Erro ao atualizar ranking:', errorMessage);
                    return throwError(() => new Error(errorMessage));
                })
            );
    }

    resetRankingPosition(token: string, accountGameId: number): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.put(
            `${this.baseUrl}/reset-ranking-position`,
            { accountGameId },
            { headers, withCredentials: true }
        ).pipe(
            catchError(error => {
                const errorMessage = this.errorHandlingService.handleHttpError(error);
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    getUserRankedGames(token: string): Observable<ViewGameRankingPosition[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.get<{ data: ViewGameRankingPosition[] }>(
            `${this.baseUrl}/user-ranked-games`,
            { headers, withCredentials: true }
        ).pipe(
            map(response => response.data),
            catchError(error => {
                console.error('Erro ao obter jogos rankeados:', error);
                return throwError(() => new Error(
                    error.error?.message || 'Erro ao carregar ranking'
                ));
            })
        );
    }

    //tier
    updateRankingTier(data: { accountGameId: number, rankingTier: RankingTier }): Observable<ApiResponse<null>> {
        return this.http.put<ApiResponse<null>>(`${this.baseUrl}/update-ranking-tier`, data)
            .pipe(
                map((response) => {
                    if (!response?.message) {
                        throw new Error('Erro inesperado ao atualizar o tier.');
                    }
                    return response;
                }),
                catchError((error) => {
                    const errorMessage = this.errorHandlingService.handleHttpError(error);
                    console.error('Erro ao atualizar tier:', errorMessage);
                    return throwError(() => new Error(errorMessage));
                })
            );
    }

    resetRankingTier(token: string, accountGameId: number): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.put(
            `${this.baseUrl}/reset-ranking-tier`,
            { accountGameId },
            { headers, withCredentials: true }
        ).pipe(
            catchError(error => {
                const errorMessage = this.errorHandlingService.handleHttpError(error);
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    getUserRankedTiers(token: string): Observable<ViewGameRankingTier[]> {
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });

        return this.http.get<{ data: ViewGameRankingTier[] }>(
            `${this.baseUrl}/user-ranked-tiers`,
            { headers, withCredentials: true }
        ).pipe(
            map(response => response.data),
            catchError(error => {
                console.error('Erro ao obter jogos por tier:', error);
                return throwError(() => new Error(
                    error.error?.message || 'Erro ao carregar tiers'
                ));
            })
        );
    }
}