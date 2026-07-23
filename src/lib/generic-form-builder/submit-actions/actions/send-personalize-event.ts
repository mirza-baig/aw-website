import { event } from '@sitecore-content-sdk/events';
import { FormsConstants } from 'lib/constants/forms-constants';
import { stopTimer } from 'lib/personalize/abandon-tracker';
import { buildPersonalizePayload } from 'lib/personalize/build-personalize-payload';
import { normalizeGuid } from 'lib/utils/string-utils/normalize-guid';

import { ActionResult } from '..';
import { BaseSubmitAction } from '../base-submit-action';
import { Sitecore } from '.sitecore/AndersenWindows.model';
export class SendPersonalizeEvent extends BaseSubmitAction<Sitecore.BaseTemplates.BaseSubmitAction> {
  async execute(): Promise<ActionResult> {
    try {
      const fields = this.props.submitAction.fields as {
        eventType?: { value?: string };
        cdpInactivityMinutes?: { value?: string };
        errorMessage?: { value?: string };
      };

      const eventType = fields.eventType?.value;
      if (!eventType) {
        console.warn('[CDP] No event type specified, skipping Personalization Submit Action Event');
        return { success: true };
      }

      const attributes = this.props.submitAction.attributes.map((attr) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fields = attr.fields as any;
        return {
          key: fields?.key?.value,
          constantValue: normalizeGuid(fields?.constantValue?.id),
          constantText: fields?.constantText?.value,
        };
      });
      const actionPayload = buildPersonalizePayload({
        eventType,
        attributes,
      });

      if (!actionPayload) {
        console.warn('[CDP] No payload generated, skipping event');
        return { success: true };
      }

      await event(actionPayload)
        .then(() =>
          console.log('[CDP] Personalize Form Action ' + eventType + '  Payload:', actionPayload)
        )
        .catch((err) =>
          console.error('[CDP] Personalize Form Action ' + eventType + ' error:', err)
        );
      console.log('[CDP] Personalize Form Action ' + eventType + ' fired successfully');

      const isSubmitEventType = eventType === FormsConstants.AW.Form.CCPFormSubmitEventType; // use your actual submit event name

      // STOP ABANDON TIMER, Clear session values on submit
      if (isSubmitEventType) {
        stopTimer();
        sessionStorage.removeItem(FormsConstants.AW.Form.CCPFormStep);
        sessionStorage.removeItem(FormsConstants.AW.Form.CCPFormTimeout);
        sessionStorage.removeItem(FormsConstants.AW.Form.CCPFormCompleted);

        // remove CCP experience session keys on submit
        sessionStorage.removeItem(FormsConstants.AW.Form.CCPFormFromExperience);
        sessionStorage.removeItem(FormsConstants.AW.Form.CCPFormExperienceId);
      }
      return {
        success: true,
        errorMessage: this.props.submitAction.fields?.errorMessage?.value,
      };
    } catch (error) {
      console.error('[CDP] Event error:', error);

      return {
        success: false,
        errorMessage:
          this.props.submitAction.fields?.errorMessage?.value ||
          'Failed to send personalization event',
      };
    }
  }
}
