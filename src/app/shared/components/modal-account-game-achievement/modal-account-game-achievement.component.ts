import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccountGameWithAchievements } from '../../models/account-game.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-modal-account-game-achievement',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './modal-account-game-achievement.component.html',
  styleUrl: './modal-account-game-achievement.component.scss'
})
export class ModalAccountGameAchievementComponent {
  @Input() gameDetails: AccountGameWithAchievements | null = null;
  @Output() closeModal = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }
}
