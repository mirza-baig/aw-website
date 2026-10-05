import { Item as SitecoreItem } from '@sitecore-content-sdk/nextjs';

export type Item<TFields> = Omit<SitecoreItem, 'fields'> & {
  fields: TFields;
};
