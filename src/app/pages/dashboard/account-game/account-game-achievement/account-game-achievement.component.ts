import { Component, OnInit } from '@angular/core';
import { AccountGame, AccountGameWithAchievements } from '../../../../shared/models/account-game.model';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handlig.service';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { TokenStorageService } from '../../../../shared/services/auth/tokenStorage.service';
import { Router, RouterModule } from '@angular/router';
import { AccountGameDetailsService } from '../../../../shared/services/account-game-details.service';
import { formatPlaytimeForever } from '../../../../utils/playtime.utils';
import { isScrolledToBottom } from '../../../../utils/scroll.utils';
import { AccountGameService } from '../../../../shared/services/account-game.service';

@Component({
  selector: 'app-account-game-achievement',
  standalone: true,
  imports: [GenericModule, RouterModule],
  templateUrl: './account-game-achievement.component.html',
  styleUrl: './account-game-achievement.component.scss'
})
export class AccountGameAchievementComponent implements OnInit {
  accountGames: AccountGame[] = [];
  errorMessage: string | null = null;
  loading = false;
  currentPage = 1;
  pageSize = 10;
  hasMore = true;

  constructor(
    private accountGameService: AccountGameService,
    private accountGameDetailsService: AccountGameDetailsService,
    private errorHandlingService: ErrorHandlingService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = this.tokenStorageService.getTokenFromCookie();
    if (token) {
      this.loadPagedAccountGames(token);
    } else {
      this.errorMessage = 'Token de autenticação não encontrado.';
    }
  }

  loadPagedAccountGames(token: string): void {
    if (this.loading || !this.hasMore) return;

    this.loading = true;

    this.accountGameService
      .getPagedAccountGamesWithAchievements(token, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          console.log('Dados recebidos:', response);
          if (response.data.length < this.pageSize) {
            this.hasMore = false;
          }

          this.accountGames = [...this.accountGames, ...response.data];
          this.currentPage++;
        },
        error: (error) => {
          this.errorMessage = this.errorHandlingService.handleHttpError(error);
          console.error('Erro ao carregar jogos:', error);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  onGameClick(gameId: number): void {
    const token = this.tokenStorageService.getTokenFromCookie();

    if (!token) {
      this.errorMessage = 'Token de autenticação não encontrado.';
      return;
    }

    const game = this.accountGames.find((g) => g.id === gameId);

    if (!game) {
      console.error('Jogo não encontrado na lista:', gameId);
      return;
    }

    this.loading = true;

    this.accountGameDetailsService
      .getGameDetailsWithPagedAchievements(token, gameId, 1, 6)
      .subscribe({
        next: (response) => {
          console.log('Dados retornados do backend:', response);

          // Mapear corretamente os dados retornados
          const gameWithAchievements: AccountGameWithAchievements = {
            ...game,
            gameName: response.gameName,
            iconUrl: response.iconUrl,
            playtimeForever: response.playtimeForever,
            gameStats: response.gameStats,
            achievements: response.achievements,
          };

          console.log('Detalhes do jogo com conquistas atualizados:', gameWithAchievements);

          // Armazena os detalhes no serviço
          this.accountGameDetailsService.setGameDetails(gameWithAchievements);

          // Navega para o componente de detalhes
          this.router.navigate(['/dashboard/account-game-details', gameId]);
        },
        error: (error) => {
          this.errorMessage = 'Erro ao carregar conquistas do jogo.';
          console.error('Erro ao carregar os detalhes do jogo:', error);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  onScroll(event: Event): void {
    if (isScrolledToBottom(event, 100) && this.hasMore && !this.loading) {
      const token = this.tokenStorageService.getTokenFromCookie();
      if (token) {
        this.loadPagedAccountGames(token);
      }
    }
  }

  formatPlaytime(playtime: number): string {
    return formatPlaytimeForever(playtime);
  }
}