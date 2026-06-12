import { WhenField } from 'lib/rules/conditions/sitecore/when-field';
import { RuleContext } from 'lib/rules/rule-context';

import { StringConditionWrapper } from './string-condition-wrapper';

export class WhenFieldWrapper<TContext extends RuleContext> extends StringConditionWrapper<
  TContext,
  WhenField<TContext>
> {
  protected getQueryNodeFieldName() {
    return this.condition.fieldName;
  }

  protected getConditionStringValue(): string {
    return this.condition.value;
  }
}
