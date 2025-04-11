import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { AccountGameStatus } from '../../../../shared/models/account-game.model';
import { GameStatus } from '../../../../shared/enums/game-status';
import { Observable, Subject } from 'rxjs';
import { AccountGameQuery } from '../../../../state/account-game/AccountGame.query';
import { GameStatusManagerService } from '../../../../shared/services/game-status-manager.service';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handlig.service';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { AllGameListComponent } from '../../../../shared/components/carousel/all-game-list/all-game-list.component';
import { AccountGameStore } from '../../../../state/account-game/AccountGame.store';
import { MaterialModule } from '../../../../../shareds/commons/MaterialModule';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { SnackbarService } from '../../../../shared/services/snackbar/snackbar.service';
import { handleUpdate } from '../../../../utils/handle-update';

@Component({
  selector: 'app-game-status-manager',
  standalone: true,
  imports: [
    GenericModule,
    MaterialModule,
    AllGameListComponent,
    CdkDropList,
    CdkDrag,
    DragDropModule
  ],
  templateUrl: './game-status-manager.component.html',
  styleUrls: ['./game-status-manager.component.scss']
})
export class GameStatusManagerComponent implements OnInit, OnDestroy {
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('gamesTemplate') gamesTemplate!: TemplateRef<any>;

  private destroy$ = new Subject<void>();

  connectedDropLists: string[] = [];
  GameStatus = GameStatus;
  notStartedGames$: Observable<AccountGameStatus[]>;
  assignedStatus$: Observable<AccountGameStatus[]>;

  statusColumns = [
    { label: 'Em Progresso', value: GameStatus.InProgress },
    { label: 'Para Jogar', value: GameStatus.WhishList },
    { label: 'Favoritos', value: GameStatus.Favorite },
    { label: 'Concluído', value: GameStatus.Completed },
    { label: 'Dropado', value: GameStatus.Abandoned }
  ];

  constructor(
    private snackbarService: SnackbarService,
    private gameStatusService: GameStatusManagerService,
    private accountGameStore: AccountGameStore,
    private accountGameQuery: AccountGameQuery,
    private errorHandlingService: ErrorHandlingService,
  ) {
    this.notStartedGames$ = this.accountGameQuery.notStarted$;
    this.assignedStatus$ = this.accountGameQuery.assignedStatus$;
  }

  ngOnInit(): void {
    this.connectedDropLists = this.statusColumns.map(c => 'status-' + c.value);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getGamesByColumn(games: AccountGameStatus[], status: GameStatus): AccountGameStatus[] {
    return games.filter(g => g.gameStatusManager?.gameStatus === status);
  }

  onGameDropped(event: CdkDragDrop<any>, newStatus: GameStatus): void {
    const game = event.item.data as AccountGameStatus;
    const previousStatus = game?.gameStatusManager?.gameStatus;

    if (!game || newStatus === previousStatus) {
      this.snackbarService.showError('Drop inválido ou sem mudança');
      return;
    }

    this.updateGameStatus(game.id, newStatus);
  }

  private updateGameStatus(accountGameId: number, newStatus: GameStatus): void {
    const action = `atualizado para "${this.getStatusName(newStatus)}"`;

    handleUpdate(
      this.gameStatusService.updateGameStatus({
        accountGameId,
        newStatus
      }),
      {
        onSuccessMessage: `Jogo ${action} com sucesso!`,
        onErrorMessage: 'Erro ao atualizar status do jogo.',
        onSuccessAction: () => this.accountGameStore.updateGameStatus(accountGameId, newStatus),
        snackbarService: this.snackbarService,
        errorHandlingService: this.errorHandlingService
      }
    );
  }

  private getStatusName(status: GameStatus): string {
    return this.statusColumns.find(col => col.value === status)?.label ?? status.toString();
  }
}