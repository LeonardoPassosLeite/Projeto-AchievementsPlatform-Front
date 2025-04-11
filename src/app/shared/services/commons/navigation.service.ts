import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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
}
