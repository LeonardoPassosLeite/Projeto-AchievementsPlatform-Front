import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PageTitleComponent } from "../page-title/page-title.component";

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  @ViewChild('carousel') carousel!: ElementRef;

  @Input() games: any[] = [];
  @Input() title: string = '';
  @Input() subtitle: string = '';

  ngOnInit(): void {
    if (!this.games || this.games.length === 0) {
      console.warn('Nenhum jogo encontrado para exibir no carrossel.');
    }
  }

  scrollLeft(): void {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }

  getPlatforms(game: any): string {
    if (game.platforms && game.platforms.length > 0) {
      return game.platforms.map((platform: any) => platform.name).join(', ');
    } else {
      return 'Plataformas desconhecidas';
    }
  }

  formatDate(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('pt-BR', options);
  }
}