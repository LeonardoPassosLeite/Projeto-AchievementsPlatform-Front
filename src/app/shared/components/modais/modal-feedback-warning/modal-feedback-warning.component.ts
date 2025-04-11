import { Component, Input } from '@angular/core';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-modal-feedback-warning',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './modal-feedback-warning.component.html',
  styleUrl: './modal-feedback-warning.component.scss'
})
export class ModalFeedbackWarningComponent {
  @Input() visible = false;
  @Input() message = '';
  @Input() onClose: () => void = () => { };

  close() {
    this.onClose();
  }
}