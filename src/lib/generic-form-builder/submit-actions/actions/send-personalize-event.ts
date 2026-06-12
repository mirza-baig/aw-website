import { event } from '@sitecore-content-sdk/events';
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
        errorMessage?: { value?: string };
      };

      const eventType = fields.eventType?.value;
      if (!eventType) {
        console.warn('[CDP] No event type specified, skipping Personalization Submit Event');
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
      const submitPayload = buildPersonalizePayload({
        eventType,
        attributes,
      });

      if (!submitPayload) {
        console.warn('[CDP] No payload generated, skipping event');
        return { success: true };
      }

      await event(submitPayload)
        .then(() => console.log('[CDP] Personalize Form Submit Event Payload:', submitPayload))
        .catch((err) => console.error('[CDP] Personalize Form Submit Event error:', err));
      console.log('[CDP] Personalize Form Submit Event fired successfully');

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
