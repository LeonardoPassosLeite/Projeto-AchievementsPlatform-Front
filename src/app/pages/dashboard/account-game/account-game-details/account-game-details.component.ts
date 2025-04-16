import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AccountGameDetailsService } from '../../../../shared/services/account-game-details.service';
import { formatPlaytimeForever } from '../../../../utils/playtime.utils';
import { Achievements, GameAchievement } from '../../../../shared/models/game-achievement';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { AchievementsComponent } from './achievements/achievements.component';
import { GameStatsComponent } from './game-stats/game-stats.component';
import { MatIconModule } from '@angular/material/icon';
import { AccountGameService } from '../../../../shared/services/account-game.service';
import { FormsModule } from '@angular/forms';
import { AccountGame } from '../../../../shared/models/account-game.model';
import { GameDropdownSelectorComponent } from '../../../../shared/components/games/game-dropdown-selector/game-dropdown-selector.component';
import { InfinitePaginator } from '../../../../utils/infinite-paginator';
import { AchievementFilterType } from '../../../../shared/enums/achievement-filter-type';
import { DropdownComponent } from '../../../../shared/components/forms/dropdown/dropdown.component';
import { AchievementOrderType } from '../../../../shared/enums/achievement-order-type';

@Component({
  selector: 'app-account-game-details',
  standalone: true,
  imports: [
    GenericModule,
    RouterModule,
    AchievementsComponent,
    GameStatsComponent,
    MatIconModule,
    FormsModule,
    GameDropdownSelectorComponent,
    DropdownComponent
  ],
  templateUrl: './account-game-details.component.html',
  styleUrls: ['./account-game-details.component.scss'],
})
export class AccountGameDetailsComponent implements OnInit {
  gameDetails: Achievements | null = null;
  achievements: GameAchievement[] = [];
  errorMessage: string | null = null;
  achievementPaginator = new InfinitePaginator();
  gamePaginator = new InfinitePaginator();
  gamesWithAchievements: AccountGame[] = [];
  searchTerm = '';
  showDropdown = false;

  achievementFilterOptions = Object.values(AchievementFilterType);
  achievementOrderOptions = Object.values(AchievementOrderType);

  selectedFilter: AchievementFilterType = AchievementFilterType.All;
  selectedOrder: AchievementOrderType = AchievementOrderType.None;

  constructor(
    private accountGameDetailsService: AccountGameDetailsService,
    private accountGameService: AccountGameService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const storedGameDetails = this.accountGameDetailsService.getStoredGameDetails();

    if (!storedGameDetails) {
      this.errorMessage = 'Os detalhes do jogo não estão disponíveis.';
      setTimeout(() => this.router.navigate(['/dashboard/account-games']), 3000);
      return;
    }

    this.gameDetails = storedGameDetails;
    this.achievements = storedGameDetails.pagination?.items || [];
    this.achievementPaginator.hasMore = storedGameDetails.pagination?.totalPages > 1;

    this.loadGames();
  }

  filterAchievements(): GameAchievement[] {
    let filtered = this.achievements;

    switch (this.selectedFilter) {
      case AchievementFilterType.Unlocked:
        filtered = filtered.filter(a => a.unlockTime);
        break;
      case AchievementFilterType.Locked:
        filtered = filtered.filter(a => !a.unlockTime);
        break;
      case AchievementFilterType.Rare:
        filtered = filtered.filter(a => a.rarity <= 10);
        break;
    }

    switch (this.selectedOrder) {
      case AchievementOrderType.MostSteamPoints:
        filtered = [...filtered].sort((a, b) => b.steamPoints - a.steamPoints);
        break;
      case AchievementOrderType.LeastSteamPoints:
        filtered = [...filtered].sort((a, b) => a.steamPoints - b.steamPoints);
        break;
    }

    return filtered;
  }

  private loadGames(): void {
    this.gamePaginator.loading = true;
    this.accountGameService.getPagedAccountGamesWithAchievements({
      page: this.gamePaginator.page,
      pageSize: this.gamePaginator.pageSize
    })
      .subscribe({
        next: (res) => {
          this.gamesWithAchievements = [...this.gamesWithAchievements, ...res.items];
          this.gamePaginator.hasMore = res.items.length === this.gamePaginator.pageSize;
          this.gamePaginator.advance();
        },
        error: (error) => this.errorMessage = error.message,
        complete: () => this.gamePaginator.loading = false,
      });
  }

  private loadAchievements(gameId: number): void {
    this.achievementPaginator.loading = true;

    this.accountGameDetailsService.getGameDetailsWithPagedAchievements(
      gameId,
      { page: this.achievementPaginator.page, pageSize: this.achievementPaginator.pageSize }
    ).subscribe({
      next: (response) => {
        this.achievements = [...this.achievements, ...response.items];
        this.achievementPaginator.hasMore = this.achievementPaginator.page < response.totalPages;
        this.achievementPaginator.advance();
      },
      error: (error) => this.errorMessage = error.message,
      complete: () => this.achievementPaginator.loading = false,
    });
  }

  onLoadMoreAchievements(): void {
    if (this.gameDetails) {
      this.loadAchievements(this.gameDetails.id);
    }
  }

  onScrollMoreGames(): void {
    if (this.gamePaginator.hasMore && !this.gamePaginator.loading) {
      this.loadGames();
    }
  }

  selectGame(game: AccountGame): void {
    this.showDropdown = false;
    this.achievementPaginator.reset();
    this.achievements = [];
    this.accountGameDetailsService.getGameDetailsWithPagedAchievements(
      game.id,
      { page: this.achievementPaginator.page, pageSize: this.achievementPaginator.pageSize }
    )
      .subscribe({
        next: (pagination) => {
          this.gameDetails = { ...game, pagination };
          this.achievements = pagination.items || [];
          this.achievementPaginator.hasMore = pagination.totalPages > 1;
          this.achievementPaginator.advance();
        },
        error: (error) => this.errorMessage = error.message,
        complete: () => this.achievementPaginator.loading = false,
      });
  }

  formatPlaytime(playtime: number): string {
    return formatPlaytimeForever(playtime);
  }
}