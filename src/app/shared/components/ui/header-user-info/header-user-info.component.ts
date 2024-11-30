// import { Component, OnInit } from '@angular/core';
// import { SteamService } from '../../../services/steam.service';
// import { GenericModule } from '../../../../../shareds/commons/GenericModule';

// @Component({
//   selector: 'app-header-user-info',
//   standalone: true,
//   imports: [GenericModule],
//   templateUrl: './header-user-info.component.html',
//   styleUrls: ['./header-user-info.component.scss']
// })
// export class HeaderUserInfoComponent implements OnInit {
//   userProfileUrl: string = '';
//   userName: string = '';
//   currentLevel: number = 1;
//   nextLevelProgress: number = 0;
//   totalPoints: number = 0;
//   totalSteamPoints: number = 0;
//   totalPlatinum: number = 0;
//   totalPlaytimeHours: number = 0;
//   totalPlayedGames: number = 0;
//   totalGamesWithAchievements: number = 0;
//   totalOwnedGames: number = 0;

//   constructor(private steamService: SteamService) { }

//   ngOnInit(): void {
//     // this.loadUserProfile();
//     this.loadUserStats();
//   }

//   // processGame(game: any, index: number): any {
//   //   const achievementsUnlocked = game.achievementsUnlocked || 0;
//   //   const totalAchievements = game.totalAchievements || 1;
//   //   const percentage = Math.round((achievementsUnlocked / totalAchievements) * 100);
//   //   const playTimeInHours = (game.playtime_forever / 60).toFixed(1);

//   //   this.totalSteamPoints += achievementsUnlocked;
//   //   this.totalPlaytimeHours += game.playtime_forever / 60;

//   //   this.steamService.getGameAchievements(game.appid).subscribe({
//   //     next: (achievements) => {
//   //       if (achievements.total > 0 && achievements.unlocked === achievements.total) {
//   //         this.totalPlatinum++;
//   //       }
//   //     },
//   //     error: (err) => {
//   //       console.error(`Erro ao buscar conquistas para o jogo ${game.name}:`, err);
//   //     }
//   //   });

//   //   return {
//   //     position: index + 1,
//   //     name: game.name,
//   //     achievementsUnlocked: achievementsUnlocked,
//   //     totalAchievements: totalAchievements,
//   //     coverUrl: `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/capsule_184x69.jpg`,
//   //     percentage: percentage,
//   //     lastPlayed: game.rtime_last_played,
//   //     playTime: playTimeInHours
//   //   };
//   // }

//   // loadUserProfile(): void {
//   //   this.steamService.getUserProfile().subscribe({
//   //     next: (profile) => {
//   //       this.userProfileUrl = profile.avatar;
//   //       this.userName = profile.name;
//   //     },
//   //     error: (err) => {
//   //       console.error('Erro ao carregar o perfil do usuário:', err);
//   //     }
//   //   });
//   // }

//   loadUserStats(): void {
//     this.loadTotalAchievements();
//     this.loadGamesStats();
//   }

//   loadTotalAchievements(): void {
//     this.steamService.getTotalUnlockedAchievements().subscribe({
//       next: (totalUnlocked) => {
//         this.totalSteamPoints = totalUnlocked;
//         this.updateLevelProgress();
//       },
//       error: (err) => {
//         console.error('Erro ao carregar conquistas:', err);
//       }
//     });
//   }

//   loadGamesStats(): void {
//     this.steamService.getAllGames().subscribe({
//       next: (games) => {
//         this.totalOwnedGames = games.length;
  
//         const playedGames = games.filter((game: any) => game.playtime_forever > 0);
//         this.totalPlayedGames = playedGames.length;
  
//         this.totalPlaytimeHours = 0;
  
//         playedGames.forEach(game => {
//           const playtimeInHours = game.playtime_forever / 60; 
  
//           this.totalPlaytimeHours += playtimeInHours;
//         });
    
//         this.steamService.getAllGamesWithAchievements().subscribe({
//           next: (gamesWithAchievements) => {
//             this.totalGamesWithAchievements = gamesWithAchievements.length;
  
//             gamesWithAchievements.forEach(game => {
//               this.processGame(game, 0);
//             });
  
//           },
//           error: (err) => {
//             console.error('Erro ao carregar jogos com conquistas:', err);
//           }
//         });
//       },
//       error: (err) => {
//         console.error('Erro ao carregar todos os jogos da conta:', err);
//       }
//     });
//   }
  
//   readonly basePointsPerLevel = 50;
//   readonly difficultyFactor = 1.5;

//   calculateLevelPoints(): number {
//     const platinumWeight = 3;
//     const achievementsWeight = 0.3;
//     const playtimeWeight = 0.2;

//     const platinumPoints = this.totalPlatinum * platinumWeight;
//     const achievementsPoints = this.totalSteamPoints * achievementsWeight;
//     const playtimePoints = this.totalPlaytimeHours * playtimeWeight;

//     return platinumPoints + achievementsPoints + playtimePoints;
//   }

//   calculatePointsForNextLevel(): number {
//     return Math.floor(this.basePointsPerLevel * Math.pow(this.difficultyFactor, this.currentLevel - 1));
//   }

//   updateLevelProgress(): void {
//     this.totalPoints = this.calculateLevelPoints();
//     let pointsForNextLevel = this.calculatePointsForNextLevel();

//     while (this.totalPoints >= pointsForNextLevel) {
//       this.totalPoints -= pointsForNextLevel;
//       this.currentLevel++;
//       pointsForNextLevel = this.calculatePointsForNextLevel();
//     }

//     this.nextLevelProgress = parseFloat(((this.totalPoints / pointsForNextLevel) * 100).toFixed(2));
//   }
// }