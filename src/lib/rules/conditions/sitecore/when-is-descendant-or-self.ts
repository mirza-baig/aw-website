import { XmlElement } from '@rgrove/parse-xml';
import { SitecoreIds } from 'lib/constants/sitecore-ids';

import { RuleContext } from '../../rule-context';
import { WhenCondition } from './when-condition';

export class WhenIsDescendantOrSelf<TContext extends RuleContext> extends WhenCondition<TContext> {
  public readonly itemId: string;

  constructor(element: XmlElement) {
    super();
    this.itemId = element.attributes.itemid ?? SitecoreIds.Null;
  }

  execute(_ruleContext: TContext): boolean {
    throw new Error('Method not implemented.');
  }
}
