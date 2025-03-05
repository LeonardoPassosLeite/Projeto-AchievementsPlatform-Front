import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountGame, AccountGamePreview } from '../../../shared/models/account-game.model';
import { AccountGameQuery } from '../../../state/account-game/AccountGame.query';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { GameStatus } from '../../../shared/enums/GameStatus';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-games',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './all-games.component.html',
  styleUrl: './all-games.component.scss'
})
export class AllGamesComponent implements OnInit {
  allGames$!: Observable<AccountGamePreview[]>;
  GameStatus = GameStatus;

  constructor(
    private accountGameQuery: AccountGameQuery,
    private router: Router) { }

  ngOnInit(): void {
    this.allGames$ = this.accountGameQuery.getAllGamesPreview$();

    this.allGames$.subscribe(games => {
      console.log("Dados dos Jogos:", games);
    });
  }

  formatPlaytime(playtime: number): string {
    const hours = Math.floor(playtime / 60);
    const minutes = playtime % 60;
    return `${hours}h ${minutes}m`;
  }

  getGamesByStatus(status: GameStatus): Observable<AccountGamePreview[]> {
    return this.accountGameQuery.getGamesByStatus$(status);
  }

  getStatusLabel(status: GameStatus): string {
    return GameStatus[status] || 'Desconhecido';
  }

  goToComments(gameId: number): void {
    this.router.navigate([`/dashboard/comments`, gameId]);
  }
}