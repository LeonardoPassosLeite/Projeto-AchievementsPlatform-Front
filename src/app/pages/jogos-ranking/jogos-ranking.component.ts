import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { IgdbService } from '../../shared/services/igdb.service';
import { CardMenssageComponent } from "../../shared/components/card-menssage/card-menssage.component";
import { MaterialModule } from '../../../shareds/commons/MaterialModule';
import { AutoCompleteComponent } from '../../shared/components/auto-complete/auto-complete.component';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { DropdownComponent } from '../../shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-jogos-ranking',
  standalone: true,
  imports: [
    GenericModule,
    MaterialModule,
    CardMenssageComponent,
    AutoCompleteComponent,
    DropdownComponent
  ],
  templateUrl: './jogos-ranking.component.html',
  styleUrls: ['./jogos-ranking.component.scss']
})

export class JogosRankingComponent {
  showRankingTable = true;
  searchQuery: string = '';
  searchResults: any[] = [];
  displayedColumns: string[] = ['position', 'game', 'platform', 'rating'];
  platforms: string[] = ['PlayStation', 'Xbox', 'PC', 'Switch'];
  availableRatings: number[] = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

  rankingData = Array.from({ length: 15 }, (_, i) => ({
    position: i + 1,
    game: '',
    platform: '',
    platinum: false,
    hoursPlayed: 0,
    rating: null as number | null,
    completionDate: '',
    comments: ''
  }));

  pageSize = 15;
  pageIndex = 0;
  paginatedData = this.rankingData.slice(0, this.pageSize);

  gameSuggestions: any[] = [];

  constructor(private igdbService: IgdbService) { }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.paginatedData = this.rankingData.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  showTable(): void {
    this.showRankingTable = true;
  }

  addMorePositions(): void {
    const currentLength = this.rankingData.length;
    const newData = Array.from({ length: 18 }, (_, i) => ({
      position: currentLength + i + 1,
      game: '',
      platform: '',
      platinum: false,
      hoursPlayed: 0,
      rating: 0,
      completionDate: '',
      comments: ''
    }));

    this.rankingData = [...this.rankingData, ...newData];
    this.pageIndex = Math.floor(currentLength / this.pageSize);
    this.paginatedData = this.rankingData.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }

  onRatingSelected(rating: number, element: any): void {
    element.rating = rating;
  }

  onPlatformSelected(platform: string, element: any): void {
    element.platform = platform;
  }

  onSearchGame(query: string): void {
    if (!query) {
      this.igdbService.getGames(10).subscribe(games => {
        this.gameSuggestions = games;
      });
    } else if (query.length > 2) {
      this.igdbService.searchGames(query, 10).subscribe(games => {
        this.gameSuggestions = games;
      });
    }
  }

  onGameSelected(suggestion: any, element: any): void {
    element.game = suggestion.name;
    element.coverUrl = suggestion.cover?.url ? suggestion.cover.url : 'assets/default-cover.jpg';
    element.platform = this.getFormattedPlatforms(suggestion);
  }

  getFormattedPlatforms(game: any): string {
    if (game.platforms && game.platforms.length > 0) {
      return game.platforms.map((p: any) => p.name).join(', ');
    }
    return 'N/A';
  }

  closeSuggestions(): void {
    setTimeout(() => {
      this.gameSuggestions = [];
    }, 200);
  }
}