import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, catchError, forkJoin, map, throwError } from "rxjs";
import { TokenStorageService } from "./tokenStorage.service";
import { SteamUserService } from "../../shared/services/steam-user.service";
import { AccountGameService } from "../../shared/services/account-game.service";
import { Router } from "@angular/router";


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private accountGameStore = new BehaviorSubject<{ accountGames: any[], isLoading: boolean }>({ accountGames: [], isLoading: false });
  private steamUserStore = new BehaviorSubject<{ steamProfile: any | null }>({ steamProfile: null });

  constructor(
    private tokenStorageService: TokenStorageService,
    private accountGameService: AccountGameService,
    private steamUserService: SteamUserService,
    private router: Router
  ) {
    this.initializeAuthentication();
  }

  private initializeAuthentication(): void {
    const token = this.tokenStorageService.getTokenFromCookie();

    if (token) {
      this.isAuthenticatedSubject.next(true);
    } else {
      this.isAuthenticatedSubject.next(false);
    }
  }

  storeProfileAndGames(): Observable<any> {
    const token = this.tokenStorageService.getTokenFromCookie();

    if (!token) throw new Error('Token não encontrado');

    const steamId = this.tokenStorageService.getSteamIdFromToken();

    if (!steamId) throw new Error('SteamID não encontrado no token');

    return forkJoin({
      accountGames: this.accountGameService.addAccountGames().pipe(
        map((response: any) => {
          if (!response || !response.value) {
            throw new Error('Resposta inesperada do backend: "value" não encontrado');
          }
          return response.value;
        }),
        catchError((error) => {
          console.error('Erro ao salvar jogos:', error);
          return throwError(() => new Error('Erro ao salvar jogos. Verifique o backend.'));
        })
      ),
      steamProfile: this.steamUserService.steamUser().pipe(
        catchError((error) => {
          console.error('Erro ao sincronizar perfil Steam:', error);
          return throwError(() => new Error('Erro ao sincronizar o perfil Steam. Verifique o backend.'));
        })
      ),
    }).pipe(
      catchError((error) => {
        console.error('Erro geral durante a sincronização:', error);
        return throwError(() => new Error('Erro durante a sincronização dos dados.'));
      })
    );
  }

  login(token: string): void {
    this.tokenStorageService.setToken(token);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    this.tokenStorageService.removeToken();
    this.isAuthenticatedSubject.next(false);

    this.accountGameStore.next({ accountGames: [], isLoading: false });
    this.steamUserStore.next({ steamProfile: null });

    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}