import { ActionResult } from '..';
import { BaseSubmitAction } from '../base-submit-action';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export class RedirectToUrl extends BaseSubmitAction<Sitecore.Forms.GenericFormBuilder.SubmitActions.RedirecttoUrl> {
  async execute(): Promise<ActionResult> {
    const redirectUrlLink = this.props.submitAction.fields?.targetURL;

    const queryString = redirectUrlLink?.value.querystring?.startsWith('?')
      ? redirectUrlLink?.value.querystring?.substring(1)
      : redirectUrlLink?.value.querystring;

    const redirectTarget = redirectUrlLink?.value.target;

    window.open(
      `${redirectUrlLink?.value.href}${queryString && '?' + queryString}`,
      `${redirectTarget !== '' ? redirectTarget : '_self'}`
    );

    return { success: true };
  }
}
