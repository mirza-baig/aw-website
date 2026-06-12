import { useReducer } from 'react';

const stateReducer = <TState>(
  state: TState,
  action: ((prev: TState) => TState) | Partial<TState>
) => ({
  ...state,
  ...(typeof action === 'function' ? action(state) : action),
});

export const useSimpleReducer = <TState>(initialState: TState) => {
  return useReducer(stateReducer<TState>, initialState);
};
