import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenStorageService } from '../auth/TokenStorageService';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private router: Router,
        private tokenStorage: TokenStorageService 
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.tokenStorage.getToken(); 

        if (token && !this.tokenStorage.isTokenExpired(token)) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
        } else if (token && this.tokenStorage.isTokenExpired(token)) {
            console.warn('Token expirado. Redirecionando para login.');
            this.tokenStorage.removeToken(); 
            this.router.navigate(['/login']);
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