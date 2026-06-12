import { faker } from '@faker-js/faker';
import { XmlElement } from '@rgrove/parse-xml/dist/lib/XmlElement';
import { CoveoFields } from 'lib/coveo/constants';
import { AndNode } from 'lib/coveo/expressions/query-nodes/and-node';
import { FieldNode } from 'lib/coveo/expressions/query-nodes/field-node';
import { QueryNodeOperator } from 'lib/coveo/expressions/query-nodes/query-node-operator';
import { VoidNode } from 'lib/coveo/expressions/query-nodes/void-node';
import { SitecoreId } from 'lib/utils/sitecore-utils/sitecore-id';
import { describe, expect, test } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { IConditionFactoryContext } from '../../condition-factory-context';
import { WhenIsChildOfCondition } from './when-is-child-of-condition';

describe('lib > rules > conditions > coveo > items > when-is-child-of-condition', () => {
  test('generates void node for invalid id', () => {
    // Arrange
    const element = mock<XmlElement>();
    const context = mock<IConditionFactoryContext>();
    const condition = new WhenIsChildOfCondition(element, context);
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
    const condition = new WhenIsChildOfCondition(element, context);
    // Act
    const node = condition.getQueryNode() as AndNode;
    const left = node.leftOperand as FieldNode;
    const right = node.rightOperand as FieldNode;
    // Assert
    expect(node).toBeInstanceOf(AndNode);
    expect(left.fieldName).toBe(CoveoFields.PathIds);
    expect(left.operator).toBe(QueryNodeOperator.Equal);
    expect(left.fieldValues).toEqual([id.toShortId()]);
    expect(right.fieldName).toBe(CoveoFields.ItemId);
    expect(right.operator).toBe(QueryNodeOperator.NotEqual);
    expect(right.fieldValues).toEqual([id.toShortId()]);
  });
});
