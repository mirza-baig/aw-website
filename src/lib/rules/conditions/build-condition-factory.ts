import { XmlElement } from '@rgrove/parse-xml';

import { RuleCondition } from '../rule-condition';
import { RuleContext } from '../rule-context';
import { IConditionFactoryContext } from './condition-factory-context';
import { AndCondition } from './sitecore/and-condition';
import { NotCondition } from './sitecore/not-condition';
import { OrCondition } from './sitecore/or-condition';

export function buildConditionFactory(context: IConditionFactoryContext) {
  const conditionFactory = <T extends RuleContext>(
    conditionElement: XmlElement
  ): RuleCondition<T> | null => {
    if (conditionElement.name == 'or') {
      const leftCondition = conditionElement.children[0] as XmlElement;
      const rightCondition = conditionElement.children[1] as XmlElement;
      if (leftCondition == null || rightCondition == null) {
        return null;
      }
      const leftOperand = conditionFactory<T>(leftCondition);
      const rightOperand = conditionFactory<T>(rightCondition);
      if (leftOperand == null || rightOperand == null) {
        return null;
      }
      return new OrCondition(leftOperand, rightOperand);
    }

    if (conditionElement.name == 'and') {
      const leftCondition = conditionElement.children[0] as XmlElement;
      const rightCondition = conditionElement.children[1] as XmlElement;
      if (leftCondition == null || rightCondition == null) {
        return null;
      }
      const leftOperand = conditionFactory<T>(leftCondition);
      const rightOperand = conditionFactory<T>(rightCondition);
      if (leftOperand == null || rightOperand == null) {
        return null;
      }
      return new AndCondition(leftOperand, rightOperand);
    }

    if (conditionElement.name == 'not') {
      const condition = conditionElement.children[0] as XmlElement;
      if (condition == null) {
        return null;
      }
      const operand = conditionFactory<T>(condition);
      if (!operand) {
        return null;
      }
      return new NotCondition(operand);
    }

    const id = conditionElement.attributes.id;
    if (id == null) {
      return null;
    }

    const conditionConstructor = context.conditionMap.get(id);
    if (conditionConstructor == undefined) {
      console.error(`No rule condition defined for '${id}'`);
      return null;
    }

    return new conditionConstructor(conditionElement, context);
  };
  return conditionFactory;
}
