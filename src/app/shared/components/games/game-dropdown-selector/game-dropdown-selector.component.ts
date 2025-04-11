import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountGame } from '../../../models/account-game.model';
import { FilterByNamePipe } from '../../../pipes/filter-by-name';
import { MatIcon } from '@angular/material/icon';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { isNearBottom } from '../../../../utils/infinite-paginator';

@Component({
  selector: 'app-game-dropdown-selector',
  standalone: true,
  imports: [
    FilterByNamePipe,
    MatIcon,
    GenericModule
  ],
  templateUrl: './game-dropdown-selector.component.html',
  styleUrls: ['./game-dropdown-selector.component.scss']
})
export class GameDropdownSelectorComponent {
  @Input() games: AccountGame[] = [];
  @Input() show = false;

  @Output() select = new EventEmitter<AccountGame>();
  @Output() scrolledToBottom = new EventEmitter<void>();

  searchTerm = '';

  onSelectGame(game: AccountGame): void {
    this.select.emit(game);
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    if (isNearBottom(target)) {
      this.scrolledToBottom.emit();
    }
  }
}