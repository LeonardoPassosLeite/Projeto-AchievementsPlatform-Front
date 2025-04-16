// ✅ COMPONENTE PAI (antigo avô)
import { Component, inject } from '@angular/core';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { AchievementInsightsQuery } from '../../../state/game-achivements/GameAchievements.query';
import { AchievementsInsightsComponent } from './user-insights-details/achievements-insights/achievements-insights.component';

@Component({
    selector: 'app-user-insights',
    standalone: true,
    imports: [GenericModule, AchievementsInsightsComponent],
    templateUrl: './user-insights.component.html',
    styleUrls: ['./user-insights.component.scss']
})
export class UserInsightsComponent {
    protected readonly achievementQuery = inject(AchievementInsightsQuery);
    protected readonly context$ = this.achievementQuery.context$;
}