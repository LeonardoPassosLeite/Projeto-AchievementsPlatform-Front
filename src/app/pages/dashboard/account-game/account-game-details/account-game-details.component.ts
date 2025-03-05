import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AccountGameDetailsService } from '../../../../shared/services/account-game-details.service';
import { TokenStorageService } from '../../../../shared/services/auth/tokenStorage.service';
import { formatPlaytimeForever } from '../../../../utils/playtime.utils';
import { AccountGameWithAchievements } from '../../../../shared/models/account-game.model';
import { GameAchievement } from '../../../../shared/models/game-achievement';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { AchievementsComponent } from './achievements/achievements.component';
import { GameStatsComponent } from './game-stats/game-stats.component';
import { ModalAccountGameAchievementComponent } from '../../../../shared/components/modal-account-game-achievement/modal-account-game-achievement.component';

@Component({
  selector: 'app-account-game-details',
  standalone: true,
  imports:
    [
      GenericModule,
      RouterModule,
      AchievementsComponent,
      GameStatsComponent,
      ModalAccountGameAchievementComponent
    ],
  templateUrl: './account-game-details.component.html',
  styleUrls: ['./account-game-details.component.scss'],
})
export class AccountGameDetailsComponent implements OnInit {
  gameDetails: AccountGameWithAchievements | null = null;
  achievements: GameAchievement[] = [];
  errorMessage: string | null = null;
  loading = false;
  currentPage = 1;
  pageSize = 10;
  hasMore = true;
  isModalOpen = false;

  constructor(
    private accountGameDetailsService: AccountGameDetailsService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const storedGameDetails = this.accountGameDetailsService.getStoredGameDetails();

    if (!storedGameDetails) {
      this.handleError('Os detalhes do jogo não estão disponíveis.');
      return;
    }

    this.gameDetails = storedGameDetails;
    this.achievements = storedGameDetails.pagination?.items || []; 
    this.hasMore = storedGameDetails.pagination?.totalPages > 1; 
  }

  private loadAchievements(token: string, gameId: number): void {
    this.loading = true;

    this.accountGameDetailsService
      .getGameDetailsWithPagedAchievements(token, gameId, this.currentPage, this.pageSize)
      .subscribe({
        next: (response) => {
          if (response && Array.isArray(response.items)) { 
            this.achievements = [
              ...this.achievements,
              ...response.items,
            ];
            this.hasMore = this.currentPage < response.totalPages; 
            this.currentPage++;
          } else {
            console.error('Formato inesperado nos dados de conquistas:', response);
            this.hasMore = false;
          }
        },
        error: (error) =>
          this.handleError('Erro ao carregar mais conquistas.', error),
        complete: () => (this.loading = false),
      });
  }

  onLoadMoreAchievements(): void {
    const token = this.tokenStorageService.getTokenFromCookie();
    if (token && this.gameDetails) {
      this.loadAchievements(token, this.gameDetails.id);
    }
  }

  private handleError(message: string, error?: any): void {
    this.errorMessage = message;
    console.error(message, error || '');
    setTimeout(() => this.router.navigate(['/dashboard/account-games']), 3000);
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  formatPlaytime(playtime: number): string {
    return formatPlaytimeForever(playtime);
  }
}