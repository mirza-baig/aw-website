import { FormsConstants } from 'lib/constants/forms-constants';
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

  const getValueFromType = (constantValueId?: string, key?: string) => {
    const AttributeConstants =
      SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums.Forms
        .Attributes.AttributeConstants;
    const getFromSessionValue = (key?: string): string | boolean => {
      const fromExperience =
        sessionStorage.getItem(FormsConstants.AW.Form.CCPFormFromExperience) === 'true';

      switch (key) {
        case FormsConstants.AW.Form.CCPFormFromExperienceText:
          return fromExperience;

        case FormsConstants.AW.Form.CCPFormExperienceIdText:
          return fromExperience
            ? sessionStorage.getItem(FormsConstants.AW.Form.CCPFormExperienceId) || ''
            : '';

        default:
          return '';
      }
    };
    switch (normalizeGuid(constantValueId)) {
      case normalizeGuid(AttributeConstants.Timestamp.Id):
        return new Date().toISOString();

      case normalizeGuid(AttributeConstants.URL.Id):
        return typeof globalThis === 'undefined' ? '' : globalThis.location.href;

      case normalizeGuid(AttributeConstants.Referrer.Id):
        return typeof document === 'undefined' ? '' : document.referrer;

      case normalizeGuid(AttributeConstants.StepCompleted.Id): {
        if (typeof document === 'undefined') {
          return '';
        }
        const completedStep = sessionStorage.getItem(FormsConstants.AW.Form.CCPFormCompleted);
        return completedStep ? Number(completedStep) : 1;
      }
      case normalizeGuid(AttributeConstants.CurrentStep.Id): {
        if (typeof document === 'undefined') {
          return '';
        }
        const currentStep = sessionStorage.getItem(FormsConstants.AW.Form.CCPFormStep);
        return currentStep ? Number(currentStep) : 1;
      }
      case normalizeGuid(AttributeConstants.FromSession.Id): {
        if (globalThis.window === undefined) {
          return '';
        }

        return getFromSessionValue(key);
      }
      default:
        return '';
    }
  };
  const payloadAttributes = attributes.reduce((acc, item) => {
    if (!item.key) {
      return acc;
    }
    // Other ConstantValue types
    if (item.constantValue) {
      acc[item.key] = getValueFromType(normalizeGuid(item.constantValue), item.key);
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
