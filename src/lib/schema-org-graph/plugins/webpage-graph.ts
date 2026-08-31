import { Thing, WebPage } from 'schema-dts';

import { PluginParams } from '../plugin-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export function plugin({ graph, page }: PluginParams<unknown>): Thing[] {
  const route = page.layout.sitecore.route;
  if (!route) {
    return graph;
  }

  const canonicalHostName = (page.customProps.siteInfo?.canonicalHostName ?? '') as string;
  const requestedPath = page.customProps.requestedPath ?? '/';
  const canonicalUrl = `${canonicalHostName}${requestedPath}`;

  const pageFields = route.fields as Sitecore.BaseTemplates.BasePage['fields'] &
    Sitecore.FieldSets.Routes.PageProperties['fields'];

  const name = pageFields?.pageTitle?.value ?? '';
  const description = pageFields?.pageMetaDescription?.value ?? undefined;

  // Strip trailing slash before appending fragment to match breadcrumb-graph @id format
  const normalizedPath = requestedPath === '/' ? '' : requestedPath.replace(/\/$/, '');
  const baseUrl = `${canonicalHostName}${normalizedPath}`;

  const webpage: WebPage = {
    '@type': 'WebPage',
    '@id': canonicalUrl,
    url: canonicalUrl,
    name: name || undefined,
    description: description || undefined,
    isPartOf: {
      '@id': `${canonicalHostName}/#/schema/WebSite/Andersen`,
    },
    publisher: {
      '@id': `${canonicalHostName}/#/schema/Organization/Andersen`,
    },
    inLanguage: 'en',
    breadcrumb: {
      '@id': `${baseUrl}/#/schema/BreadcrumbList/1`,
    },
  };

  return [...graph, webpage];
}
