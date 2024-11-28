import { Component, OnInit } from '@angular/core';
import { AccountGameService } from '../../shared/services/account-game.service';
import { AccountGame } from '../../shared/models/account-game.model';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { TokenStorageService } from '../../shared/services/auth/TokenStorageService';

@Component({
  selector: 'app-account-games',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './account-games.component.html',
  styleUrl: './account-games.component.scss'
})
export class AccountGamesComponent implements OnInit {
  games: AccountGame[] = [];
  loading = true;
  errorMessage: string | null = null;

  constructor(
    private accountGameService: AccountGameService,
    private tokenStorageService: TokenStorageService 
  ) { }

  ngOnInit(): void {

    const token = this.tokenStorageService.getToken();

    if (token) {
      this.fetchGames(token);
    } else {
      this.errorMessage = 'Usuário não autenticado.';
      this.loading = false;
    }
  }

  fetchGames(token: string): void {
    this.accountGameService.getStoredAccountGames(token).subscribe({
      next: (data) => {
        this.games = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar jogos:', error);
        this.errorMessage = 'Erro ao carregar jogos. Tente novamente mais tarde.';
        this.loading = false;
      },
    });
  }
}