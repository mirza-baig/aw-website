import { BreadcrumbItem } from 'lib/breadcrumb/breadcrumb-service';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { BreadcrumbList, ListItem, Thing } from 'schema-dts';

import { PluginParams } from '../plugin-types';

// Placeholder: update with the Sitecore template ID for the breadcrumb graph item once created in XM Cloud
export const pluginId =
  SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.SchemaOrgGraph.Breadcrumb.Id;

export function plugin({ graph, page, websiteStaticState }: PluginParams<unknown>): Thing[] {
  const breadcrumbs: BreadcrumbItem[] = websiteStaticState.breadcrumbs ?? [];
  const canonicalHostName =
    (websiteStaticState.siteInfo?.canonicalHostName as string | undefined) ?? '';
  const requestedPath = websiteStaticState.requestedPath ?? '';

  if (breadcrumbs.length <= 1) {
    return graph;
  }

  // Normalize path: strip trailing slash before appending fragment so @id is consistent with WebPage @id
  const normalizedPath = requestedPath === '/' ? '' : requestedPath.replace(/\/$/, '');

  const breadcrumbList: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalHostName}${normalizedPath}/#/schema/BreadcrumbList/1`,
    itemListElement: breadcrumbs.map((item, index): ListItem => {
      const isLast = index === breadcrumbs.length - 1;
      const href = item.href === '/' ? '' : item.href;
      const itemValue = isLast
        ? { '@id': `${canonicalHostName}${item.href}` }
        : `${canonicalHostName}${href}`;

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: itemValue,
      };
    }),
  };

  return [...graph, breadcrumbList];
}
