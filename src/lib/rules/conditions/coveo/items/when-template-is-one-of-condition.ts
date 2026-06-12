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

export const WhenTemplateIsOneOfConditionId = '{F5550CEE-F577-4279-8266-856119DA33B0}';

export class WhenTemplateIsOneOfCondition<TContext extends RuleContext>
  extends WhenCondition<TContext>
  implements CoveoCondition
{
  public readonly templateIds: SitecoreId[];

  constructor(element: XmlElement, _context: IConditionFactoryContext) {
    super();
    const templateIds = element.attributes.templateids;
    this.templateIds =
      templateIds == null
        ? []
        : templateIds
            .split('|')
            .filter((id) => SitecoreId.isId(id))
            .map((id) => new SitecoreId(id));
  }

  execute(_ruleContext: TContext): boolean {
    throw new Error('Method not implemented.');
  }

  getQueryNode(): QueryNode {
    if (this.templateIds.length === 0) {
      return new VoidNode();
    }
    return new FieldNode(
      CoveoFields.TemplateId,
      QueryNodeOperator.Equal,
      this.templateIds.map((id) => id.toShortId())
    );
  }
}
