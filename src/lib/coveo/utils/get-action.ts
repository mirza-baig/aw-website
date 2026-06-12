import { RuleAction } from 'lib/rules/rule-action';
import { RuleContext } from 'lib/rules/rule-context';

import { BaseBoostAction } from '../expressions/actions/base-boost-action';

export function getAction<TContext extends RuleContext>(
  ruleAction: RuleAction<TContext>
): RuleAction<TContext> | null {
  let baseBoostAction: BaseBoostAction<TContext> | null = null;
  if (ruleAction instanceof BaseBoostAction) {
    baseBoostAction = ruleAction as BaseBoostAction<TContext>;
  }
  return baseBoostAction;
}
