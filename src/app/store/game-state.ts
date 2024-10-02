import { State, Action, StateContext, Selector } from '@ngxs/store';

export class IncrementLeftWins {
  static readonly type = '[Game] Increment Left Wins';
}
export class IncrementRightWins {
  static readonly type = '[Game] Increment Right Wins';
}

export interface GameStateModel {
  leftWins: number;
  rightWins: number;
}

@State<GameStateModel>({
  name: 'game',
  defaults: {
    leftWins: 0,
    rightWins: 0
  }
})
export class GameState {
  @Selector()
  static getLeftWins(state: GameStateModel): number {
    return state?.leftWins ?? 0;
  }

  @Selector()
  static getRightWins(state: GameStateModel): number {
    return state?.rightWins ?? 0;
  }

  @Action(IncrementLeftWins)
  incrementLeftWins({ getState, patchState }: StateContext<GameStateModel>): void {
    const state = getState();
    patchState({ leftWins: state.leftWins + 1 });
  }

  @Action(IncrementRightWins)
  incrementRightWins({ getState, patchState }: StateContext<GameStateModel>): void {
    const state = getState();
    patchState({ rightWins: state.rightWins + 1 });
  }
}
