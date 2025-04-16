import { Component, OnInit } from '@angular/core';
import { UserRanking } from '../../../shared/models/user-ranking.model';
import { ErrorHandlingService } from '../../../shared/services/commons/error-handlig.service';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { RankingType } from '../../../shared/enums/ranking-type.enum';
import { UserRankingService } from '../../../shared/services/user-raking.service';
import { RankingListComponent } from '../../../shared/components/users/ranking-list/ranking-list.component';

@Component({
  selector: 'app-ranking-global',
  standalone: true,
  imports:
    [
      GenericModule,
      RankingListComponent
    ],
  templateUrl: './ranking-global.component.html',
  styleUrl: './ranking-global.component.scss'
})
export class RankingGlobalComponent implements OnInit {
  allRankings: UserRanking[] = [];
  filteredRankings: UserRanking[] = [];

  rankingType: RankingType = RankingType.Level;
  rankingEnum = RankingType;

  loading = true;
  errorMessage: string | null = null;

  constructor(
    private userRankingService: UserRankingService,
    private errorHandlingService: ErrorHandlingService
  ) { }

  ngOnInit(): void {
    this.loadRanking();
  }

  loadRanking(): void {
    this.userRankingService.getUserRankingByType(this.rankingType).subscribe({
      next: (result) => {
        this.allRankings = result;
        this.filterRanking(); 
      },
      error: (error) => {
        this.errorMessage = this.errorHandlingService.handleHttpError(error);
      },
      complete: () => this.loading = false
    });
  }

  changeRankingType(type: RankingType): void {
    this.rankingType = type;
    this.filterRanking();
  }

  filterRanking(): void {
    this.filteredRankings = [...this.allRankings].sort((a, b) => {
      switch (this.rankingType) {
        case RankingType.Level:
          return b.steamUser.userStats.level - a.steamUser.userStats.level;
        case RankingType.SteamPoints:
          return b.steamUser.userStats.totalSteamPoints - a.steamUser.userStats.totalSteamPoints;
        case RankingType.Platinum:
          return b.steamUser.userStats.allPlatinum - a.steamUser.userStats.allPlatinum;
        default:
          return 0;
      }
    });
  }
}