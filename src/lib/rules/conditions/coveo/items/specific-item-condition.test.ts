import { faker } from '@faker-js/faker';
import { XmlElement } from '@rgrove/parse-xml';
import { CoveoFields } from 'lib/coveo/constants';
import { FieldNode } from 'lib/coveo/expressions/query-nodes/field-node';
import { QueryNodeOperator } from 'lib/coveo/expressions/query-nodes/query-node-operator';
import { VoidNode } from 'lib/coveo/expressions/query-nodes/void-node';
import { SitecoreId } from 'lib/utils/sitecore-utils/sitecore-id';
import { describe, expect, test } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { IConditionFactoryContext } from '../../condition-factory-context';
import { SpecificItemCondition } from './specific-item-condition';

describe('lib > rules > conditions > coveo > items > specific-item-condition', () => {
  test('generates void node for invalid id', () => {
    // Arrange
    const element = mock<XmlElement>();
    const context = mock<IConditionFactoryContext>();
    const condition = new SpecificItemCondition(element, context);
    // Act
    const node = condition.getQueryNode();
    // Assert
    expect(node).toBeInstanceOf(VoidNode);
  });
  test('generates correct node for valid id', () => {
    // Arrange
    const uuid = `{${faker.string.uuid()}}`;
    const id = new SitecoreId(uuid);
    const element = mock<XmlElement>({ attributes: { itemid: uuid } });
    const context = mock<IConditionFactoryContext>();
    const condition = new SpecificItemCondition(element, context);
    // Act
    const node = condition.getQueryNode() as FieldNode;
    // Assert
    expect(node).toBeInstanceOf(FieldNode);
    expect(node.fieldName).toBe(CoveoFields.ItemId);
    expect(node.operator).toBe(QueryNodeOperator.ExactMatch);
    expect(node.fieldValues).toEqual([id.toShortId()]);
  });
});
