import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private http: HttpClient, private router: Router) { }

  logout(): void {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      this.http
        .post('http://localhost:5000/api/login/logout', {}, {
          withCredentials: true, // Garante que cookies sejam enviados
        })
        .subscribe({
          next: () => {
            console.log('Logout realizado com sucesso.');
            localStorage.removeItem('jwtToken'); // Remove o token do armazenamento
            this.router.navigate(['/login']); // Redireciona para a página de login
          },
          error: (err) => {
            console.error('Erro ao realizar logout:', err);
          },
        });
    } else {
      console.warn('Nenhum token JWT encontrado. Redirecionando para login.');
      this.router.navigate(['/login']); // Caso o token não esteja presente
    }
  }
}
