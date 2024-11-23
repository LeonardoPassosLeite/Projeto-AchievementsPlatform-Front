import { Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { HeaderUserInfoComponent } from '../shared/components/ui/header-user-info/header-user-info.component';
import { InsightsComponent } from '../pages/insights/insights.component';
import { SidenavComponent } from '../shared/components/sidenav/sidenav.component';


export const routes: Routes = [
    {
        path: '',
        component: SidenavComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'insights', component: InsightsComponent },
            { path: 'componentes', component: HeaderUserInfoComponent },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        ]
    },

    { path: '**', redirectTo: '/login' }
];