import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent {
  @Input() options: any[] = [];
  @Input() selectedValue: any;
  @Input() placeholder: string = 'Selecione uma opção';

  @Output() valueSelected = new EventEmitter<any>();

  isOpen = false;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectOption(value: any): void {
    this.selectedValue = value;
    this.valueSelected.emit(value);
    this.isOpen = false;
  }
}