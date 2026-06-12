import { RuleContext } from '../../rule-context';
import { RuleStack } from '../../rule-stack';
import { BinaryCondition } from './binary-condition';

export class OrCondition<TContext extends RuleContext> extends BinaryCondition<TContext> {
  evaluate(ruleContext: TContext, stack: RuleStack) {
    this.leftOperand.evaluate(ruleContext, stack);
    if (stack.pop()) {
      stack.push(true);
    } else {
      this.rightOperand.evaluate(ruleContext, stack);
    }
  }
}
