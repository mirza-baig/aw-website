import { ActionConstructor } from 'lib/rules/actions/action-factory-context';
import { ConditionConstructor } from 'lib/rules/conditions/condition-factory-context';
import { RuleContext } from 'lib/rules/rule-context';
import { GetRulesContext } from 'lib/rules/utils/get-rules-context';
import { AWSitecoreClient } from 'lib/sitecore-client';

export class ParseRulesContext<TContext extends RuleContext> extends GetRulesContext<TContext> {
  constructor(
    conditionMap: Map<string, ConditionConstructor>,
    actionMap: Map<string, ActionConstructor>,
    sitecoreClient: AWSitecoreClient
  ) {
    super(conditionMap, actionMap, sitecoreClient);
  }
}
