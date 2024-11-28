import { Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { HeaderUserInfoComponent } from '../shared/components/ui/header-user-info/header-user-info.component';
import { InsightsComponent } from '../pages/insights/insights.component';
import { SidenavComponent } from '../shared/components/sidenav/sidenav.component';
import { LoginComponent } from '../login/login.component';
import { CallbackComponent } from '../login/callback/callback.component';
import { AuthGuard } from '../shared/services/auth/auth.guard';
import { AccountGamesComponent } from '../pages/account-games/account-games.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'auth/callback', component: CallbackComponent },

    {
        path: '',
        component: SidenavComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'conquistas', component: AccountGamesComponent },
            { path: 'insights', component: InsightsComponent },
            { path: 'componentes', component: HeaderUserInfoComponent },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ]
    },

    { path: '**', redirectTo: '/login' }
];