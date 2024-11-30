import { Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
// import { InsightsComponent } from '../pages/insights/insights.component';
import { SidenavComponent } from '../shared/components/sidenav/sidenav.component';
import { LoginComponent } from '../login/login.component';
import { CallbackComponent } from '../login/callback/callback.component';
import { AuthGuard } from '../shared/services/auth/auth.guard';
import { AccountSteamAchievementComponent } from '../pages/account-steam-achievement/account-steam-achievement.component';

// import { AccountProfileComponent } from '../pages/steam-user/account-profile/account-profile.component';

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
            { path: 'conquistas', component: AccountSteamAchievementComponent },
            // { path: 'insights', component: InsightsComponent },
            // { path: 'usuario', component: AccountProfileComponent },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ]
    },

    { path: '**', redirectTo: '/login' }
];