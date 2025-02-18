import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GameStatus } from '../enums/GameStatus';
import { TokenStorageService } from './auth/tokenStorage.service';

@Injectable({
  providedIn: 'root'
})
export class GameStatusManagerService {
  private baseUrl = `${environment.baseUrl}/gamestatusmanager`;

  constructor(private http: HttpClient, 
              private tokenStorageService: TokenStorageService) { }

  updateGameStatus(gameId: number, newStatus: GameStatus): Observable<void> {
    const token = this.tokenStorageService.getTokenFromCookie();

    if (!token) {
      console.error(" Token ausente ao tentar atualizar status do jogo");
      return throwError(() => new Error("Usuário não autenticado"));
    }

    return this.http.put<void>(`${this.baseUrl}/update-status/${gameId}`,
      { newStatus },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }),
        withCredentials: true,  
      }
    ).pipe(
      tap(() => {
        console.log(`✅ Status do jogo ID ${gameId} atualizado para ${newStatus}`);
      }),
      catchError((error) => {
        console.error(`❌ Erro ao atualizar status do jogo ID ${gameId}:`, error);
        return throwError(() => new Error("Erro ao atualizar status do jogo. Verifique o backend."));
      })
    );
  }

  getAllGameStatuses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/status`);
  }
}
