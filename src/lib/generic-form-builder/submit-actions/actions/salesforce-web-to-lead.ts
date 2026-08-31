import { Field, Item } from '@sitecore-content-sdk/nextjs';
import config from 'aw.config.client';
import FIELD_IDS from 'lib/constants/salesforce-field-ids';
import { FeatureFlags } from 'lib/feature-flags/feature-flags';
import { getCookie } from 'lib/utils/client-storage-utils/get-cookie';
import { getEnum } from 'lib/utils/get-enum';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { ActionProps, ActionResult } from '..';
import { BaseSubmitAction } from '../base-submit-action';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export class SalesforceWebToLead extends BaseSubmitAction<Sitecore.Forms.GenericFormBuilder.SubmitActions.SalesforceWebtoLead> {
  async execute(props: ActionProps): Promise<ActionResult> {
    if (props.isCustomForm) {
      // If triggered from custom-forms, we expect this.formData to be in formatted to expected WebToLeadForm Schema
      try {
        await this.submitWebToLeadForm(props.formValues as Record<string, string>);
        return {
          success: true,
          errorMessage: 'Error while processing your request.',
        };
      } catch {
        console.error('Something went wrong while submitting the Web-to-Lead form.');
        return {
          success: false,
          errorMessage: 'Error while processing your request.',
        };
      }
    } else {
      try {
        await this.submitWebToLeadForm(this.generateWebToLeadData(props));
        return {
          success: true,
          errorMessage: this.props.submitAction.fields?.errorMessage.value,
        };
      } catch {
        console.error('Something went wrong while submitting the Web-to-Lead form.');
        return {
          success: false,
          errorMessage: this.props.submitAction.fields?.errorMessage.value,
        };
      }
    }
  }

  private generateWebToLeadData(props: ActionProps): Record<string, string> {
    if (this.props.submitAction.fields == undefined) {
      return {};
    }

    const webToLeadData: Record<string, string> = {};
    Object.keys(this.props.submitAction.fields).forEach(
      (key: keyof typeof this.props.submitAction.fields) => {
        if (!key.startsWith('ef-')) {
          return;
        }

        let nameField: Field<string> | undefined;

        // Check for a subfield
        const subfieldKey =
          `${key.replace('ef-', '')}Subfield` as keyof typeof this.props.submitAction.fields;
        const subfieldItem = this.props.submitAction.fields![subfieldKey] as unknown as
          | {
              fields?: { Value: { value: string } };
            }
          | undefined;
        if (subfieldItem != undefined) {
          const subfieldName = subfieldItem.fields?.Value.value;
          if (isNullOrWhitespace(subfieldName)) {
            return;
          }

          const item = this.props.submitAction.fields![key] as Item | undefined;

          nameField = item?.fields?.[subfieldName] as unknown as Field<string> | undefined;
        } else {
          const item = this.props.submitAction.fields![key] as unknown as
            | Sitecore.FieldSets.Forms.FieldNameSettings
            | undefined;
          nameField = item?.fields?.fieldName;
        }

        const formKey = nameField?.value;
        if (isNullOrWhitespace(formKey)) {
          return;
        }

        const sitecoreKey = key.replace('ef-', '').toUpperCase() as keyof typeof FIELD_IDS;
        const salesforceKey = FIELD_IDS[sitecoreKey];
        if (salesforceKey == undefined) {
          return;
        }
        webToLeadData[salesforceKey] = props.formValues[formKey];
      }
    );

    const _salesforceSubmitFields = this.props.submitAction.fields;

    const recordType = getEnum<string>(_salesforceSubmitFields?.recordType) ?? '';
    // 00N500000020bSh is the Salesforce field id for User Type
    const userType = webToLeadData['00N500000020bSh'] ?? '';
    const tradeType = webToLeadData['trade_pro_type'] ?? '';
    const campaignId: string = getCookie('awCampaignId') as string;
    const campaignIdValue = (campaignId || _salesforceSubmitFields?.campaignIds?.value) ?? '';

    webToLeadData[FIELD_IDS.CAMPAIGNIDS] = campaignIdValue;

    // Use the usertype drop down value if on the page.
    if (userType.length > 0) {
      webToLeadData[FIELD_IDS.USERTYPE] = tradeType || userType;
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
      new Date() + ' /// ' + new Date().getTime() + ' /// ' + navigator.userAgent;

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

  private async submitWebToLeadForm(webToLeadData: Record<string, string>): Promise<void> {
    // Gate the fetch-based submission behind a feature flag. When disabled, fall back to
    // the legacy hidden-iFrame form submission.
    if (FeatureFlags.values.releaseRaqWebToLeadFetchMethod) {
      await this.submitViaFetch(webToLeadData);
    } else {
      this.submitViaIframe(this.generateWebToLeadForm(webToLeadData));
    }
  }

  private async submitViaFetch(webToLeadData: Record<string, string>): Promise<void> {
    // Send the lead via fetch instead of submitting an iFrame-targeted form. The iFrame
    // approach caused an extra page navigation inside the frame, which the CDP script
    // tracked as a spurious "Viewed the Home Page" page-view event.
    const body = new URLSearchParams();
    Object.entries(webToLeadData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Join array elements with pipe character and set it as the field value
        body.append(key, value.join('|'));
      } else {
        body.append(key, value ?? '');
      }
    });

    // Salesforce Web-to-Lead does not send CORS headers, so we use no-cors: the request
    // is delivered but the (opaque) response cannot be read, which is fine here.
    await fetch(config.salesforce.salesCloud.webToLeadUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
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

  private submitViaIframe(form: HTMLFormElement) {
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
