import { getCondition } from 'lib/coveo/utils/get-condition';
import { NotCondition } from 'lib/rules/conditions/sitecore/not-condition';
import { RuleContext } from 'lib/rules/rule-context';

import { NotNode } from '../query-nodes/not-node';
import { ConditionWrapper } from './condition-wrapper';
import { CoveoCondition } from './coveo-condition';

export class NotConditionWrapper<TContext extends RuleContext> extends ConditionWrapper<
  NotCondition<TContext>
> {
  protected get operand(): CoveoCondition {
    return getCondition(this.condition.operand);
  }

  public getQueryNode() {
    return new NotNode(this.operand.getQueryNode());
  }
}
