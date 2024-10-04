import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/enviroment';
import { secretKey } from '../../environments/secret-key';

@Injectable({
  providedIn: 'root'
})
export class RawgService {
  private apiKey = secretKey.rawgApiKey;
  private apiUrl = environment.rawgApiUrl;

  constructor(private http: HttpClient) { }

  getUpcomingGames(): Observable<any> {
    const url = `${this.apiUrl}?key=${this.apiKey}&dates=${this.getDateRange()}&page_size=10`;
    return this.http.get(url).pipe(
      map((response: any) => response.results)
    );
  }

  private getDateRange(): string {
    const today = new Date();
    
    const endDate = new Date('2024-12-31');
  
    const startDate = today.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
  
    return `${startDate},${formattedEndDate}`;
  }
  
  getGamesByDateRange(startDate: Date, endDate: Date): Observable<any> {
    const start = startDate.toISOString().split('T')[0]; // Formata a data de início
    const end = endDate.toISOString().split('T')[0]; // Formata a data final
    const url = `${this.apiUrl}?key=${this.apiKey}&dates=${start},${end}&page_size=10`;
  
    return this.http.get(url).pipe(
      map((response: any) => response.results) // Extrai a lista de jogos dos resultados
    );
  }
  
}