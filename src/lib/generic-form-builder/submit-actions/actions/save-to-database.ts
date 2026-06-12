import { FormField, isStandardField } from 'lib/generic-form-builder/form-props';

import { ActionProps, ActionResult } from '..';
import { BaseSubmitAction } from '../base-submit-action';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type FieldProps = {
  fieldId: string;
  name: string;
  type: string;
  value: string | Array<string>;
};

type SaveToDatabasePayload = {
  formId?: string;
  sessionId: string;
  name: string;
  lines?: Array<FieldProps>;
};

export class SaveToDatabase extends BaseSubmitAction<Sitecore.Forms.GenericFormBuilder.SubmitActions.SavetoDatabase> {
  private getPayload(props: ActionProps): SaveToDatabasePayload {
    return {
      formId: props.formDetails.id,
      sessionId: props.sessionId ?? '',
      name: props.formDetails.name ?? '',
      lines: this.getFieldData(props),
    };
  }

  private getFieldData(props: ActionProps): Array<FieldProps> {
    const lines: Array<FieldProps> = [];

    props.formPages.forEach((page) =>
      page.fields.forEach((field: FormField) => {
        if (isStandardField(field)) {
          lines.push({
            fieldId: field.id,
            name: field.name,
            type: field.templateName,
            value: props.formValues[field.name].toString(),
          });
        } else {
          field.subfields.forEach((subfield) => {
            lines.push({
              fieldId: subfield.id,
              name: field.prefix ? `${field.prefix}-${subfield.name}` : subfield.name,
              type: field.templateName,
              value: props.formValues[subfield.name].toString(),
            });
          });
        }
      })
    );
    // Add Context entries
    for (const key of Object.keys(props.context)) {
      const entry = props.context[key];
      lines.push({
        fieldId: entry.id,
        name: entry.name,
        type: entry.type,
        value: entry.value,
      });
    }

    return lines;
  }

  async execute(props: ActionProps): Promise<ActionResult> {
    const payload: string = JSON.stringify(this.getPayload(props));

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    };

    const response = await fetch(
      `/api/aw/generic-form-builder/submit-actions/save-to-database`,
      requestOptions
    );

    return {
      success: response.status === 201,
      errorMessage: this.props.submitAction.fields?.errorMessage.value,
    };
  }
}
