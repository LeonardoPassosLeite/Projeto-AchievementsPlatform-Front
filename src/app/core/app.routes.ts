import { Routes } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { LoginComponent } from '../login/login.component';
import { CallbackComponent } from '../login/callback/callback.component';
import { AuthGuard } from './auth/auth.guard';
import { RankingGlobalComponent } from '../pages/dashboard/ranking-global/ranking-global.component';
import { AccountGameDetailsComponent } from '../pages/dashboard/account-game/account-game-details/account-game-details.component';
import { AccountGameAchievementComponent } from '../pages/dashboard/account-game/account-game-achievement/account-game-achievement.component';
import { SideMenuComponent } from '../shared/components/side-navs/side-menu/side-menu.component';
import { AccountGamePlatinumComponent } from '../pages/dashboard/account-game/account-game-platinum/account-game-platinum.component';
import { AccountGameInProgressComponent } from '../pages/dashboard/account-game/account-game-in-progress/account-game-in-progress.component';
import { AccountGameFinishedComponent } from '../pages/dashboard/account-game/account-game-finished/account-game-finished.component';
import { HomeComponent } from '../pages/dashboard/home/home.component';
import { GameStatusComponent } from '../pages/dashboard/game-status/game-status.component';
// import { AllGamesComponent } from '../pages/sidebar/all-games/all-games.component';
import { UserFeedbacksComponent } from '../pages/sidebar/user-feedbacks/user-feedbacks.component';
// import { UserInsightsComponent } from '../pages/sidebar/user-insights/user-insights.component';
// import { AllGamesPlaytimeComponent } from '../pages/sidebar/user-insights/all-games-playtime/all-games-playtime.component';
import { AccountGameDroppedComponent } from '../pages/dashboard/account-game/account-game-dropped/account-game-dropped.component';
import { AccountGameFavoriteComponent } from '../pages/dashboard/account-game/account-game-favorite/account-game-favorite.component';
import { RankingPositionResolver } from '../shared/resolvers/ranking-position/ranking-position-resolver';
import { RankingPositionTableComponent } from '../pages/dashboard/account-game/account-game-favorite/ranking-position-table/ranking-position-table.component';
import { GameStatusManagerComponent } from '../pages/sidebar/manager/game-status-manager/game-status-manager.component';
import { RankingTierComponent } from '../pages/sidebar/manager/ranking-tier/ranking-tier.component';
import { GameStatusNavComponent } from '../shared/components/side-navs/game-status-nav/game-status-nav.component';
import { AllGamesComponent } from '../pages/sidebar/all-games/all-games.component';
import { AllCommentsComponent } from '../pages/sidebar/all-games/all-comments/all-comments.component';
import { CommentsComponent } from '../pages/sidebar/comments/comments.component';
import { RankingPlaytimeTableComponent } from '../pages/dashboard/account-game/account-game-favorite/ranking-playtime-table/ranking-playtime-table.component';
import { UserInsightsComponent } from '../pages/sidebar/user-insights/user-insights.component';
import { SideNavbarComponent } from '../shared/components/side-navs/side-navbar/side-navbar.component';

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
                        component: GameStatusNavComponent,
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
                                path: 'games-dropados',
                                component: AccountGameDroppedComponent,
                            },
                            {
                                path: 'games-favoritos',
                                component: AccountGameFavoriteComponent,
                                children: [
                                    {
                                        path: 'ranking-position',
                                        component: RankingPositionTableComponent
                                    },
                                    {
                                        path: 'playtime',
                                        component: RankingPlaytimeTableComponent
                                    },
                                    { path: '', redirectTo: 'ranking-position', pathMatch: 'full' }
                                ]
                            },
                            {
                                path: '',
                                redirectTo: 'games-conquistas',
                                pathMatch: 'full',
                            },
                        ],
                    },
                    {
                        path: 'all-comments/:id',
                        component: AllCommentsComponent
                    },
                    {
                        path: 'comments',
                        component: CommentsComponent,
                    },
                    { path: 'account-game-details/:id', component: AccountGameDetailsComponent },
                    { path: 'user-feedbacks', component: UserFeedbacksComponent },

                    // { path: 'all-games-playtimeForever', component: AllGamesPlaytimeComponent },
                    { path: '', redirectTo: 'home', pathMatch: 'full' },
                ]

            },
            {
                path: 'sidebar',
                component: SideNavbarComponent,
                children: [
                    {
                        path: 'ranking-tier',
                        component: RankingTierComponent
                    },
                    {
                        path: 'game-status-manager',
                        component: GameStatusManagerComponent
                    },
                    {
                        path: 'user-insights',
                        component: UserInsightsComponent,
                    },
                ]
            },

            {
                path: 'all-games',
                component: AllGamesComponent,
            },
            { path: 'insights', component: AccountGameAchievementComponent },
            { path: 'usuario', component: AccountGameAchievementComponent },
        ]
    },

    // Redirecionamento padrão para login em caso de rota inválida
    // { path: '**', redirectTo: '/login' }
];