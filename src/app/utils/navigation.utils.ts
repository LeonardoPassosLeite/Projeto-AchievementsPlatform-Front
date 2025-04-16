import { Router } from '@angular/router';
import { DashboardMenu, GameStatusMenu } from '../shared/enums/navigation.enum';

export function isActive(router: Router, path: string, exact: boolean = true): boolean {
    return exact ? router.url === path : router.url.startsWith(path);
}

export function getSelectedDashboardMenu(url: string): DashboardMenu {
    if (url.includes('/game-status')) return DashboardMenu.GameStatus;
    if (url.includes('/conquistas')) return DashboardMenu.Conquistas;
    if (url.includes('/ranking-global')) return DashboardMenu.Ranking;
    return DashboardMenu.Home;
}

export function getSelectedGameStatusMenu(url: string): GameStatusMenu {
    if (url.includes('/platinum')) return GameStatusMenu.Platinum;
    if (url.includes('/in-progress')) return GameStatusMenu.InProgress;
    if (url.includes('/finished')) return GameStatusMenu.Finished;
    if (url.includes('/dropped')) return GameStatusMenu.Dropped;
    if (url.includes('/favorite')) return GameStatusMenu.Favorite;
    return GameStatusMenu.Achievements;
}
