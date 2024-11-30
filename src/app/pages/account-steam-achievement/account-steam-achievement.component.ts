import { Component } from '@angular/core';
import { SteamUserService } from '../../shared/services/steam-user.service';
import { AccountGameService } from '../../shared/services/account-game.service';
import { ErrorHandlingService } from '../../shared/services/commons/error-handlig.service';
import { AccountGame } from '../../shared/models/account-game.model';
import { SteamUser } from '../../shared/models/steam-user.model';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { TokenStorageService } from '../../shared/services/auth/tokenStorage.service';




@Component({
  selector: 'app-account-steam-achievement',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './account-steam-achievement.component.html',
  styleUrl: './account-steam-achievement.component.scss'

})
export class AccountSteamAchievementComponent {
  steamUser: SteamUser | null = null;
  accountGames: AccountGame[] = []
  errorMessage: string | null = null;
  loading = true
  selectedImage: string | null = null;

  steamUserXpMock = {
    level: 40,         // Mockando o level
    xpCurrent: 1200,   // Mockando o XP atual
    xpToNextLevel: 2000 // Mockando o XP necessário para o próximo nível
  };

  constructor(
    private steamUserService: SteamUserService,
    private accountGameService: AccountGameService,
    private errorHandlingService: ErrorHandlingService,
    private tokenCoockie: TokenStorageService
  ) { }

  ngOnInit(): void {
    const token = this.tokenCoockie.getTokenFromCookie();
    console.log('Valor do token recuperado: ', token);
    if (token) {
      this.loading;
      this.loadSteamUser(token);
      this.loadAccountGames(token);
    } else {
      this.errorMessage = 'Token de autenticação não encontrado.';
      this.loading = false;
    }
  }

  getXpPercentage(): number {
    if (this.steamUserXpMock.xpToNextLevel > 0) {
      return (this.steamUserXpMock.xpCurrent / this.steamUserXpMock.xpToNextLevel) * 100;
    }
    return 0;
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  loadSteamUser(token: string): void {
    this.steamUserService.getStoredUser(token).subscribe({
      next: (response) => {
        this.steamUser = response;
        console.log("Perfil: ", response)
      },
      error: (error) => {
        this.errorMessage = this.errorHandlingService.handleHttpError(error);
      },
      complete: () => this.loading = false,
    });
  }

  loadAccountGames(token: string): void {
    this.accountGameService.getAccountGames(token).subscribe({
      next: (response) => {
        this.accountGames = response || [];
        console.log("Jogos", this.accountGames);
      },
      error: (error) => {
        this.errorMessage = this.errorHandlingService.handleHttpError(error);
      },
      complete: () => this.loading = false,
    });
  }

}