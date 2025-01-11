import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';
import { GameAchievement } from '../../../../../shared/models/game-achievement';
import { isScrolledToBottom } from '../../../../../utils/scroll.utils';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})
export class AchievementsComponent implements OnInit {
  @Input() achievements: GameAchievement[] = [];
  @Input() loading: boolean = false;
  @Input() hasMore: boolean = false;
  @Output() loadMore = new EventEmitter<void>();

  ngOnInit(): void {

  }

  onScroll(event: Event): void {
    if (isScrolledToBottom(event, 100) && this.hasMore && !this.loading) {
      this.loadMore.emit();
    }
  }
}
