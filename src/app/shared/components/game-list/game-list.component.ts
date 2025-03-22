import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountGame, AccountGameWithAchievements } from '../../models/account-game.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';
import { AccountGameDetailsService } from '../../services/account-game-details.service';
import { TokenStorageService } from '../../services/auth/tokenStorage.service';
import { Router } from '@angular/router';
import { isScrolledToBottom } from '../../../utils/scroll.utils';

@Component({
  selector: 'app-game-list',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './game-list.component.html',
  styleUrl: './game-list.component.scss'
})
export class GameListComponent {
  private _accountGames: AccountGame[] = [];

  @Input()
  set accountGames(value: AccountGame[] | null) {
    this._accountGames = value ?? [];
  }
  get accountGames(): AccountGame[] {
    return this._accountGames;
  }
  
  @Input() loading: boolean = false;
  @Input() errorMessage: string | null = null;
  @Input() enableGameDetails: boolean = false;

  @Output() gameClicked = new EventEmitter<number>();
  @Output() scrolledToBottom = new EventEmitter<void>();

  constructor(
    private accountGameDetailsService: AccountGameDetailsService,
    private tokenStorageService: TokenStorageService,
    private router: Router
  ) { }

  onGameClick(gameId: number): void {
    this.gameClicked.emit(gameId);
  
    if (!this.enableGameDetails) return;
  
    const token = this.tokenStorageService.getTokenFromCookie();
  
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      return;
    }
  
    const game = this.accountGames.find((g) => g.id === gameId);
  
    if (!game) {
      console.error('Jogo não encontrado na lista:', gameId);
      return;
    }
  
    this.accountGameDetailsService
      .getGameDetailsWithPagedAchievements(token, gameId, 1, 6)
      .subscribe({
        next: (pagination) => {
          console.log('Dados recebidos:', pagination);

          if (!pagination) {
            console.error('Erro: O backend não retornou `pagination` como esperado.');
            return;
          }
  
          const gameWithAchievements: AccountGameWithAchievements = {
            ...game, 
            pagination: pagination 
          };
    
          this.accountGameDetailsService.setGameDetails(gameWithAchievements);
          this.router.navigate(['/dashboard/account-game-details', gameId]);
        },
        error: (error) => {
          console.error('Erro ao carregar os detalhes do jogo:', error);
        }
      });
  }

  onScroll(event: Event): void {
    if (isScrolledToBottom(event, 100)) {
      this.scrolledToBottom.emit();
    }
  }

  formatPlaytime(playtime: number): string {
    const hours = Math.floor(playtime / 60);
    const minutes = playtime % 60;
    return `${hours}h ${minutes}m`;
  }
}