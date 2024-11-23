import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Game, HourlyGame } from '../models/steam-game.model';


@Injectable({
    providedIn: 'root',
})
export class SteamChartsService {
    private readonly stemChartApiUrl = environment.steamChartsApiUrl;
    private readonly hourlyGamesApiUrl = environment.hourlyGamesApiUrl;

    constructor(private http: HttpClient) { }

    getTopGames(): Observable<Game[]> {
        return this.http.get<Game[]>(this.stemChartApiUrl).pipe(
            map((games) =>
                games.map((game, index) => ({
                    ...game,
                    appId: index + 1,
                })))
        )
    }

    getHourlyGames(): Observable<HourlyGame[]> {
        return this.http.get<HourlyGame[]>(this.hourlyGamesApiUrl);
    }
}