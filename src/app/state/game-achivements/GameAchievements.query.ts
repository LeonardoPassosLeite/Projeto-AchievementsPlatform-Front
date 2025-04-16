import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { AchievementInsightsStore } from './GameAchivements.store';
import { AchievementInsightsState } from './GameAchievements.state';

@Injectable({ providedIn: 'root' })
export class AchievementInsightsQuery extends Query<AchievementInsightsState> {
    totalUserAchievements$: Observable<number>;
    totalAchievements$: Observable<number>;
    achievementsByYear$: Observable<Record<string, number>>;
    achievementsByMonth$: Observable<Record<string, number>>;
    loading$: Observable<boolean>;
    error$: Observable<string | null>;

    constructor(protected override store: AchievementInsightsStore) {
        super(store);

        this.totalUserAchievements$ = this.select('totalUserAchievements');
        this.totalAchievements$ = this.select('totalAchievements');
        this.achievementsByYear$ = this.select('achievementsByYear');
        this.achievementsByMonth$ = this.select('achievementsByMonth');
        this.loading$ = this.select('loading');
        this.error$ = this.select('error');
    }

    get totalPercentage(): number {
        const state = this.getValue();
        const { totalUserAchievements, totalAchievements } = state;
        return totalAchievements > 0 ? (totalUserAchievements / totalAchievements) * 100 : 0;
    }

    get context$(): Observable<{
        totalAchievementsCount: number;
        achievementsDone: number;
        totalGamesWithAchievements: number;
        platinum: number;
        loading: boolean;
        errorMessage: string | null;
    }> {
        return combineLatest([
            this.totalAchievements$,
            this.totalUserAchievements$,
            this.select('totalGamesWithAchievements'),
            this.select('platinumGames'),
            this.loading$,
            this.error$
        ]).pipe(
            map(([totalAchievementsCount, achievementsDone, totalGamesWithAchievements, platinum, loading, errorMessage]) => {
                const ctx = {
                    totalAchievementsCount,
                    achievementsDone,
                    totalGamesWithAchievements,
                    platinum,
                    loading,
                    errorMessage
                };
                console.log('[Query] context$ →', ctx);
                return ctx;
            })
        );
    }
}  