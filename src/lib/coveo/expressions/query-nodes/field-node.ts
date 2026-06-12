import { isNullOrWhitespace } from 'lib/utils/string-utils/is-null-or-whitespace';

import { QueryNode } from '../query-nodes/query-node';
import { FieldValueTypes } from './field-node-types';
import { FieldValueType } from './field-value-type';
import { QueryNodeOperator } from './query-node-operator';

export class FieldNode implements QueryNode {
  protected readonly COVEO_INDEX_DATE_FORMAT = 'yyyy/MM/dd@HH:mm:ssZ';
  protected readonly ATOMIC_REGEX = /^\d+(\.\d+)?$|^[\d\w]+$/;
  protected readonly RANGE_REGEX =
    /^\d+(\.\d+)?\.\.\d+(\.\d+)?$|^\d{4}\/\d{2}\/\d{2}@\d{2}:\d{2}:\d{2}\.\.\d{4}\/\d{2}\/\d{2}@\d{2}:\d{2}:\d{2}$/;
  protected readonly RANGE_WITHOUT_OUTERBOUNDS_REGEX =
    /^\d+(\.\d+)?$|^\d{4}\/\d{2}\/\d{2}@\d{2}:\d{2}:\d{2}$/;

  public fieldName: string;
  public operator: QueryNodeOperator = QueryNodeOperator.Unknown;
  public fieldValues: FieldValueTypes[];
  public valueType: FieldValueType;

  constructor(fieldName: string, operator: QueryNodeOperator, fieldValues: FieldValueTypes);
  constructor(fieldName: string, operator: QueryNodeOperator, fieldValues: FieldValueTypes[]);
  constructor(
    fieldName: string,
    operator: QueryNodeOperator,
    fieldValues: FieldValueTypes | FieldValueTypes[]
  ) {
    this.fieldName = fieldName;
    this.operator = operator;
    this.fieldValues = Array.isArray(fieldValues) ? fieldValues : [fieldValues];
    this.valueType = this.getValueType(this.fieldValues);
  }

  getExpression(): string {
    if (this.valueType == FieldValueType.String) {
      return this.getStringExpression();
    }
    return this.buildFieldExpression(
      this.fieldName,
      this.operator,
      this.fieldValues.map((_) => this.mapValueForType(_))
    );
  }

  protected getStringExpression(): string {
    const values = this.fieldValues
      .filter((_) => !isNullOrWhitespace(_ as string | null))
      .map((value) => String(value));
    if (values.length > 0) {
      return this.buildFieldExpression(this.fieldName, this.operator, values);
    }
    switch (this.operator) {
      case QueryNodeOperator.Equal:
      case QueryNodeOperator.ExactMatch:
        return `@${this.fieldName}`;
      case QueryNodeOperator.NotEqual:
        return `(NOT @${this.fieldName})`;
    }
    throw new Error(
      `Operator "${this.operator}" for field "${this.fieldName}" requires a non-empty value`
    );
  }

  protected buildFieldExpression(fieldName: string, operator: string, values: string[]): string {
    if (values.length == 1) {
      return `@${fieldName}${operator}${this.quoteAndEscapeIfNeeded(values[0])}`;
    }
    return `@${fieldName}${operator}(${values.map((_) => this.quoteAndEscapeIfNeeded(_)).join(',')})`;
  }

  protected mapValueForType(value: unknown): string {
    switch (this.valueType) {
      case FieldValueType.Boolean:
        return value ? '1' : '0';
      case FieldValueType.Date:
        return (value as Date).toISOString().replace('T', '@');
      case FieldValueType.Number:
        return `${value}`;
      default:
        return `${value}`;
    }
  }

  protected quoteAndEscapeIfNeeded(value: string): string {
    return this.isAtomicString(value) ||
      this.isRangeString(value) ||
      this.isRangeWithoutOuterBoundsString(value)
      ? value
      : this.quoteAndEscape(value);
  }

  protected isAtomicString(value: string): boolean {
    return this.ATOMIC_REGEX.test(value);
  }

  protected isRangeString(value: string): boolean {
    return this.RANGE_REGEX.test(value);
  }

  protected isRangeWithoutOuterBoundsString(value: string): boolean {
    return this.RANGE_WITHOUT_OUTERBOUNDS_REGEX.test(value);
  }

  protected quoteAndEscape(value: string): string {
    return `"${this.escapeString(value)}"`;
  }

  protected escapeString(value: string): string {
    return value.replaceAll('"', ' ');
  }

  private getValueType(values: unknown[]): FieldValueType {
    let valueType = FieldValueType.Object;
    if (values.length > 0) {
      if (typeof values[0] == 'string' || typeof values[0] == 'symbol') {
        valueType = FieldValueType.String;
      } else if (typeof values[0] == 'number' || typeof values[0] == 'bigint') {
        valueType = FieldValueType.Number;
      } else if (typeof values[0] == 'boolean') {
        valueType = FieldValueType.Boolean;
      } else if (values[0] instanceof Date) {
        valueType = FieldValueType.Date;
      }
    }
    return valueType;
  }
}
