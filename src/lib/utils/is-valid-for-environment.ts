import { Environment } from 'lib/environment/environment';
import { getEnum, getEnumsFromMultiselectField } from 'lib/utils/get-enum';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type IsValidForEnvironmentProps = Sitecore.FieldSets.Advanced.ValidForEnvironment;

export type EnvironmentStates = 'Disabled' | 'All' | 'Selected';
export type Environments = 'Local' | 'Development' | 'UAT' | 'Production';

export const isValidForEnvironment = (
  fieldset: IsValidForEnvironmentProps,
  env: Environment
): boolean => {
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
};
