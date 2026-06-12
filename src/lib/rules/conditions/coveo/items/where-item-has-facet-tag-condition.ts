import { XmlElement } from '@rgrove/parse-xml/dist/lib/XmlElement';
import { CoveoCondition } from 'lib/coveo/expressions/conditions/coveo-condition';
import { FieldNode } from 'lib/coveo/expressions/query-nodes/field-node';
import { QueryNode } from 'lib/coveo/expressions/query-nodes/query-node';
import { QueryNodeOperator } from 'lib/coveo/expressions/query-nodes/query-node-operator';
import { VoidNode } from 'lib/coveo/expressions/query-nodes/void-node';
import { FutureResult } from 'lib/graphql/item-fetcher/future-result';
import { ItemTextField } from 'lib/graphql/item-fetcher/item';
import { getCoveoFieldName } from 'lib/rules/conditions/coveo/get-coveo-field-name';
import { RuleContext } from 'lib/rules/rule-context';
import { SitecoreId } from 'lib/utils/sitecore-utils/sitecore-id';
import { isNullOrEmpty } from 'lib/utils/string-utils/is-null-or-empty';

import { IConditionFactoryContext } from '../../condition-factory-context';
import { WhenCondition } from '../../sitecore/when-condition';

export const WhereItemHasFacetTagConditionId = '{228B319A-2E97-4B5A-92E1-2BB230D6E383}';

export class WhereItemHasFacetTagCondition<TContext extends RuleContext>
  extends WhenCondition<TContext>
  implements CoveoCondition
{
  public readonly fieldId: SitecoreId;
  public readonly tagId: SitecoreId;
  protected readonly field: FutureResult | null;
  protected readonly tag: FutureResult | null;

  constructor(element: XmlElement, _context: IConditionFactoryContext) {
    super();
    const fieldId = element.attributes.fieldid;
    this.fieldId = SitecoreId.isId(fieldId) ? new SitecoreId(fieldId) : SitecoreId.null;
    const tagId = element.attributes.tagid;
    this.tagId = SitecoreId.isId(tagId) ? new SitecoreId(tagId) : SitecoreId.null;

    this.field = SitecoreId.isNullOrEmpty(this.fieldId)
      ? null
      : _context.getItem(this.fieldId.toShortId(), 'en');
    this.tag = SitecoreId.isNullOrEmpty(this.tagId)
      ? null
      : _context.getItem(this.tagId.toShortId(), 'en');
  }

  execute(_ruleContext: TContext): boolean {
    throw new Error('Method not implemented.');
  }

  getQueryNode(): QueryNode {
    if (this.field?.result == null || this.tag?.result == null) {
      return new VoidNode();
    }

    const fieldName = getCoveoFieldName(this.field.result);
    if (isNullOrEmpty(fieldName)) {
      return new VoidNode();
    }

    const tagTitleField = this.tag.result.fields.find((field) => field.name == 'title') as
      | ItemTextField
      | undefined;
    if (tagTitleField == undefined) {
      return new VoidNode();
    }

    return new FieldNode(fieldName, QueryNodeOperator.Equal, tagTitleField.value);
  }
}
