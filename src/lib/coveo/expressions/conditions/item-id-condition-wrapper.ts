import { ItemIdCondition } from 'lib/rules/conditions/sitecore/item-id-condition';
import { RuleContext } from 'lib/rules/rule-context';
import { SitecoreId } from 'lib/utils/sitecore-utils/sitecore-id';

import { CoveoFields } from '../../constants';
import { QueryNodeOperator } from '../query-nodes/query-node-operator';
import { StringConditionWrapper } from './string-condition-wrapper';

export class ItemIdConditionWrapper<TContext extends RuleContext> extends StringConditionWrapper<
  TContext,
  ItemIdCondition<TContext>
> {
  protected getQueryNodeFieldName() {
    return CoveoFields.ItemId;
  }

  protected getQueryNodeOperator() {
    return QueryNodeOperator.ExactMatch;
  }

  protected getQueryNodeValue(): string {
    return this.getConditionStringValue();
  }

  protected getConditionStringValue(): string {
    let conditionStringValue = this.condition.value;
    if (SitecoreId.isId(conditionStringValue)) {
      const id = new SitecoreId(conditionStringValue);
      conditionStringValue = id.toShortId();
    }
    return conditionStringValue;
  }
}
