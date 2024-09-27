import { Component } from '@angular/core';
import { GamenewsService } from '../../../shared/services/gamenews.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { IgdbService } from '../../../shared/services/igdb.service';
import { NavComponent } from '../../../shared/nav/nav.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [
    GenericModule,
    NavComponent],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.scss'
})
export class NoticiasComponent {
  featuredNews: any;
  newsList: any[] = [];
  currentPlatform: string = '';
  latestGames: any[] = [];

  categories = [
    { label: 'Notícias', value: 'noticias' },
    { label: 'Jogos Lançamentos', value: 'jogos-lancamento' },
    { label: 'Filmes', value: 'filmes' },
    { label: 'Séries', value: 'series' }
  ];

  constructor(private newsService: GamenewsService,
    private igdbService: IgdbService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(platform?: string): void {
    this.newsService.getGameNews(platform).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.featuredNews = response[0];
          this.newsList = response.slice(1, 10);
        }
      },
      error: (err) => console.error('Erro ao carregar notícias:', err)
    });
  }

  filterByPlatform(platform: string): void {
    this.currentPlatform = platform;
    this.loadNews(platform);
  }
}