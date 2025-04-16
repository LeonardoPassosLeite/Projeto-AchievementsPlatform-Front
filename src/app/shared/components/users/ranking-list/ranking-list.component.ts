import { Component, Input } from '@angular/core';
import { UserRanking } from '../../../models/user-ranking.model';
import { GenericModule } from '../../../../../shareds/commons/GenericModule';
import { RankingType } from '../../../enums/ranking-type.enum';
import { MaterialModule } from '../../../../../shareds/commons/MaterialModule';

@Component({
  selector: 'app-ranking-list',
  standalone: true,
  imports: [GenericModule, MaterialModule],
  templateUrl: './ranking-list.component.html',
  styleUrl: './ranking-list.component.scss'
})
export class RankingListComponent {
  @Input() users: UserRanking[] = [];
  @Input() rankingType!: RankingType;

  displayedColumns: string[] = ['position', 'user', 'value'];
  rankingEnum = RankingType; 

  getIconSize(value: number): string {
    if (!value) return '16px'; // valor default
    const size = 16 + (value * 2); // cresce 2px por platina
    return size > 32 ? '32px' : `${size}px`; // máximo 32px
  }
  
}