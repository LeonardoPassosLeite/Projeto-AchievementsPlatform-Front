import { Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';
import { CallbackComponent } from '../login/callback/callback.component';
import { AuthGuard } from '../shared/services/auth/auth.guard';
import { RankingGlobalComponent } from '../pages/dashboard/ranking-global/ranking-global.component';
import { AccountGameDetailsComponent } from '../pages/dashboard/account-game/account-game-details/account-game-details.component';
import { AccountGameAchievementComponent } from '../pages/dashboard/account-game/account-game-achievement/account-game-achievement.component';
import { SideMenuComponent } from '../shared/components/side-navs/side-menu/side-menu.component';
import { NavBarComponent } from '../shared/components/side-navs/nav-bar/nav-bar.component';
import { AccountGamePlatinumComponent } from '../pages/dashboard/account-game/account-game-platinum/account-game-platinum.component';
import { AccountGameInProgressComponent } from '../pages/dashboard/account-game/account-game-in-progress/account-game-in-progress.component';
import { AccountGameFinishedComponent } from '../pages/dashboard/account-game/account-game-finished/account-game-finished.component';
import { HomeComponent } from '../pages/dashboard/home/home.component';
import { GameStatusComponent } from '../pages/dashboard/game-status/game-status.component';
import { GameKanbanComponent } from '../pages/sidebar/game-kanban/game-kanban.component';
import { AllGamesComponent } from '../pages/sidebar/all-games/all-games.component';
import { CommentsComponent } from '../pages/sidebar/all-games/comments/comments.component';
import { UserFeedbacksComponent } from '../pages/sidebar/user-feedbacks/user-feedbacks.component';

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
                    { path: 'home', component: HomeComponent },
                    { path: 'game-status', component: GameStatusComponent },
                    { path: 'ranking-global', component: RankingGlobalComponent },
                    {
                        path: 'conquistas',
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
                    { path: 'account-game-details/:id', component: AccountGameDetailsComponent },
                    { path: 'game-kanban', component: GameKanbanComponent },
                    { path: 'all-games', component: AllGamesComponent },
                    { path: 'user-feedbacks', component: UserFeedbacksComponent },
                    { path: 'comments/:id', component: CommentsComponent },
                    { path: '', redirectTo: 'home', pathMatch: 'full' },
                ]
            },
            { path: 'insights', component: AccountGameAchievementComponent },
            { path: 'usuario', component: AccountGameAchievementComponent },
        ]
    },

    // Redirecionamento padrão para login em caso de rota inválida
    // { path: '**', redirectTo: '/login' }
];