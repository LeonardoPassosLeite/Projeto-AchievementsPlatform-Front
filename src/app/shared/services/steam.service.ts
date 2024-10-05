import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { secretKey } from '../../environments/secret-key';
import { GameAchievements, SteamAchievement, SteamGame } from '../models/steam-game.model';

@Injectable({
  providedIn: 'root'
})
export class SteamService {
  constructor(private http: HttpClient) { }

  private getSteamApiUrl(endpoint: string): string {
    const steamId = secretKey.steamId;
    const apiKey = secretKey.steamApiKey;
    return `/steam-api/${endpoint}?key=${apiKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`;
  }

  private getAchievementsForGames(games: SteamGame[]): Observable<SteamGame[]> {
    const gameAchievementsRequests = games.map((game: SteamGame) => {
      return this.getGameAchievements(game.appid).pipe(
        map(achievements => ({
          ...game,
          achievementsUnlocked: achievements.unlocked,
          totalAchievements: achievements.total
        })),
        catchError(error => {
          return of({
            ...game,
            achievementsUnlocked: 0,
            totalAchievements: 0
          });
        })
      );
    });

    return forkJoin(gameAchievementsRequests);
  }

  getUserProfile(): Observable<any> {
    const url = `/steam-api/ISteamUser/GetPlayerSummaries/v2/?key=${secretKey.steamApiKey}&steamids=${secretKey.steamId}`;
  
    return this.http.get<{ response: { players: any[] } }>(url).pipe(
      map(response => {
        if (response?.response?.players?.length) {
          const player = response.response.players[0];
          return {
            name: player.personaname,
            avatar: player.avatarfull
          };
        }
        return { name: 'Usuário Desconhecido', avatar: '' };
      }),
      catchError(error => {
        console.error('Erro ao buscar o perfil do usuário:', error);
        return of({ name: 'Usuário Desconhecido', avatar: '' });
      })
    );
  }  

  getAllGames(): Observable<SteamGame[]> {
    const url = this.getSteamApiUrl('IPlayerService/GetOwnedGames/v1');
    return this.http.get(url).pipe(
      map((response: any) => response?.response?.games || []),
      catchError(error => {
        console.error('Erro ao buscar todos os jogos da Steam:', error);
        return of([]);
      })
    );
  }

  getAllGamesWithAchievements(): Observable<SteamGame[]> {
    return this.getAllGames().pipe(
      map((games: SteamGame[]) => games.filter((game: SteamGame) => game.has_community_visible_stats)),
      catchError(error => {
        console.error('Erro ao buscar jogos com conquistas:', error);
        return of([]);
      })
    );
  }

  getGameAchievements(appId: number): Observable<GameAchievements> {
    const url = `/steam-api/ISteamUserStats/GetPlayerAchievements/v1/?key=${secretKey.steamApiKey}&steamid=${secretKey.steamId}&appid=${appId}`;

    return this.http.get<{ playerstats: { achievements: SteamAchievement[] } }>(url).pipe(
      map(response => {
        if (response?.playerstats?.achievements) {
          const achievements = response.playerstats.achievements;
          const unlocked = achievements.filter(achievement => achievement.achieved === 1).length;
          const total = achievements.length;

          return { unlocked, total };
        }
        return { unlocked: 0, total: 0 };
      }),
      catchError(error => {
        if (error.status === 404) {
          console.warn(`Jogo sem conquistas ou não disponível: ${appId}`);
          return of({ unlocked: 0, total: 0 });
        }
        console.error(`Erro ao buscar conquistas para o jogo ${appId}:`, error);
        return of({ unlocked: 0, total: 0 });
      })
    );
  }

  getGamesWithAchievements(): Observable<SteamGame[]> {
    return this.getAllGamesWithAchievements().pipe(
      switchMap(games => games.length ? this.getAchievementsForGames(games) : of([]))
    );
  }

  getTotalUnlockedAchievements(): Observable<number> {
    return this.getGamesWithAchievements().pipe(
      map(games => {
        let totalUnlocked = 0;

        games.forEach(game => {
          totalUnlocked += game.achievementsUnlocked;
        });

        return totalUnlocked;
      }),
      catchError(error => {
        console.error('Erro ao calcular o total de conquistas desbloqueadas:', error);
        return of(0);
      })
    );
  }
}  