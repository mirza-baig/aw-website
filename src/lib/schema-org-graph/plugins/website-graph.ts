import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { Organization, SearchAction, Thing, WebSite } from 'schema-dts';

import { PluginParams } from '../plugin-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const pluginId =
  SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.SchemaOrgGraph.Website.Id;

export function plugin({
  graph,
  data,
  page,
}: PluginParams<Sitecore.Components.Seo.WebsiteSchema.WebsiteSchema['fields']>): Thing[] {
  if (!data) {
    return graph;
  }

  const canonicalHostName =
    (page.customProps.siteInfo?.canonicalHostName as string | undefined) ?? '';
  const siteName = page.customProps.siteInfo?.name ?? '';

  const website: WebSite = {
    '@type': 'WebSite',
    '@id': `${canonicalHostName}/#/schema/WebSite/Andersen`,
    name: siteName,
    url: canonicalHostName,
    publisher: {
      '@id': `${canonicalHostName}/#/schema/Organization/Andersen`,
    } as unknown as Organization,
    copyrightHolder: {
      '@id': `${canonicalHostName}/#/schema/Organization/Andersen`,
    } as unknown as Organization,
  };

  const searchPageUrl = data.searchPage?.value?.href;
  if (searchPageUrl) {
    website.potentialAction = {
      '@type': 'SearchAction',
      target: `${canonicalHostName}${searchPageUrl}#q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    } as SearchAction;
  }

  return [...graph, website];
}
