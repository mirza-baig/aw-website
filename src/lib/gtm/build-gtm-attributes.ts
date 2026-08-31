import { resolveAttributeValue } from 'lib/tracking/resolve-attribute-value';

type AttributeItem = {
  key?: string;
  constantValue?: string;
  constantText?: string;
};

export function buildGtmAttributes(attributes: AttributeItem[]): Record<string, unknown> {
  return attributes.reduce(
    (acc, item) => {
      if (!item.key) {
        return acc;
      }

      if (item.constantValue) {
        acc[item.key] = resolveAttributeValue(item.constantValue, item.key);
      } else if (item.constantText) {
        acc[item.key] = item.constantText;
      }

      return acc;
    },
    {} as Record<string, unknown>
  );
}
