import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { RankingPositionTableComponent } from './ranking-position-table/ranking-position-table.component';

@Component({
  selector: 'app-account-game-favorite',
  standalone: true,
  imports: [
    GenericModule,
    RouterModule,
  ],
  templateUrl: './account-game-favorite.component.html',
  styleUrls: ['./account-game-favorite.component.scss']
})
export class AccountGameFavoriteComponent implements OnInit {
  @ViewChild(RankingPositionTableComponent) rankingPositionTable?: RankingPositionTableComponent;

  activeTab: 'ranking-position' | 'playtime' = 'ranking-position';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activeTab = this.router.url.includes('playtime') ? 'playtime' : 'ranking-position';
  }

  navigateToTab(tab: 'ranking-position' | 'playtime'): void {
    this.activeTab = tab;
    this.router.navigate([tab], { relativeTo: this.route });
  }

  isActiveTab(tabName: string): boolean {
    return this.router.url.includes(tabName);
  }
}
