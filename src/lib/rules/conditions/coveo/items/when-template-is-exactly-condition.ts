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

export const WhenTemplateIsExactlyConditionId = '{E93D7537-4235-48AE-97C3-EE755DDF4DB7}';

export class WhenTemplateIsExactlyCondition<TContext extends RuleContext>
  extends WhenCondition<TContext>
  implements CoveoCondition
{
  public readonly templateId: SitecoreId;

  constructor(element: XmlElement, _context: IConditionFactoryContext) {
    super();
    const templateId = element.attributes.templateid;
    this.templateId = SitecoreId.isId(templateId) ? new SitecoreId(templateId) : SitecoreId.null;
  }

  execute(_ruleContext: TContext): boolean {
    throw new Error('Method not implemented.');
  }

  getQueryNode(): QueryNode {
    if (SitecoreId.isNullOrEmpty(this.templateId)) {
      return new VoidNode();
    }
    return new FieldNode(
      CoveoFields.TemplateId,
      QueryNodeOperator.ExactMatch,
      this.templateId.toShortId()
    );
  }
}
