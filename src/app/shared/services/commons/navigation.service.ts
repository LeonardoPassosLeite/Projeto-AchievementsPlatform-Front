import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardMenu, GameStatusMenu } from '../../enums/navigation.enum';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    constructor(private router: Router) { }

    //sidebar
    goToAllGames() {
        this.router.navigate(['/all-games']);
    }

    goToUserFeedbacks() {
        this.router.navigate(['/dashboard/comments']);
    }

    goToUserInsights() {
        this.router.navigate(['/sidebar/user-insights']);
    }

    goToGameStatusManager() {
        this.router.navigate(['/sidebar/game-status-manager']);
    }

    goToRankingTier() {
        this.router.navigate(['/sidebar/ranking-tier']);
    }

    //dashboard
    goToHome() {
        this.router.navigate(['/dashboard//home']);
    }

    goToGameStatus() {
        this.router.navigate(['/dashboard/game-status']);
    }

    goToConquistas() {
        this.router.navigate(['/dashboard/conquistas/games-conquistas']);
    }

    goToRanking() {
        this.router.navigate(['/dashboard/ranking-global']);
    }

    //dashboard-account-games
    goToGameAchievements() {
        this.router.navigate(['dashboard/conquistas/games-conquistas']);
    }

    goToGamePlatinum() {
        this.router.navigate(['dashboard/conquistas/games-platinados']);
    }

    goToGameInProgress() {
        this.router.navigate(['dashboard/conquistas/games-em-amdamento']);
    }

    goToGameFinished() {
        this.router.navigate(['dashboard/conquistas/games-finalizados']);
    }

    goToGameDropped() {
        this.router.navigate(['dashboard/conquistas/games-dropados']);
    }

    goToGameFavorite() {
        this.router.navigate(['dashboard/conquistas/games-favoritos']);
    }

    navigateDashboard(menu: DashboardMenu): void {
        switch (menu) {
            case DashboardMenu.Home: return this.goToHome();
            case DashboardMenu.GameStatus: return this.goToGameStatus();
            case DashboardMenu.Conquistas: return this.goToConquistas();
            case DashboardMenu.Ranking: return this.goToRanking();
        }
    }

    navigateGameStatus(menu: GameStatusMenu): void {
        switch (menu) {
            case GameStatusMenu.Achievements: return this.goToGameAchievements();
            case GameStatusMenu.Platinum: return this.goToGamePlatinum();
            case GameStatusMenu.InProgress: return this.goToGameInProgress();
            case GameStatusMenu.Finished: return this.goToGameFinished();
            case GameStatusMenu.Dropped: return this.goToGameDropped();
            case GameStatusMenu.Favorite: return this.goToGameFavorite();
        }
    }
}