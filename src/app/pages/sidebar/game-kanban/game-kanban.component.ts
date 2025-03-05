import { Component, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountGameQuery } from '../../../state/account-game/AccountGame.query';
import { GameStatusManagerService } from '../../../shared/services/game-status-manager.service';
import { AccountGame } from '../../../shared/models/account-game.model';
import { GameStatus } from '../../../shared/enums/GameStatus';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-game-kanban',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './game-kanban.component.html',
  styleUrl: './game-kanban.component.scss'
})
export class GameKanbanComponent {
  @ViewChild('shelf', { static: false }) shelf!: ElementRef;

  GameStatus = GameStatus;

  constructor(
    private accountGameQuery: AccountGameQuery,
    private gameStatusManagerService: GameStatusManagerService
  ) { }

  getGamesByStatus(status: GameStatus): Observable<AccountGame[]> {
    return this.accountGameQuery.getGamesByStatus$(status);
  }

  dragStart(event: DragEvent, jogo: AccountGame) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('application/json', JSON.stringify({ id: jogo.id, status: jogo.gameStatusManager?.gameStatus }));
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  drop(event: DragEvent, novoStatus: GameStatus) {
    event.preventDefault();

    const data = event.dataTransfer?.getData('application/json');
    if (data) {
      let jogo = JSON.parse(data);

      if (!jogo.id) {
        console.error('Erro: ID do jogo não encontrado no evento Drag & Drop!');
        return;
      }

      this.gameStatusManagerService.updateGameStatus(jogo.id, novoStatus).subscribe(
        () => { },
        (error) => console.error(`Erro ao atualizar status do jogo ID ${jogo.id}:`, error)
      );
    } else {
      console.error('Erro: Nenhum dado foi recuperado do evento Drag & Drop!');
    }
  }

  scroll(direction: 'left' | 'right') {
    if (this.shelf?.nativeElement) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      this.shelf.nativeElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
      console.warn('⚠️ shelf não está definido ainda!');
    }
  }
}