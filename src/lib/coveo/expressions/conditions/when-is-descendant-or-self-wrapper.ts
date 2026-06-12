import { WhenIsDescendantOrSelf } from 'lib/rules/conditions/sitecore/when-is-descendant-or-self';
import { RuleContext } from 'lib/rules/rule-context';
import { SitecoreId } from 'lib/utils/sitecore-utils/sitecore-id';

import { CoveoFields } from '../../constants';
import { QueryNodeOperator } from '../query-nodes/query-node-operator';
import { FieldConditionWrapper } from './field-condition-wrapper';

export class WhenIsDescendantOrSelfWrapper<
  TContext extends RuleContext,
> extends FieldConditionWrapper<TContext, WhenIsDescendantOrSelf<TContext>> {
  protected getQueryNodeFieldName() {
    return CoveoFields.PathIds;
  }

  protected getQueryNodeOperator(): QueryNodeOperator {
    return QueryNodeOperator.Equal;
  }

  protected getQueryNodeValue(): string {
    return new SitecoreId(this.condition.itemId).toShortId();
  }
}
