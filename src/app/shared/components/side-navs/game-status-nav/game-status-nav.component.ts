import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-game-status-nav',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './game-status-nav.component.html',
  styleUrl: './game-status-nav.component.scss'
})
export class GameStatusNavComponent {
  constructor(private router: Router) { }

  goToGameAchievements() {
    this.router.navigate(['dashboard/conquistas/games-conquistas']);
  }

  goToGamePlatinum() {
    this.router.navigate(['dashboard/conquistas/games-platinados']);
  }

  goToGameInProgress() {
    this.router.navigate(['dashboard/conquistas/games-em-amdamento']);
  }

  goToGameFinished() {
    this.router.navigate(['dashboard/conquistas/games-finalizados']);
  }

  goToGameDropped() {
    this.router.navigate(['dashboard/conquistas/games-dropados']);
  }

  goToGameFavorite() {
    this.router.navigate(['dashboard/conquistas/games-favoritos']);
  }
}
