'use client';

/**
 * Stores string values in browser session storage.
 *
 * @param items A map of session-storage keys to values.
 * @returns Nothing. Each entry is written to `sessionStorage`.
 */
export function setSessionStorageItems(items: Record<string, string>) {
  Object.entries(items).forEach(([key, value]) => {
    sessionStorage.setItem(key, value);
  });
}
