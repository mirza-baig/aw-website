import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { CoveoCondition } from 'lib/coveo/expressions/conditions/coveo-condition';
import { FieldNode } from 'lib/coveo/expressions/query-nodes/field-node';
import { NotNode } from 'lib/coveo/expressions/query-nodes/not-node';
import { QueryNode } from 'lib/coveo/expressions/query-nodes/query-node';
import { QueryNodeOperator } from 'lib/coveo/expressions/query-nodes/query-node-operator';
import { VoidNode } from 'lib/coveo/expressions/query-nodes/void-node';
import { FutureResult } from 'lib/graphql/item-fetcher/future-result';
import { RuleContext } from 'lib/rules/rule-context';
import { SitecoreId } from 'lib/utils/sitecore-utils/sitecore-id';
import { isNullOrEmpty } from 'lib/utils/string-utils/is-null-or-empty';

import { IConditionFactoryContext } from '../../condition-factory-context';
import { WhenCondition } from '../../sitecore/when-condition';
import { getCoveoFieldName } from '../get-coveo-field-name';

export const DateFieldConditionId = '{859F37E1-F817-47E7-B770-AA619AA789D9}';

export class DateFieldCondition<TContext extends RuleContext>
  extends WhenCondition<TContext>
  implements CoveoCondition
{
  public readonly fieldId: SitecoreId;
  public readonly operatorId: string;
  public readonly value: string;
  protected readonly field: FutureResult | null;

  constructor(element: Element, _context: IConditionFactoryContext) {
    super();
    const fieldId = element.getAttribute('fieldid');
    this.fieldId = SitecoreId.isId(fieldId) ? new SitecoreId(fieldId) : SitecoreId.null;
    this.operatorId = element.getAttribute('operatorid') ?? '';
    this.value = element.getAttribute('value') ?? '';
    this.field = SitecoreId.isNullOrEmpty(this.fieldId)
      ? null
      : _context.getItem(this.fieldId.toShortId(), 'en');
  }

  execute(_ruleContext: TContext): boolean {
    throw new Error('Method not implemented.');
  }

  getQueryNode(): QueryNode {
    if (this.field?.result == null) {
      return new VoidNode();
    }

    const fieldName = getCoveoFieldName(this.field.result);
    if (isNullOrEmpty(fieldName)) {
      return new VoidNode();
    }

    const formattedValue = this.getFormattedValue();
    if (formattedValue == null) {
      return new VoidNode();
    }

    const operator = this.getQueryNodeOperator();
    if (operator == QueryNodeOperator.NotEqual) {
      return new NotNode(new FieldNode(fieldName, QueryNodeOperator.ExactMatch, formattedValue));
    }
    return new FieldNode(fieldName, operator, formattedValue);
  }

  protected getFormattedValue(): string {
    switch (this.operatorId) {
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isEqualTo.Id: // is equal to
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isNotEqualTo.Id: // is not equal to
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isGreaterThan.Id: // greater than
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isLessThan.Id: // less than
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isGreaterThanOrEqualTo.Id: // is greater than or equal to
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isLessThanOrEqualTo.Id: // is less than or equal to
        return this.value;
      default:
        throw new Error(`Invalid Condition Operator: ${this.operatorId}`);
    }
  }

  private getQueryNodeOperator(): QueryNodeOperator {
    switch (this.operatorId) {
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isEqualTo.Id:
        return QueryNodeOperator.ExactMatch;
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isNotEqualTo.Id:
        return QueryNodeOperator.NotEqual;
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isGreaterThan.Id:
        return QueryNodeOperator.GreaterThan;
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isLessThan.Id:
        return QueryNodeOperator.LessThan;
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isGreaterThanOrEqualTo.Id:
        return QueryNodeOperator.GreaterThanOrEqual;
      case SitecoreIds.System.Settings.Rules.Definitions.Operators.isLessThanOrEqualTo.Id:
        return QueryNodeOperator.LessThanOrEqual;
      default:
        throw new Error(`Invalid Condition Operator: ${this.operatorId}`);
    }
  }
}
