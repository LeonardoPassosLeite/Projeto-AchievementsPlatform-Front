import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, finalize, Subscription } from 'rxjs';
import { InsightAchievementService } from '../../../shared/services/insights/insight-achievement.service';
import { InsightSpService } from '../../../shared/services/insights/insight-sp.service';
import { GameAchievement } from '../../../shared/models/game-achievement';
import { SelectComponent } from '../../../shared/components/forms/select/select.component';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { AchievementsInsightsComponent } from './achievements-insights/achievements-insights.component';
import { SteamPointsInsightsComponent } from './steam-points-insights/steam-points-insights.component';
import { InsightPlatinumService } from '../../../shared/services/insights/insight-platinum.service';
import { AccountGameQuery } from '../../../state/account-game/AccountGame.query';
import { PlatinumInsightsComponent } from './platinum-insights/platinum-insights.component';
import { InsightService } from '../../../shared/services/insights/insight.service';
import { AccountGame } from '../../../shared/models/account-game.model';
import { formatPlaytimeForever } from '../../../utils/playtime.utils';
import { Router } from '@angular/router';
import { GameStats } from '../../../shared/models/game-stats.model';
import { isGameStats } from '../../../utils/type-guard';

@Component({
    selector: 'app-user-insights',
    standalone: true,
    imports: [
        GenericModule,
        AchievementsInsightsComponent,
        SteamPointsInsightsComponent,
        PlatinumInsightsComponent,
        SelectComponent,
    ],
    templateUrl: './user-insights.component.html',
    styleUrls: ['./user-insights.component.scss']
})
export class UserInsightsComponent implements OnInit, OnDestroy {
    achievementsByMonth: Record<string, number> = {};
    steamPointsByMonth: Record<string, number> = {};
    steamPointsByYear: Record<string, number> = {};
    achievementsByYear: Record<string, number> = {};
    platinasByMonth: Record<string, number> = {};
    platinasByYear: Record<string, number> = {};
    availableYears: string[] = ['Todos os Anos'];
    selectedYear: string = 'Todos os Anos';
    filteredAchievementsCount: number = 0;
    allAchievements: GameAchievement[] = [];
    totalAchievements: number = 0;
    totalPlatinas: number = 0;
    totalSteamPoints: number = 0;
    completionPercentage: number = 0;
    filterOptions: string[] = ['Total', 'Mês', 'Ano'];
    selectedFilterOption: string = 'Total';

    errorMessage: string | null = null;
    loading = false;

    private token: string | null = null;
    private dataSubscription: Subscription | null = null;

    dataTypes: string[] = ['conquistas', 'platinas', 'steam points'];
    selectedDataType: 'conquistas' | 'steam points' | 'platinas' = 'conquistas';
    topPlayedGames: AccountGame[] = [];

    constructor(
        private insightAchievementService: InsightAchievementService,
        private insightSpService: InsightSpService,
        private insightPlatinumService: InsightPlatinumService,
        private insightsService: InsightService,
        private accountGameQuery: AccountGameQuery,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadAllData();
        this.loadTopPlayedGames();
    }

    ngOnDestroy(): void {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
    }

    loadAllData(): void {
        this.loading = true;

        combineLatest([
            this.insightAchievementService.getAllAchievements(),
            this.accountGameQuery.accountGames$
        ])
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: ([allData, accountGames]) => {
                    this.allAchievements = allData;
                    this.updateDataInsights(allData, accountGames);
                },
                error: () => {
                    this.errorMessage = 'Erro ao carregar todas as conquistas.';
                }
            });
    }

    loadTopPlayedGames(): void {
        console.log('Carregando os 3 jogos mais jogados...');

        this.accountGameQuery.getTopPlayedGames$().subscribe({
            next: (games) => {
                console.log('Top 3 jogos carregados com sucesso:', games); // Verifica os jogos carregados
                this.topPlayedGames = games;
            },
            error: (err) => {
                console.error('Erro ao carregar os jogos mais jogados:', err); // Verifica erros
            }
        });
    }

    private updateDataInsights(allData: GameAchievement[], accountGames: AccountGame[]): void {
        const gameStatsList: GameStats[] = accountGames
            .map(g => g.gameStats)
            .filter(isGameStats);

        const summary = this.insightsService.calculateSummaryStatistics(allData, gameStatsList);
        this.totalAchievements = summary.totalAchievements;
        this.totalPlatinas = summary.totalPlatinas;
        this.totalSteamPoints = summary.totalSteamPoints;

        this.platinasByMonth = this.insightPlatinumService.countPlatinasByMonth(allData, gameStatsList, this.selectedYear);
        this.platinasByYear = this.insightPlatinumService.countPlatinasByYear(allData, gameStatsList);

        this.achievementsByMonth = this.insightAchievementService.countAchievementsByMonth(allData);
        this.achievementsByYear = this.insightAchievementService.countAchievementsByYear(allData);

        const years = Object.keys(this.achievementsByYear);
        this.availableYears = ['Todos os Anos', ...years];

        this.steamPointsByYear = this.insightSpService.sumSteamPointsByYear(allData);
    }

    onYearChange(year: string): void {
        this.selectedYear = year;
        this.loadData(this.selectedDataType, year);
    }

    onSelectionChange(selectedOption: string): void {
        if (selectedOption === 'conquistas' || selectedOption === 'steam points' || selectedOption === 'platinas') {
            this.selectedDataType = selectedOption;
            this.loadData(this.selectedDataType, this.selectedYear);
        } else {
            console.error('Tipo de dado inválido:', selectedOption);
            this.selectedDataType = 'conquistas';
        }
    }

    private loadData(dataType: 'steam points' | 'conquistas' | 'platinas', year: string): void {
        this.insightAchievementService.getAllAchievements().subscribe({
          next: (achievements) => {
            if (dataType === 'steam points') {
              if (year === 'Todos os Anos') {
                this.steamPointsByYear = this.insightSpService.sumSteamPointsByYear(achievements);
              } else {
                this.steamPointsByMonth = this.insightSpService.sumSteamPointsByMonth(achievements, year);
              }
      
            } else if (dataType === 'conquistas') {
              if (year === 'Todos os Anos') {
                this.achievementsByMonth = this.insightAchievementService.countAchievementsByMonth(achievements);
                this.filteredAchievementsCount = achievements.length;
              } else {
                const filteredAchievements = this.insightAchievementService.filterAchievementsByYearLocal(achievements, year);
                this.achievementsByMonth = this.insightAchievementService.countAchievementsByMonth(filteredAchievements);
                this.filteredAchievementsCount = filteredAchievements.length;
              }
      
            } else if (dataType === 'platinas') {
              const gameStatsList = this.accountGameQuery.getGameStatsList().filter(isGameStats);
      
              if (year === 'Todos os Anos') {
                this.platinasByYear = this.insightPlatinumService.countPlatinasByYear(achievements, gameStatsList);
              } else {
                this.platinasByMonth = this.insightPlatinumService.countPlatinasByMonth(achievements, gameStatsList, year);
              }
            }
          },
          error: () => {
            this.errorMessage = `Erro ao carregar ${dataType}.`;
          }
        });
      }

    getMonths(): string[] {
        return [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
    }

    updateChartData(data: Record<string, number>, isYearly: boolean): { labels: string[], data: number[] } {
        if (isYearly) {
            return {
                labels: Object.keys(data),
                data: Object.values(data)
            };
        } else {
            const months = this.getMonths();
            return {
                labels: months,
                data: months.map(month => data[month] || 0)
            };
        }
    }

    formatPlaytime(minutes: number): string {
        return formatPlaytimeForever(minutes);
    }

    goToAllGames() {
        this.router.navigate(['/dashboard/all-games-playtimeForever']);
    }

    goToAllGamesPlaytimeForever() {
        switch (this.selectedDataType) {
            case 'conquistas':
                this.router.navigate(['/dashboard/conquistas/games-conquistas']);
                break;
            case 'platinas':
                this.router.navigate(['/dashboard/conquistas/games-platinados']);
                break;
            case 'steam points':
                this.router.navigate(['/dashboard/all-games-playtimeForever']);
                break;
            default:
                this.router.navigate(['/dashboard/all-games-playtimeForever']);
                break;
        }
    }
}