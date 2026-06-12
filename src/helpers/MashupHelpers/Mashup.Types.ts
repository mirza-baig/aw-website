import { Field, ImageField, Item } from '@sitecore-content-sdk/nextjs';
import { ImagePrimaryProps } from 'helpers/Media/ImagePrimary';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type MashupStyle = 'images-for-all' | 'feature-image-only' | 'no-images';
export type PageStyle = 'standard-page' | 'article-page' | 'project-showcase-page';

type OpenGraphMetaFields = 'openGraphTitle' | 'openGraphDescription';
type SiteSearchMetaFields = 'siteSearchEyebrow' | 'siteSearchHeadline' | 'siteSearchDescription';
type ProjectShowcaseMetaFields = 'projectShowcaseTitle' | 'projectShowcaseDescription';
type ArticleMetaFields = 'articleTitle' | 'articleDescription';

type MetaFields = {
  [key in
    | OpenGraphMetaFields
    | SiteSearchMetaFields
    | ProjectShowcaseMetaFields
    | ArticleMetaFields]?: Field<string>;
};

type ImageFields = {
  [key in 'featuredImage' | 'siteSearchImage' | 'primaryImage' | 'primaryImageMobile']?: ImageField;
};

export type ResultItem = Sitecore.FieldSets.Routes.PageProperties &
  Item & {
    fields: {
      articleCategory?: Array<Sitecore.Data.Search.FacetTag>;
      primaryImageMobileFocusArea?: Item;
    } & MetaFields &
      ImageFields;
  };

export type ResultItems = {
  fields: {
    resultItems: Array<ResultItem>;
  };
};

export type ImageForAllProps = Sitecore.Components.General.PageMashup.PageMashup &
  ResultItems & { fields: { mashupStyle: MashupStyle } };

export type FeaturedImageOnlyProps = Sitecore.Components.General.PageMashup.PageMashup &
  ResultItems & { fields: { mashupStyle: MashupStyle } };

export type ItemData = {
  eyebrow: string;
  headline: string;
  description: string;
  image: ImagePrimaryProps;
  cta: Sitecore.FieldSets.Cta1;
};
