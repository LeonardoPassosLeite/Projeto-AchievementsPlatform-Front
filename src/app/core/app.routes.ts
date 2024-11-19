import { Routes } from '@angular/router';
import { NoticiasComponent } from '../pages/dashboard/noticias/noticias.component';
import { JogosLancamentosComponent } from '../pages/dashboard/jogos-lancamentos/jogos-lancamentos.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { ConquistasComponent } from '../pages/conquistas/conquistas.component';
import { AutoCompleteComponent } from '../shared/components/forms/auto-complete/auto-complete.component';
import { HeaderUserInfoComponent } from '../shared/components/ui/header-user-info/header-user-info.component';
import { InsightsComponent } from '../pages/insights/insights.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        children: [
            { path: 'noticias', component: NoticiasComponent },
            { path: 'jogos-lancamento', component: JogosLancamentosComponent },
            { path: '', redirectTo: 'noticias', pathMatch: 'full' }
        ]
    },
    { path: 'jogos', loadChildren: () => import('../pages/jogos/jogos.module').then(m => m.JogosModule) },
    { path: 'conquistas', component: ConquistasComponent },
    { path: 'insights', component: InsightsComponent },
    { path: 'componentes', component: HeaderUserInfoComponent },
];