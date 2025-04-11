import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountGame, } from '../../../models/account-game.model';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { AccountGameDetailsService } from '../../../services/account-game-details.service';
import { Router } from '@angular/router';
import { isScrolledToBottom } from '../../../../utils/scroll.utils';
import { formatPlaytimeForever } from '../../../../utils/playtime.utils';
import { ErrorHandlingService } from '../../../services/commons/error-handlig.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClock, faTrophy, faCoins } from '@fortawesome/free-solid-svg-icons';
import { Achievements } from '../../../models/game-achievement';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [GenericModule, FontAwesomeModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss'
})
export class GameListComponent {
  private _accountGames: AccountGame[] = [];
  errorMessage: string | null = null;

  faPlaytime = faClock;
  faAchievements = faTrophy;
  faSteamPoints = faCoins;

  @Input()
  set accountGames(value: AccountGame[] | null) {
    this._accountGames = value ?? [];
  }

  @Input() loading: boolean = false;
  @Input() enableGameDetails: boolean = false;
  @Input() externalErrorMessage: string | null = null;

  @Output() gameClicked = new EventEmitter<number>();
  @Output() scrolledToBottom = new EventEmitter<void>();

  get accountGames(): AccountGame[] {
    return this._accountGames;
  }
  constructor(
    private accountGameDetailsService: AccountGameDetailsService,
    private router: Router,
    private errorHandlingService: ErrorHandlingService
  ) { }

  onGameClick(gameId: number): void {
    this.gameClicked.emit(gameId);

    if (!this.enableGameDetails) return;

    const game = this.accountGames.find((g) => g.id === gameId);
    if (!game) {
      console.error('Jogo não encontrado na lista:', gameId);
      return;
    }

    this.accountGameDetailsService.getGameDetailsWithPagedAchievements(
      gameId, { page: 1, pageSize: 6 })
      .subscribe({
        next: (pagination) => {
          if (!pagination) {
            console.error('Erro: O backend não retornou `pagination` como esperado.');
            return;
          }

          const gameWithAchievements: Achievements = {
            ...game,
            pagination
          };

          this.accountGameDetailsService.setGameDetails(gameWithAchievements);
          this.router.navigate(['/dashboard/account-game-details', gameId]);
        },
        error: (error) => {
          this.errorHandlingService.handleWithLog(error, 'Erro ao carregar os detalhes do jogo:');
        }
      });
  }

  onScroll(event: Event): void {
    if (isScrolledToBottom(event, 100)) {
      this.scrolledToBottom.emit();
    }
  }

  formatPlaytime(playtime: number): string {
    return formatPlaytimeForever(playtime);
  }
}