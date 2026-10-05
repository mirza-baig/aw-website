/**
 * Executes an asynchronous callback for each array entry in sequence.
 *
 * @param array The entries to process.
 * @param func The callback to await for each entry before processing the next one.
 * @returns A promise that resolves after every callback completes or rejects when a callback fails.
 */
export async function asyncForEach<T>(array: T[], func: (arg0: T) => Promise<void>) {
  await array.reduce(async (promise, entry) => {
    // This line will wait for the last async function to finish.
    // The first iteration uses an already resolved Promise
    // so, it will immediately continue.
    await promise;
    await func(entry);
  }, Promise.resolve());
}
