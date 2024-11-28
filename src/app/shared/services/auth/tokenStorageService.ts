import { Injectable } from '@angular/core';
import { CoockieService } from './coockieService';
import * as jwt_decode from 'jwt-decode'; // Importação corrigida

@Injectable({
    providedIn: 'root',
})
export class TokenStorageService {
    private readonly tokenKey = 'jwtToken';

    constructor(private cookieService: CoockieService) {}

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    removeToken(): void {
        localStorage.removeItem(this.tokenKey);
    }

    isTokenExpired(token: string): boolean {
        try {
            const decoded: any = (jwt_decode as any)(token); // Usando jwt_decode como uma função
            const expirationDate = new Date(decoded.exp * 1000);
            const now = new Date();
            return now > expirationDate;
        } catch (error) {
            console.error('Erro ao decodificar o token:', error);
            return true; // Expirado ou inválido
        }
    }

    getTokenFromCookie(): string | null {
        try {
            const token = this.cookieService.getCookie(this.tokenKey);
            if (token) {
                try {
                    this.setToken(token);
                } catch (localStorageError) {
                    console.error('Erro ao salvar o token no localStorage:', localStorageError);
                }
            } else {
                console.warn('Nenhum token encontrado no cookie.');
            }
            return token;
        } catch (cookieError) {
            console.error('Erro ao acessar os cookies:', cookieError);
            return null;
        }
    }
}
