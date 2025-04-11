import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CdkDrag, CdkDropList, CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { RankingTier } from '../../../../shared/enums/ranking-tier';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { MaterialModule } from '../../../../../shareds/commons/MaterialModule';
import { ErrorHandlingService } from '../../../../shared/services/commons/error-handlig.service';
import { AccountGameRankingTier } from '../../../../shared/models/account-game.model';
import { AllGameListComponent } from '../../../../shared/components/carousel/all-game-list/all-game-list.component';
import { GameRankingService } from '../../../../shared/services/game-ranking.service';
import { AccountGameQuery } from '../../../../state/account-game/AccountGame.query';
import { AccountGameStore } from '../../../../state/account-game/AccountGame.store';
import { SnackbarService } from '../../../../shared/services/snackbar/snackbar.service';
import { handleUpdate } from '../../../../utils/handle-update';

@Component({
  selector: 'app-ranking-tier',
  standalone: true,
  imports: [
    GenericModule,
    MaterialModule,
    AllGameListComponent,
    CdkDropList,
    CdkDrag,
    DragDropModule
  ],
  templateUrl: './ranking-tier.component.html',
  styleUrls: ['./ranking-tier.component.scss']
})
export class RankingTierComponent implements OnInit, OnDestroy {
  RankingTier = RankingTier;

  unrankedGames$: Observable<AccountGameRankingTier[]>;
  rankedGames$: Observable<AccountGameRankingTier[]>;

  columns = [
    { id: 'tier', label: 'TIER', width: '100px' },
    { id: 'games', label: 'JOGOS', width: 'auto' }
  ];

  displayedColumns: string[] = this.columns.map(col => col.id);
  combinedDropListIds: string[] = [];
  dataSource: { tier: RankingTier; tierName: string; games: AccountGameRankingTier[] }[] = [];

  private destroy$ = new Subject<void>();

  tierDefinitions = [
    { value: RankingTier.SSS, name: 'SSS' },
    { value: RankingTier.SS, name: 'SS' },
    { value: RankingTier.S, name: 'S' },
    { value: RankingTier.A, name: 'A' },
    { value: RankingTier.B, name: 'B' },
    { value: RankingTier.C, name: 'C' },
    { value: RankingTier.D, name: 'D' },
    { value: RankingTier.F, name: 'F' }
  ];

  constructor(
    private errorHandlingService: ErrorHandlingService,
    private gameRankingService: GameRankingService,
    private accountGameStore: AccountGameStore,
    private accountGameQuery: AccountGameQuery,
    private snackbarService: SnackbarService
  ) {
    this.unrankedGames$ = this.accountGameQuery.unrankedTierGames$;
    this.rankedGames$ = this.accountGameQuery.rankedTierGames$;
  }

  get combinedDropLists(): string[] {
    return ['games-shelf', ...this.getDropListIdsByTier()];
  }

  ngOnInit(): void {
    this.loadRankedGames();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadRankedGames(): void {
    this.rankedGames$
      .pipe(takeUntil(this.destroy$))
      .subscribe(rankedGames => {
        this.dataSource = this.tierDefinitions.map(tier => ({
          tier: tier.value,
          tierName: tier.name,
          games: rankedGames
            .filter(game => game.rankingTier === tier.value)
            .sort((a, b) => a.gameName.localeCompare(b.gameName))
        }));

        this.combinedDropListIds = this.getDropListIdsByTier();
      });
  }

  getDropListIdsByTier(): string[] {
    return this.tierDefinitions.map(tier => `dropzone-tier-${tier.value}`);
  }

  onItemDropped(event: CdkDragDrop<{ tier: RankingTier }>): void {
    const game: AccountGameRankingTier = event.item.data;
    const targetTier = event.container.data?.tier;

    if (!targetTier || game.rankingTier === targetTier) {
      console.warn('Drop ignorado: mesmo tier ou destino inválido');
      return;
    }

    this.updateGameRankingTier(game.id, targetTier);
  }

  removeRanking(game: AccountGameRankingTier): void {
    if (!game) return;
    this.updateGameRankingTier(game.id, RankingTier.Unranked, game.rankingTier);
  }

  private updateGameRankingTier(gameId: number, newTier: RankingTier, previousTier?: RankingTier): void {
    const isRemoving = newTier === RankingTier.Unranked;
    const tierName = this.getTierName(isRemoving ? previousTier : newTier);

    const action = isRemoving
      ? `removido do tier "${tierName}"`
      : `movido para o tier "${tierName}"`;

    handleUpdate(
      this.gameRankingService.updateRankingTier({
        accountGameId: gameId,
        rankingTier: newTier
      }),
      {
        onSuccessMessage: `Jogo ${action} com sucesso!`,
        onErrorMessage: 'Erro ao atualizar jogo.',
        onSuccessAction: () => this.accountGameStore.updateGameTier(gameId, newTier),
        snackbarService: this.snackbarService,
        errorHandlingService: this.errorHandlingService
      }
    );
  }

  private getTierName(tier?: RankingTier): string {
    return this.tierDefinitions.find(t => t.value === tier)?.name || '';
  }

  getTierNgClass(tier: RankingTier, columnId: string): { [klass: string]: boolean } {
    const baseClass = `${columnId}-cell`;
    const tierName = this.getTierName(tier).toLowerCase();
    return {
      [baseClass]: true,
      [`tier-${tierName}`]: columnId === 'tier'
    };
  }

  onSlotDrop(event: CdkDragDrop<any>, targetTier: RankingTier): void {
    const game = event.item.data as AccountGameRankingTier;
    const previousTier = event.previousContainer.data?.tier;
    const currentTier = targetTier;

    if (!game) {
      this.snackbarService.showError('Não foi possível identificar o jogo.');
      return;
    }

    if (previousTier === currentTier) {
      this.snackbarService.showError('O jogo já está nesse tier.');
      return;
    }

    this.updateGameRankingTier(game.id, currentTier);
  }
}