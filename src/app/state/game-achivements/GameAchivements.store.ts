import { Injectable } from '@angular/core';
import { Store } from '@datorama/akita';
import { GameAchievementsState, createInitialState } from './GameAchievements.state'; // Importando a função
import { GameAchievement } from '../../shared/models/game-achievement';

@Injectable({ providedIn: 'root' })
export class GameAchievementsStore extends Store<GameAchievementsState> {

  constructor() {
    super(createInitialState()); 
  }

  loadMoreAchievements(): void {
    const state = this.getValue();
    const perPage = 10;
    const nextPage = state.page + 1;

    console.log('Loading more achievements...');
    console.log('Current state before update:', state);

    this.update({
      gameAchievements: state.gameAchievements,
      page: nextPage,
      hasMore: true,
      isLoading: false,
    });

    console.log('Updated state after loadMoreAchievements:', this.getValue());
  }

  override setLoading(loading: boolean) {
    console.log('Setting loading state to:', loading);
    this.update(state => ({
      ...state,
      isLoading: loading,
    }));
  }

  setAchievements(gameAchievements: GameAchievement[]) {
    console.log('Adding achievements:', gameAchievements);
    this.update(state => ({
      ...state,
      gameAchievements: [...state.gameAchievements, ...gameAchievements],
    }));

    console.log('Updated state after setAchievements:', this.getValue());
  }

  setHasMore(hasMore: boolean) {
    console.log('Setting hasMore to:', hasMore);
    this.update(state => ({
      ...state,
      hasMore,
    }));
  }
}
