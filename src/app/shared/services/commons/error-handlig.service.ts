import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class ErrorHandlingService {
    constructor(private router: Router) { }

    handleHttpError(err: any): string {
        if (err.status === 401) {
            console.error('Token inválido ou expirado. Redirecionando para login...');
            this.router.navigate(['/login']);
            return 'Sua sessão expirou. Faça login novamente.';
        } else if (err.status === 400) {
            console.error('Erro na requisição: ', err.error);
            return 'Houve um problema ao processar sua solicitação. Verifique os dados e tente novamente.';
        } else if (err.status >= 500) {
            console.error('Erro interno no servidor:', err.error);
            return 'Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.';
        } else {
            console.error('Erro desconhecido:', err);
            return 'Algo deu errado. Por favor, tente novamente.';
        }
    }
}