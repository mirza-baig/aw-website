import { identity } from '@sitecore-content-sdk/events';
import { buildPersonalizeIdentifyPayload } from 'lib/personalize/build-personalize-identify-payload';

import { ActionProps, ActionResult } from '..';
import { BaseSubmitAction } from '../base-submit-action';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export class SendPersonalizeIdentify extends BaseSubmitAction<Sitecore.BaseTemplates.BaseSubmitAction> {
  async execute(props: ActionProps): Promise<ActionResult> {
    try {
      const attributes = (this.props?.submitAction?.attributes ?? []).map((attr) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fields = attr.fields as any;
        const key = fields?.key?.value;

        // Constant Attribute
        if (fields?.constantText?.value) {
          return {
            key,
            value: fields.constantText.value,
          };
        }

        // Field selected from Experience Forms
        const efValue = fields?.['ef-value'];
        const fieldName = efValue?.fields?.fieldName?.value;
        return {
          key,
          value: fieldName ? props.formValues?.[fieldName] : '',
        };
      });

      const payload = buildPersonalizeIdentifyPayload({
        formValues: props.formValues,
        attributes,
      });

      if (!payload) {
        return {
          success: false,
          errorMessage: 'Unable to generate personalization identify payload',
        };
      }
      await identity(payload);
      return {
        success: true,
      };
    } catch (error) {
      console.error('[CDP] Personalize Identify error:', error);
      return {
        success: false,
        errorMessage:
          this.props?.submitAction?.fields?.errorMessage?.value || 'Failed to identify visitor',
      };
    }
  }
}
