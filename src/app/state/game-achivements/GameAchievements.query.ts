import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { GameAchievementsState } from './GameAchievements.state';
import { GameAchievement } from '../../shared/models/game-achievement';
import { GameAchievementsStore } from './GameAchivements.store';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GameAchievementsQuery extends Query<GameAchievementsState> {
    gameAchievements$: Observable<GameAchievement[]>;
    isLoading$: Observable<boolean> = this.select('isLoading');
    hasMore$: Observable<boolean> = this.select('hasMore');

    constructor(protected override store: GameAchievementsStore) {
        super(store);

        this.gameAchievements$ = this.select('gameAchievements').pipe(map(achievements => achievements ?? []) // Garante que seja um array vazio, caso o valor seja nulo ou indefinido
        );
    }
}