export type ItemFieldResult<TValue = unknown> = {
  id?: string;
  name?: string;
  jsonValue?: TValue;
  value?: string;
};
