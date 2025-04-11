import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AccountGame } from '../../../models/account-game.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [GenericModule, ReactiveFormsModule],
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss']
})
export class AutoCompleteComponent implements OnInit {
  @Input() placeholder: string = 'Buscar jogo...';
  @Input() games: AccountGame[] = [];
  @Input() availableOnly: boolean = true;
  @Input() selectedGame: AccountGame | null = null;

  @Output() gameSelected = new EventEmitter<AccountGame>();
  @Output() inputFocus = new EventEmitter<void>();
  @Output() inputBlur = new EventEmitter<void>();

  gameControl = new FormControl();
  filteredGames: AccountGame[] = [];

  ngOnInit() {
    if (this.selectedGame) {
      this.gameControl.setValue(this.selectedGame.gameName);
    }

    this.gameControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.filterGames(term);
    });
  }

  private filterGames(term: string) {
    if (!term) {
      this.filteredGames = [];
      return;
    }

    const searchTerm = term.trim().toLowerCase();
    this.filteredGames = this.games.filter(game => {
      const nameMatch = game.gameName.toLowerCase().includes(searchTerm);
      const available = this.availableOnly ? game.rankingPosition === 0 : true;
      return nameMatch && available;
    });
  }

  selectGame(game: AccountGame): void {
    this.gameSelected.emit(game);
    this.gameControl.reset();
    this.filteredGames = [];
  }

  onFocus() {
    this.inputFocus.emit();
  }

  onBlur() {
    setTimeout(() => {
      this.inputBlur.emit();
    }, 200);
  }
}