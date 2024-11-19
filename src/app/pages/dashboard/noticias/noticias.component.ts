import { Component } from '@angular/core';
import { GamenewsService } from '../../../shared/services/gamenews.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { PlatformFilterComponent } from "../../../shared/components/ui/platform-filter/platform-filter.component";
import { PageTitleComponent } from "../../../shared/components/ui/page-title/page-title.component";
import { NavComponent } from '../../../shared/components/nav/nav.component';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [
    GenericModule,
    PlatformFilterComponent,
    PageTitleComponent
  ],
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

  constructor(private newsService: GamenewsService) { }

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

  onPlatformSelected(platform: string): void {
    this.currentPlatform = platform;

    console.log(`Buscando notícias para a plataforma selecionada: ${platform || 'todas as plataformas'}`);

    this.loadNews(platform);
  }
}