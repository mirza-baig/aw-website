import { getCookie } from 'cookies-next';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { ProvidedValue, Runtime } from '..';
import { BaseValueProvider } from '../base-value-provider';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export class CookieValueProvider extends BaseValueProvider<Sitecore.Forms.GenericFormBuilder.ValueProviders.CookieValueProvider> {
  get runtime(): Runtime {
    return Runtime.client;
  }

  exec(): ProvidedValue | ProvidedValue[] | null {
    if (
      typeof document === 'undefined' ||
      this.props.valueProvider.fields?.cookieName == undefined
    ) {
      return null;
    }

    const value = getCookie(this.props.valueProvider.fields?.cookieName.value);
    if (typeof value == 'boolean' || isNullOrWhitespace(value)) {
      return null;
    }

    const trimmed = value.trim();
    return trimmed.includes('|') ? trimmed.split('|').map((value) => value.trim()) : trimmed;
  }
}

export default CookieValueProvider;
