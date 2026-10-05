'use client';

/**
 * Removes the specified keys from browser session storage.
 *
 * Empty keys are ignored.
 *
 * @param keys The session-storage keys to remove.
 * @returns Nothing. Matching keys are removed from `sessionStorage`.
 */
export function clearSessionStorageItems(keys: string[]) {
  keys.forEach((key) => {
    if (key) {
      sessionStorage.removeItem(key);
    }
  });
}
