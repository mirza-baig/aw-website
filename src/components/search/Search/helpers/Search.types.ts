import { Sitecore } from '.sitecore/AndersenWindows.model';

export type GridStyle = 'photo-gallery' | 'result-with-image' | 'result-without-image';

export type SearchProps = Sitecore.Components.Search.Search.Search & {
  fields: {
    searchBox: Sitecore.Elements.Search.SearchBox;
    pager: Sitecore.Elements.Search.Pager;
    facets: Sitecore.Elements.Search.Facet[];
    searchParameters: Sitecore.Elements.Search.SearchParameters;
    tabs: Sitecore.Elements.Search.Tab[];
    listResultItems: Sitecore.Elements.Search.ListResultItem[];
    gridResultItems: Sitecore.Elements.Search.GridResultItem[];
    columns: Sitecore.Elements.Search.ResultColumn[];
    didYouMean: Sitecore.Elements.Search.DidYouMean;
  };
};
