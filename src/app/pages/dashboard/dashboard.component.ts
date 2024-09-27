import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from '../../shared/sidenav/sidenav.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    SidenavComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
}