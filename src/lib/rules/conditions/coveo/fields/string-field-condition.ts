import { XmlElement } from '@rgrove/parse-xml';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { CoveoCondition } from 'lib/coveo/expressions/conditions/coveo-condition';
import { FieldNode } from 'lib/coveo/expressions/query-nodes/field-node';
import { NotNode } from 'lib/coveo/expressions/query-nodes/not-node';
import { QueryNode } from 'lib/coveo/expressions/query-nodes/query-node';
import { QueryNodeOperator } from 'lib/coveo/expressions/query-nodes/query-node-operator';
import { VoidNode } from 'lib/coveo/expressions/query-nodes/void-node';
import { FutureResult } from 'lib/graphql/item-fetcher/future-result';
import { getCoveoFieldName } from 'lib/rules/conditions/coveo/get-coveo-field-name';
import { RuleContext } from 'lib/rules/rule-context';
import { SitecoreId } from 'lib/utils/sitecore-utils/sitecore-id';
import { isNullOrEmpty } from 'lib/utils/string-utils/is-null-or-empty';

import { IConditionFactoryContext } from '../../condition-factory-context';
import { WhenCondition } from '../../sitecore/when-condition';

export const StringFieldConditionId = '{3EECAA50-99F5-4AD9-A345-533046B3E71E}';

export class StringFieldCondition<TContext extends RuleContext>
  extends WhenCondition<TContext>
  implements CoveoCondition
{
  public readonly fieldId: SitecoreId;
  public readonly operatorId: string;
  public readonly value: string;
  protected readonly field: FutureResult | null;

  constructor(element: XmlElement, _context: IConditionFactoryContext) {
    super();
    const fieldId = element.attributes.fieldid;
    this.fieldId = SitecoreId.isId(fieldId) ? new SitecoreId(fieldId) : SitecoreId.null;
    this.operatorId = element.attributes.operatorid ?? '';
    this.value = element.attributes.value ?? '';
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
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.endsWith.Id:
        return `*${this.value}`;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.isEqualTo.Id:
        return this.value;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.isNotEqualTo.Id:
        return this.value;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.matchesTheRegularExpression.Id:
        return this.value;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.containsKeywords.Id:
        return this.value;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.containsString.Id:
        return `*${this.value}*`;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.startsWith.Id:
        return `${this.value}*`;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.isLike.Id:
        return this.value;
      default:
        throw new Error(`Invalid Condition Operator: ${this.operatorId}`);
    }
  }

  private getQueryNodeOperator(): QueryNodeOperator {
    switch (this.operatorId) {
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.endsWith.Id:
        return QueryNodeOperator.WildcardMatch;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.isEqualTo.Id:
        return QueryNodeOperator.ExactMatch;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.isNotEqualTo.Id:
        return QueryNodeOperator.NotEqual;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.matchesTheRegularExpression.Id:
        return QueryNodeOperator.RegexMatch;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.containsKeywords.Id:
        return QueryNodeOperator.Equal;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.containsString.Id:
        return QueryNodeOperator.WildcardMatch;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.startsWith.Id:
        return QueryNodeOperator.WildcardMatch;
      case SitecoreIds.Content.AndersenCorporation.AndersenWindows.Global.DataSources.Enums
        .CoveoStringOperators.isLike.Id:
        return QueryNodeOperator.FuzzyMatch;
      default:
        throw new Error(`Invalid Condition Operator: ${this.operatorId}`);
    }
  }
}
