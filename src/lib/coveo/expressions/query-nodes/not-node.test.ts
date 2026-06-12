import { describe, expect, test } from 'vitest';

import { NotNode } from './not-node';

describe('lib > coveo > expressions > query-nodes > not-node', () => {
  test('generates correct expression', () => {
    // Arrange
    const operand = { getExpression: () => 'operand' };
    const node = new NotNode(operand);
    // Act
    const expression = node.getExpression();
    // Assert
    expect(expression).toBe('NOT operand');
  });
});
