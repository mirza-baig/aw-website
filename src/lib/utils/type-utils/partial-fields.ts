export type PartialFields<T extends { fields?: unknown }> = {
  fields?: Partial<T['fields']>;
};
