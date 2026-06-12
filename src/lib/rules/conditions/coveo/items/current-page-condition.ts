import { XmlElement } from '@rgrove/parse-xml';
import { CoveoFields, Tokens } from 'lib/coveo/constants';
import { CoveoCondition } from 'lib/coveo/expressions/conditions/coveo-condition';
import { FieldNode } from 'lib/coveo/expressions/query-nodes/field-node';
import { QueryNode } from 'lib/coveo/expressions/query-nodes/query-node';
import { QueryNodeOperator } from 'lib/coveo/expressions/query-nodes/query-node-operator';
import { RuleContext } from 'lib/rules/rule-context';

import { IConditionFactoryContext } from '../../condition-factory-context';
import { WhenCondition } from '../../sitecore/when-condition';

export const CurrentPageConditionId = '{D828BA1A-DCC8-4714-95B5-FBC7B3BD8FFE}';

export class CurrentPageCondition<TContext extends RuleContext>
  extends WhenCondition<TContext>
  implements CoveoCondition
{
  constructor(_element: XmlElement, _context: IConditionFactoryContext) {
    super();
  }

  execute(_ruleContext: TContext): boolean {
    throw new Error('Method not implemented.');
  }

  getQueryNode(): QueryNode {
    return new FieldNode(CoveoFields.ItemId, QueryNodeOperator.ExactMatch, Tokens.CurrentPage);
  }
}
