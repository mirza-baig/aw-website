import { FormikValues } from 'formik';
import { getFieldNameForAttribute } from 'lib/generic-form-builder/utils/get-field-name-for-attribute';
import { getEnum } from 'lib/utils/get-enum';
import { createUUID } from 'lib/utils/string-utils/create-uuid';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { ActionProps, ActionResult } from '..';
import { BaseSubmitAction } from '../base-submit-action';
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

export class SFMCTransactionalMessagingSendEmail extends BaseSubmitAction<Sitecore.Forms.GenericFormBuilder.SubmitActions.SfmctransactionalMessagingSendEmail> {
  private getPayload(formValues: FormikValues): SFMCTransactionalMessagingSendEmailPayload {
    const recipientToItem = this.props.submitAction.fields
      ?.recipientTo as unknown as Sitecore.FieldSets.Forms.FieldNameSettings;
    const recipientToFieldName = recipientToItem?.fields?.fieldName.value ?? '';
    const recipientTo = formValues[recipientToFieldName] ?? null;

    return {
      definitionKey: this.props.submitAction.fields?.definitionKey.value ?? '',
      account: getEnum<string>(this.props.submitAction.fields?.account) ?? '',
      recipient: {
        contactKey: createUUID().replace(/-/, ''),
        to: recipientTo,
        attributes: this.getAttributes(formValues),
      },
    };
  }

  private getAttributes(formValues: FormikValues): Attributes {
    const attributes: Attributes = {};

    this.props.submitAction.attributes.forEach((attribute) => {
      const key = attribute.fields?.key.value;
      if (isNullOrWhitespace(key)) {
        return;
      }
      const fieldName = getFieldNameForAttribute(attribute);
      if (fieldName == undefined) {
        return;
      }

      const fieldValue = formValues[fieldName];

      if (Array.isArray(fieldValue)) {
        // TODO: All vlues
        // getKeyValuePairList(formField).forEach((option: { [key: string]: string }) => {
        //   attributes[`${key}_${option.value}`] = fieldValue.includes(option.value);
        // });
        fieldValue.forEach((value: string) => {
          attributes[`${key}_${value}`] = true;
        });
      } else {
        attributes[key] = fieldValue;
      }
    });

    return attributes;
  }

  async execute(props: ActionProps): Promise<ActionResult> {
    const payload: string = JSON.stringify(
      props.isCustomForm ? props.formValues : this.getPayload(props.formValues)
    );

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    };

    const response = await fetch(
      `/api/aw/generic-form-builder/submit-actions/sfmc-transactional-messaging-send-email`,
      requestOptions
    );

    return {
      success: response.status === 200,
      errorMessage: props.isCustomForm
        ? '<p>Error while processing your request.</p>'
        : this.props.submitAction.fields?.errorMessage.value,
    };
  }
}
