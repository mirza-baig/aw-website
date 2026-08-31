import { event } from '@sitecore-content-sdk/events';
import { FormsConstants } from 'lib/constants/forms-constants';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { StringConstants } from 'lib/constants/string-constants';
import { stopTimer } from 'lib/personalize/abandon-timer';
import { buildPersonalizePayload } from 'lib/personalize/build-personalize-payload';
import { clearSessionStorageItems } from 'lib/utils/session-storage';
import { normalizeGuid } from 'lib/utils/string-utils/normalize-guid';

import { ActionResult } from '..';
import { BaseSubmitAction } from '../base-submit-action';
import { Sitecore } from '.sitecore/AndersenWindows.model';
export class SendPersonalizeEvent extends BaseSubmitAction<Sitecore.BaseTemplates.BaseSubmitAction> {
  async execute(): Promise<ActionResult> {
    try {
      const fields = this.props?.submitAction?.fields as {
        eventType?: { value?: string };
        eventAction?: {
          id?: string;
          name?: string;
          displayName?: string;
          value?: string;
        };
        cdpInactivityMinutes?: { value?: string };
        errorMessage?: { value?: string };
      };

      const eventType = fields?.eventType?.value;
      if (!eventType) {
        console.warn('[CDP] No event type specified, skipping Personalization Submit Action Event');
        return { success: true };
      }

      const attributes = (this.props?.submitAction?.attributes ?? []).map((attr) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fields = attr?.fields as any;
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

      const eventAction = fields?.eventAction?.id;
      const isSubmitEventType =
        normalizeGuid(eventAction) ===
        normalizeGuid(
          SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums.Forms
            .EventActions.Submit.Id
        );
      // STOP ABANDON TIMER, Clear session values on submit
      if (isSubmitEventType) {
        stopTimer();

        // Mark abandon as already triggered to prevent double fire.
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem(StringConstants.AW.GFBForm.AbandonEventTriggered, 'true');
        }

        clearSessionStorageItems([
          // Abandon Event sessions
          FormsConstants.AW.Form.CCPFormStep,
          FormsConstants.AW.Form.CCPFormTimeout,
          FormsConstants.AW.Form.CCPFormCompleted,

          // remove CCP experience session keys on submit
          FormsConstants.AW.Form.CCPFormFromExperience,
          FormsConstants.AW.Form.CCPFormExperienceId,

          // Remove the active journey so no event is fired after a successful submit.
          StringConstants.AW.GFBForm.ActiveJourneyKey,
          StringConstants.AW.GFBForm.AbandonPayloadKey,
        ]);
      }
      return {
        success: true,
        errorMessage: this.props?.submitAction?.fields?.errorMessage?.value,
      };
    } catch (error) {
      console.error('[CDP] Event error:', error);

      return {
        success: false,
        errorMessage:
          this.props?.submitAction?.fields?.errorMessage?.value ||
          'Failed to send personalization event',
      };
    }
  }
}
