import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { NavigationService } from '../../../services/commons/navigation.service';
import { GameStatusMenu } from '../../../enums/navigation.enum';
import { getSelectedGameStatusMenu } from '../../../../utils/navigation.utils';

@Component({
  selector: 'app-game-status-nav',
  standalone: true,
  imports: [GenericModule, RouterModule],
  templateUrl: './game-status-nav.component.html',
  styleUrls: ['./game-status-nav.component.scss']
})
export class GameStatusNavComponent {
  GameStatusMenu = GameStatusMenu;
  selectedMenu: GameStatusMenu = GameStatusMenu.Achievements;

  constructor(public navigation: NavigationService) { }

  navigateTo(menu: GameStatusMenu): void {
    this.selectedMenu = menu;
    this.navigation.navigateGameStatus(menu);
  }
}