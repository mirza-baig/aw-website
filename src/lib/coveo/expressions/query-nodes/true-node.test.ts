import { describe, expect, test } from 'vitest';

import { TrueNode } from './true-node';

describe('lib > coveo > expressions > query-nodes > true-node', () => {
  test('generates correct expression', () => {
    // Arrange
    const node = new TrueNode();
    // Act
    const expression = node.getExpression();
    // Assert
    expect(expression).toBe('@uri');
  });
});
