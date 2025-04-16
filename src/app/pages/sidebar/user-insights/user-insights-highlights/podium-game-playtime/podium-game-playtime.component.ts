import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { formatPlaytimeForever } from '../../../../../utils/playtime.utils';
import { AccountGame } from '../../../../../shared/models/account-game.model';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-podium-game-playtime',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './podium-game-playtime.component.html',
  styleUrls: ['./podium-game-playtime.component.scss']
})
export class PodiumGamePlaytimeComponent implements AfterViewInit {
  @Input() topPlayedGames: AccountGame[] = [];
  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  private scrollInterval: any;

  ngAfterViewInit(): void {
    this.scrollInterval = setInterval(() => this.scroll(), 5);
  }

  scroll(): void {
    const el = this.scrollContainer.nativeElement;
    el.scrollLeft += 1;
  
    const halfScroll = el.scrollWidth / 2;
  
    if (el.scrollLeft >= halfScroll) {
      el.scrollLeft = 0;
    }
  }
  
  ngOnDestroy(): void {
    clearInterval(this.scrollInterval);
  }

  formatPlaytime(playtime: number): string {
    return formatPlaytimeForever(playtime);
  }
}