import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { ErrorHandlingService } from './commons/error-handlig.service';
import { SteamUser } from '../models/steam-user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SteamUserService {
    private readonly baseUrl = environment.baseUrl;

    constructor(
        private http: HttpClient,
        private errorHandlingService: ErrorHandlingService
    ) { }

    steamUser(): Observable<SteamUser> {
        return this.http.post<SteamUser>(`${this.baseUrl}/steamuser/store-profile`, {}, {
            withCredentials: true,
        }).pipe(
            map(response => response),
            catchError(error => {
                const errorMessage = this.errorHandlingService.handleHttpError(error);
                console.error('Erro na requisição para store-profile:', errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    getSeamUser(): Observable<SteamUser> {
        return this.http.get<SteamUser>(`${this.baseUrl}/steamUser/stored-profile`, {
            withCredentials: true,
        }).pipe(
            catchError(error => {
                const errorMessage = this.errorHandlingService.handleHttpError(error);
                console.error('Erro na requisição para stored-profile:', errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    updateStoredGames(token: string): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/accountgame/update-stored-games`, {}, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }),
            withCredentials: true,
        }).pipe(
            catchError((error) => {
                const errorMessage = this.errorHandlingService.handleHttpError(error);
                console.error('Erro ao atualizar jogos armazenados:', errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    }


    getUserFeedbacks(token: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/steamuser/feedbacks`, {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }),
            withCredentials: true,
        }).pipe(
            catchError(error => {
                console.error('Erro completo:', error);
                const errorMessage = this.errorHandlingService.handleHttpError(error);
                console.error('Erro na requisição para feedbacks:', errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    }

}