import { Component, EventEmitter, Input, Output } from "@angular/core";
import { GenericModule } from "../../../../../shareds/commons/GenericModule";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { GameFeedbackResponseBase, UserGameFeedbackResponse } from "../../../models/game-feedback.model";
import { AccountGameFeedback } from "../../../models/account-game.model";
import { formatPlaytimeForever } from "../../../../utils/playtime.utils";
import { faThumbsDown, faThumbsUp, faStarHalfAlt, faClock, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports:
    [
      GenericModule,
      FontAwesomeModule,
    ],
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss']
})
export class CommentListComponent {
  @Input() items: GameFeedbackResponseBase[] = [];
  @Input() itemType: 'game' | 'user' = 'game';
  @Input() totalItems = 0;

  @Output() pageChange = new EventEmitter<{ pageIndex: number; pageSize: number }>();

  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  solidStar = solidStar;
  regularStar = regularStar;
  faStarHalf = faStarHalfAlt;
  faClock = faClock;

  getStars(rating: number) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    const stars = [];

    for (let i = 0; i < fullStars; i++) stars.push(this.solidStar);
    if (hasHalfStar) stars.push(this.faStarHalf);
    for (let i = 0; i < emptyStars; i++) stars.push(this.regularStar);

    return stars;
  }

  getAccountGameFeedback(feedback: GameFeedbackResponseBase): AccountGameFeedback | null {
    if (this.itemType === 'user') {
      const userFeedback = feedback as UserGameFeedbackResponse;
      return userFeedback.accountGameFeedback ?? null;
    }
    return null;
  }

  formatPlaytime(minutes: number): string {
    return formatPlaytimeForever(minutes);
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize
    });
  }
}