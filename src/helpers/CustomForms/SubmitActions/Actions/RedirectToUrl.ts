import { BaseSubmitAction, BaseSubmitProps } from '../BaseSubmitAction';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export class RedirectToUrl extends BaseSubmitAction {
  constructor(params: BaseSubmitProps) {
    super(params);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override async executeAction(): Promise<any> {
    const redirectUrlLink = (
      this
        .actionFieldsProps as Sitecore.Forms.GenericFormBuilder.SubmitActions.RedirecttoUrl['fields']
    )?.targetURL;

    const queryString = redirectUrlLink?.value.querystring?.startsWith('?')
      ? redirectUrlLink?.value.querystring?.substring(1)
      : redirectUrlLink?.value.querystring;

    const redirectTarget = redirectUrlLink?.value.target;
    const url = redirectUrlLink?.value.href;
    const target = redirectTarget === '' ? '_self' : redirectTarget;

    // Only append the query string if it's present
    const fullUrl = queryString ? `${url}?${queryString}` : url;

    window.open(fullUrl, target);
  }
}
