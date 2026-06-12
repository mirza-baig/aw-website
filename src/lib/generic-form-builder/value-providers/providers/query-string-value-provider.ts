import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { ProvidedValue, Runtime } from '..';
import { BaseValueProvider } from '../base-value-provider';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export class QueryStringValueProvider extends BaseValueProvider<Sitecore.Forms.GenericFormBuilder.ValueProviders.QueryStringValueProvider> {
  get runtime(): Runtime {
    return Runtime.client;
  }

  exec(): ProvidedValue | ProvidedValue[] | null {
    if (
      typeof window === 'undefined' ||
      this.props.valueProvider.fields?.queryStringKey == undefined
    ) {
      return null;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(this.props.valueProvider.fields.queryStringKey.value);

    if (isNullOrWhitespace(value)) {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.includes('|') ? trimmed.split('|').map((value) => value.trim()) : trimmed;
  }
}

export default QueryStringValueProvider;
