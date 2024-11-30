import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenStorageService } from '../auth/tokenStorage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private tokenStorage: TokenStorageService 
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenStorage.getTokenFromCookie();  // Recupera o token

        if (token) {
            // Se o token existir, adiciona o header Authorization
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
        }

        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401) {
                    // Caso o token seja inválido ou expirado, redireciona para o login
                    console.error('Usuário não autorizado ou token inválido.');
                    this.tokenStorage.removeToken();  // Remove o token inválido
                    if (this.router.url !== '/login') {
                        this.router.navigate(['/login']);
                    }
                }
                return throwError(() => err);  // Lança o erro para o fluxo continuar
            })
        );
    }
}
