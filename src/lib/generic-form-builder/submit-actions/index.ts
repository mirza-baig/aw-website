import { FormikValues } from 'formik';

import { FormPage } from '../form-props';
import { Recaptcha } from './actions/recaptcha';
import { RedirectToUrl } from './actions/redirect-to-url';
import { SalesforceWebToLead } from './actions/salesforce-web-to-lead';
import { SaveToDatabase } from './actions/save-to-database';
import { SendEmail } from './actions/send-email';
import { SendGtmEvent } from './actions/send-gtm-event';
import { SendPersonalizeEvent } from './actions/send-personalize-event';
import { SFMCTransactionalMessagingSendEmail } from './actions/sfmc-transactional-messaging-send-email';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type SubmitActionProps<T> = {
  submitAction: T & {
    id: string;
    attributes: (Sitecore.Forms.GenericFormBuilder.Attributes.FieldAttribute & {
      id: string;
    })[];
  };
};

type Constructor<TIn, TOut> = new (props: SubmitActionProps<TIn>) => TOut;

export type ActionResult = {
  result?: unknown;
  success: boolean;
  errorMessage?: string;
  verificationResult?: Record<string, unknown>;
  nextPageIndex?: number;
};

export type ContextValue = {
  id: string;
  name: string;
  type: string;
  value: string;
};

export type ActionProps = {
  formValues: FormikValues;
  formDetails: { id?: string; name?: string };
  submitButton?: Sitecore.Forms.GenericFormBuilder.Navigation.NavigationButton.NavigationButton;
  sessionId: string;
  context: Record<string, ContextValue>;
  isCustomForm?: boolean;
  formPages: FormPage[];
};

export interface ISubmitAction {
  execute(props: ActionProps): Promise<ActionResult>;
  //setActionCookie(cookieValue: unknown): void;
}

const map = new Map<string, Constructor<Sitecore.BaseTemplates.BaseSubmitAction, ISubmitAction>>();
map.set('{32D8793A-9B8C-4F3B-93AF-1E3152D541D0}', Recaptcha);
map.set('{697FDF5E-3CC5-424B-8C23-35168960868D}', RedirectToUrl);
map.set('{2F3D2E87-9934-41E8-AD21-668B13363F5C}', SalesforceWebToLead);
map.set('{5D7539C5-2604-43EF-B78B-E303081D4751}', SaveToDatabase);
map.set('{EDBD20E6-0A0D-40D6-9C07-B60047452657}', SendEmail);
map.set('{6233DDBB-1C52-4429-B417-D87AD9F4CD52}', SendGtmEvent);
map.set('{E4CD7119-60DB-4196-8316-658B3A1A33AA}', SFMCTransactionalMessagingSendEmail);
map.set('{EF145B4E-1090-4654-9DE7-FC3240130235}', SendPersonalizeEvent); // Default to SendEmail if no template ID provided

export const submitActionFactory = (
  submitAction: Sitecore.BaseTemplates.BaseSubmitAction & {
    id: string;
    attributes: (Sitecore.Forms.GenericFormBuilder.Attributes.FieldAttribute & {
      id: string;
    })[];
  }
) => {
  if (submitAction.fields?._AW_TemplateId == undefined) {
    console.error(`No template ID defined for ${JSON.stringify(submitAction)}`);
    return undefined;
  }

  const classType = map.get(submitAction.fields._AW_TemplateId.value);
  if (classType == undefined) {
    console.error(`No provider handler defined for '${submitAction.fields._AW_TemplateId.value}'`);
    return undefined;
  }

  return new classType({ submitAction });
};
