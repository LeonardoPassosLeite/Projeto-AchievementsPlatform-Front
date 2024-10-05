import { Injectable } from '@angular/core';
import { secretKey } from '../../environments/secret-key';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GamenewsService {

  private apiUrl = environment.newsApiUrl + '/v2/everything';

  constructor(private http: HttpClient) { }

  getGameNews(platform?: string): Observable<any> {
    let query = 'games';

    if (platform) {
      switch (platform) {
        case 'PC':
          query = 'Microsoft PC';
          break;
        case 'PlayStation':
          query = 'PlayStation';
          break;
        case 'Xbox':
          query = 'Xbox Studios';
          break;
        case 'Nintendo':
          query = 'Nintendo';
          break;
        default:
          query = 'games';
      }
    }

    const params = new HttpParams()
      .set('q', query)
      .set('sortBy', 'publishedAt')
      .set('language', 'pt')
      .set('apiKey', secretKey.newsApiKey);

    return this.http.get(this.apiUrl, { params }).pipe(
      map((response: any) => response.articles)
    );
  }
}