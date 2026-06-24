'use client';

import { JSX } from 'react';

import { FeatureFlags } from './feature-flags';
import { FlagValues } from './types';

export function SetFeatureFlags({ values }: { values: FlagValues }): JSX.Element | null {
  FeatureFlags.setValues(values);
  return null;
}
