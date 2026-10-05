import { afterEach, describe, expect, it } from 'vitest';

import { setSessionStorageItems } from './set-session-storage-items';

describe('lib > utils > client-storage-utils > set-session-storage-items', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('stores each item under its key', () => {
    setSessionStorageItems({ first: 'one', second: 'two' });

    expect(sessionStorage.getItem('first')).toBe('one');
    expect(sessionStorage.getItem('second')).toBe('two');
  });
});
