import { ParseRulesContext } from 'lib/coveo/utils/parse-rules-context';
import { parseRulesFromXmlString } from 'lib/coveo/utils/parse-rules-from-xml-string';
import { ActionConstructor } from 'lib/rules/actions/action-factory-context';
import { CoveoBoostAction, CoveoBoostActionId } from 'lib/rules/actions/coveo/coveo-boost-action';
import {
  CoveoReduceBoostAction,
  CoveoReduceBoostActionId,
} from 'lib/rules/actions/coveo/coveo-reduce-boost-action';
import { ConditionConstructor } from 'lib/rules/conditions/condition-factory-context';
import {
  StringFieldCondition,
  StringFieldConditionId,
} from 'lib/rules/conditions/coveo/fields/string-field-condition';
import {
  CurrentPageCondition,
  CurrentPageConditionId,
} from 'lib/rules/conditions/coveo/items/current-page-condition';
import {
  SpecificItemCondition,
  SpecificItemConditionId,
} from 'lib/rules/conditions/coveo/items/specific-item-condition';
import {
  WhenIsChildOfCondition,
  WhenIsChildOfConditionId,
} from 'lib/rules/conditions/coveo/items/when-is-child-of-condition';
import {
  WhenIsFirstLevelChildOfCondition,
  WhenIsFirstLevelChildOfConditionId,
} from 'lib/rules/conditions/coveo/items/when-is-first-level-child-of-condition';
import {
  WhenTemplateIsExactlyCondition,
  WhenTemplateIsExactlyConditionId,
} from 'lib/rules/conditions/coveo/items/when-template-is-exactly-condition';
import {
  WhenTemplateIsOneOfCondition,
  WhenTemplateIsOneOfConditionId,
} from 'lib/rules/conditions/coveo/items/when-template-is-one-of-condition';
import {
  WhereItemHasFacetTagCondition,
  WhereItemHasFacetTagConditionId,
} from 'lib/rules/conditions/coveo/items/where-item-has-facet-tag-condition';
import { ItemIdCondition } from 'lib/rules/conditions/sitecore/item-id-condition';
import { LayoutCondition } from 'lib/rules/conditions/sitecore/layout-condition';
import { TrueCondition } from 'lib/rules/conditions/sitecore/true-condition';
import { WhenField } from 'lib/rules/conditions/sitecore/when-field';
import { WhenIsDescendantOrSelf } from 'lib/rules/conditions/sitecore/when-is-descendant-or-self';
import { WhenTemplateIs } from 'lib/rules/conditions/sitecore/when-template-is';
import { CoveoRuleConditions } from 'lib/rules/constants';
import { RuleContext } from 'lib/rules/rule-context';
import sitecoreClient from 'lib/sitecore-client';

import { CoveoRule } from './expressions/coveo-rule';

const conditionMap = new Map<string, ConditionConstructor>();

// Sitecore OOTB
conditionMap.set(CoveoRuleConditions.ItemIdCondition, ItemIdCondition);
conditionMap.set(CoveoRuleConditions.LayoutCondition, LayoutCondition);
conditionMap.set(CoveoRuleConditions.TrueCondition, TrueCondition);
conditionMap.set(CoveoRuleConditions.WhenField, WhenField);
conditionMap.set(CoveoRuleConditions.WhenIsDescendantOrSelf, WhenIsDescendantOrSelf);
conditionMap.set(CoveoRuleConditions.WhenTemplateIs, WhenTemplateIs);

// Coveo
conditionMap.set(CurrentPageConditionId, CurrentPageCondition);
conditionMap.set(SpecificItemConditionId, SpecificItemCondition);
conditionMap.set(WhenIsChildOfConditionId, WhenIsChildOfCondition);
conditionMap.set(WhenIsFirstLevelChildOfConditionId, WhenIsFirstLevelChildOfCondition);
conditionMap.set(WhenTemplateIsExactlyConditionId, WhenTemplateIsExactlyCondition);
conditionMap.set(WhenTemplateIsOneOfConditionId, WhenTemplateIsOneOfCondition);
conditionMap.set(WhereItemHasFacetTagConditionId, WhereItemHasFacetTagCondition);

conditionMap.set(StringFieldConditionId, StringFieldCondition);

const actionMap = new Map<string, ActionConstructor>();
actionMap.set(CoveoBoostActionId, CoveoBoostAction);
actionMap.set(CoveoReduceBoostActionId, CoveoReduceBoostAction);

export async function buildCoveoRules<TContext extends RuleContext>(
  xml: string
): Promise<CoveoRule<TContext>[]> {
  const context = new ParseRulesContext(conditionMap, actionMap, sitecoreClient);
  const coveoRules = await parseRulesFromXmlString(xml, context);
  return coveoRules;
}
