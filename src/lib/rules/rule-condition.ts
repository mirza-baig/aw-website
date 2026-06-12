import { RuleContext } from './rule-context';
import { RuleStack } from './rule-stack';

export abstract class RuleCondition<TContext extends RuleContext> {
  uid?: string;
  id?: string;

  abstract evaluate(ruleContext: TContext, stack: RuleStack): void;

  canEvaluate(_ruleContext: TContext) {
    return true;
  }
}
