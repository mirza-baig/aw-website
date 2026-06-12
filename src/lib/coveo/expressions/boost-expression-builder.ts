import { RuleContext } from 'lib/rules/rule-context';
import {} from 'lib/utils/linq/array';

import { getQueryNode } from '../utils/get-query-node';
import { BaseBoostAction } from './actions/base-boost-action';
import { CoveoRule } from './coveo-rule';
import { RankingExpression } from './ranking-expression';

export class BoostExpressionBuilder {
  protected rankingExpressions: RankingExpression[] = [];

  addBoostingRules(boostRules: CoveoRule<RuleContext>[]): this {
    for (const rule of boostRules) {
      this.addBoostingRule(rule);
    }
    return this;
  }

  addBoostingRule(boostRule: CoveoRule<RuleContext>): this {
    const action = boostRule.actions.firstOrDefault(
      (_) => _ instanceof BaseBoostAction
    ) as BaseBoostAction<RuleContext>;
    if (action == null) {
      return this;
    }
    const query = getQueryNode(boostRule);
    if (query == null) {
      return this;
    }

    this.rankingExpressions.push(new RankingExpression(query, action.getEffectiveWeight()));
    return this;
  }

  buildExpression(): string {
    const qres = this.rankingExpressions.map(
      (re) => `$qre(expression:(${re.expression?.getExpression()}), modifier:'${re.modifier}')`
    );
    return qres.join(' ');
  }
}
