import { Flag } from 'flags/next';
import type * as flags from 'lib/feature-flags/flags';

type ExtractFlagValueType<Type> = Type extends Flag<infer ValueType> ? ValueType : never;

export type Flags = typeof flags;
export type FlagsKey = keyof Flags;
export type FlagValues = { [K in FlagsKey]: ExtractFlagValueType<Flags[K]> };
