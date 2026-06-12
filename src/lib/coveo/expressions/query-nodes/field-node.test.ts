import { faker } from '@faker-js/faker';
import { describe, expect, test } from 'vitest';

import { FieldNode } from './field-node';
import { QueryNodeOperator } from './query-node-operator';

describe('lib > coveo > expressions > query-nodes > field-node', () => {
  test('generates correct expression for multiple string values', () => {
    // Arrange
    const fieldName = faker.string.alpha(10);
    const operator = QueryNodeOperator.Equal;
    const fieldValues = faker.helpers.multiple(() => faker.string.alpha(10));
    const node = new FieldNode(fieldName, operator, fieldValues);
    // Act
    const expression = node.getExpression();
    // Assert
    expect(expression).toBe(`@${fieldName}=(${fieldValues.join(',')})`);
  });
});
