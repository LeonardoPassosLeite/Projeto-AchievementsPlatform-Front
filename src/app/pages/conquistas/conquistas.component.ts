import { Component, HostListener, OnInit } from '@angular/core';
import { SteamService } from '../../shared/services/steam.service';
import { GenericModule } from '../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-conquistas',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './conquistas.component.html',
  styleUrl: './conquistas.component.scss'
})
export class ConquistasComponent implements OnInit {
  gameData: any[] = [];
  paginatedData: any[] = [];
  pageSize = 10;
  pageIndex = 0;

  userProfileUrl: string = '';
  userName: string = '';
  currentLevel: number = 1;
  totalPoints: number = 0;
  pointsForNextLevel: number = 0;
  nextLevelProgress: number = 0;
  levelPoints: number = 1

  totalSteamPoints = 0;
  totalPlatinum = 0;
  totalGamesWithAchievements = 0;
  totalPlayedGames = 0;
  totalOwnedGames = 0;
  totalPlaytimeHours = 0;
  isLoading: boolean = false;

  constructor(private steamService: SteamService) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadAllGamesWithAchievements();
    this.loadTotalOwnedGames();
    this.updateLevelProgress();
  }

  loadStoredData(): void {
    const storeTotalSteamPoints = localStorage.getItem("totalSteamPoints");
    const storedPlatinum = localStorage.getItem('totalPlatinum');
    const storedTotalGamesWithAchievements = localStorage.getItem('totalGamesWithAchievements');
    const storedTotalPlayedGames = localStorage.getItem('totalPlayedGames');
    const storedTotalOwnedGames = localStorage.getItem('totalOwedGames');
    const storedTotalPlaytimeHours = localStorage.getItem('totalPlaytimeHours');

    console.log("Pontos recuperados do localStorage:", storeTotalSteamPoints);

    if (storeTotalSteamPoints) this.totalSteamPoints = +storeTotalSteamPoints;
    if (storedPlatinum) this.totalPlatinum = +storedPlatinum;
    if (storedTotalGamesWithAchievements) this.totalGamesWithAchievements = +storedTotalGamesWithAchievements;
    if (storedTotalPlayedGames) this.totalPlayedGames = +storedTotalPlayedGames;
    if (storedTotalOwnedGames) this.totalOwnedGames = +storedTotalOwnedGames;
    if (storedTotalPlaytimeHours) this.totalPlaytimeHours = +storedTotalPlaytimeHours;
  }

  saveDataToLocalStorage(): void {
    localStorage.setItem('totalSteamPoints', this.totalSteamPoints.toString());
    localStorage.setItem('totalPlatinum', this.totalPlatinum.toString());
    localStorage.setItem('totalGamesWithAchievements', this.totalGamesWithAchievements.toString());
    localStorage.setItem('totalPlayedGames', this.totalPlayedGames.toString());
    localStorage.setItem('totalOwnedGames', this.totalOwnedGames.toString());
    localStorage.setItem('totalPlaytimeHours', this.totalPlaytimeHours.toString());
  }

  calculateGamesData(games: any[]): void {
    this.totalSteamPoints = 0;
    this.totalPlatinum = 0;
    this.totalPlaytimeHours = 0;

    const gamesWithAchievements = games
      .filter(game => game.totalAchievements > 0)
      .sort((a, b) => b.rtime_last_played - a.rtime_last_played);

    this.totalGamesWithAchievements = gamesWithAchievements.length;

    this.gameData = gamesWithAchievements.map((game: any, index: number) => {
      const achievementsUnlocked = game.achievementsUnlocked || 0;
      const totalAchievements = game.totalAchievements || 1;
      const percentage = Math.round((achievementsUnlocked / totalAchievements) * 100);
      const playTimeInHours = (game.playtime_forever / 60).toFixed(1);

      this.totalSteamPoints += achievementsUnlocked;
      this.totalPlaytimeHours += game.playtime_forever / 60;

      if (percentage === 100) {
        this.totalPlatinum++;
      }

      return {
        position: index + 1,
        name: game.name,
        achievementsUnlocked: achievementsUnlocked,
        totalAchievements: totalAchievements,
        coverUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/capsule_184x69.jpg`,
        percentage: percentage,
        lastPlayed: game.rtime_last_played,
        playTime: playTimeInHours
      };
    });

    console.log(`Total de conquistas desbloqueadas: ${this.totalSteamPoints}`);
    console.log(`Total de jogos platinados: ${this.totalPlatinum}`);
    console.log(`Total de horas jogadas: ${this.totalPlaytimeHours}`);

    this.totalPoints = this.calculateLevelPoints();
    console.log("Total de pontos calculados:", this.totalPoints);

    this.updateLevelProgress();
  }

  loadUserProfile(): void {
    this.steamService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfileUrl = profile.avatar;
        this.userName = profile.name;
      },
      error: (err) => {
        console.error('Erro ao carregar o perfil do usuário:', err);
      }
    })
  }

  loadTotalOwnedGames(): void {
    this.steamService.getAllGames().subscribe({
      next: (games) => {
        this.totalOwnedGames = games.length;

        const playedGames = games.filter((game: any) => game.playtime_forever > 0);
        this.totalPlayedGames = playedGames.length;

        this.totalPlaytimeHours = playedGames.reduce((acc, game) => acc + (game.playtime_forever || 0), 0) / 60;

        localStorage.setItem('totalPlayedGames', this.totalPlayedGames.toString());
        localStorage.setItem('totalOwedGames', this.totalOwnedGames.toString());
      },
      error: (err) => {
        console.error('Erro ao carregar os jogos:', err);
      }
    });
  }

  loadAllGamesWithAchievements(): void {
    this.isLoading = true;

    this.loadStoredData();

    this.steamService.getGamesWithAchievements().subscribe({
      next: (games) => {
        console.log(games);
        this.calculateGamesData(games);

        this.saveDataToLocalStorage();

        this.loadMoreGames();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar jogos:', err);
        this.isLoading = false;
      }
    });
  }

  loadMoreGames(): void {
    const nextPageData = this.gameData.slice(this.pageIndex, this.pageIndex + this.pageSize);
    this.paginatedData = [...this.paginatedData, ...nextPageData];
    this.pageIndex += this.pageSize;
  }

  loadUnlockAchievements() {
    this.steamService.getTotalUnlockedAchievements().subscribe({
      next: (totalUnlocked) => {
        this.totalSteamPoints = totalUnlocked;
      },
      error: (err) => {
        console.error('Erro ao carregar o total de conquistas desbloqueadas:', err);
      }
    });
  }

  readonly basePointsPerLevel = 50;
  readonly difficultyFactor = 1.5;

  calculateLevelPoints(): number {
    const platinumWeight = 3;
    const achievementsWeight = 0.3;
    const playtimeWeight = 0.2;

    const platinumPoints = this.totalPlatinum * platinumWeight;
    const achievementsPoints = this.totalSteamPoints * achievementsWeight;
    const playtimePoints = this.totalPlaytimeHours * playtimeWeight;

    return platinumPoints + achievementsPoints + playtimePoints;
  }

  calculatePointsForNextLevel(): number {
    return Math.floor(this.basePointsPerLevel * Math.pow(this.difficultyFactor, this.currentLevel - 1));
  }

  updateLevelProgress(): void {
    let pointsForNextLevel = this.calculatePointsForNextLevel();

    console.log(`Total de pontos: ${this.totalPoints}, Pontos para o próximo nível: ${pointsForNextLevel}`);

    while (this.totalPoints >= pointsForNextLevel) {
      console.log(`Subindo de nível! Nível atual: ${this.currentLevel}, Total de pontos antes de subir: ${this.totalPoints}`);

      this.totalPoints -= pointsForNextLevel;
      this.currentLevel++;  
      pointsForNextLevel = this.calculatePointsForNextLevel();  

      console.log(`Novo nível: ${this.currentLevel}, Pontos restantes: ${this.totalPoints}, Próximos pontos necessários: ${pointsForNextLevel}`);
    }

    this.nextLevelProgress = parseFloat(((this.totalPoints / pointsForNextLevel) * 100).toFixed(2));
    console.log(`Progresso para o próximo nível: ${this.nextLevelProgress}%`);
  }


  @HostListener('window:scroll', [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight && !this.isLoading) {
      this.loadMoreGames();
    }
  }
}