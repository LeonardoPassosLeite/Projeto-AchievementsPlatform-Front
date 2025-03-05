import { Component, OnInit } from '@angular/core';
import { GameFeedbackWithMeta } from '../../../../shared/models/game-feedback.model';
import { AccountGameService } from '../../../../shared/services/account-game.service';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../../../../shared/services/auth/tokenStorage.service';
import { ActivatedRoute } from '@angular/router';
import { formatPlaytimeForever } from '../../../../utils/playtime.utils';
import { GameFeedbackService } from '../../../../shared/services/game-feedback.service';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  private token: string | null = null;

  feedbacks$: Observable<GameFeedbackWithMeta | null> = new Observable();
  gameInfo: { gameName: string; iconUrl: string; playtimeForever: number } = {
    gameName: "Nome não disponível",
    iconUrl: 'assets/default-game.png',
    playtimeForever: 0
  };
  totalItems: number = 0;
  pageNumber: number = 1;
  pageSize: number = 10;
  gameId!: number;
  newComment: string = '';
  newRating: number = 5;
  recommend: boolean = true;
  isSubmitting: boolean = false;

  constructor(
    private accountGameService: AccountGameService,
    private gameFeedbackService: GameFeedbackService,
    private tokenStorageService: TokenStorageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.token = this.tokenStorageService.getTokenFromCookie();

    // Pegamos o gameId da rota
    this.route.params.subscribe(params => {
      this.gameId = +params['id'];
      if (this.token && this.gameId) {
        this.loadFeedbacks(this.gameId, this.pageNumber, this.pageSize);
      }
    });
  }

  loadFeedbacks(accountGameId: number, pageNumber: number = 1, pageSize: number = 10): void {
    if (!this.token) {
      console.error('Usuário não autenticado! Faça login.');
      return;
    }

    this.accountGameService.getPagedGameFeedbacks(this.token, accountGameId, pageNumber, pageSize)
      .subscribe({
        next: (response: GameFeedbackWithMeta) => {
          this.feedbacks$ = new Observable(subscriber => {
            subscriber.next(response);
            subscriber.complete();
          });

          // Atualiza os dados do jogo com os metadados
          if (response.meta) {
            this.gameInfo = response.meta;
          }

          this.totalItems = response.totalItems;
          console.log('✅ Feedbacks carregados:', response);
        },
        error: (error) => {
          console.error('❌ Erro ao buscar feedbacks:', error);
        }
      });
  }

  nextPage(): void {
    if (this.pageNumber * this.pageSize < this.totalItems) {
      this.pageNumber++;
      this.loadFeedbacks(this.gameId, this.pageNumber, this.pageSize);
    }
  }

  previousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadFeedbacks(this.gameId, this.pageNumber, this.pageSize);
    }
  }

  submitComment(): void {
    if (!this.token) {
      console.error('Usuário não autenticado! Faça login.');
      return;
    }

    if (!this.newComment.trim()) {
      console.warn('O comentário não pode estar vazio.');
      return;
    }

    this.isSubmitting = true;

    const feedbackData = {
      accountGameId: this.gameId,
      comment: this.newComment,
      rating: this.newRating,
      recommend: this.recommend,
    };

    this.gameFeedbackService.addGameFeedback(this.token, feedbackData)
      .subscribe({
        next: (response) => {
          console.log('✅ Comentário enviado com sucesso:', response);
          this.newComment = ''; // Limpar campo de texto após envio
          this.newRating = 5; // Resetar avaliação
          this.recommend = true; // Resetar recomendação
          this.loadFeedbacks(this.gameId, this.pageNumber, this.pageSize); // Atualizar lista
        },
        error: (error) => {
          console.error('❌ Erro ao enviar comentário:', error);
        },
        complete: () => this.isSubmitting = false
      });
  }

  formatPlaytime(playtime: number): string {
    return formatPlaytimeForever(playtime);
  }
}