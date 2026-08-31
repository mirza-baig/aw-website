import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { Brand, Thing } from 'schema-dts';

import { PluginParams } from '../plugin-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const pluginId =
  SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.SchemaOrgGraph.Brand.Id;

export function plugin({
  graph,
  data,
  page,
}: PluginParams<Sitecore.Components.Seo.BrandSchema.BrandSchema['fields']>): Thing[] {
  if (!data) {
    return graph;
  }

  const canonicalHostName =
    (page.customProps.siteInfo?.canonicalHostName as string | undefined) ?? '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getValue = (field: any): string => {
    return typeof field === 'string' ? field : (field?.value ?? '');
  };

  const brand: Brand = {
    '@type': 'Brand',
    '@id': `${canonicalHostName}/#/schema/Brand/Andersen_Windows`,
    name: getValue(data.name) || 'Andersen Windows',
    alternateName: getValue(data.alternateName) || 'Andersen Windows & Doors',
    url: canonicalHostName,
    sameAs:
      getValue(data.sameAs)
        ?.split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean) ?? [],
  };

  return [...graph, brand];
}
