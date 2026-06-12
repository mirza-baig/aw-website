export const buildVariableList = (prefix: string, type: string, count: number) => {
  if (count <= 0) {
    return '';
  }

  return `, ${Array.from({ length: count }, (_, index) => `$${prefix}${index}:${type}`).join(
    ', '
  )}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildVariableValues = (prefix: string, values: any[]) => {
  if (values.length <= 0) {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, any> = {};
  for (let i = 0; i < values.length; i++) {
    result[`${prefix}${i}`] = values[i];
  }

  return result;
};

export const buildExpressionList = (
  name: string,
  operator: string,
  prefix: string,
  count: number
) => {
  if (count <= 0) {
    return '';
  }

  return Array.from(
    { length: count },
    (_, index) => `{ name: "${name}", value: $${prefix}${index}, operator: ${operator} }`
  ).join('\n');
};
