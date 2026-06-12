import { Field } from '@sitecore-content-sdk/nextjs';

import { BaseSubmitAction, BaseSubmitProps, ExecutionResult } from '../BaseSubmitAction';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type FieldNameMapping = { fields: { fieldName: Field<string> } };

type ExtendedActionFieldProps = {
  referralInformationFields: Array<FieldNameMapping>;
  referrerInformationFields: Array<FieldNameMapping>;
} & Sitecore.BaseTemplates.BaseSubmitAction['fields'];

enum FieldSourceType {
  Advocate = 'referrerInformationFields',
  Referral = 'referralInformationFields',
}

type ObjectField = { [key: string]: unknown };

type PayloadProps = {
  formData: {
    advocate: ObjectField;
    referral: ObjectField;
  };
};

export class ReferralConsultation extends BaseSubmitAction {
  constructor(params: BaseSubmitProps) {
    super(params);
  }

  override actionFieldsProps: ExtendedActionFieldProps = this.actionFieldsProps;

  override async executeAction(): Promise<ExecutionResult> {
    const payload: string = JSON.stringify(this.getPayload());

    // If error occurs while constructing payload, reject the promise
    if (!payload) {
      throw new Error(`Error: ${this.actionFieldsProps?.errorMessage?.value}`);
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    };

    const response = await fetch(`/api/rba/submit-actions/referral-consultation`, requestOptions);

    return {
      success: response.status === 200,
      errorMessage: this.actionFieldsProps?.errorMessage?.value,
    };
  }

  private getPayload(): PayloadProps | undefined {
    try {
      return {
        formData: {
          advocate: {
            ...this.extractFieldMappings(FieldSourceType.Advocate),
          },
          referral: {
            ...this.extractFieldMappings(FieldSourceType.Referral),
          },
        },
      };
    } catch (_error) {
      console.error(
        'Error in constructing payload for "REFERRAL CONSULTATION" submit action',
        _error
      );
      return undefined;
    }
  }

  private extractFieldMappings(sourceType: FieldSourceType): ObjectField {
    const _mappedFields: ObjectField = {};

    this.actionFieldsProps?.[sourceType].forEach(
      (infoField) =>
        (_mappedFields[infoField.fields.fieldName.value as keyof typeof _mappedFields] =
          this?.formData[infoField.fields.fieldName.value])
    );

    return _mappedFields;
  }
}
