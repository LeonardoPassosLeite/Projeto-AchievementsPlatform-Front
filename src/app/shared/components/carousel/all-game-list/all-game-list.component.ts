import { Component, ElementRef, Input, Output, EventEmitter, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountGameBase } from '../../../models/account-game.model';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../forms/input/input.component';

@Component({
  selector: 'app-all-game-list',
  standalone: true,
  imports: [
    GenericModule,
    DragDropModule,
    MatIconModule,
    InputComponent,
    FormsModule
  ],
  templateUrl: './all-game-list.component.html',
  styleUrls: ['./all-game-list.component.scss']
})
export class AllGameListComponent<T extends AccountGameBase = AccountGameBase> implements OnInit {
  @ViewChild('shelf') shelf!: ElementRef;

  @Input() title: string = '';
  @Input() games$!: Observable<T[]>;
  @Input() connectedDropLists: string[] = [];
  @Input() dragDataType: 'tier' | 'status' = 'tier';
  
  @Output() gameSelected = new EventEmitter<T>();

  private _searchTerm: string = '';

  get searchTerm(): string {
    return this._searchTerm;
  }

  set searchTerm(value: string) {
    this._searchTerm = value;
    this.filterGames();
  }

  allGames: T[] = [];
  filteredGames: T[] = [];

  ngOnInit() {
    this.games$.subscribe(games => {
      console.log('[AllGameListComponent] Dados recebidos:', games); // <-- log aqui

      this.allGames = games;
      this.filterGames();
    });
  }

  filterGames() {
    const term = this._searchTerm.toLowerCase();
    this.filteredGames = this.allGames.filter(game =>
      game.gameName.toLowerCase().includes(term)
    );
  }

  scrollShelf(direction: 'left' | 'right') {
    if (this.shelf?.nativeElement) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      this.shelf.nativeElement.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  drop(event: CdkDragDrop<T[]>) {
    if (event.previousContainer === event.container && event.container.data) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
