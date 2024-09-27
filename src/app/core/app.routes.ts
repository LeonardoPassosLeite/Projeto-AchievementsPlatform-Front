import { Routes } from '@angular/router';
import { JogosComponent } from '../pages/jogos/jogos.component';
import { JogosRankingComponent } from '../pages/jogos-ranking/jogos-ranking.component';
import { AutoCompleteComponent } from '../shared/components/auto-complete/auto-complete.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: JogosComponent },
    { path: 'jogos', component: JogosComponent },
    { path: 'jogos-ranking', component: JogosRankingComponent },
    { path: 'componentes', component: AutoCompleteComponent },
];