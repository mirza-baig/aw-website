import { RuleContext } from 'lib/rules/rule-context';

import { getQueryNode } from '../utils/get-query-node';
import { joinWithAndNode } from '../utils/join-with-and-node';
import { optimize } from '../utils/optimize';
import { CoveoRule } from './coveo-rule';
import { QueryNode } from './query-nodes/query-node';

export class FilterExpressionBuilder {
  protected filterRulesQueryNodes: QueryNode[] = [];

  addFilterRules(filterRules: CoveoRule<RuleContext>[]): this {
    if (filterRules.some((rule) => rule.condition != undefined)) {
      const queryNode = getQueryNode(filterRules);
      if (queryNode != null) {
        this.filterRulesQueryNodes.push(queryNode);
      }
    }
    return this;
  }

  buildExpression(): string | undefined {
    const queryNodeList = [...this.filterRulesQueryNodes];
    if (queryNodeList.length == 0) {
      return undefined;
    }
    return this.joinNodes(queryNodeList)?.getExpression();
  }

  private joinNodes(nodes: QueryNode[]): QueryNode | null {
    let queryNode: QueryNode | null = null;
    if (nodes.length > 0) {
      queryNode = joinWithAndNode(nodes);
      queryNode = optimize(queryNode);
    }
    return queryNode;
  }
}
