import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandlingService } from './commons/error-handlig.service';
import { SteamUser } from '../models/steam-user.model';

@Injectable({
    providedIn: 'root',
})
export class SteamUserService {
    private readonly baseUrl = environment.baseUrl;

    constructor(
        private http: HttpClient,
        private errorHandlingService: ErrorHandlingService
    ) { }

    storeSteamUser(token: string): Observable<SteamUser> {
        return this.http.post<SteamUser>(`${this.baseUrl}/steamuser/store-profile`, {}, {
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
                console.error('Erro na requisição para store-profile:', errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    }

    getStoredUser(token: string): Observable<SteamUser> {
        return this.http.get<SteamUser>(`${this.baseUrl}/steamUser/stored-profile`, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            }),
            withCredentials: true,
        }).pipe(
            catchError(error => {
                const errorMessage = this.errorHandlingService.handleHttpError(error);
                console.error('Erro na requisição para stored-profile:', errorMessage);
                return throwError(() => new Error(errorMessage));
            })
        );
    }
}