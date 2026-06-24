import * as flags from 'lib/feature-flags/flags';

import { Flags, FlagValues } from './types';

async function processFlagsParallel(record: Flags): Promise<FlagValues> {
  // 1. Get entries and map them to promises
  const entriesPromises = Object.entries(record).map(async ([key, flag]) => {
    const resolvedValue = await flag();
    return [key, resolvedValue];
  });

  // 2. Await all of them at once
  const resolvedEntries = await Promise.all(entriesPromises);

  // 3. Reconstruct back into an object
  const resultObject = Object.fromEntries(resolvedEntries);
  return resultObject;
}

export async function loader(): Promise<FlagValues> {
  const featureFlags = await processFlagsParallel(flags);
  return featureFlags;
}
