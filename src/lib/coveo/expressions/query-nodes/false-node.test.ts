import { describe, expect, test } from 'vitest';

import { FalseNode } from './false-node';

describe('lib > coveo > expressions > query-nodes > false-node', () => {
  test('generates correct expression', () => {
    // Arrange
    const node = new FalseNode();
    // Act
    const expression = node.getExpression();
    // Assert
    expect(expression).toBe('(NOT @uri)');
  });
});
