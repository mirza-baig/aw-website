import { formValueProviderFactory, ProvidedValue } from '../../value-providers';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export function getValueProviderValue(
  field: Sitecore.FieldSets.Forms.FieldValueProviderSettings
): ProvidedValue | ProvidedValue[] | null {
  const valueProviders = field.fields?.valueProviders;
  if (valueProviders == undefined || valueProviders.length === 0) {
    return null;
  }
  for (const item of valueProviders) {
    const provider = item as unknown as Sitecore.BaseTemplates.Forms.BaseFieldValueProvider;
    const providerHandler = formValueProviderFactory(provider);
    if (providerHandler == undefined) {
      continue;
    }
    const value = providerHandler.exec();
    if (value === null || value === undefined) {
      continue;
    }
    return value;
  }
  return null;
}
