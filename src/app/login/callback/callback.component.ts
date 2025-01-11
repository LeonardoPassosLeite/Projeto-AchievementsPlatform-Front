import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';
import { GenericModule } from '../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss'],
})
export class CallbackComponent implements OnInit {
  isLoading = true;
  message: string | null = null;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.storeProfileAndGames().subscribe({
      next: (data) => {
        console.log('Dados sincronizados com sucesso:', data);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erro ao sincronizar dados do Steam e jogos:', err);
        console.error('Detalhes do erro:', err.error); // Adicionando mais informações do erro
        this.message = err.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}