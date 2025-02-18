import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { DisplayType } from '../../../enums/GameStatus';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {
  @Input() options: { value: DisplayType; label: string }[] = [];
  @Input() selectedOption: DisplayType = DisplayType.CurrentPlayers;
  @Output() optionChange = new EventEmitter<DisplayType>();

  onOptionChange(value: DisplayType): void {
    this.optionChange.emit(value);
  }
}