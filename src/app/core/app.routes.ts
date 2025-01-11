import { Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';
import { CallbackComponent } from '../login/callback/callback.component';
import { AuthGuard } from '../shared/services/auth/auth.guard';
import { RankingGlobalComponent } from '../pages/dashboard/ranking-global/ranking-global.component';
import { AccountArtComponent } from '../pages/dashboard/account-art/account-art.component';
import { AccountGameDetailsComponent } from '../pages/dashboard/account-game/account-game-details/account-game-details.component';
import { AccountGameAchievementComponent } from '../pages/dashboard/account-game/account-game-achievement/account-game-achievement.component';
import { SideMenuComponent } from '../shared/components/side-navs/side-menu/side-menu.component';
import { NavBarComponent } from '../shared/components/side-navs/nav-bar/nav-bar.component';
import { AccountGamePlatinumComponent } from '../pages/dashboard/account-game/account-game-platinum/account-game-platinum.component';
import { AccountGameInProgressComponent } from '../pages/dashboard/account-game/account-game-in-progress/account-game-in-progress.component';
import { AccountGameFinishedComponent } from '../pages/dashboard/account-game/account-game-finished/account-game-finished.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { canActivate: [AuthGuard], path: 'auth/callback', component: CallbackComponent },

    {
        path: '',
        component: SideMenuComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                children: [
                    { path: 'arte', component: AccountArtComponent },
                    {
                        path: 'navbar',
                        component: NavBarComponent,
                        children: [
                            {
                                path: 'games-conquistas',
                                component: AccountGameAchievementComponent,
                            },
                            {
                                path: 'games-platinados',
                                component: AccountGamePlatinumComponent,
                            },
                            {
                                path: 'games-em-amdamento',
                                component: AccountGameInProgressComponent,
                            },
                            {
                                path: 'games-finalizados',
                                component: AccountGameFinishedComponent,
                            },
                            {
                                path: '',
                                redirectTo: 'games-conquistas',
                                pathMatch: 'full',
                            },
                        ],
                    },
                    { path: 'ranking-global', component: RankingGlobalComponent },
                    { path: 'account-game-details/:id', component: AccountGameDetailsComponent },
                    { path: '', redirectTo: 'arte', pathMatch: 'full' },
                ]
            },
            { path: 'insights', component: AccountGameAchievementComponent },
            { path: 'usuario', component: AccountGameAchievementComponent },
        ]
    },

    // Redirecionamento padrão para login em caso de rota inválida
    // { path: '**', redirectTo: '/login' }
];