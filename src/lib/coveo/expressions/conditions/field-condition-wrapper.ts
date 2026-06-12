import { RuleCondition } from 'lib/rules/rule-condition';
import { RuleContext } from 'lib/rules/rule-context';
import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { FieldNode } from '../query-nodes/field-node';
import { FieldValueTypes } from '../query-nodes/field-node-types';
import { QueryNode } from '../query-nodes/query-node';
import { QueryNodeOperator } from '../query-nodes/query-node-operator';
import { VoidNode } from '../query-nodes/void-node';
import { ConditionWrapper } from './condition-wrapper';

export abstract class FieldConditionWrapper<
  TContext extends RuleContext,
  TCondition extends RuleCondition<TContext>,
> extends ConditionWrapper<TCondition> {
  getQueryNode(): QueryNode {
    let queryNode = new VoidNode();
    if (this.isConditionValid()) {
      queryNode = new FieldNode(
        this.getQueryNodeFieldName()!,
        this.getQueryNodeOperator(),
        this.getQueryNodeValue()
      );
    }
    return queryNode;
  }

  public isConditionValid(): boolean {
    const queryNodeOperator = this.getQueryNodeOperator();
    if (isNullOrWhitespace(this.getQueryNodeFieldName())) {
      return false;
    }
    if (queryNodeOperator == QueryNodeOperator.Unknown) {
      return false;
    }
    if (this.getQueryNodeValue() == null) {
      return false;
    }
    return true;
  }

  protected abstract getQueryNodeFieldName(): string | null;

  protected abstract getQueryNodeOperator(): QueryNodeOperator;

  protected abstract getQueryNodeValue(): FieldValueTypes;
}
