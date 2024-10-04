import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { IgdbService } from '../../../shared/services/igdb.service';
import { PageTitleComponent } from "../../../shared/components/page-title/page-title.component";
import { PlatformFilterComponent } from "../../../shared/components/platform-filter/platform-filter.component";
import { CarouselComponent } from "../../../shared/components/carousel/carousel.component";

@Component({
  selector: 'app-jogos-lancamentos',
  standalone: true,
  imports: [CommonModule, GenericModule, PageTitleComponent, PlatformFilterComponent, CarouselComponent],
  templateUrl: './jogos-lancamentos.component.html',
  styleUrls: ['./jogos-lancamentos.component.scss']
})
export class JogosLancamentosComponent implements OnInit {
  @ViewChild('highlightedCarousel') highlightedCarousel!: ElementRef;
  @ViewChild('currentMonthCarousel') currentMonthCarousel!: ElementRef;

  highlightedGames: any[] = [];
  upcomingGames: any[] = [];
  currentMonthGames: any[] = [];

  constructor(private igdbService: IgdbService) { }

  ngOnInit(): void {
    this.loadHighlightedGames();
    this.loadUpcomingGames();
    this.loadCurrentMonthGames();
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

  loadUpcomingGames(): void {
    this.igdbService.getUpcomingGames().subscribe({
      next: (response) => {
        const sortedGames = response.sort((a: any, b: any) => a.first_release_date - b.first_release_date);
        this.upcomingGames = sortedGames;
      },
      error: (err) => {
        console.error('Erro ao carregar jogos futuros:', err);
      }
    });
  }

  loadCurrentMonthGames(): void {
    this.igdbService.getUpcomingGamesForCurrentMonth().subscribe({
      next: (response) => {
        const sortedGames = response.sort((a: any, b: any) => a.first_release_date - b.first_release_date);
        this.currentMonthGames = sortedGames;
      },
      error: (err) => {
        console.error('Erro ao carregar jogos lançados no mês atual:', err);
      }
    });
  }

  scrollLeft(carouselType: string): void {
    if (carouselType === 'highlighted') {
      this.highlightedCarousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    } else if (carouselType === 'current') {
      this.currentMonthCarousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(carouselType: string): void {
    if (carouselType === 'highlighted') {
      this.highlightedCarousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    } else if (carouselType === 'current') {
      this.currentMonthCarousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }
}