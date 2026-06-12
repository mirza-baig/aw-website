export function getLocalStorageItem(key: string): unknown {
  const data = window.localStorage.getItem(key);
  return data && JSON.parse(data);
}
