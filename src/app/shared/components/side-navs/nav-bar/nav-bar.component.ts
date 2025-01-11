import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

  constructor(private router: Router) { }

  goToGameAchievements() {
    this.router.navigate(['dashboard/navbar/games-conquistas']);
  }

  goToGamePlatinum() {
    this.router.navigate(['dashboard/navbar/games-platinados']);
  }

  goToGameInProgress() {
    this.router.navigate(['dashboard/navbar/games-em-amdamento']);
  }

  goToGameFinished() {
    this.router.navigate(['dashboard/navbar/games-finalizados']);
  }
}
