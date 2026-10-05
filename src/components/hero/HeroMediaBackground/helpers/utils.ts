import { ComponentMargin, ComponentPadding, ComponentSpacing } from 'helpers/Component/Component';
import { EnumField } from 'lib/utils/sitecore-utils/enum-field';

type SitecoreItem = {
  fields?: Record<string, { value?: unknown }>;
};

export function asEnumField<T>(field?: unknown): EnumField<T> | undefined {
  if (!field) {
    return undefined;
  }
  if (typeof field !== 'object') {
    return field as EnumField<T>;
  }
  if ('fields' in field && (field as SitecoreItem).fields) {
    const item = field as SitecoreItem;
    const val = item.fields?.Value?.value ?? item.fields?.value?.value;
    return val === undefined ? undefined : (val as EnumField<T>);
  }
  return undefined;
}

export function getSpacingClass(
  spacing?: EnumField<ComponentSpacing>,
  padding?: EnumField<ComponentPadding>,
  margin?: EnumField<ComponentMargin>
) {
  const getValue = (field?: EnumField<unknown>): string => {
    if (!field) {
      return '';
    }

    if (typeof field === 'string' || typeof field === 'number' || typeof field === 'boolean') {
      return String(field);
    }

    if (typeof field === 'object' && 'value' in field) {
      const val = field.value;
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return String(val);
      }
      return '';
    }

    return '';
  };

  return [getValue(spacing), getValue(padding), getValue(margin)]
    .filter((val) => val.trim() !== '')
    .join(' ');
}

export function getField<T>(obj: unknown, key: string, fallback: T): T {
  return typeof obj === 'object' && obj !== null && key in obj
    ? (obj as Record<string, T>)[key]
    : fallback;
}
