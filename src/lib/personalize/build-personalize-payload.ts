import { resolveAttributeValue } from 'lib/tracking/resolve-attribute-value';

type BasicTypes = string | number | boolean;

type NestedObject = {
  [key: string]: BasicTypes | NestedObject | BasicTypes[];
};

type ExtRecord = Record<string, BasicTypes | NestedObject | BasicTypes[]>;

type AttributeItem = {
  key?: string;
  constantValue?: string;
  constantText?: string;
};

type BuildPayloadInput = {
  eventType?: string;
  attributes?: AttributeItem[];
  additionalExt?: ExtRecord;
};

export function buildPersonalizePayload(input: BuildPayloadInput) {
  const { eventType, attributes = [] } = input;
  if (!eventType) {
    console.warn('[CDP] Missing Event Type, skipping Personalization Submit');
    return null;
  }

  const payloadAttributes = attributes.reduce((acc, item) => {
    if (!item.key) {
      return acc;
    }
    // Other ConstantValue types
    if (item.constantValue) {
      acc[item.key] = resolveAttributeValue(item.constantValue, item.key);
      return acc;
    }
    // ConstantText only
    if (item.constantText) {
      acc[item.key] = item.constantText;
    }
    return acc;
  }, {} as ExtRecord);
  return {
    type: eventType,
    channel: 'WEB',
    language: 'EN',
    ext: {
      ...payloadAttributes,
      ...input.additionalExt,
    },
  };
}
