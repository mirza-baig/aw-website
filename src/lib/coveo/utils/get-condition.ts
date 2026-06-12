import { AndCondition } from 'lib/rules/conditions/sitecore/and-condition';
import { ItemIdCondition } from 'lib/rules/conditions/sitecore/item-id-condition';
import { LayoutCondition } from 'lib/rules/conditions/sitecore/layout-condition';
import { NotCondition } from 'lib/rules/conditions/sitecore/not-condition';
import { OrCondition } from 'lib/rules/conditions/sitecore/or-condition';
import { WhenField } from 'lib/rules/conditions/sitecore/when-field';
import { WhenIsDescendantOrSelf } from 'lib/rules/conditions/sitecore/when-is-descendant-or-self';
import { WhenTemplateIs } from 'lib/rules/conditions/sitecore/when-template-is';
import { RuleCondition } from 'lib/rules/rule-condition';
import { RuleContext } from 'lib/rules/rule-context';

import { AndConditionWrapper } from '../expressions/conditions/and-condition-wrapper';
import { CoveoCondition } from '../expressions/conditions/coveo-condition';
import { ItemIdConditionWrapper } from '../expressions/conditions/item-id-condition-wrapper';
import { LayoutConditionWrapper } from '../expressions/conditions/layout-condition-wrapper';
import { NotConditionWrapper } from '../expressions/conditions/not-condition-wrapper';
import { NotSupportedConditionWrapper } from '../expressions/conditions/not-supported-condition-wrapper';
import { OrConditionWrapper } from '../expressions/conditions/or-condition-wrapper';
import { WhenFieldWrapper } from '../expressions/conditions/when-field-wrapper';
import { WhenIsDescendantOrSelfWrapper } from '../expressions/conditions/when-is-descendant-or-self-wrapper';
import { WhenTemplateIsWrapper } from '../expressions/conditions/when-template-is-condition-wrapper';

export function getCondition<TContext extends RuleContext>(
  conditionRule: RuleCondition<TContext>
): CoveoCondition {
  if ('getQueryNode' in conditionRule) {
    return conditionRule as CoveoCondition;
  }
  if (conditionRule instanceof WhenField) {
    return new WhenFieldWrapper(conditionRule);
  }
  if (conditionRule instanceof AndCondition) {
    return new AndConditionWrapper(conditionRule);
  }
  if (conditionRule instanceof OrCondition) {
    return new OrConditionWrapper(conditionRule);
  }
  if (conditionRule instanceof NotCondition) {
    return new NotConditionWrapper(conditionRule);
  }
  if (conditionRule instanceof WhenTemplateIs) {
    return new WhenTemplateIsWrapper(conditionRule);
  }
  if (conditionRule instanceof ItemIdCondition) {
    return new ItemIdConditionWrapper(conditionRule);
  }
  if (conditionRule instanceof LayoutCondition) {
    return new LayoutConditionWrapper(conditionRule);
  }
  if (conditionRule instanceof WhenIsDescendantOrSelf) {
    return new WhenIsDescendantOrSelfWrapper(conditionRule);
  }
  return new NotSupportedConditionWrapper(conditionRule);
}
