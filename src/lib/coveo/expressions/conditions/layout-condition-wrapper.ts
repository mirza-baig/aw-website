import { LayoutCondition } from 'lib/rules/conditions/sitecore/layout-condition';
import { RuleContext } from 'lib/rules/rule-context';

import { FieldValueTypes } from '../query-nodes/field-node-types';
import { QueryNodeOperator } from '../query-nodes/query-node-operator';
import { FieldConditionWrapper } from './field-condition-wrapper';

export class LayoutConditionWrapper<TContext extends RuleContext> extends FieldConditionWrapper<
  TContext,
  LayoutCondition<TContext>
> {
  protected getQueryNodeFieldName() {
    return 'HasLayout';
  }

  protected getQueryNodeOperator() {
    return QueryNodeOperator.ExactMatch;
  }

  protected getQueryNodeValue(): FieldValueTypes {
    return true;
  }
}
