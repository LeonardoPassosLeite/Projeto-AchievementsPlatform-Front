import { Component, OnInit } from '@angular/core';
import { SteamUser } from '../../shared/models/steam-user.model';
import { AccountGame } from '../../shared/models/account-game.model';
import { SteamUserService } from '../../shared/services/steam-user.service';
import { ErrorHandlingService } from '../../shared/services/commons/error-handlig.service';
import { TokenStorageService } from '../../shared/services/auth/tokenStorage.service';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { YoutubeService } from '../../shared/services/youtube.service';

declare var YT: any; // Declaração global para o tipo YT

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    GenericModule,
    RouterModule,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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

  player: any | null = null; // Usando 'any' temporariamente

  constructor(
    private steamUserService: SteamUserService,
    private errorHandlingService: ErrorHandlingService,
    private tokenCoockieService: TokenStorageService,
    private youtubeService: YoutubeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const token = this.tokenCoockieService.getTokenFromCookie();
    if (token) {
      this.loadSteamUser(token);
    } else {
      this.errorMessage = 'Token de autenticação não encontrado.';
      this.loading = false;
    }

    this.loadYouTubeAPI();
  }

  loadSteamUser(token: string): void {
    this.steamUserService.getStoredUser(token).subscribe({
      next: (response) => {
        this.steamUser = response;
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
        this.loadSteamUser(token);
      },
      error: (error) => {
        this.errorMessage = this.errorHandlingService.handleHttpError(error);
      }
    });
  }

  goToHome() {
    this.router.navigate(['/dashboard//home']);
  }

  goToGameStatus() {
    this.router.navigate(['/dashboard/game-status']);
  }

  goToConquistas() {
    this.router.navigate(['/dashboard/conquistas/games-conquistas']);
  }

  goToRanking() {
    this.router.navigate(['/dashboard/ranking-global']);
  }

  //music
  isMusicSearchOpen = false;
  searchQuery = '';
  searchResults: any[] = [];
  isPlaying = false

  toggleMusicSearch(): void {
    this.isMusicSearchOpen = !this.isMusicSearchOpen;
  }

  onSearchInput(): void {
    if (this.searchQuery.trim()) {
      this.searchMusic();
    }
  }

  searchMusic(): void {
    if (this.searchQuery.trim()) {
      this.youtubeService.searchVideo(this.searchQuery).subscribe((response: any) => {
        this.searchResults = response.items;
      });
    } else {
      this.searchResults = []; // Limpa os resultados se o campo estiver vazio
    }
  }

  loadYouTubeAPI(): void {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => {
      this.player = new YT.Player('youtube-player', {
        height: '200',
        width: '300',
        events: {
          onReady: (event: any) => event.target.playVideo(),
        },
      });
    };
  }

  playVideo(videoId: string): void {
    if (this.player) {
      this.player.loadVideoById(videoId);
      this.player.playVideo();
      this.isPlaying = true; // Ativa o efeito visual
    } else {
      console.error('Player do YouTube não está carregado.');
    }
  }

  stopVideo(): void {
    if (this.player) {
      this.player.stopVideo();
      this.isPlaying = false; // Desativa o efeito visual
    }
  }
}