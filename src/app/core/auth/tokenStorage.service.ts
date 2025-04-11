import { Injectable } from '@angular/core';
import { CoockieService } from './coockie.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({
    providedIn: 'root',
})
export class TokenStorageService {
    private readonly tokenKey = 'jwtToken';

    constructor(private cookieService: CoockieService) { }

    getTokenFromCookie(): string | null {
        return this.cookieService.getCookie(this.tokenKey);
    }

    setToken(token: string): void {
        this.cookieService.setCookie(this.tokenKey, token);
    }

    removeToken(): void {
        this.cookieService.deleteCookie(this.tokenKey);
    }

    getSteamIdFromToken(): string | null {
        const token = this.getTokenFromCookie();
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                return decoded.steamId;
            } catch (error) {
                console.error('Erro ao decodificar o token para obter o steamId:', error);
                return null;
            }
        }
        return null;
    }
}