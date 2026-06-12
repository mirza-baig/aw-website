import { ComponentProps } from 'lib/component-props';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type SizingToolProps = Sitecore.Components.Tool.SizingTool.SizingTool & {
  fields?: {
    pager: Sitecore.Elements.Search.Pager;
    facets: Array<Sitecore.Elements.Search.Facet>;
    searchParameters: Sitecore.Elements.Search.SearchParameters;
    productTypeFacet: Sitecore.Elements.Search.Facet;
    productDimensionsFacet: Sitecore.Elements.Search.Facet;
  };
  boostingExpression: string;
  filterExpression: string;
} & ComponentProps;
