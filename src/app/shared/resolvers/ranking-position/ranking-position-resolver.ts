import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { catchError, map, take, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { AccountGameQuery } from '../../../state/account-game/AccountGame.query';
import { GameRankingService } from '../../services/game-ranking.service';
import { TokenStorageService } from '../../../core/auth/tokenStorage.service';

@Injectable({ providedIn: 'root' })
export class RankingPositionResolver implements Resolve<any> {
  constructor(
    private accountGameQuery: AccountGameQuery,
    private rankingService: GameRankingService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  resolve() {
    console.log('[Resolver] Iniciando resolução de dados');
    const token = this.tokenStorage.getTokenFromCookie();
    console.log('[Resolver] Token encontrado:', !!token);
    
    if (!token) {
      console.warn('[Resolver] Nenhum token encontrado, redirecionando para login');
      this.router.navigate(['/login']);
      return of(null);
    }

    return forkJoin([
      this.accountGameQuery.accountGames$.pipe(take(1)),
      this.rankingService.getUserRankedGames(token)
    ]).pipe(
      tap(([allGames, rankings]) => {
        console.log('[Resolver] Dados obtidos:', {
          allGamesCount: allGames?.length,
          rankingsCount: rankings?.length
        });
      }),
      map(([allGames, rankings]) => ({ allGames, rankings })),
      catchError((error) => {
        console.error('[Resolver] Erro ao resolver dados:', error);
        this.router.navigate(['/login']);
        return of(null);
      })
    );
  }
}