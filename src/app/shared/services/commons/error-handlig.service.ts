import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlingService {
    constructor(private router: Router) { }

    handleHttpError(err: any): string {
        const raw = err.error;

        if (err.status === 401) {
            this.router.navigate(['/login']);
            return 'Sua sessão expirou. Faça login novamente.';
        }

        if (err.status === 400 || err.status === 500) {
            if (typeof raw === 'string') {
                return raw;
            }

            return (
                raw?.detail ||
                raw?.message ||
                err?.message ||
                'Houve um problema ao processar sua solicitação.'
            );
        }

        return 'Algo deu errado. Por favor, tente novamente.';
    }

    handleWithLog(err: any, contextMessage: string): string {
        const parsed = this.handleHttpError(err);
        console.error(`${contextMessage}`, parsed);
        return parsed;
    }
}