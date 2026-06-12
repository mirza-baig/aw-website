import config from 'aw.config.client';
import FIELD_IDS from 'lib/constants/salesforce-field-ids';
import { translateFieldMappings } from 'lib/custom-forms/FormActions';
import { FormProps } from 'lib/custom-forms/FormProps';
import { getCookie } from 'lib/utils/client-storage-utils/get-cookie';
import { getEnum } from 'lib/utils/get-enum';

import { BaseSubmitAction, BaseSubmitProps, ExecutionResult } from '../BaseSubmitAction';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export class SalesforceWebToLead extends BaseSubmitAction {
  constructor(params: BaseSubmitProps) {
    super(params);
  }

  override async executeAction(isCustomForm?: boolean): Promise<ExecutionResult> {
    if (isCustomForm) {
      // If triggered from custom-forms, we expect this.formData to be in formatted to expected WebToLeadForm Schema
      this.submitWebToLeadForm(this.generateWebToLeadForm(this.formData));
      return {
        success: true,
        errorMessage: 'Error while processing your request.',
      };
    } else {
      this.submitWebToLeadForm(this.generateWebToLeadForm(this.generateWebToLeadData()));
      return {
        success: true,
        errorMessage: this.actionFieldsProps?.errorMessage?.value,
      };
    }
  }

  private generateWebToLeadData(): Record<string, string> {
    const webToLeadData: Record<string, string> = translateFieldMappings(
      this.formProps as FormProps,
      this.formData,
      this.actionFieldsProps
    );

    const _salesforceSubmitFields = this
      .actionFieldsProps as Sitecore.Forms.GenericFormBuilder.SubmitActions.SalesforceWebtoLead['fields'];

    const recordType = getEnum<string>(_salesforceSubmitFields?.recordType) ?? '';
    // 00N500000020bSh is the Salesforce field id for User Type
    const userType = webToLeadData['00N500000020bSh'] ?? '';
    const tradeType = webToLeadData['trade_pro_type'] ?? '';
    const campaignId: string = getCookie('awCampaignId') as string;
    const campaignIdValue = campaignId ?? _salesforceSubmitFields?.campaignIds?.value ?? '';

    webToLeadData[FIELD_IDS.CAMPAIGNIDS] = campaignIdValue;

    // Use the usertype drop down value if on the page.
    if (userType.length > 0) {
      webToLeadData[FIELD_IDS.USERTYPE] = tradeType ?? userType;
      webToLeadData[FIELD_IDS.RECORDTYPE] = (FIELD_IDS as Record<string, string>)[
        userType.replace(' ', '').toUpperCase()
      ];
    } else {
      webToLeadData[FIELD_IDS.USERTYPE] = _salesforceSubmitFields?.userType?.value ?? '';
      webToLeadData[FIELD_IDS.RECORDTYPE] = (FIELD_IDS as Record<string, string>)[
        recordType.toUpperCase()
      ];
    }

    webToLeadData[FIELD_IDS.PROCESSSTATE] = 'New';
    webToLeadData[FIELD_IDS.SESSIONDATA] =
      new Date() + ' /// ' + Date.now() + ' /// ' + navigator.userAgent;

    webToLeadData[FIELD_IDS.ORGID] = config.salesforce.salesCloud.orgIds.aw;

    const today = new Date();
    webToLeadData[FIELD_IDS.INTERACTIONDATE] =
      ('0' + (today.getMonth() + 1)).slice(-2) +
      '/' +
      ('0' + today.getDate()).slice(-2) +
      '/' +
      today.getFullYear();
    delete webToLeadData['trade_pro_type'];
    return webToLeadData;
  }

  private generateWebToLeadForm(webToLeadData: Record<string, string>): HTMLFormElement {
    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', config.salesforce.salesCloud.webToLeadUrl);
    Object.entries(webToLeadData).forEach((entry) => {
      const formInput = document.createElement('input');
      formInput.setAttribute('type', 'hidden');
      formInput.setAttribute('id', entry[0]);
      formInput.setAttribute('name', entry[0]);

      if (Array.isArray(entry[1])) {
        // Join array elements with pipe character and set it as the input value
        formInput.setAttribute('value', entry[1].join('|'));
      } else {
        formInput.setAttribute('value', entry[1]);
      }

      form.append(formInput);
    });

    return form;
  }

  private submitWebToLeadForm(form: HTMLFormElement) {
    const webToLeadFrameName = 'webToLeadFrame';

    // We've to create iFrame and set it as form's target in order to prevent redirection on form submission
    const webToLeadFrame = document.createElement('iframe');
    webToLeadFrame.setAttribute('name', webToLeadFrameName);
    webToLeadFrame.setAttribute('style', 'display: none');

    form.setAttribute('target', webToLeadFrameName);

    document.body.append(form);
    document.body.append(webToLeadFrame);

    form.submit();
    form.reset();
  }
}
