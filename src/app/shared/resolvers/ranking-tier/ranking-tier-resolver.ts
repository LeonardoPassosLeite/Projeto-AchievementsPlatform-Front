import { Injectable } from "@angular/core";
import { Resolve, Router } from "@angular/router";
import { catchError, forkJoin, map, of, take } from "rxjs";
import { AccountGameQuery } from "../../../state/account-game/AccountGame.query";
import { GameRankingService } from "../../services/game-ranking.service";
import { TokenStorageService } from "../../../core/auth/tokenStorage.service";

@Injectable({ providedIn: 'root' })
export class RankingPositionResolver implements Resolve<any> {
    constructor(
        private accountGameQuery: AccountGameQuery,
        private rankingService: GameRankingService,
        private tokenStorage: TokenStorageService,
        private router: Router
    ) { }

    resolve() {
        const token = this.tokenStorage.getTokenFromCookie();
        if (!token) {
            this.router.navigate(['/login']);
            return of(null);
        }

        return forkJoin([
            this.accountGameQuery.accountGames$.pipe(take(1)),
            this.rankingService.getUserRankedGames(token),
            this.rankingService.getUserRankedTiers(token)
        ]).pipe(
            map(([allGames, rankings, tiers]) => ({
                allGames,
                rankings,
                tiers
            })),
            catchError((error) => {
                console.error('[Resolver] Erro ao resolver dados:', error);
                this.router.navigate(['/login']);
                return of(null);
            })
        );
    }
}