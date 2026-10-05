import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { useExternalScript } from './use-external-script';

describe('lib > utils > react-utils > use-external-script', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns idle and does not create a script for an empty URL', () => {
    const { result } = renderHook(() => useExternalScript(''));

    expect(result.current).toBe('idle');
    expect(document.querySelectorAll('script')).toHaveLength(0);
  });

  it('creates an async script with the default type', () => {
    renderHook(() => useExternalScript('https://example.com/script.js'));

    const script = document.querySelector('script');

    expect(script?.getAttribute('src')).toBe('https://example.com/script.js');
    expect(script?.type).toBe('application/javascript');
    expect(script?.async).toBe(true);
  });

  it('uses a custom script type', () => {
    renderHook(() => useExternalScript('https://example.com/script.js', 'module'));

    expect(document.querySelector('script')?.type).toBe('module');
  });

  it.each([
    ['load', 'ready'],
    ['error', 'error'],
  ])('updates the state when the script emits %s', (event, expectedState) => {
    const { result } = renderHook(() => useExternalScript('https://example.com/script.js'));
    const script = document.querySelector('script');

    act(() => {
      script?.dispatchEvent(new Event(event));
    });

    expect(result.current).toBe(expectedState);
  });

  it('reuses an existing script with the same URL', () => {
    const script = document.createElement('script');
    script.src = 'https://example.com/script.js';
    document.body.appendChild(script);

    renderHook(() => useExternalScript('https://example.com/script.js'));

    expect(document.querySelectorAll('script')).toHaveLength(1);
    expect(document.querySelector('script')).toBe(script);
  });
});
