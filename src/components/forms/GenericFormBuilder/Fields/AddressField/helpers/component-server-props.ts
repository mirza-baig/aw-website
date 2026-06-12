import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import {
  CountryItem,
  getCountryStateOptions,
  getStateOptions,
  StateItem,
} from 'components/forms/GenericFormBuilder/Fields/AddressField/helpers/address-field-utils';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export async function getComponentServerProps(rendering: ComponentRendering) {
  const props = rendering as ComponentRendering<
    Sitecore.Forms.GenericFormBuilder.Fields.Address.AddressField['fields']
  >;
  if (props.fields?.datasource?.id == undefined) {
    return { options: [] };
  }

  let countryAndStateOptions: CountryItem[] | null = null;
  let stateOptions: StateItem[] | null = null;
  if (!isNullOrWhitespace(props.fields.countryFieldName.value)) {
    const parentId = props.fields.datasource.id;
    const title = props.fields.displayFieldName.value ?? 'title';
    const value = props.fields.valueFieldName.value ?? 'value';

    countryAndStateOptions = await getCountryStateOptions(parentId, title, value);

    if (props.fields.countryShowDefaultDisplay.value) {
      countryAndStateOptions.unshift({
        id: 'default',
        title: props.fields.countryDefaultDisplay.value,
        value: '',
        states: [],
      });
    }

    if (
      !isNullOrWhitespace(props.fields.stateFieldName.value) &&
      props.fields.stateShowDefaultDisplay.value
    ) {
      for (const option of countryAndStateOptions) {
        option.states.unshift({
          id: 'default',
          title: props.fields.stateDefaultDisplay.value,
          value: '',
        });
      }
    }
  } else {
    const parentId = props.fields.datasource.id;
    const title = props.fields.stateDisplayFieldName.value ?? 'title';
    const value = props.fields.stateValueFieldName.value ?? 'value';

    stateOptions = await getStateOptions(parentId, title, value);

    if (props.fields.stateShowDefaultDisplay.value) {
      stateOptions.unshift({
        id: 'default',
        title: props.fields.stateDefaultDisplay.value,
        value: '',
      });
    }
  }

  return { countryAndStateOptions: countryAndStateOptions ?? [], stateOptions: stateOptions ?? [] };
}
