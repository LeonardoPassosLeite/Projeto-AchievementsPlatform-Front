import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../core/auth/auth.service';

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
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  submenuOpen = false;
  selectedMenuTitle: string | null = null;
  activeSubmenu: MenuItem[] | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  menuItems: MenuItem[] = [
    { label: 'Perfil', icon: 'article', route: '/dashboard' },
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