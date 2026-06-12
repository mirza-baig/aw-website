export interface EnumField<T> {
  fields?: {
    Value?: {
      value: T;
    };
  };
}

export const getEnum = <T>(field?: EnumField<T>): T | undefined => field?.fields?.Value?.value;

export const getEnumsFromMultiselectField = <T>(field?: EnumField<T>[]): T[] | undefined =>
  field?.map((_) => _.fields?.Value?.value).filter((_): _ is T => !!_);
