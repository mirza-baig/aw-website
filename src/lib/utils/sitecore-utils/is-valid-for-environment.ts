import { Environment } from 'lib/environment/environment';
import { getEnum } from 'lib/utils/sitecore-utils/get-enum';
import { getEnumsFromMultiselectField } from 'lib/utils/sitecore-utils/get-enum-from-multiselect-field';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type IsValidForEnvironmentProps = Sitecore.FieldSets.Advanced.ValidForEnvironment;

export type EnvironmentStates = 'Disabled' | 'All' | 'Selected';
export type Environments = 'Local' | 'Development' | 'UAT' | 'Production';

/**
 * Determines whether a feature is enabled for the current environment.
 *
 * Disabled or unknown states return false, All enables every environment, and
 * Selected checks the configured environment list.
 *
 * @param fieldset The Sitecore fieldset containing environment configuration.
 * @param env The current application environment.
 * @returns Whether the feature is valid for the current environment.
 */
export function isValidForEnvironment(
  fieldset: IsValidForEnvironmentProps,
  env: Environment
): boolean {
  const environmentState =
    getEnum<EnvironmentStates>(fieldset?.fields?.environmentState) ?? 'Disabled';
  const validForEnvironments =
    getEnumsFromMultiselectField<Environments>(fieldset?.fields?.validEnvironments) ?? [];

  switch (environmentState) {
    case 'Disabled':
      return false;

    case 'All':
      return true;

    case 'Selected': {
      return validForEnvironments.some((e) => env.isEnvironment(e));
    }
    default:
      return false;
  }
}
