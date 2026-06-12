// We can ignore any type for this generic util that is being used for debouncing
/* eslint-disable @typescript-eslint/no-explicit-any */

export const debounceFunction = (
  func: (...args: unknown[]) => Promise<any> | any,
  delay: number
) => {
  let timeoutId: any;
  return function (...args: any[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
