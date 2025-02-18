import { Component, OnInit } from '@angular/core';
import { AccountGame } from '../../../../shared/models/account-game.model';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handlig.service';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { TokenStorageService } from '../../../../shared/services/auth/tokenStorage.service';
import { RouterModule } from '@angular/router';
import { AccountGameService } from '../../../../shared/services/account-game.service';
import { GameListComponent } from '../../../../shared/components/game-list/game-list.component';

@Component({
  selector: 'app-account-game-achievement',
  standalone: true,
  imports: [
    GenericModule,
    RouterModule,
    GameListComponent
  ],
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
  private token: string | null = null; 

  constructor(
    private accountGameService: AccountGameService,
    private errorHandlingService: ErrorHandlingService,
    private tokenStorageService: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.token = this.tokenStorageService.getTokenFromCookie(); 
    if (this.token) {
      this.loadPagedAccountGames();
    } else {
      this.errorMessage = 'Token de autenticação não encontrado.';
    }
  }

  loadPagedAccountGames(): void {
    if (this.loading || !this.hasMore || !this.token) return;  

    this.loading = true;

    this.accountGameService
      .getPagedAccountGamesWithAchievements(this.token, this.currentPage, this.pageSize)
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
}