import { Field } from '@sitecore-content-sdk/nextjs';

export type Tab = {
  id: string;
  contentId: Field<string>;
  title: Field<string>;
};
