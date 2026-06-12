import { faker } from '@faker-js/faker';
import { XmlElement } from '@rgrove/parse-xml';
import { VoidNode } from 'lib/coveo/expressions/query-nodes/void-node';
import { describe, expect, test } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { IConditionFactoryContext } from '../../condition-factory-context';
import { WhereItemHasFacetTagCondition } from './where-item-has-facet-tag-condition';

describe('lib > rules > conditions > coveo > items > where-item-has-facet-tag-condition', () => {
  test('generates void node for invalid tag and facet id', () => {
    // Arrange
    const element = mock<XmlElement>();
    const context = mock<IConditionFactoryContext>();
    const condition = new WhereItemHasFacetTagCondition(element, context);
    // Act
    const node = condition.getQueryNode();
    // Assert
    expect(node).toBeInstanceOf(VoidNode);
  });
  test('generates void node for empty tag id', () => {
    // Arrange
    const uuid = `{${faker.string.uuid()}}`;
    const element = mock<XmlElement>({ attributes: { fieldid: uuid, tagid: '' } });
    const context = mock<IConditionFactoryContext>();
    const condition = new WhereItemHasFacetTagCondition(element, context);
    // Act
    const node = condition.getQueryNode();
    // Assert
    expect(node).toBeInstanceOf(VoidNode);
  });
  test('generates void node for empty field id', () => {
    // Arrange
    const uuid = `{${faker.string.uuid()}}`;
    const element = mock<XmlElement>({ attributes: { fieldid: '', tagid: uuid } });
    const context = mock<IConditionFactoryContext>();
    const condition = new WhereItemHasFacetTagCondition(element, context);
    // Act
    const node = condition.getQueryNode();
    // Assert
    expect(node).toBeInstanceOf(VoidNode);
  });
});
