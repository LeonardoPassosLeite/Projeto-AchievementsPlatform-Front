import { Component, EventEmitter, Output } from '@angular/core';
import { isScrolledToBottom } from '../../../utils/scroll.utils';
import { GameStatus } from '../../../shared/enums/game-status';
import { AccountGame } from '../../../shared/models/account-game.model';
import { AccountGameQuery } from '../../../state/account-game/AccountGame.query';
import { GameStatusManagerService } from '../../../shared/services/game-status-manager.service';
import { ErrorHandlingService } from '../../../shared/services/commons/error-handlig.service';
import { TokenStorageService } from '../../../core/auth/tokenStorage.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { CarouselComponent } from '../../../shared/components/carousel/carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GenericModule, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  accountGames: AccountGame[] = [];
  errorMessage: string | null = null;
  loading = false;
  currentPage = 1;
  pageSize = 10;
  hasMore = true;
  token: string | null = null;

  statuses = Object.values(GameStatus).filter(value => typeof value === 'number') as GameStatus[];

  @Output() scrolledToBottom = new EventEmitter<void>();

  get carouselItems() {
    if (!this.accountGames.length) return [];

    return this.accountGames
      .filter(game => game.gameStatusManager && game.gameStatusManager.gameStatus !== undefined)
      .map(game => ({
        ...game,
        status: game.gameStatusManager.gameStatus as GameStatus
      }));
  }

  constructor(
    private accountGameQuery: AccountGameQuery,
    private gameStatusManagerService: GameStatusManagerService,
    private errorHandlingService: ErrorHandlingService,
    private tokenStorageService: TokenStorageService,
  ) { }

  ngOnInit(): void {
    this.token = this.tokenStorageService.getTokenFromCookie();

    if (!this.token) {
      this.errorMessage = 'Token de autenticação não encontrado.';

      this.loadPagedAllAccountGames();
      return;
    }

    this.loadPagedAllAccountGames();
  }

  loadPagedAllAccountGames(): void {
    if (this.loading || !this.hasMore || !this.token) return;

    this.loading = true;

    this.accountGameQuery.accountGames$.subscribe(games => {

      if (games.length < this.pageSize) {
        this.hasMore = false;
      }

      this.accountGames = [...games];
      this.currentPage++;

      this.loading = false;
    }, error => {
      this.errorMessage = this.errorHandlingService.handleHttpError(error);
      console.error('❌ Erro ao carregar jogos do Store:', error);
      this.loading = false;
    });
  }

  // updateGameStatus(update: { id: number; newStatus: GameStatus }): void {

  //   this.gameStatusManagerService.updateGameStatus(update.id, update.newStatus).subscribe({
  //     next: () => {

  //       const gameIndex = this.accountGames.findIndex(game => game.id === update.id);
  //       if (gameIndex !== -1) {
  //         this.accountGames[gameIndex] = {
  //           ...this.accountGames[gameIndex],
  //           gameStatusManager: {
  //             ...this.accountGames[gameIndex].gameStatusManager,
  //             gameStatus: update.newStatus
  //           }
  //         };
  //       }

  //       this.accountGames = [...this.accountGames];
  //     },
  //     error: (error) => this.handleError(error, 'Erro ao atualizar status do jogo.')
  //   });
  // }

  // getStatusName(status: GameStatus): string {
  //   const statusNames: { [key in GameStatus]: string } = {
  //     [GameStatus.NotStarted]: "Não Iniciado",
  //     [GameStatus.InProgress]: "Em Progresso",
  //     [GameStatus.Completed]: "Zerados",
  //     [GameStatus.Platinum]: "Platinados",
  //     [GameStatus.Abandoned]: "Dropados"
  //   };
  //   return statusNames[status];
  // }

  onScroll(event: Event): void {
    if (isScrolledToBottom(event, 100)) {
      this.scrolledToBottom.emit();
    }
  }

  private handleError(error: any, message: string): void {
    this.errorMessage = this.errorHandlingService.handleHttpError(error);
    console.error(message, error);
  }
}
