import * as flags from 'lib/feature-flags/flags';

import { Flags, FlagValues } from './types';

async function processFlagsParallel(precomputed: string, record: Flags): Promise<FlagValues> {
  const flagGroups = Object.values(record);

  // 1. Get entries and map them to promises
  const entriesPromises = Object.entries(record).map(async ([key, flag]) => {
    const resolvedValue = await flag(precomputed, flagGroups);
    return [key, resolvedValue];
  });

  // 2. Await all of them at once
  const resolvedEntries = await Promise.all(entriesPromises);

  // 3. Reconstruct back into an object
  const resultObject = Object.fromEntries(resolvedEntries);
  return resultObject;
}

export async function loader(precomputed: string): Promise<FlagValues> {
  const featureFlags = await processFlagsParallel(precomputed, flags);
  return featureFlags;
}
