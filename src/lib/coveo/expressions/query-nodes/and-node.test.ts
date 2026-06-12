import { describe, expect, test } from 'vitest';

import { AndNode } from './and-node';

describe('lib > coveo > expressions > query-nodes > and-node', () => {
  test('generates correct expression', () => {
    // Arrange
    const left = { getExpression: () => 'left' };
    const right = { getExpression: () => 'right' };
    const node = new AndNode(left, right);
    // Act
    const expression = node.getExpression();
    // Assert
    expect(expression).toBe('(left right)');
  });
});
