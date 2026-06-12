import { StringOperatorCondition } from 'lib/rules/conditions/sitecore/string-operator-condition';
import { RuleContext } from 'lib/rules/rule-context';

import { QueryNodeOperator } from '../query-nodes/query-node-operator';
import { FieldConditionWrapper } from './field-condition-wrapper';

export abstract class StringConditionWrapper<
  TContext extends RuleContext,
  TCondition extends StringOperatorCondition<TContext>,
> extends FieldConditionWrapper<TContext, TCondition> {
  constructor(condition: TCondition) {
    super(condition);
  }

  protected abstract getConditionStringValue(): string;

  protected getQueryNodeOperator(): QueryNodeOperator {
    switch (this.condition.operatorId) {
      case '{10537C58-1684-4CAB-B4C0-40C10907CE31}':
        return QueryNodeOperator.ExactMatch;
      case '{22E1F05F-A17A-4D0C-B376-6F7661500F03}':
        return QueryNodeOperator.WildcardMatch;
      case '{2E67477C-440C-4BCA-A358-3D29AED89F47}':
        return QueryNodeOperator.WildcardMatch;
      case '{537244C2-3A3F-4B81-A6ED-02AF494C0563}':
        return QueryNodeOperator.ExactMatch;
      case '{6A7294DF-ECAE-4D5F-A8D2-C69CB1161C09}':
        return QueryNodeOperator.NotEqual;
      case '{A6AC5A6B-F409-48B0-ACE7-C3E8C5EC6406}':
        return QueryNodeOperator.NotEqual;
      case '{F8641C26-EE27-483C-9FEA-35529ECC8541}':
        return QueryNodeOperator.RegexMatch;
      case '{FDD7C6B1-622A-4362-9CFF-DDE9866C68EA}':
        return QueryNodeOperator.WildcardMatch;
      default:
        console.warn(`Unknown rule condition operator "${this.condition.operatorId}".`);
        return QueryNodeOperator.Unknown;
    }
  }

  protected getQueryNodeValue(): string {
    let queryNodeValue = this.getConditionStringValue();
    if (this.shouldPrependWildcard(this.condition.operatorId)) {
      queryNodeValue = `*${queryNodeValue}`;
    }
    if (this.shouldAppendWildcard(this.condition.operatorId)) {
      queryNodeValue = `${queryNodeValue}*`;
    }
    return queryNodeValue;
  }

  private shouldAppendWildcard(operatorId: string): boolean {
    return (
      operatorId == '{2E67477C-440C-4BCA-A358-3D29AED89F47}' ||
      operatorId == '{FDD7C6B1-622A-4362-9CFF-DDE9866C68EA}'
    );
  }

  private shouldPrependWildcard(operatorId: string): boolean {
    return (
      operatorId == '{2E67477C-440C-4BCA-A358-3D29AED89F47}' ||
      operatorId == '{22E1F05F-A17A-4D0C-B376-6F7661500F03}'
    );
  }
}
