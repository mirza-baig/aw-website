import { identity } from '@sitecore-content-sdk/events';
import { FormikValues } from 'formik';
import { buildPersonalizeIdentifyPayload } from 'lib/personalize/build-personalize-identify-payload';

import { ActionProps, ActionResult } from '..';
import { BaseSubmitAction } from '../base-submit-action';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type AttributeItem = {
  key?: string;
  value?: string | boolean | number;
};

type FieldAttribute = Sitecore.Forms.GenericFormBuilder.Attributes.FieldAttribute;

const mapExtensionAttributes = (
  attributes: FieldAttribute[],
  formValues: FormikValues
): AttributeItem[] =>
  attributes.map((attr) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields = attr?.fields as any;
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
      value: fieldName ? formValues?.[fieldName] : '',
    };
  });

/**
 * The submit action fields point to form fields.
 * Pull the fieldName from the items linked to these fields.
 * If the field is not pointing to anything, do not set the form key-value pair.
 */
const mapFieldAttributes = (
  fields: Record<string, FieldAttribute | undefined>,
  formValues: FormikValues
): AttributeItem[] =>
  Object.entries(fields)
    .filter((entry): entry is [string, FieldAttribute] => entry[1] != null)
    // Skip entries that do not point at a form field
    .filter(([key, attr]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldName = (attr?.fields as any)?.fieldName?.value as string | undefined;
      return Boolean(key && fieldName);
    })
    .map(([key, attr]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fieldName = (attr?.fields as any)?.fieldName?.value as string;
      return {
        key,
        value: formValues?.[fieldName] ?? '',
      };
    });

export class SendPersonalizeIdentify extends BaseSubmitAction<Sitecore.Forms.GenericFormBuilder.SubmitActions.SendPersonalizeIdentify> {
  async execute(props: ActionProps): Promise<ActionResult> {
    try {
      const extensionData = mapExtensionAttributes(
        this.props?.submitAction?.attributes ?? [],
        props.formValues
      );

      // The submit action fields are keyed by the CDP attribute name and each item
      // points at the form field to read, so they are mapped into fieldData.
      const fieldData = mapFieldAttributes(
        (this.props?.submitAction.fields ?? {}) as Record<string, FieldAttribute | undefined>,
        props.formValues
      );

      const payload = buildPersonalizeIdentifyPayload({
        formValues: props.formValues,
        extensionData: extensionData,
        fieldData: fieldData,
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
