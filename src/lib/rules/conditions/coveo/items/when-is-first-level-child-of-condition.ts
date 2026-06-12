import { XmlElement } from '@rgrove/parse-xml/dist/lib/XmlElement';
import { CoveoFields } from 'lib/coveo/constants';
import { CoveoCondition } from 'lib/coveo/expressions/conditions/coveo-condition';
import { FieldNode } from 'lib/coveo/expressions/query-nodes/field-node';
import { QueryNode } from 'lib/coveo/expressions/query-nodes/query-node';
import { QueryNodeOperator } from 'lib/coveo/expressions/query-nodes/query-node-operator';
import { VoidNode } from 'lib/coveo/expressions/query-nodes/void-node';
import { RuleContext } from 'lib/rules/rule-context';
import { SitecoreId } from 'lib/utils/sitecore-utils/sitecore-id';

import { IConditionFactoryContext } from '../../condition-factory-context';
import { WhenCondition } from '../../sitecore/when-condition';

export const WhenIsFirstLevelChildOfConditionId = '{46E410AB-9528-4E62-AFB9-21E186EBBD52}';

export class WhenIsFirstLevelChildOfCondition<TContext extends RuleContext>
  extends WhenCondition<TContext>
  implements CoveoCondition
{
  public readonly itemId: SitecoreId;

  constructor(element: XmlElement, _context: IConditionFactoryContext) {
    super();
    const itemId = element.attributes.itemid;
    this.itemId = SitecoreId.isId(itemId) ? new SitecoreId(itemId) : SitecoreId.null;
  }

  execute(_ruleContext: TContext): boolean {
    throw new Error('Method not implemented.');
  }

  getQueryNode(): QueryNode {
    if (SitecoreId.isNullOrEmpty(this.itemId)) {
      return new VoidNode();
    }
    return new FieldNode(
      CoveoFields.ParentId,
      QueryNodeOperator.ExactMatch,
      this.itemId.toShortId()
    );
  }
}
