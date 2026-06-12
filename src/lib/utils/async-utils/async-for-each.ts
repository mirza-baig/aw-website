export const asyncForEach = async <T>(array: T[], func: (arg0: T) => Promise<void>) => {
  await array.reduce(async (promise, entry) => {
    // This line will wait for the last async function to finish.
    // The first iteration uses an already resolved Promise
    // so, it will immediately continue.
    await promise;
    await func(entry);
  }, Promise.resolve());
};
