import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError, forkJoin } from "rxjs";
import { AccountGameService } from "../account-game.service";
import { TokenStorageService } from "./tokenStorage.service";
import { SteamUserService } from "../steam-user.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private tokenStorageService: TokenStorageService,
    private accountGameService: AccountGameService,
    private steamUserService: SteamUserService
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

    if (!token)
      throw new Error('Token não encontrado');

    const steamId = this.tokenStorageService.getSteamIdFromToken();

    if (!steamId)
      throw new Error('SteamID não encontrado no token');

    return forkJoin({
      steamProfile: this.steamUserService.storeSteamUser(token),
      accountGames: this.accountGameService.storeAccountGames(token),
    });
  }

  login(token: string): void {
    this.tokenStorageService.setToken(token);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    this.tokenStorageService.removeToken();
    this.isAuthenticatedSubject.next(false);
  }


  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}