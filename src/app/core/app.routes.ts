import { Routes } from '@angular/router';
import { JogosComponent } from '../pages/jogos/jogos.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: JogosComponent },
    { path: 'jogos', component: JogosComponent },
];