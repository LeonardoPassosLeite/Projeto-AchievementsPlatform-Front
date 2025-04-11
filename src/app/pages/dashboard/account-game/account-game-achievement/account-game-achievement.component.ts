import { Component, OnInit } from '@angular/core';
import { AccountGame } from '../../../../shared/models/account-game.model';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handlig.service';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { RouterModule } from '@angular/router';
import { AccountGameService } from '../../../../shared/services/account-game.service';
import { GameListComponent } from '../../../../shared/components/games/game-list/game-list.component';
import { InfinitePaginator } from '../../../../utils/infinite-paginator';

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
  paginator = new InfinitePaginator();

  constructor(
    private accountGameService: AccountGameService,
    private errorHandlingService: ErrorHandlingService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.paginator.loading = true;

    this.accountGameService.getPagedAccountGamesWithAchievements({
        page: this.paginator.page,
        pageSize: this.paginator.pageSize
      })
      .subscribe({
        next: (response) => {
          this.accountGames = [...this.accountGames, ...response.items];
          this.paginator.hasMore = response.items.length === this.paginator.pageSize;
          this.paginator.advance();
        },
        error: (error) => {
          const message = this.errorHandlingService.handleWithLog(error, 'Erro ao carregar jogos:');
          console.error(message);
        },
        complete: () => {
          this.paginator.loading = false;
        },
      });
  }

  onScroll(): void {
    if (this.paginator.hasMore && !this.paginator.loading) {
      this.loadData();
    }
  }
}