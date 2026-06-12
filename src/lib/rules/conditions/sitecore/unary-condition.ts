import { RuleCondition } from '../../rule-condition';
import { RuleContext } from '../../rule-context';
import { RuleStack } from '../../rule-stack';

export abstract class UnaryCondition<T extends RuleContext> extends RuleCondition<T> {
  public readonly operand: RuleCondition<T>;

  constructor(operand: RuleCondition<T>) {
    super();
    this.operand = operand;
  }

  evaluate(ruleContext: T, stack: RuleStack) {
    this.operand.evaluate(ruleContext, stack);
  }

  canEvaluate(ruleContext: T) {
    return this.operand.canEvaluate(ruleContext);
  }
}
