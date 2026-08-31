import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { Article, CreativeWork, Organization, Thing } from 'schema-dts';

import { PluginParams } from '../plugin-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const pluginId =
  SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.SchemaOrgGraph.Article.Id;

export function plugin({ graph, page }: PluginParams<unknown>): Thing[] {
  const route = page.layout.sitecore.route;
  if (!route) {
    return graph;
  }

  const articleTemplateId =
    SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Pages.ArticlePage.Id;
  if (route.templateId?.toLowerCase() !== articleTemplateId.toLowerCase()) {
    return graph;
  }

  const canonicalHostName =
    (page.customProps.siteInfo?.canonicalHostName as string | undefined) ?? '';
  const requestedPath = page.customProps.requestedPath ?? '';
  const articleId = route.itemId ?? requestedPath;

  const pageFields = route.fields as Sitecore.FieldSets.Article['fields'] &
    Sitecore.FieldSets.Routes.SitemapLastUpdated['fields'] &
    Sitecore.FieldSets.Routes.ImageProperties['fields'] &
    Sitecore.FieldSets.Routes.PageProperties['fields'];

  const headline = pageFields?.articleTitle?.value ?? '';
  const datePublished = pageFields?.articleDate?.value ?? '';
  const dateModified = pageFields?.lastUpdated?.value ?? '';
  const image = pageFields?.primaryImage?.value?.src ?? '';

  if (!headline) {
    return graph;
  }

  const description = pageFields?.pageMetaDescription?.value ?? '';
  const canonicalUrl = `${canonicalHostName}${requestedPath}`;

  const article: Article = {
    '@type': 'Article',
    '@id': `${canonicalHostName}/#/schema/Article/${articleId}`,
    name: headline,
    headline,
    description: description || undefined,
    datePublished,
    dateModified,
    image: image ? [image] : undefined,
    isPartOf: { '@id': canonicalUrl } as unknown as CreativeWork,
    mainEntityOfPage: { '@id': canonicalUrl } as unknown as CreativeWork,
    author: {
      '@id': `${canonicalHostName}/#/schema/Organization/Andersen`,
    } as unknown as Organization,
    publisher: {
      '@id': `${canonicalHostName}/#/schema/Organization/Andersen`,
    } as unknown as Organization,
  };

  return [...graph, article];
}
