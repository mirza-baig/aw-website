import { Field } from '@sitecore-content-sdk/nextjs';
import { FormFieldProps } from 'lib/custom-forms/FormFieldProps';
import { formatDateToCustomFormat, replacePlaceholders } from 'lib/custom-forms/FormFieldUtils';

import { BaseSubmitAction, BaseSubmitProps, ExecutionResult } from '../BaseSubmitAction';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type SendEmailPayload = {
  to: string[];
  from: string;
  subject: string;
  body: string;
};

type EmailFields = Sitecore.Forms.GenericFormBuilder.SubmitActions.SendEmail['fields'];

export class SendEmail extends BaseSubmitAction {
  constructor(params: BaseSubmitProps) {
    super(params);
  }

  private getSubstitutedValue(fieldName: keyof EmailFields): string {
    const actionFieldsProps = this.actionFieldsProps as EmailFields;

    this.formProps?.fields.children.forEach((page) =>
      page.fields?.children.forEach((field: FormFieldProps) => {
        if (field.templateName === 'Date' && field.fields.fieldName?.value.trim()) {
          const dateField = field.fields.fieldName?.value;
          this.formData[dateField] = formatDateToCustomFormat(this.formData[dateField]);
        }
      })
    );

    if (actionFieldsProps) {
      return replacePlaceholders(
        (actionFieldsProps[fieldName] as Field<string>)?.value,
        this.formData,
        true
      );
    }
    return '';
  }

  private preparePayload(): SendEmailPayload {
    const toEmailAddresses = this.getSubstitutedValue('toEmailAddress' as keyof EmailFields)
      .split('\r\n')
      .filter((email) => email !== '');
    const fromEmailAddress = this.getSubstitutedValue('fromEmailAddress' as keyof EmailFields);
    const emailSubject = this.getSubstitutedValue('emailSubject' as keyof EmailFields);
    const emailBody = this.getSubstitutedValue('emailBody' as keyof EmailFields);

    return {
      to: toEmailAddresses,
      from: fromEmailAddress,
      subject: emailSubject,
      body: emailBody,
    };
  }

  override async executeAction(): Promise<ExecutionResult> {
    const payload: SendEmailPayload = this.preparePayload();
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`/api/aw/custom-forms/submit-actions/send-email`, requestOptions);

    return {
      success: response.status === 200,
      errorMessage: this.actionFieldsProps?.errorMessage?.value ?? '',
    };
  }
}
