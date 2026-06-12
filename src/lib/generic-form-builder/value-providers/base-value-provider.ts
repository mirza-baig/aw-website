import { IValueProvider, ProvidedValue, Runtime, ValueProviderProps } from '.';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export abstract class BaseValueProvider<
  T = Sitecore.BaseTemplates.Forms.BaseFieldValueProvider,
> implements IValueProvider {
  constructor(protected readonly props: ValueProviderProps<T>) {}

  abstract get runtime(): Runtime;

  abstract exec(): ProvidedValue | ProvidedValue[] | null;
}
