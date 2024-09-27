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
      icon: 'game',
      route: '/jogos'
    },
  ];
  selectMenu(item: MenuItem) {
    this.selectedMenuTitle = item.label;
    this.activeSubmenu = item.submenu || null;
    this.submenuOpen = !!item.submenu;
  }
  navigateTo(subItem: MenuItem) {
    this.router.navigate([subItem.route]);
  }
}