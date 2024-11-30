import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth/auth.service';

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

  constructor(private authService: AuthService, private router: Router) { }

  menuItems: MenuItem[] = [
    { label: 'Noticias', icon: 'article', route: '/dashboard' },
    { label: 'Jogos', icon: 'sports_esports', route: '/jogos' },
    { label: 'Insights', icon: 'bar_chart', route: '/insights' },
    { label: 'Conquistas', icon: 'emoji_events', route: '/conquistas' },
    { label: 'Usuario', icon: 'emoji_events', route: '/usuario' },
    { label: 'Sair', icon: 'logout' }
  ];

  navigateTo(item: MenuItem): void {
    if (item.label === 'Sair') {
      this.authService.logout();
      this.router.navigate(['/login']);
      return;
    }

    if (item.route) {
      this.router.navigate([item.route]);
    }
  }
}