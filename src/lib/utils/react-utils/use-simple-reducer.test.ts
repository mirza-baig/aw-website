import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useSimpleReducer } from './use-simple-reducer';

describe('lib > utils > react-utils > use-simple-reducer', () => {
  it('returns the initial state', () => {
    const initialState = { count: 0, label: 'initial' };
    const { result } = renderHook(() => useSimpleReducer(initialState));

    expect(result.current[0]).toBe(initialState);
  });

  it('merges partial state updates', () => {
    const { result } = renderHook(() => useSimpleReducer({ count: 0, label: 'initial' }));

    act(() => {
      result.current[1]({ count: 1 });
    });

    expect(result.current[0]).toEqual({ count: 1, label: 'initial' });
  });

  it('passes the latest state to functional updates', () => {
    const { result } = renderHook(() => useSimpleReducer({ count: 0 }));

    act(() => {
      result.current[1]((previous) => ({ count: previous.count + 1 }));
      result.current[1]((previous) => ({ count: previous.count + 1 }));
    });

    expect(result.current[0]).toEqual({ count: 2 });
  });

  it('replaces nested values with a shallow merge', () => {
    const settings: { enabled: boolean; mode?: string } = { enabled: true, mode: 'default' };
    const { result } = renderHook(() => useSimpleReducer({ settings, label: 'initial' }));

    act(() => {
      result.current[1]({ settings: { enabled: false } });
    });

    expect(result.current[0]).toEqual({ settings: { enabled: false }, label: 'initial' });
  });
});
