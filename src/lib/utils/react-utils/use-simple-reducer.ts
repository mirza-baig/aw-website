'use client';

import { useReducer } from 'react';

const stateReducer = <TState>(
  state: TState,
  action: ((prev: TState) => TState) | Partial<TState>
) => ({
  ...state,
  ...(typeof action === 'function' ? action(state) : action),
});

/**
 * Manages object state with shallow partial or functional updates.
 *
 * @typeParam TState The shape of the managed state.
 * @param initialState The initial state value.
 * @returns A React state tuple containing the current state and an update dispatcher.
 */
export function useSimpleReducer<TState>(initialState: TState) {
  return useReducer(stateReducer<TState>, initialState);
}
