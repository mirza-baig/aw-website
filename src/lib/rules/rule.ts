import { Debug } from 'lib/constants/debug';

import { RuleAction } from './rule-action';
import { RuleCondition } from './rule-condition';
import { RuleContext } from './rule-context';
import { RuleStack } from './rule-stack';

export class Rule<TContext extends RuleContext> {
  uid: string;
  id?: string;
  actions: RuleAction<TContext>[] = [];
  condition?: RuleCondition<TContext>;

  constructor(uid: string) {
    this.uid = uid;
  }

  static fromCondtion<T extends RuleContext>(uid: string, condition: RuleCondition<T>) {
    const result = new Rule<T>(uid);
    result.condition = condition;
    return result;
  }

  static fromConditionAndAction<T extends RuleContext>(
    uid: string,
    condition: RuleCondition<T>,
    action: RuleAction<T>
  ) {
    const result = new Rule<T>(uid);
    result.condition = condition;
    result.actions = [action];
    return result;
  }

  static fromConditionAndActions<T extends RuleContext>(
    uid: string,
    condition: RuleCondition<T>,
    actions: RuleAction<T>[]
  ) {
    const result = new Rule<T>(uid);
    result.condition = condition;
    result.actions = [...actions];
    return result;
  }

  /// <summary>Evaluates this instance.</summary>
  /// <param name="ruleContext">The rule context.</param>
  /// <returns><c>true</c>, if the condition is true, otherwise <c>false</c>.</returns>
  evaluate(ruleContext: TContext): boolean {
    if (this.condition == undefined) {
      return false;
    }

    const stack = new RuleStack();
    try {
      this.condition.evaluate(ruleContext, stack);
    } catch {
      Debug.rules(
        'Evaluation of condition failed. Rule item ID: %s, condition item ID: {1}',
        this.id ?? 'Unknown',
        this.condition.id ?? 'Unknown'
      );
    }

    return stack.size != 0 && !!stack.pop();
  }

  /// <summary>Executes the specified rule context.</summary>
  /// <param name="ruleContext">The rule context.</param>
  execute(ruleContext: TContext): void {
    for (const action of this.actions) {
      action.apply(ruleContext);
      if (ruleContext.isAborted) {
        break;
      }
    }
  }
}
