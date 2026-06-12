import { RuleCondition } from '../../rule-condition';
import { RuleContext } from '../../rule-context';
import { RuleStack } from '../../rule-stack';

export abstract class WhenCondition<T extends RuleContext> extends RuleCondition<T> {
  evaluate(ruleContext: T, stack: RuleStack) {
    stack.push(this.execute(ruleContext));
  }

  abstract execute(ruleContext: T): boolean;
}
