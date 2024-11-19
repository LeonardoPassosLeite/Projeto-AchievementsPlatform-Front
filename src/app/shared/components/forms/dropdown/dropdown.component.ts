import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { MaterialModule } from '../../../../../shareds/commons/MaterialModule';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    GenericModule,
    MaterialModule
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent {
  @Input() options: any[] = [];
  @Input() selectedValue: any;
  @Input() placeholder: string = 'Selecione uma opção';

  @Output() valueSelected = new EventEmitter<any>();

  onValueChange(value: any): void {
    this.valueSelected.emit(value);
  }
}