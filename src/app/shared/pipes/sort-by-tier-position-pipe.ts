import { Pipe, PipeTransform } from '@angular/core';
import { AccountGameRankingTier } from '../models/account-game.model';

 export interface GameWithPosition extends AccountGameRankingTier {
  _tierPosition?: number;
  isEmptySlot?: boolean;
}

@Pipe({
  name: 'sortByTierPosition',
  standalone: true
})
export class SortByTierPositionPipe implements PipeTransform {
  transform(games: GameWithPosition[]): GameWithPosition[] {
    if (!games) return [];
    
    // Ordena primeiro por _tierPosition, depois mantém a ordem original como fallback
    return [...games].sort((a, b) => {
      const posA = a._tierPosition ?? Infinity;
      const posB = b._tierPosition ?? Infinity;
      
      // Se as posições forem iguais, mantém a ordem original
      if (posA === posB) return 0;
      
      return posA - posB;
    });
  }
}