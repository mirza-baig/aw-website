'use client';

// We can ignore any type for this generic util that is being used for debouncing

type TimeoutId = ReturnType<typeof setTimeout>;

/**
 * Delays invoking a function until the specified time has elapsed since its latest call.
 *
 * @param func The function to invoke with the latest call's arguments.
 * @param delay The delay in milliseconds after the latest call.
 * @returns A debounced function that postpones invocation until the delay elapses.
 */
export function debounceFunction(func: (...args: unknown[]) => unknown, delay: number) {
  let timeoutId: TimeoutId;
  return function (...args: unknown[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
