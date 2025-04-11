// import { Component } from '@angular/core';
// import { Observable } from 'rxjs';
// import { AccountGamePlaytimePreview } from '../../../../shared/models/account-game.model';
// import { GenericModule } from '../../../../../shareds/commons/GenericModule';
// import { AccountGameQuery } from '../../../../state/account-game/AccountGame.query';

// @Component({
//   selector: 'app-all-games-playtime',
//   standalone: true,
//   imports: [GenericModule], // Remova o GameListComponent
//   templateUrl: './all-games-playtime.component.html',
//   styleUrl: './all-games-playtime.component.scss'
// })
// export class AllGamesPlaytimeComponent {
//   playtimeGames$: Observable<AccountGamePlaytimePreview[]>;

//   constructor(private accountGameQuery: AccountGameQuery) {
//     this.playtimeGames$ = this.accountGameQuery.getAllGamesPlaytimePreview();
//   }
// }