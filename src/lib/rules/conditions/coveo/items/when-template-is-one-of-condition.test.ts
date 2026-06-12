import { faker } from '@faker-js/faker';
import { XmlElement } from '@rgrove/parse-xml';
import { CoveoFields } from 'lib/coveo/constants';
import { FieldNode } from 'lib/coveo/expressions/query-nodes/field-node';
import { QueryNodeOperator } from 'lib/coveo/expressions/query-nodes/query-node-operator';
import { VoidNode } from 'lib/coveo/expressions/query-nodes/void-node';
import { SitecoreId } from 'lib/utils/sitecore-utils/sitecore-id';
import { describe, expect, test } from 'vitest';
import { mock } from 'vitest-mock-extended';

import { IConditionFactoryContext } from '../../condition-factory-context';
import { WhenTemplateIsOneOfCondition } from './when-template-is-one-of-condition';

describe('lib > rules > conditions > coveo > items > when-template-is-one-of-condition', () => {
  test('generates void node for invalid id', () => {
    // Arrange
    const element = mock<XmlElement>();
    const context = mock<IConditionFactoryContext>();
    const condition = new WhenTemplateIsOneOfCondition(element, context);
    // Act
    const node = condition.getQueryNode();
    // Assert
    expect(node).toBeInstanceOf(VoidNode);
  });
  test('generates correct node for valid id', () => {
    // Arrange
    const uuid = `{${faker.string.uuid()}}`;
    const id = new SitecoreId(uuid);
    const element = mock<XmlElement>({ attributes: { templateids: uuid } });
    const context = mock<IConditionFactoryContext>();
    const condition = new WhenTemplateIsOneOfCondition(element, context);
    // Act
    const node = condition.getQueryNode() as FieldNode;
    // Assert
    expect(node).toBeInstanceOf(FieldNode);
    expect(node.fieldName).toBe(CoveoFields.TemplateId);
    expect(node.operator).toBe(QueryNodeOperator.Equal);
    expect(node.fieldValues).toEqual([id.toShortId()]);
  });
  test('generates correct node for multiple valid ids', () => {
    // Arrange
    const uuid1 = `{${faker.string.uuid()}}`;
    const uuid2 = `{${faker.string.uuid()}}`;
    const id1 = new SitecoreId(uuid1);
    const id2 = new SitecoreId(uuid2);
    const element = mock<XmlElement>({ attributes: { templateids: `${uuid1}|${uuid2}` } });
    const context = mock<IConditionFactoryContext>();
    const condition = new WhenTemplateIsOneOfCondition(element, context);
    // Act
    const node = condition.getQueryNode() as FieldNode;
    // Assert
    expect(node).toBeInstanceOf(FieldNode);
    expect(node.fieldName).toBe(CoveoFields.TemplateId);
    expect(node.operator).toBe(QueryNodeOperator.Equal);
    expect(node.fieldValues).toEqual([`${id1.toShortId()}`, `${id2.toShortId()}`]);
  });
});
