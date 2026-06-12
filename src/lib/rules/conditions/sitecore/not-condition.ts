import { RuleContext } from '../../rule-context';
import { RuleStack } from '../../rule-stack';
import { UnaryCondition } from './unary-condition';

export class NotCondition<TContext extends RuleContext> extends UnaryCondition<TContext> {
  evaluate(ruleContext: TContext, stack: RuleStack) {
    this.operand.evaluate(ruleContext, stack);
    const result = stack.pop();
    stack.push(!result);
  }
}
