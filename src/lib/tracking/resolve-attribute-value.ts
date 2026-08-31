import { FormsConstants } from 'lib/constants/forms-constants';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { normalizeGuid } from 'lib/utils/string-utils/normalize-guid';

export function resolveAttributeValue(
  constantValueId?: string,
  key?: string
): string | number | boolean {
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
      if (typeof globalThis === 'undefined') {
        return '';
      }
      const completedStep = sessionStorage.getItem(FormsConstants.AW.Form.CCPFormCompleted);
      return completedStep ? Number(completedStep) : 1;
    }

    case normalizeGuid(AttributeConstants.CurrentStep.Id): {
      if (typeof globalThis === 'undefined') {
        return '';
      }
      const currentStep = sessionStorage.getItem(FormsConstants.AW.Form.CCPFormStep);
      return currentStep ? Number(currentStep) : 1;
    }

    case normalizeGuid(AttributeConstants.FromSession.Id): {
      if (typeof globalThis === 'undefined') {
        return '';
      }

      return getFromSessionValue(key);
    }

    default:
      return '';
  }
}
