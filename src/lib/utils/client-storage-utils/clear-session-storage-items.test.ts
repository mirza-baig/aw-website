import { afterEach, describe, expect, it } from 'vitest';

import { clearSessionStorageItems } from './clear-session-storage-items';
import { setSessionStorageItems } from './set-session-storage-items';

describe('lib > utils > client-storage-utils > clear-session-storage-items', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('removes the requested items and keeps other items', () => {
    setSessionStorageItems({ first: 'one', second: 'two' });

    clearSessionStorageItems(['first']);

    expect(sessionStorage.getItem('first')).toBe(null);
    expect(sessionStorage.getItem('second')).toBe('two');
  });

  it('ignores empty keys', () => {
    setSessionStorageItems({ first: 'one' });

    clearSessionStorageItems(['', 'first']);

    expect(sessionStorage.length).toBe(0);
  });
});
