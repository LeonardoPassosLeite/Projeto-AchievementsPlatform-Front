import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { IgdbService } from '../../../shared/services/igdb.service';
import { PageTitleComponent } from "../../../shared/components/page-title/page-title.component";
import { PlatformFilterComponent } from "../../../shared/components/platform-filter/platform-filter.component";
import { CarouselComponent } from "../../../shared/components/carousel/carousel.component";
import { AutoCarouselComponent } from "../../../shared/components/auto-carousel/auto-carousel.component";

@Component({
  selector: 'app-jogos-lancamentos',
  standalone: true,
  imports: [
    CommonModule,
    GenericModule,
    PageTitleComponent,
    PlatformFilterComponent,
    CarouselComponent,
    AutoCarouselComponent
  ],
  templateUrl: './jogos-lancamentos.component.html',
  styleUrls: ['./jogos-lancamentos.component.scss']
})
export class JogosLancamentosComponent implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef;

  todayReleases: any[] = [];
  highlightedGames: any[] = [];
  highlightedGamesMonth: any[] = [];
  upcomingGames: any[] = [];
  realeasesMonthGames: any[] = [];

  constructor(private igdbService: IgdbService) { }

  ngOnInit(): void {
    this.loadHighlightedGames();
    this.loadHighlightedGamesMonth();
    this.loadRealeasesGamesMonth();
    this.loadTodayReleases();
  }

  loadTodayReleases(): void {
    this.igdbService.getTodayReleases().subscribe({
      next: (response) => {
        this.todayReleases = response;
      },
      error: (err) => {
        console.error('Erro ao carregar lançamentos de hoje:', err);
      }
    });
  }

  loadHighlightedGames(): void {
    this.igdbService.getHighlightedGames().subscribe({
      next: (response) => {
        const sortedGames = response.sort((a: any, b: any) => a.first_release_date - b.first_release_date);
        this.highlightedGames = sortedGames;
      },
      error: (err) => {
        console.error('Erro ao carregar jogos mais aguardados:', err);
      }
    });
  }

  loadHighlightedGamesMonth(): void {
    this.igdbService.getHighlightedGamesMonth().subscribe({
      next: (response) => {
        const sortedGames = response.sort((a: any, b: any) => a.first_release_date - b.first_release_date);
        this.highlightedGamesMonth = sortedGames;
      },
      error: (err) => {
        console.error('Erro ao carregar jogos do mês atual:', err);
      }
    });
  }

  loadRealeasesGamesMonth(): void {
    this.igdbService.getRealeasesGamesMonth().subscribe({
      next: (response) => {
        const sortedGames = response.sort((a: any, b: any) => a.first_release_date - b.first_release_date);
        this.realeasesMonthGames = sortedGames;
      },
      error: (err) => {
        console.error('Erro ao carregar jogos lançados no mês atual:', err);
      }
    });
  }
}