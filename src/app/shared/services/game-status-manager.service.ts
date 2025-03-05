import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GameStatus } from '../enums/GameStatus';
import { TokenStorageService } from './auth/tokenStorage.service';
import { AccountGameStore } from '../../state/account-game/AccountGame.store';

@Injectable({
  providedIn: 'root'
})
export class GameStatusManagerService {
  private baseUrl = `${environment.baseUrl}/gamestatusmanager`;

  constructor(
    private http: HttpClient,
    private tokenStorageService: TokenStorageService,
    private accountGameStore: AccountGameStore 
  ) {}

  updateGameStatus(gameId: number, newStatus: GameStatus): Observable<{ gameId: number; gameStatus: GameStatus }> {
    const token = this.tokenStorageService.getTokenFromCookie();

    if (!token) {
      console.error("❌ Token ausente ao tentar atualizar status do jogo");
      return throwError(() => new Error("Usuário não autenticado"));
    }

    return this.http.put<{ gameId: number; gameStatus: GameStatus }>(`${this.baseUrl}/update-status/${gameId}`,
      { gameStatus: newStatus },  
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
        withCredentials: true,  
      }
    ).pipe(
      tap((response) => {
        this.accountGameStore.update(state => {
          const updatedGames = state.accountGames.map(game =>
            game.id === response.gameId ? { ...game, gameStatusManager: { gameStatus: response.gameStatus } } : game
          );
          return { ...state, accountGames: updatedGames };
        });
      }),
      catchError((error) => {
        console.error(`❌ Erro ao atualizar status do jogo ID ${gameId}:`, error);
        return throwError(() => new Error("Erro ao atualizar status do jogo. Verifique o backend."));
      })
    );
  }
}