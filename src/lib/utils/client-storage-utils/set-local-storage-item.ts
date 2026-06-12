export function setLocalStorageItem(key: string, data: unknown): void {
  window.localStorage.setItem(key, JSON.stringify(data));
}
