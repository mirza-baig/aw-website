import { XmlElement } from '@rgrove/parse-xml';
import { CoveoFields, Tokens } from 'lib/coveo/constants';
import { FieldNode } from 'lib/coveo/expressions/query-nodes/field-node';
import { QueryNodeOperator } from 'lib/coveo/expressions/query-nodes/query-node-operator';
import { describe, expect, test } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { IConditionFactoryContext } from '../../condition-factory-context';
import { CurrentPageCondition } from './current-page-condition';

describe('lib > rules > conditions > coveo > items > current-page-condition', () => {
  test('generates correct node', () => {
    // Arrange
    const element = mock<XmlElement>();
    const context = mock<IConditionFactoryContext>();
    const condition = new CurrentPageCondition(element, context);
    // Act
    const node = condition.getQueryNode() as FieldNode;
    // Assert
    expect(node).toBeInstanceOf(FieldNode);
    expect(node.fieldName).toBe(CoveoFields.ItemId);
    expect(node.operator).toBe(QueryNodeOperator.ExactMatch);
    expect(node.fieldValues).toEqual([Tokens.CurrentPage]);
  });
});
