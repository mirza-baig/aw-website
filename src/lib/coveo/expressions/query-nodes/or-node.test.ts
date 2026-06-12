import { describe, expect, test } from 'vitest';

import { OrNode } from './or-node';

describe('lib > coveo > expressions > query-nodes > or-node', () => {
  test('generates correct expression', () => {
    // Arrange
    const left = { getExpression: () => 'left' };
    const right = { getExpression: () => 'right' };
    const node = new OrNode(left, right);
    // Act
    const expression = node.getExpression();
    // Assert
    expect(expression).toBe('(left OR right)');
  });
});
