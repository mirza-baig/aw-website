import { Field } from '@sitecore-content-sdk/nextjs';
import { findFieldById } from 'lib/custom-forms/FormActions';
import { FormFieldProps } from 'lib/custom-forms/FormFieldProps';
import { getKeyValuePairList } from 'lib/custom-forms/FormFieldUtils';
import { getEnum } from 'lib/utils/get-enum';
import { createUUID } from 'lib/utils/string-utils/create-uuid';

import { BaseSubmitAction, BaseSubmitProps, ExecutionResult } from '../BaseSubmitAction';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type Attributes = {
  [key: string]: string | boolean;
};

type SFMCTransactionalMessagingSendEmailPayload = {
  definitionKey: string;
  account: string;
  recipient: {
    contactKey: string;
    to: string;
    attributes: Attributes;
  };
};

type SFMCTransactionalMessagingSendEmailFields =
  Sitecore.Forms.GenericFormBuilder.SubmitActions.SfmctransactionalMessagingSendEmail['fields'] & {
    recipientTo: {
      fields?: {
        fieldName?: Field<string>;
      };
    };
    children: Sitecore.Forms.GenericFormBuilder.Attributes.FieldAttribute[];
  };

export class SFMCTransactionalMessagingSendEmail extends BaseSubmitAction {
  constructor(params: BaseSubmitProps) {
    super(params);
  }

  private getPayload(): SFMCTransactionalMessagingSendEmailPayload {
    const recipientTo =
      this.formData[
        (this.actionFieldsProps as SFMCTransactionalMessagingSendEmailFields).recipientTo?.fields
          ?.fieldName?.value ?? ''
      ] ?? null;

    return {
      definitionKey:
        (
          this
            .actionFieldsProps as Sitecore.Forms.GenericFormBuilder.SubmitActions.SfmctransactionalMessagingSendEmail['fields']
        )?.definitionKey?.value ?? '',
      account:
        getEnum<string>(
          (
            this
              .actionFieldsProps as Sitecore.Forms.GenericFormBuilder.SubmitActions.SfmctransactionalMessagingSendEmail['fields']
          )?.account
        ) ?? '',
      recipient: {
        contactKey: createUUID().replace(/-/, ''),
        to: recipientTo,
        attributes: this.getAttributes(),
      },
    };
  }

  private getAttributes(): Attributes {
    const attributes: Attributes = {};

    (this.actionFieldsProps as SFMCTransactionalMessagingSendEmailFields).children?.forEach(
      (childAttr) => {
        const AttributeKey = childAttr?.fields?.key?.value;

        const formField = findFieldById(
          this.formProps as unknown as FormFieldProps,
          childAttr?.fields?.['ef-value']?.id as string
        );

        const fieldValue = this.formData[formField?.fields?.fieldName?.value ?? ''];

        if (AttributeKey && formField && fieldValue) {
          if (Array.isArray(fieldValue)) {
            getKeyValuePairList(formField).forEach((option: { [key: string]: string }) => {
              attributes[`${AttributeKey}_${option.value}`] = fieldValue.includes(option.value);
            });
          } else {
            attributes[AttributeKey] = fieldValue;
          }
        }
      }
    );

    return attributes;
  }

  override async executeAction(isCustomForm?: boolean): Promise<ExecutionResult> {
    const payload: string = JSON.stringify(isCustomForm ? this.formData : this.getPayload());

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    };

    const response = await fetch(
      `/api/aw/custom-forms/submit-actions/sfmc-transactional-messaging-send-email`,
      requestOptions
    );

    return {
      success: response.status === 200,
      errorMessage: isCustomForm
        ? '<p>Error while processing your request.</p>'
        : this.actionFieldsProps?.errorMessage?.value,
    };
  }
}
