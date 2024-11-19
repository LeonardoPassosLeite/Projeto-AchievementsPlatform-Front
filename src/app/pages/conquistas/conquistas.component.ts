import { Component, HostListener, OnInit } from '@angular/core';
import { SteamService } from '../../shared/services/steam.service';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { HeaderUserInfoComponent } from "../../shared/components/ui/header-user-info/header-user-info.component";

@Component({
  selector: 'app-conquistas',
  standalone: true,
  imports: [GenericModule, HeaderUserInfoComponent],
  templateUrl: './conquistas.component.html',
  styleUrls: ['./conquistas.component.scss']
})
export class ConquistasComponent implements OnInit {
  gameData: any[] = [];
  paginatedData: any[] = [];
  pageSize = 10;
  pageIndex = 0;
  isLoading: boolean = false;

  constructor(private steamService: SteamService) { }

  ngOnInit(): void {
    this.loadAllGamesWithAchievements();
  }

  loadAllGamesWithAchievements(): void {
    this.isLoading = true;

    this.steamService.getGamesWithAchievements().subscribe({
      next: (games) => {
        this.calculateGamesData(games);
        this.loadMoreGames();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar jogos:', err);
        this.isLoading = false;
      }
    });
  }

  calculateGamesData(games: any[]): void {
    // Ordena os jogos pelo campo lastPlayed (do mais recente para o menos recente)
    const sortedGames = games.sort((a, b) => b.rtime_last_played - a.rtime_last_played);

    this.gameData = sortedGames.map((game: any, index: number) => ({
      position: index + 1,
      name: game.name,
      achievementsUnlocked: game.achievementsUnlocked || 0,
      totalAchievements: game.totalAchievements || 1,
      percentage: Math.round((game.achievementsUnlocked / (game.totalAchievements || 1)) * 100),
      coverUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/capsule_184x69.jpg`,
      lastPlayed: game.rtime_last_played,
      playTime: (game.playtime_forever / 60).toFixed(1)
    }));
  }

  loadMoreGames(): void {
    const nextPageData = this.gameData.slice(this.pageIndex, this.pageIndex + this.pageSize);
    this.paginatedData = [...this.paginatedData, ...nextPageData];
    this.pageIndex += this.pageSize;
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight && !this.isLoading) {
      this.loadMoreGames();
    }
  }
}
