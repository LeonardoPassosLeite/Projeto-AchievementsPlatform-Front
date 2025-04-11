import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
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
    this.isLoading = true;  
    this.message = null;

    this.authService.storeProfileAndGames().subscribe({
      next: (data) => {
        if (!data.accountGames || !data.steamProfile) {
          console.error('Dados incompletos recebidos:', data);
          this.message = 'A sincronização foi concluída, mas alguns dados estão faltando.';
          this.isLoading = false;
          return;
        }

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erro ao sincronizar dados:', err.error || 'Detalhes não disponíveis');
        this.message = err.message || 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}