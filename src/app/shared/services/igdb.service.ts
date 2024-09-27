import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getLatestGames(): Observable<any> {
    const headers = new HttpHeaders({
      'Client-ID': secretKey.igdbClientId,
      'Authorization': `Bearer ${secretKey.igdbApiKey}`,
      'Content-Type': 'application/json'
    });

    const body = `
      fields name, summary, rating, cover.url, release_dates.date;
      sort release_dates.date desc;
      limit 10;
      where rating > 0; 
    `;

    return this.http.post(this.apiUrl, body, { headers }).pipe(
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