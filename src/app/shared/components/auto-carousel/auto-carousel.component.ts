import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PageTitleComponent } from "../page-title/page-title.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-auto-carousel',
  standalone: true,
  imports: [CommonModule, PageTitleComponent],
  templateUrl: './auto-carousel.component.html',
  styleUrl: './auto-carousel.component.scss'
})
export class AutoCarouselComponent implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef;

  @Input() games: any[] = [];
  @Input() title: string = '';
  @Input() subtitle: string = '';

  autoScrollInterval: any;
  autoScrollActive = true;

  ngOnInit(): void {
    if (!this.games || this.games.length === 0) {
      console.warn('Nenhum jogo encontrado para exibir no carrossel.');
    }

    this.startAutoScroll();

    setInterval(() => {
      this.updateCountdowns();
    }, 1000);
  }

  scrollLeft(): void {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(): void {
    const container = this.carousel.nativeElement;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    if (container.scrollLeft >= maxScrollLeft) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  startAutoScroll(): void {
    this.autoScrollInterval = setInterval(() => {
      this.scrollRight();
    }, 3000);
  }

  stopAutoScroll(): void {
    clearInterval(this.autoScrollInterval);
    this.autoScrollActive = false;
  }

  toggleAutoScroll(): void {
    if (this.autoScrollActive) {
      this.stopAutoScroll();
    } else {
      this.startAutoScroll();
    }
  }

  // Atualiza o tempo restante para cada jogo
  updateCountdowns(): void {
    this.games.forEach(game => {
      const timeLeft = this.getTimeUntilRelease(game.first_release_date);
      game.timeLeft = timeLeft;
    });
  }

  // Método para calcular o tempo restante
  getTimeUntilRelease(first_release_date: number): any {
    const now = new Date().getTime();
    const releaseDate = new Date(first_release_date * 1000).getTime();
    const timeLeft = releaseDate - now;

    if (timeLeft > 0) {
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    } else {
      return null; // Já lançado
    }
  }

  // Verifica se o jogo já foi lançado
  isGameReleased(first_release_date: number): boolean {
    const releaseDate = new Date(first_release_date * 1000);
    return releaseDate < new Date();
  }
}