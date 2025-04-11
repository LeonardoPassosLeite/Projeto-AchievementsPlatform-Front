import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountGameQuery } from '../../../state/account-game/AccountGame.query';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { Router } from '@angular/router';
import { GameStatus } from '../../../shared/enums/game-status';
import { AccountAllGames } from '../../../shared/models/account-game.model';

@Component({
    selector: 'app-all-games',
    standalone: true,
    imports: [GenericModule],
    templateUrl: './all-games.component.html',
    styleUrl: './all-games.component.scss'
})
export class AllGamesComponent implements OnInit {
    allGames$!: Observable<AccountAllGames[]>;
    GameStatus = GameStatus;

    constructor(
        private accountGameQuery: AccountGameQuery,
        private router: Router) { }

    ngOnInit(): void {
        this.allGames$ = this.accountGameQuery.allGamesWithRaiting$;
    }

    formatPlaytime(playtime: number): string {
        const hours = Math.floor(playtime / 60);
        const minutes = playtime % 60;
        return `${hours}h ${minutes}m`;
    }

    getStatusLabel(status: GameStatus): string {
        return GameStatus[status] || 'Desconhecido';
    }

    goToComments(gameId: number): void {
        this.router.navigate(['dashboard/all-comments', gameId]);
    }
}