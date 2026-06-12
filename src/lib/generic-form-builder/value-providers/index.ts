import { CookieValueProvider } from './providers/cookie-value-provider';
import { QueryStringValueProvider } from './providers/query-string-value-provider';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ValueProviderProps<T> = {
  valueProvider: T;
};

type Constructor<TIn, TOut> = new (props: ValueProviderProps<TIn>) => TOut;

export enum Runtime {
  server,
  client,
}

export type ProvidedValue = string | boolean | number;

export type ProvidedValues = ProvidedValue | ProvidedValue[] | null;

export interface IValueProvider {
  runtime: Runtime;
  exec(): ProvidedValues;
}

const map = new Map<
  string,
  Constructor<Sitecore.BaseTemplates.Forms.BaseFieldValueProvider, IValueProvider>
>();
map.set('{D3966C25-582D-4B4A-90E0-2CF8EA8B6E8D}', CookieValueProvider);
map.set('{E13A63A0-B8B0-4206-A7CF-DD38558789C5}', QueryStringValueProvider);

export const formValueProviderFactory = (
  valueProvider: Sitecore.BaseTemplates.Forms.BaseFieldValueProvider
) => {
  if (valueProvider.fields?._AW_TemplateId == undefined) {
    console.error(`No template ID defined for ${JSON.stringify(valueProvider)}`);
    return undefined;
  }

  const classType = map.get(valueProvider.fields._AW_TemplateId.value);
  if (classType == undefined) {
    console.error(`No provider handler defined for '${valueProvider.fields._AW_TemplateId.value}'`);
    return undefined;
  }

  return new classType({ valueProvider });
};
