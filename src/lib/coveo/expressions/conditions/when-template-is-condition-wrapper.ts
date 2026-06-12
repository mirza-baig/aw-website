import { WhenTemplateIs } from 'lib/rules/conditions/sitecore/when-template-is';
import { RuleContext } from 'lib/rules/rule-context';

import { CoveoFields } from '../../constants';
import { QueryNodeOperator } from '../query-nodes/query-node-operator';
import { FieldConditionWrapper } from './field-condition-wrapper';

export class WhenTemplateIsWrapper<TContext extends RuleContext> extends FieldConditionWrapper<
  TContext,
  WhenTemplateIs<TContext>
> {
  protected getQueryNodeFieldName() {
    return CoveoFields.TemplateId;
  }

  protected getQueryNodeOperator() {
    return QueryNodeOperator.ExactMatch;
  }

  protected getQueryNodeValue(): string {
    return this.condition.templateId;
  }
}
