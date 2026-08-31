import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { getFieldNameForAttribute } from 'lib/generic-form-builder/utils/get-field-name-for-attribute';
import { resolveAttributeValue } from 'lib/tracking/resolve-attribute-value';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import TagManager from 'react-gtm-module';

import { ActionProps, ActionResult } from '..';
import { BaseSubmitAction } from '../base-submit-action';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type SendGtmEventProps = Sitecore.Forms.GenericFormBuilder.SubmitActions.SendGtmevent & {
  attributes: (
    | Sitecore.Forms.GenericFormBuilder.Attributes.FieldAttribute
    | Sitecore.Forms.GenericFormBuilder.Attributes.ConstantAttribute
  )[];
};

function isConstantAttribute(
  attribute:
    | Sitecore.Forms.GenericFormBuilder.Attributes.FieldAttribute
    | Sitecore.Forms.GenericFormBuilder.Attributes.ConstantAttribute
): attribute is Sitecore.Forms.GenericFormBuilder.Attributes.ConstantAttribute {
  return !!attribute.fields && 'constantText' in attribute.fields;
}

export class SendGtmEvent extends BaseSubmitAction<SendGtmEventProps> {
  AttributeConstants =
    SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums.Forms
      .Attributes.AttributeConstants;
  referrer = resolveAttributeValue(this.AttributeConstants.Referrer.Id);
  currentStep = resolveAttributeValue(this.AttributeConstants.CurrentStep.Id);

  async execute(props: ActionProps): Promise<ActionResult> {
    const attributeParams = this.props.submitAction.attributes.reduce(
      (acc, attribute) => {
        if (!attribute.fields || !('constantText' in attribute.fields)) {
          return acc;
        }
        const key = attribute?.fields?.key?.value;
        const value = attribute.fields.constantValue?.id
          ? resolveAttributeValue(attribute.fields.constantValue.id, key)
          : attribute.fields.constantText?.value;
        if (key && value !== undefined) {
          acc[key] = value;
        }

        return acc;
      },
      {} as Record<string, unknown>
    );

    TagManager.dataLayer({
      dataLayer: {
        event: this.props.submitAction.fields?.gtmEventName.value ?? '',
        form_name: props.formDetails.name ?? '',
        ...this.getAdditionalParametersToSend(props),
        ...attributeParams,
        form_submit_text: props.submitButton?.fields?.label.value ?? '',
      },
    });

    return { success: true, errorMessage: this.props.submitAction.fields?.errorMessage.value };
  }

  private getAdditionalParametersToSend(props: ActionProps): Record<string, unknown> {
    const additionalParameters = this.props.submitAction.attributes.reduce(
      (parameters, attribute) => {
        // Check ConstantAttribute
        if (isConstantAttribute(attribute)) {
          return parameters;
        }
        const key = attribute.fields?.key.value;
        if (isNullOrWhitespace(key)) {
          return parameters;
        }
        const fieldName = getFieldNameForAttribute(attribute);
        if (fieldName == undefined) {
          return parameters;
        }
        parameters[key] = props.formValues[fieldName];
        return parameters;
      },
      {} as Record<string, unknown>
    );

    return additionalParameters;
  }
}
