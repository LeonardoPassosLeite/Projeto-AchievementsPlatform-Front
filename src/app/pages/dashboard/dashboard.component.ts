import { Component } from '@angular/core';
import { SteamUser } from '../../shared/models/steam-user.model';
import { AccountGame } from '../../shared/models/account-game.model';
import { SteamUserService } from '../../shared/services/steam-user.service';
import { ErrorHandlingService } from '../../shared/services/commons/error-handlig.service';
import { TokenStorageService } from '../../shared/services/auth/tokenStorage.service';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GenericModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {
  steamUser: SteamUser | null = null;
  accountGames: AccountGame[] = [];
  errorMessage: string | null = null;
  loading = true;
  selectedImage: string | null = null;

  steamUserXpMock = {
    level: 40,         // Mockando o level
    xpCurrent: 1200,   // Mockando o XP atual
    xpToNextLevel: 2000 // Mockando o XP necessário para o próximo nível
  };

  constructor(
    private steamUserService: SteamUserService,
    private errorHandlingService: ErrorHandlingService,
    private tokenCoockieService: TokenStorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = this.tokenCoockieService.getTokenFromCookie();
    console.log('Valor do token recuperado: ', token);
    if (token) {
      this.loadSteamUser(token);
    } else {
      this.errorMessage = 'Token de autenticação não encontrado.';
      this.loading = false;
    }
  }

  loadSteamUser(token: string): void {
    this.steamUserService.getStoredUser(token).subscribe({
      next: (response) => {
        this.steamUser = response;
        console.log("Perfil: ", response);
      },
      error: (error) => {
        this.errorMessage = this.errorHandlingService.handleHttpError(error);
      },
      complete: () => this.loading = false,
    });
  }

  updateStoredGames(): void {
    const token = this.tokenCoockieService.getTokenFromCookie();
    if (!token) {
      this.errorMessage = 'Token de autenticação não encontrado.';
      return;
    }

    this.steamUserService.updateStoredGames(token).subscribe({
      next: () => {
        console.log('Jogos armazenados atualizados com sucesso.');
        this.loadSteamUser(token);
      },
      error: (error) => {
        this.errorMessage = this.errorHandlingService.handleHttpError(error);
      }
    });
  }

  goToArte() {
    this.router.navigate(['/dashboard/arte']);
  }

  goToConquistas() {
    this.router.navigate(['/dashboard/navbar/games-conquistas']);
  }

  goToRanking() {
    this.router.navigate(['/dashboard/ranking-global']);
  }
}