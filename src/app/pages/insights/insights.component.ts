import { Component, OnInit } from '@angular/core';
import { SteamChartsService } from '../../shared/services/steam-charts.service';
import { Game, HourlyGame } from '../../shared/models/steam-game.model';
import { PlayerChartComponent } from './player-chart/player-chart.component';
import { HourlyPlayersChartComponent } from './hourly-player-chart/hourly-player-chart.component copy';
import { DisplayType } from '../../shared/enums/displayType';


@Component({
  selector: 'app-insights',
  standalone: true,
  imports: [
    PlayerChartComponent,
    HourlyPlayersChartComponent
  ],
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss'],
})
export class InsightsComponent implements OnInit {
  games: Game[] = [];
  hourlyData: { [gameName: string]: { time: string[]; players: number[] } } = {};
  displayType: DisplayType = DisplayType.CurrentPlayers;

  constructor(private steamChartsService: SteamChartsService) { }

  ngOnInit(): void {
    this.fetchCurrentData();
    this.fetchHourlyData();
  }

  fetchCurrentData(): void {
    this.steamChartsService.getTopGames().subscribe({
      next: (games) => (this.games = games),
      error: (err) => console.error('Erro ao carregar jogos:', err),
    });
  }

  fetchHourlyData(): void {
    this.steamChartsService.getHourlyGames().subscribe({
      next: (data) => {
        console.log('Dados horários recebidos:', data); 
        this.hourlyData = this.formatHourlyData(data);
      },
      error: (err) => console.error('Erro ao carregar dados horários:', err),
    });
  }


  formatHourlyData(data: HourlyGame[]): { [gameName: string]: { time: string[]; players: number[] } } {
    const formattedData: { [gameName: string]: { time: string[]; players: number[] } } = {};

    data.forEach((entry) => {
      const gameName = entry.name;
      if (!formattedData[gameName]) {
        formattedData[gameName] = { time: [], players: [] };
      }
      const hour = new Date(entry.date).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
      formattedData[gameName].time.push(hour);
      formattedData[gameName].players.push(entry.currentPlayers);
    });

    return formattedData;
  }
}