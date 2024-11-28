import { BehaviorSubject, catchError, Observable, tap, throwError } from "rxjs";
import { TokenStorageService } from "./TokenStorageService";
import { environment } from "../../../environments/environment";
import { Injectable } from "@angular/core";
import { AccountGameService } from "../account-game.service";
import { ErrorHandlingService } from "../commons/error-handlig.service";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private tokenStorage: TokenStorageService,
    private accountGameService: AccountGameService,
    private errorHandlingService : ErrorHandlingService
  ) {
    this.initializeAuthentication();
  }

  private initializeAuthentication(): void {
    const token = this.tokenStorage.getToken();
    console.log('Token encontrado no localStorage ao inicializar:', token);
    this.isAuthenticatedSubject.next(!!token);
  }

  syncAndStoreUserData(): Observable<void> {
    const token = this.tokenStorage.getTokenFromCookie(); // Delegação ao TokenStorageService
    if (!token) {
      return throwError(() => new Error('Token não encontrado no cookie.'));
    }
    return this.accountGameService.storeAccountGameUserData(token).pipe(
      tap(() => console.log('Jogos armazenados com sucesso.')),
      catchError((err) => {
        const message = this.errorHandlingService.handleHttpError(err);
        console.error('Erro no AuthService:', message);
        return throwError(() => new Error(message));
      })
    );
  }  

  syncTokenFromCookie(): string | null {
    return this.tokenStorage.getTokenFromCookie();
  }

  login(token: string): void {
    this.tokenStorage.setToken(token);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    this.tokenStorage.removeToken();
    this.isAuthenticatedSubject.next(false);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}