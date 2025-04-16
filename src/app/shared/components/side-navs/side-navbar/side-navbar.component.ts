import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../../services/commons/navigation.service';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './side-navbar.component.html',
  styleUrl: './side-navbar.component.scss'
})
export class SideNavbarComponent {

  constructor(public navigation: NavigationService) { }
}