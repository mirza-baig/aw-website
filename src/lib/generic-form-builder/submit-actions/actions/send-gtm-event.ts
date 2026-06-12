import { getFieldNameForAttribute } from 'lib/generic-form-builder/utils/get-field-name-for-attribute';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';
import TagManager from 'react-gtm-module';

import { ActionProps, ActionResult } from '..';
import { BaseSubmitAction } from '../base-submit-action';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type SendGtmEventProps = Sitecore.Forms.GenericFormBuilder.SubmitActions.SendGtmevent & {
  attributes: Sitecore.Forms.GenericFormBuilder.Attributes.FieldAttribute[];
};

export class SendGtmEvent extends BaseSubmitAction<SendGtmEventProps> {
  async execute(props: ActionProps): Promise<ActionResult> {
    TagManager.dataLayer({
      dataLayer: {
        event: this.props.submitAction.fields?.gtmEventName.value ?? '',
        form_name: props.formDetails.name ?? '',
        ...this.getAdditionalParametersToSend(props),
        form_submit_text: props.submitButton?.fields?.label.value ?? '',
      },
    });

    return { success: true, errorMessage: this.props.submitAction.fields?.errorMessage.value };
  }

  private getAdditionalParametersToSend(props: ActionProps): Record<string, unknown> {
    const additionalParameters = this.props.submitAction.attributes.reduce(
      (parameters, attribute) => {
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
