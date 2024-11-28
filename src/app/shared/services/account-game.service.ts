import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountGame } from '../models/account-game.model';

@Injectable({
    providedIn: 'root',
})
export class AccountGameService {
    private readonly baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) { }

    storeAccountGameUserData(token: string): Observable<any> {
        return this.http.post(
            `${this.baseUrl}/accountgame/store-games`,
            {},
            {
                headers: new HttpHeaders({
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }),
                withCredentials: true,
            }
        );
    }

    getStoredAccountGames(token: string): Observable<any> {
        return this.http.get(
            `${this.baseUrl}/accountgame/stored-games`,
            {
                headers: new HttpHeaders({
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }),
                withCredentials: true,
            }
        );
    }

}      