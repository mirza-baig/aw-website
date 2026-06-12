import { RuleContext } from '../../rule-context';
import { RuleStack } from '../../rule-stack';
import { BinaryCondition } from './binary-condition';

export class AndCondition<TContext extends RuleContext> extends BinaryCondition<TContext> {
  evaluate(ruleContext: TContext, stack: RuleStack) {
    this.leftOperand.evaluate(ruleContext, stack);
    if (!stack.pop()) {
      stack.push(false);
    } else {
      this.rightOperand.evaluate(ruleContext, stack);
    }
  }
}
