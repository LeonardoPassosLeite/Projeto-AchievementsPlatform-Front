import { Component, OnInit } from '@angular/core';
import { IgdbService } from '../../shared/services/igdb.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Game } from '../../shared/models/game.model';
@Component({
  selector: 'app-jogos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jogos.component.html',
  styleUrl: './jogos.component.scss'
})
export class JogosComponent implements OnInit {
  searchQuery: string = '';
  allGames: Game[] = [];
  displayedGames: Game[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  readonly itemsPerPage: number = 16;
  isLoading: boolean = false;
  hasMoreGames: boolean = true;
  loadedGamesCount: number = 0;
  readonly maxGamesPerRequest: number = 500;
  readonly maxTotalGames: number = 1000;
  isSearching: boolean = false;
  constructor(private igdbService: IgdbService) { }
  ngOnInit(): void {
    this.loadGames();
  }
  private loadGames(): void {
    if (this.allGames.length >= this.maxTotalGames || !this.hasMoreGames || this.isLoading) {
      return;
    }
    this.isLoading = true;
    this.igdbService.getGames(this.maxGamesPerRequest, this.loadedGamesCount).subscribe({
      next: (data: Game[]) => {
        this.allGames.push(...data);
        this.updatePagination();
        this.loadedGamesCount += data.length;
        this.hasMoreGames = data.length === this.maxGamesPerRequest;
        this.isLoading = false;
      },
      error: () => this.handleError()
    });
  }
  private searchGames(page: number = 1): void {
    this.isSearching = true;
    this.isLoading = true;
    const offset = (page - 1) * this.itemsPerPage;
    this.igdbService.searchGames(this.searchQuery, this.itemsPerPage, offset).subscribe({
      next: (data: Game[]) => {
        this.displayedGames = this.filterGamesWithCover(data);
        this.totalPages = Math.ceil(data.length / this.itemsPerPage);
        this.currentPage = page;
        this.isLoading = false;
      },
      error: () => this.handleError()
    });
  }
  private changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = this.currentPage * this.itemsPerPage;
      this.displayedGames = this.filterGamesWithCover(this.allGames.slice(startIndex, endIndex));
    }
  }
  private filterGamesWithCover(games: Game[]): Game[] {
    return games.filter(game => game.cover && game.cover.url);
  }
  private handleError(): void {
    console.error('Erro ao carregar dados.');
    this.isLoading = false;
  }
  private updatePagination(): void {
    this.totalPages = Math.ceil(this.allGames.length / this.itemsPerPage);
    this.changePage(this.currentPage);
  }
  filterGames(): void {
    if (this.searchQuery.trim()) {
      this.searchGames(1);
    } else {
      this.isSearching = false;
      this.changePage(this.currentPage);
    }
  }
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }
  prevPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }
}