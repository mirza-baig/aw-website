import { XmlElement } from '@rgrove/parse-xml/dist/lib/XmlElement';
import { SitecoreIds } from 'lib/constants/sitecore-ids';

import { RuleContext } from '../../rule-context';
import { WhenCondition } from './when-condition';

export class WhenTemplateIs<TContext extends RuleContext> extends WhenCondition<TContext> {
  public readonly templateId: string;

  constructor(element: XmlElement) {
    super();
    this.templateId = element.attributes.templateid ?? SitecoreIds.Null;
  }

  execute(_ruleContext: TContext): boolean {
    throw new Error('Method not implemented.');
  }
}
