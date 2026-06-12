import { Field, Item } from '@sitecore-content-sdk/nextjs';

export type Tab = {
  id: string;
  contentId: Field<string>;
  headlineText: Field<string>;
  headlineLevel?: Item;
};
