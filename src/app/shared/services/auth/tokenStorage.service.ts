import { Injectable } from '@angular/core';
import { CoockieService } from './coockie.service';
import { jwtDecode } from 'jwt-decode';  // Importando corretamente a função como uma exportação nomeada

@Injectable({
    providedIn: 'root',
})
export class TokenStorageService {
    private readonly tokenKey = 'jwtToken';

    constructor(private cookieService: CoockieService) { }

    // Método para obter o token do cookie
    getTokenFromCookie(): string | null {
        return this.cookieService.getCookie(this.tokenKey);  // Recupera o token do cookie
    }

    // Método para armazenar o token no cookie (não no localStorage)
    setToken(token: string): void {
        // A expiração do token e flags são configuradas no backend, então aqui não precisamos gerenciar a expiração.
        this.cookieService.setCookie(this.tokenKey, token);
        console.log('Token armazenado no cookie');
    }

    // Método para remover o token do cookie
    removeToken(): void {
        this.cookieService.deleteCookie(this.tokenKey);  // Remove o token do cookie
        console.log('Token removido do cookie');
    }

    // Método para obter o SteamID a partir do token JWT (não é necessário para o fluxo de login/logout)
    getSteamIdFromToken(): string | null {
        const token = this.getTokenFromCookie();  // Obtém o token diretamente do cookie
        if (token) {
            try {
                const decoded: any = jwtDecode(token);  // Decodifica o token
                return decoded.steamId;  // Retorna o steamId
            } catch (error) {
                console.error('Erro ao decodificar o token para obter o steamId:', error);
                return null;
            }
        }
        return null;
    }
}
