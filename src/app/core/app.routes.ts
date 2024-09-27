import { Routes } from '@angular/router';
import { JogosRankingComponent } from '../pages/jogos-ranking/jogos-ranking.component';
import { AutoCompleteComponent } from '../shared/components/auto-complete/auto-complete.component';
import { NoticiasComponent } from '../pages/dashboard/noticias/noticias.component';
import { JogosLancamentosComponent } from '../pages/dashboard/jogos-lancamentos/jogos-lancamentos.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';

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
    { path: 'jogos-ranking', component: JogosRankingComponent },
    { path: 'componentes', component: AutoCompleteComponent },
];