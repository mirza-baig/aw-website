import { FlagsKey, FlagValues } from './types';

export class FeatureFlags {
  protected constructor() {}

  protected static _values: FlagValues | undefined;

  static get values(): FlagValues {
    if (FeatureFlags._values === undefined) {
      throw new Error(
        'Flags values have not been set. Call FeatureFlags.setValues() with the resolved flags before getting flag values.'
      );
    }
    return FeatureFlags._values;
  }

  static getValue(key: FlagsKey): FlagValues[FlagsKey] | undefined {
    if (FeatureFlags._values === undefined) {
      console.warn(
        'Flags values have not been set. Call FeatureFlags.setValues() with the resolved flags before getting flag values.'
      );
      return undefined;
    }
    const flag = FeatureFlags._values[key];
    if (flag === undefined) {
      console.warn(`Flag with key "${key}" does not exist.`);
      return undefined;
    }
    return flag;
  }

  static setValues(resolvedFlags: FlagValues) {
    FeatureFlags._values = resolvedFlags;
  }
}
