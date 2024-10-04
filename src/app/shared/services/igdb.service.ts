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

  getHighlightedGames(limit: number = 50): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': secretKey.igdbClientId,
      'Authorization': `Bearer ${secretKey.igdbApiKey}`,
      'Content-Type': 'application/json'
    });

    const today = Math.floor(Date.now() / 1000);
    const endDate = Math.floor(new Date('2024-12-31').getTime() / 1000);

    const body = `
      fields name, first_release_date, platforms.name, cover.url, hypes, category;
      where first_release_date >= ${today} & first_release_date <= ${endDate} & category = 0 & hypes > 0;
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

    const today = Math.floor(Date.now() / 1000); // Data atual em timestamp Unix (segundos)
    const endDate = Math.floor(new Date('2024-12-31').getTime() / 1000); // Timestamp Unix para 31 de dezembro de 2024

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

  getUpcomingGamesForCurrentMonth(limit: number = 10): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': secretKey.igdbClientId,
      'Authorization': `Bearer ${secretKey.igdbApiKey}`,
      'Content-Type': 'application/json'
    });
  
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const today = new Date();
    const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
    const todayTimestamp = Math.floor(today.getTime() / 1000);
  
    console.log('startOfMonthTimestamp:', startOfMonthTimestamp);
    console.log('todayTimestamp:', todayTimestamp);
  
    const body = `
      fields name, first_release_date, platforms.name, cover.url;
      where first_release_date >= ${startOfMonthTimestamp} & first_release_date <= ${todayTimestamp};
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