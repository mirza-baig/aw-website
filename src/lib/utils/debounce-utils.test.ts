import { afterEach, describe, expect, it, vi } from 'vitest';

import { debounceFunction } from './debounce-utils';

describe('lib > utils > debounce-utils', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not invoke the function before the delay', () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debounced = debounceFunction(callback, 100);

    debounced();
    vi.advanceTimersByTime(99);

    expect(callback).not.toHaveBeenCalled();
  });

  it('invokes the function after the delay with its arguments', () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debounced = debounceFunction(callback, 100);

    debounced('value', 42);
    vi.advanceTimersByTime(100);

    expect(callback).toHaveBeenCalledWith('value', 42);
  });

  it('only invokes the function for the latest call', () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const debounced = debounceFunction(callback, 100);

    debounced('first');
    vi.advanceTimersByTime(50);
    debounced('second');
    vi.advanceTimersByTime(99);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
  });
});
