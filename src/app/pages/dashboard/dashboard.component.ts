import { Component, OnInit } from '@angular/core';
import { SteamUser } from '../../shared/models/steam-user.model';
import { SteamUserService } from '../../shared/services/steam-user.service';
import { ErrorHandlingService } from '../../shared/services/commons/error-handlig.service';
import { NavigationService } from '../../shared/services/commons/navigation.service';
import { DashboardMenu } from '../../shared/enums/navigation.enum';
import { getSelectedDashboardMenu } from '../../utils/navigation.utils';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SteamUserComponent } from './steam-user/steam-user.component';
import { GenericModule } from '../../../shareds/commons/GenericModule';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    GenericModule,
    RouterModule,
    SteamUserComponent,
    SidebarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  DashboardMenu = DashboardMenu;
  steamUser: SteamUser | null = null;
  errorMessage: string | null = null;
  selectedMenu: DashboardMenu = DashboardMenu.Home;
  loading = true;

  constructor(
    private steamUserService: SteamUserService,
    private errorHandlingService: ErrorHandlingService,
    public navigation: NavigationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSteamUser();
    this.selectedMenu = getSelectedDashboardMenu(this.router.url);
  }

  loadSteamUser(): void {
    this.steamUserService.getSeamUser().subscribe({
      next: (response) => {
        this.steamUser = response;
      },
      error: (error) => this.errorMessage = this.errorHandlingService.handleHttpError(error),
      complete: () => this.loading = false
    });
  }
  

  navigateTo(menu: DashboardMenu): void {
    this.selectedMenu = menu;
    this.navigation.navigateDashboard(menu);
  }
}