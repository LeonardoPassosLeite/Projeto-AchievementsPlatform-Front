import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenStorageService } from './tokenStorage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private tokenStorage: TokenStorageService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log('🚦 Interceptor ativado:', request.url);
        const token = this.tokenStorage.getTokenFromCookie();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            console.log("📦 Header Authorization:", request.headers.get('Authorization'));
        }

        return next.handle(request).pipe(
            catchError(err => {
                if (err.status === 401) {
                    console.error('Usuário não autorizado ou token inválido.');
                    this.tokenStorage.removeToken();
                    if (this.router.url !== '/login') {
                        this.router.navigate(['/login']);
                    }
                }
                return throwError(() => err);
            })
        );
    }
}