import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { AccountGame } from '../../../../../shared/models/account-game.model';
import { GenericModule } from '../../../../../../shareds/commons/GenericModule';
import { AutoCompleteComponent } from '../../../../../shared/components/forms/auto-complete/auto-complete.component';
import { AccountGameQuery } from '../../../../../state/account-game/AccountGame.query';
import { GameRankingService } from '../../../../../shared/services/game-ranking.service';
import { SnackbarService } from '../../../../../shared/services/snackbar/snackbar.service';
import { handleUpdate } from '../../../../../utils/handle-update';
import { AccountGameStore } from '../../../../../state/account-game/AccountGame.store';

@Component({
  selector: 'app-ranking-position-table',
  standalone: true,
  imports:
    [
      AutoCompleteComponent,
      GenericModule,
      MatTableModule,
      MatIconModule
    ],
  templateUrl: './ranking-position-table.component.html',
  styleUrls: ['./ranking-position-table.component.scss']
})
export class RankingPositionTableComponent {
  allGames: AccountGame[] = [];
  loadingPosition: number | null = null;
  topRanked$: Observable<(AccountGame | null)[]>;
  displayedColumns: string[] = ['position', 'icon', 'gameName'];
  editingPositions = new Set<number>();

  constructor(
    private accountGameStore: AccountGameStore,
    private accountGameQuery: AccountGameQuery,
    private rankingService: GameRankingService,
    private snackbarService: SnackbarService
  ) {
    this.topRanked$ = this.accountGameQuery.getRankingPosition$(10);
  }

  ngOnInit(): void {
    this.accountGameQuery.accountGames$.subscribe(games => {
      this.allGames = games;
    });
  }

  private loadRanking(): void { }

  editPosition(position: number): void {
    this.editingPositions.add(position);
  }

  onGameSelected(position: number, selectedGame: AccountGame): void {
    handleUpdate(
      this.rankingService.updateRanking({
        accountGameId: selectedGame.id,
        rankingPosition: position + 1
      }),
      {
        onSuccessMessage: 'Ranking atualizado com sucesso!',
        onErrorMessage: 'Erro ao atualizar ranking.',
        setLoading: (loading) => this.loadingPosition = loading ? position : null,
        onSuccessAction: () => {
          this.accountGameStore.updateGameRankingPosition(selectedGame.id, position + 1);
          this.loadRanking();
          this.editingPositions.delete(position);
        },
        snackbarService: this.snackbarService
      }
    );
  }
}