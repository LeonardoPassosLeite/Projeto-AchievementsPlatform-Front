import { Component, EventEmitter, Output } from '@angular/core';
import { GameStatus } from '../../../shared/enums/GameStatus';
import { isScrolledToBottom } from '../../../utils/scroll.utils';
import { AccountGameQuery } from '../../../state/account-game/AccountGame.query';
import { ErrorHandlingService } from '../../../shared/services/commons/error-handlig.service';
import { TokenStorageService } from '../../../shared/services/auth/tokenStorage.service';
import { AccountGame } from '../../../shared/models/account-game.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { CarouselComponent } from '../../../shared/components/carousel/carousel.component';

@Component({
  selector: 'app-game-status',
  standalone: true,
  imports: [GenericModule, CarouselComponent],
  templateUrl: './game-status.component.html',
  styleUrl: './game-status.component.scss'
})
export class GameStatusComponent {
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
    private errorHandlingService: ErrorHandlingService,
    private tokenStorageService: TokenStorageService,
  ) { }

  ngOnInit(): void {
    this.token = this.tokenStorageService.getTokenFromCookie();

    if (!this.token) {
      this.errorMessage = 'Token de autenticação não encontrado.';

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

  //arrumar isso, preciso fazer com que fique generico
  getStatusName(status: GameStatus): string {
    const statusNames: { [key in GameStatus]: string } = {
      [GameStatus.NotStarted]: "Não Iniciado",
      [GameStatus.InProgress]: "Em Progresso",
      [GameStatus.Completed]: "Zerados",
      [GameStatus.Platinum]: "Platinados",
      [GameStatus.Abandoned]: "Dropados"
    };
    return statusNames[status];
  }

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