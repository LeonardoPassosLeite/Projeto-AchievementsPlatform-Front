import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../shared/models/coomons/pagination.model';
import { UserGameFeedbackResponse } from '../../../shared/models/game-feedback.model';
import { GameFeedbackService } from '../../../shared/services/game-feedback.service';
import { CommentListComponent } from '../../../shared/components/users/comment-list/comment-list.component';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    GenericModule,
    PaginationComponent,
    CommentListComponent
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  pagedFeedbacks$!: Observable<PagedResult<UserGameFeedbackResponse>>;
  pagination = { page: 1, pageSize: 10 };

  constructor(private gameFeedbackService: GameFeedbackService) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.pagedFeedbacks$ = this.gameFeedbackService.getPagedFeedbacksByUser(this.pagination);
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.pageSize = event.pageSize;
    this.loadFeedbacks();
  }
}