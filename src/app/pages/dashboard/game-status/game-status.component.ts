import { Component, TemplateRef, ViewChild, OnInit } from '@angular/core';
import { GameStatus } from '../../../shared/enums/game-status';
import { AccountGameStatus } from '../../../shared/models/account-game.model';
import { AccountGameQuery } from '../../../state/account-game/AccountGame.query';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { CarouselComponent } from '../../../shared/components/carousel/carousel.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-status',
  standalone: true,
  imports: [GenericModule, CarouselComponent],
  templateUrl: './game-status.component.html',
  styleUrl: './game-status.component.scss',
})
export class GameStatusComponent implements OnInit {
  @ViewChild('gameItemTemplate', { static: true }) gameItemTemplate!: TemplateRef<any>;

  games$!: Observable<AccountGameStatus[]>;

  readonly statuses: GameStatus[] = [
    GameStatus.Platinum,
    GameStatus.InProgress,
    GameStatus.Completed,
    GameStatus.Favorite,
    GameStatus.WhishList,
    GameStatus.Abandoned,
  ];

  constructor(private accountGameQuery: AccountGameQuery) { }

  ngOnInit(): void {
    this.games$ = this.accountGameQuery.assignedStatus$;
  }

  getStatusName(status: GameStatus): string {
    const map: Record<GameStatus, string> = {
      [GameStatus.NotStarted]: 'Não Iniciado',
      [GameStatus.Platinum]: 'Platinados',
      [GameStatus.InProgress]: 'Primeira Impressão',
      [GameStatus.Completed]: 'Zerados',
      [GameStatus.Favorite]: 'Favoritos',
      [GameStatus.WhishList]: 'Para jogar',
      [GameStatus.Abandoned]: 'Dropados',
    };
    return map[status] ?? '';
  }

  getStatusFromItem = (item: AccountGameStatus) => item.gameStatusManager.gameStatus;
}