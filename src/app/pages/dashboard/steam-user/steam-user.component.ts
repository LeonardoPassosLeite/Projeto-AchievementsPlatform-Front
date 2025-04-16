import { Component, Input } from '@angular/core';
import { SteamUser } from '../../../shared/models/steam-user.model';
import { GenericModule } from '../../../../shareds/commons/GenericModule';

@Component({
  selector: 'app-steam-user',
  standalone: true,
  imports: [GenericModule],
  templateUrl: './steam-user.component.html',
  styleUrls: ['./steam-user.component.scss']
})
export class SteamUserComponent {
  @Input() steamUser: SteamUser | null = null;

  getXpPercentage(): number {
    if (!this.steamUser) return 0;

    const obtained = this.steamUser.userStats.obtainedXp;
    const xpToNext = this.steamUser.userStats.totalXp;

    return (obtained / xpToNext) * 100;
  }
}