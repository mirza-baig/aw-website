import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { normalizeGuid } from 'lib/utils/string-utils/normalize-guid';

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
  const getValueFromType = (constantValueId?: string) => {
    const AttributeConstants =
      SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums.Forms
        .Attributes.AttributeConstants;
    switch (constantValueId) {
      case normalizeGuid(AttributeConstants.Timestamp.Id):
        return new Date().toISOString();

      case normalizeGuid(AttributeConstants.URL.Id):
        return typeof globalThis === 'undefined' ? '' : globalThis.location.href;

      case normalizeGuid(AttributeConstants.Referrer.Id):
        return typeof document === 'undefined' ? '' : document.referrer;

      default:
        return '';
    }
  };

  const payloadAttributes = attributes.reduce((acc, item) => {
    if (!item.key) {
      return acc;
    }
    if (item.constantValue) {
      acc[item.key] = getValueFromType(normalizeGuid(item.constantValue));
      return acc;
    }

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
