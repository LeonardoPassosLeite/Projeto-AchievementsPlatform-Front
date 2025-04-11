import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameFeedbackRequest, GameFeedbackResponse } from '../../../../shared/models/game-feedback.model';
import { AccountGameFeedback } from '../../../../shared/models/account-game.model';
import { PagedResultWithMeta } from '../../../../shared/models/coomons/pagination.model';
import { GameFeedbackService } from '../../../../shared/services/game-feedback.service';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handlig.service';
import { CommentListComponent } from '../../../../shared/components/games/comment-list/comment-list.component';
import { ModalFeedbackWarningComponent } from '../../../../shared/components/modais/modal-feedback-warning/modal-feedback-warning.component';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { faThumbsDown, faThumbsUp, faStarHalfAlt, faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-all-comments',
  standalone: true,
  imports: [
    CommentListComponent,
    PaginationComponent,
    GenericModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ModalFeedbackWarningComponent
  ],
  templateUrl: './all-comments.component.html',
  styleUrl: './all-comments.component.scss'
})
export class AllCommentsComponent implements OnInit {
  pagedFeedbacks$!: Observable<PagedResultWithMeta<GameFeedbackResponse, AccountGameFeedback>>;
  feedbackForm!: FormGroup;
  gameId!: number;
  isSubmitting = false;
  showWarningModal = false;
  warningMessage = '';
  pagination = { page: 1, pageSize: 10 };

  faThumbsUp = faThumbsUp;
  faThumbsDown = faThumbsDown;
  solidStar = solidStar;
  regularStar = regularStar;
  faStarHalf = faStarHalfAlt;

  ratingOptions: string[] = Array.from({ length: 11 }, (_, i) => (i * 0.5).toFixed(1));

  constructor(
    private gameFeedbackService: GameFeedbackService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private errorHandlingService: ErrorHandlingService
  ) { }

  ngOnInit(): void {
    this.initFeedbackForm();

    this.route.params.subscribe(params => {
      this.gameId = +params['id'];
      this.loadFeedbacks();
    });
  }

  initFeedbackForm(): void {
    this.feedbackForm = this.fb.group({
      comment: ['', Validators.required],
      rating: [5, [Validators.required, Validators.min(0), Validators.max(5)]],
      recommend: [true]
    });
  }

  loadFeedbacks(): void {
    this.pagedFeedbacks$ = this.gameFeedbackService.getPagedFeedbacksByGameId(
      this.gameId,
      this.pagination
    );

    this.pagedFeedbacks$.subscribe(data => {
      console.log('📥 Feedbacks carregados:', data);
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }) {
    this.pagination.page = event.pageIndex + 1;
    this.pagination.pageSize = event.pageSize;
    this.loadFeedbacks();
  }

  submitComment(): void {
    if (!this.gameId) {
      console.error('accountGameId está indefinido!');
      return;
    }

    if (this.feedbackForm.invalid) return;

    this.isSubmitting = true;

    const feedbackData: GameFeedbackRequest = {
      accountGameId: this.gameId,
      ...this.feedbackForm.value
    };

    this.gameFeedbackService.addGameFeedback(feedbackData).subscribe({
      next: () => {
        this.feedbackForm.reset({ rating: 5, recommend: true });
        this.loadFeedbacks();
      },
      error: (err) => {
        const parsedMessage = this.errorHandlingService.handleHttpError(err);
        this.warningMessage = parsedMessage;
        this.showWarningModal = true;
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false)
    });
  }

  closeWarningModal(): void {
    this.showWarningModal = false;
  }

  setRecommendation(value: boolean): void {
    this.feedbackForm.get('recommend')?.setValue(value);
  }
}