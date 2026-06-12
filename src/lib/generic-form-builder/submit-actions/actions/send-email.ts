import { Field } from '@sitecore-content-sdk/nextjs';
import { FormikValues } from 'formik';
import { isStandardField } from 'lib/generic-form-builder/form-props';
import { replacePlaceholders } from 'lib/generic-form-builder/utils/replace-placeholders';

import { ActionProps, ActionResult } from '..';
import { BaseSubmitAction } from '../base-submit-action';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type SendEmailPayload = {
  to: string[];
  from: string;
  subject: string;
  body: string;
};

function formatDateToCustomFormat(inputDate: Date) {
  if (inputDate) {
    const date = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }
  return '';
}

type EmailFields = Sitecore.Forms.GenericFormBuilder.SubmitActions.SendEmail['fields'];

export class SendEmail extends BaseSubmitAction<Sitecore.Forms.GenericFormBuilder.SubmitActions.SendEmail> {
  private getSubstitutedValue(fieldName: keyof EmailFields, values: FormikValues): string {
    const field = this.props.submitAction.fields?.[fieldName] as Field<string> | undefined;
    if (field == undefined) {
      return '';
    }
    return replacePlaceholders(field.value, values, true);
  }

  getFormattedFormValues(props: ActionProps) {
    const formValues: FormikValues = { ...props.formValues };

    props.formPages.forEach((page) => {
      page.fields.forEach((field) => {
        if (isStandardField(field) && field.templateName === 'DateField') {
          formValues[field.name] = formatDateToCustomFormat(formValues[field.name]);
        }
      });
    });

    return formValues;
  }

  private preparePayload(props: ActionProps): SendEmailPayload {
    const formattedFormValues = this.getFormattedFormValues(props);
    const toEmailAddresses = this.getSubstitutedValue(
      'toEmailAddress' as keyof EmailFields,
      formattedFormValues
    )
      .split('\r\n')
      .filter((email) => email !== '');
    const fromEmailAddress = this.getSubstitutedValue(
      'fromEmailAddress' as keyof EmailFields,
      formattedFormValues
    );
    const emailSubject = this.getSubstitutedValue(
      'emailSubject' as keyof EmailFields,
      formattedFormValues
    );
    const emailBody = this.getSubstitutedValue(
      'emailBody' as keyof EmailFields,
      formattedFormValues
    );

    return {
      to: toEmailAddresses,
      from: fromEmailAddress,
      subject: emailSubject,
      body: emailBody,
    };
  }

  async execute(props: ActionProps): Promise<ActionResult> {
    const payload: SendEmailPayload = this.preparePayload(props);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(
      `/api/aw/generic-form-builder/submit-actions/send-email`,
      requestOptions
    );

    return {
      success: response.status === 200,
      errorMessage: this.props.submitAction.fields?.errorMessage.value,
    };
  }
}
