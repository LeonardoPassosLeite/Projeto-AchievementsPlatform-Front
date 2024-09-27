import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MaterialModule } from '../../../../shareds/commons/MaterialModule';

@Component({
  selector: 'app-card-menssage',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './card-menssage.component.html',
  styleUrl: './card-menssage.component.scss'
})
export class CardMenssageComponent {

  @Input() title: string = '';
  @Input() description: string = '';
  @Input() imageUrl: string = '';
  @Input() buttonText: string = 'Clique Aqui';

  @Output() buttonClick = new EventEmitter<void>();

  onButtonClick() {
    this.buttonClick.emit();
  }
}