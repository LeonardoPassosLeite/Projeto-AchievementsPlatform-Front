import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/enviroment';
import { secretKey } from '../../environments/secret-key';

@Injectable({
  providedIn: 'root'
})
export class IgdbService {
  private apiUrl = environment.igdbApiUrl;

  constructor(private http: HttpClient) { }

  getGames(limit: number = 500, offset: number = 0): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': secretKey.igdbClientId,
      'Authorization': `Bearer ${secretKey.igdbApiKey}`,
      'Content-Type': 'application/json'
    });
    const body = `
      fields name, rating, platforms, cover.url; 
      where rating < 100; 
      limit ${limit};
      offset ${offset};
    `;
    return this.http.post(this.apiUrl, body, { headers })
      .pipe(
        map((games: any) => {
          return games.map((game: any) => {
            if (game.cover && game.cover.url) {
              game.cover.url = game.cover.url.replace('t_thumb', 't_cover_big');
            }
            return game;
          });
        })
      );
  }

  getTodayReleases(limit: number = 10): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': secretKey.igdbClientId,
      'Authorization': `Bearer ${secretKey.igdbApiKey}`,
      'Content-Type': 'application/json'
    });

    const today = new Date();
    const startOfDayTimestamp = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).getTime() / 1000);
    const endOfDayTimestamp = Math.floor(new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).getTime() / 1000);

    const body = `
      fields name, first_release_date, platforms.name, cover.url, category;
      where first_release_date >= ${startOfDayTimestamp} & first_release_date <= ${endOfDayTimestamp} & category = 0;
      sort first_release_date asc;
      limit ${limit};
    `;

    return this.http.post(this.apiUrl, body, { headers })
      .pipe(
        map((games: any) => {
          return games.map((game: any) => {
            if (game.cover && game.cover.url) {
              game.cover.url = game.cover.url.replace('t_thumb', 't_cover_big');
            }
            return game;
          });
        })
      );
  }

  getHighlightedGames(limit: number = 20): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': secretKey.igdbClientId,
      'Authorization': `Bearer ${secretKey.igdbApiKey}`,
      'Content-Type': 'application/json'
    });

    const today = Math.floor(Date.now() / 1000);

    const currentDate = new Date();
    const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0); // Último dia do mês daqui a dois meses
    const endDate = Math.floor(futureDate.getTime() / 1000);

    const allowedPlatforms = ['PC (Microsoft Windows)', 'Xbox One', 'Xbox Series X|S', 'PlayStation 4', 'PlayStation 5', 'Nintendo Switch'];

    const body = `
      fields name, first_release_date, platforms.name, cover.url, hypes, category;
      where first_release_date >= ${today} 
        & first_release_date <= ${endDate} 
        & category = 0 
        & hypes > 0 
        & cover != null
        & platforms.name = (${allowedPlatforms.map(platform => `"${platform}"`).join(', ')});
      sort hypes desc;
      limit ${limit};
    `;

    return this.http.post(this.apiUrl, body, { headers })
      .pipe(
        map((games: any) => {
          return games.map((game: any) => {
            if (game.cover && game.cover.url) {
              game.cover.url = game.cover.url.replace('t_thumb', 't_cover_big');
            }
            return game;
          });
        })
      );
  }

  getUpcomingGames(limit: number = 500): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': secretKey.igdbClientId,
      'Authorization': `Bearer ${secretKey.igdbApiKey}`,
      'Content-Type': 'application/json'
    });

    const today = Math.floor(Date.now() / 1000);
    const endDate = Math.floor(new Date('2024-12-31').getTime() / 1000);

    const body = `
      fields name, first_release_date, platforms.name, cover.url, category;
      where first_release_date >= ${today} & first_release_date <= ${endDate} & category = 0; 
      sort first_release_date asc;
      limit ${limit};
    `;

    return this.http.post(this.apiUrl, body, { headers })
      .pipe(
        map((games: any) => {
          return games.map((game: any) => {
            if (game.cover && game.cover.url) {
              game.cover.url = game.cover.url.replace('t_thumb', 't_cover_big');
            }
            return game;
          });
        })
      );
  }

  getHighlightedGamesMonth(limit: number = 10): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': secretKey.igdbClientId,
      'Authorization': `Bearer ${secretKey.igdbApiKey}`,
      'Content-Type': 'application/json'
    });

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Garantir que não liste jogos do dia de hoje
    const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const tomorrowTimestamp = Math.floor(tomorrow.getTime() / 1000);
    const endOfMonthTimestamp = Math.floor(startOfNextMonth.getTime() / 1000);

    const body = `
      fields name, first_release_date, platforms.name, cover.url, hypes;
      where first_release_date >= ${tomorrowTimestamp} & first_release_date <= ${endOfMonthTimestamp} & hypes > 0;
      sort hypes desc;
      limit ${limit};
    `;

    return this.http.post(this.apiUrl, body, { headers })
      .pipe(
        map((games: any) => {
          return games.map((game: any) => {
            if (game.cover && game.cover.url) {
              game.cover.url = game.cover.url.replace('t_thumb', 't_cover_big');
            }
            return game;
          });
        }),
        catchError(error => {
          console.error('Erro ao carregar jogos aguardados do mês atual:', error);
          return throwError(error);
        })
      );
  }

  getRealeasesGamesMonth(limit: number = 10): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': secretKey.igdbClientId,
      'Authorization': `Bearer ${secretKey.igdbApiKey}`,
      'Content-Type': 'application/json'
    });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const today = new Date();
    const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
    const todayTimestamp = Math.floor(today.getTime() / 1000);

    const body = `
      fields name, first_release_date, platforms.name, cover.url;
      where first_release_date >= ${startOfMonthTimestamp} & first_release_date <= ${todayTimestamp} & cover != null;
      sort first_release_date desc;
      limit ${limit};
    `;

    return this.http.post(this.apiUrl, body, { headers })
      .pipe(
        map((games: any) => {
          return games.map((game: any) => {
            if (game.cover && game.cover.url) {
              game.cover.url = game.cover.url.replace('t_thumb', 't_cover_big');
            }
            return game;
          });
        }),
        catchError(error => {
          console.error('Erro ao carregar jogos lançados no mês atual:', error);
          return throwError(error);
        })
      );
  }

  searchGames(searchQuery: string, limit: number = 50, offset: number = 0): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': secretKey.igdbClientId,
      'Authorization': `Bearer ${secretKey.igdbApiKey}`,
      'Content-Type': 'application/json'
    });
    const body = `
      search "${searchQuery}";
      fields name, rating, platforms, cover.url;
      limit ${limit};
      offset ${offset};
    `;
    return this.http.post(this.apiUrl, body, { headers })
      .pipe(
        map((games: any) => {
          return games.map((game: any) => {
            if (game.cover && game.cover.url) {
              game.cover.url = game.cover.url.replace('t_thumb', 't_cover_big');
            }
            return game;
          });
        })
      );
  }
}