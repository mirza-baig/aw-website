import { describe, expect, test } from 'vitest';

import { VoidNode } from './void-node';

describe('lib > coveo > expressions > query-nodes > void-node', () => {
  test('generates correct expression', () => {
    // Arrange
    const node = new VoidNode();
    // Act
    const expression = node.getExpression();
    // Assert
    expect(expression).toBe('');
  });
});
