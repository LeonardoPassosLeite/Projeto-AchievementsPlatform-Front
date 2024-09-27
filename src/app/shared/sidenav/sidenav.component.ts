import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  submenuOpen = false;
  selectedMenuTitle: string | null = null;
  activeSubmenu: MenuItem[] | null = null;

  constructor(private router: Router) { }

  menuItems: MenuItem[] = [
    {
      label: 'Jogos',
      icon: 'sports_esports',
      route: '/jogos' 
    },
    {
      label: 'ranking',
      icon: 'leaderboard',
      route: '/jogos-ranking' 
    },
    {
      label: 'componentes',
      icon: 'leaderboard',
      route: '/componentes' 
    },
  ];

  navigateTo(item: MenuItem): void {
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }
}
