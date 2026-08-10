let abandonTimeout: ReturnType<typeof setTimeout> | null = null;
let isCancelled = false;
let isFired = false;

export const startTimer = (cb: () => void, delay: number) => {
  isCancelled = false;
  isFired = false;

  if (abandonTimeout) {
    clearTimeout(abandonTimeout);
  }

  abandonTimeout = setTimeout(() => {
    if (!isCancelled && !isFired) {
      isFired = true;
      cb();
    }
  }, delay);
};

export const stopTimer = () => {
  isCancelled = true;
  if (abandonTimeout) {
    clearTimeout(abandonTimeout);
    abandonTimeout = null;
  }
};
