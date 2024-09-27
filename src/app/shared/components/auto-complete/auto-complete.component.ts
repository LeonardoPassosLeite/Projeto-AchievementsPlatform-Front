import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../../shareds/commons/MaterialModule';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-auto-complete',
  standalone: true,
  imports: [
    MaterialModule,
    GenericModule
  ],

  templateUrl: './auto-complete.component.html',
  styleUrl: './auto-complete.component.scss'
})
export class AutoCompleteComponent {
  @Input() data: string = '';
  @Input() dataSuggestions: any[] = [];
  @Input() placeholder: string = 'Pesquisar...';

  @Output() searchQuery = new EventEmitter<string>();
  @Output() dataSelected = new EventEmitter<any>();

  onSearch(event: any): void {
    const query = event.target.value || '';
    this.searchQuery.emit(query);
  }

  onSelectData(suggestion: any): void {
    this.dataSelected.emit(suggestion);
  }
}