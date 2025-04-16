import { Component } from '@angular/core';
import { SteamUserService } from '../../shared/services/steam-user.service';
import { TokenStorageService } from '../../core/auth/tokenStorage.service';
import { ErrorHandlingService } from '../../shared/services/commons/error-handlig.service';
import { SteamUser } from '../../shared/models/steam-user.model';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { NavigationService } from '../../shared/services/commons/navigation.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  steamUser: SteamUser | null = null;
  errorMessage: string | null = null;
  loading = true;

  constructor(
    private steamUserService: SteamUserService,
    public navigation: NavigationService,
    private errorHandlingService: ErrorHandlingService,
    private tokenCoockieService: TokenStorageService
  ) { }

  ngOnInit(): void {
    const token = this.tokenCoockieService.getTokenFromCookie();
    if (token) {
      this.loadSteamUser();
    } else {
      this.errorMessage = 'Token de autenticação não encontrado.';
      this.loading = false;
    }
  }

  loadSteamUser(): void {
    this.steamUserService.getSeamUser().subscribe({
      next: (response) => {
        this.steamUser = response;
      },
      error: (error) => {
        this.errorMessage = this.errorHandlingService.handleHttpError(error);
      },
      complete: () => this.loading = false,
    });
  }
}