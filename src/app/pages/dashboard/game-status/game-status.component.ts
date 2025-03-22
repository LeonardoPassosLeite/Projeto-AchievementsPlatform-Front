import { Component, EventEmitter, Output } from '@angular/core';
import { GameStatus } from '../../../shared/enums/GameStatus';
import { isScrolledToBottom } from '../../../utils/scroll.utils';
import { AccountGameQuery } from '../../../state/account-game/AccountGame.query';
import { ErrorHandlingService } from '../../../shared/services/commons/error-handlig.service';
import { TokenStorageService } from '../../../shared/services/auth/tokenStorage.service';
import { AccountGame } from '../../../shared/models/account-game.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { CarouselComponent } from '../../../shared/components/carousel/carousel.component';
import { BaseComponentWithToken } from '../../../utils/BaseComponentWithToken';

@Component({
  selector: 'app-game-status',
  standalone: true,
  imports: [GenericModule, CarouselComponent],
  templateUrl: './game-status.component.html',
  styleUrl: './game-status.component.scss',
})
export class GameStatusComponent extends BaseComponentWithToken {
  accountGames: AccountGame[] = [];

  statuses = Object.values(GameStatus).filter(
    (value) => typeof value === 'number'
  ) as GameStatus[];

  @Output() scrolledToBottom = new EventEmitter<void>();

  constructor(
    private accountGameQuery: AccountGameQuery,
    tokenStorageService: TokenStorageService,
    errorHandlingService: ErrorHandlingService
  ) {
    super(tokenStorageService, errorHandlingService); 
  }

  loadData(): void {
    this.loadAccountGames();
  }

  loadAccountGames(): void {
    this.accountGameQuery.accountGames$.subscribe(
      (games) => {
        this.accountGames = [...games];
      },
      (error) => {
        this.handleError(error, 'Erro ao carregar jogos do Store:');
      }
    );
  }

  get carouselItems() {
    if (!this.accountGames.length) return [];

    return this.accountGames
      .filter(
        (game) =>
          game.gameStatusManager && game.gameStatusManager.gameStatus !== undefined
      )
      .map((game) => ({
        ...game,
        status: game.gameStatusManager.gameStatus as GameStatus,
      }));
  }

  getStatusName(status: GameStatus): string {
    const statusNames: { [key in GameStatus]: string } = {
      [GameStatus.NotStarted]: 'Não Iniciado',
      [GameStatus.InProgress]: 'Em Progresso',
      [GameStatus.Completed]: 'Zerados',
      [GameStatus.Platinum]: 'Platinados',
      [GameStatus.Abandoned]: 'Dropados',
    };
    return statusNames[status];
  }

  onScroll(event: Event): void {
    if (isScrolledToBottom(event, 100)) {
      this.scrolledToBottom.emit();
    }
  }
}