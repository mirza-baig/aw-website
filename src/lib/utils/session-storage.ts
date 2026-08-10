export const clearSessionStorageItems = (keys: string[]) => {
  keys.forEach((key) => {
    if (key) {
      sessionStorage.removeItem(key);
    }
  });
};

export const setSessionStorageItems = (items: Record<string, string>) => {
  Object.entries(items).forEach(([key, value]) => {
    sessionStorage.setItem(key, value);
  });
};
