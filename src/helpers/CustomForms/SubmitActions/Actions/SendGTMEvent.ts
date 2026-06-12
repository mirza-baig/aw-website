import { Field } from '@sitecore-content-sdk/nextjs';
import { findFieldsByIds } from 'lib/custom-forms/FormActions';
import { FormFieldProps } from 'lib/custom-forms/FormFieldProps';
import TagManager from 'react-gtm-module';

import { BaseSubmitAction, BaseSubmitProps, ExecutionResult } from '../BaseSubmitAction';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ExtendedActionFieldProps = {
  gtmEventName: Field<string>;
  children: Array<Record<string, unknown>>;
} & Sitecore.BaseTemplates.BaseSubmitAction['fields'];

export class SendGTMEvent extends BaseSubmitAction {
  constructor(params: BaseSubmitProps) {
    super(params);
  }

  override actionFieldsProps: ExtendedActionFieldProps = this.actionFieldsProps;

  override async executeAction(): Promise<ExecutionResult> {
    TagManager.dataLayer({
      dataLayer: {
        event: this.actionFieldsProps?.gtmEventName?.value ?? '',
        form_name: this.formProps?.fields?.formName?.value ?? '',
        ...this.getAdditionalParametersToSend(),
        form_submit_text: this.submitButtonProps?.fields?.label?.value ?? '',
      },
    });

    return {
      success: true,
      errorMessage: this.actionFieldsProps?.errorMessage?.value,
    };
  }

  private getAdditionalParametersToSend(): Record<string, unknown> {
    // Create fieldId and GTM parameter mappings
    const fieldIdParameterMappings: Record<string, unknown> =
      this.actionFieldsProps.children.reduce(
        (
          parameterMappings: Record<string, unknown>,
          inputFieldAttribute: Sitecore.Forms.GenericFormBuilder.Attributes.FieldAttribute
        ) => {
          parameterMappings[
            inputFieldAttribute.fields?.['ef-value']?.id as keyof typeof parameterMappings
          ] = inputFieldAttribute.fields?.key.value;
          return parameterMappings;
        },
        {}
      );

    // Get array of field IDs to map
    const fieldIdsToMap = Object.keys(fieldIdParameterMappings).map((fieldId: string) => fieldId);

    // Create field ID and value mappings
    const fieldIdValueMappings = Object.entries(
      findFieldsByIds(this.formProps as unknown as FormFieldProps, fieldIdsToMap)
    ).reduce((idValueMappings: Record<string, unknown>, fieldItem) => {
      idValueMappings[fieldItem[0]] = this.getFieldValueById(
        fieldItem[1] as Sitecore.FieldSets.Forms.FieldNameSettings
      );

      return idValueMappings;
    }, {});

    return fieldIdsToMap.reduce(
      (additionalGTMParameters: Record<string, unknown>, fieldId: string) => {
        additionalGTMParameters[
          fieldIdParameterMappings[fieldId] as keyof typeof additionalGTMParameters
        ] = fieldIdValueMappings[fieldId];
        return additionalGTMParameters;
      },
      {}
    );
  }

  private getFieldValueById(
    fieldItem: Sitecore.FieldSets.Forms.FieldNameSettings
  ): Record<string, unknown> {
    return this.formData[fieldItem.fields?.fieldName.value ?? ''];
  }
}
