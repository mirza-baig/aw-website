import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { Brand, ContactPoint, Organization, Place, Thing } from 'schema-dts';

import { PluginParams } from '../plugin-types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export const pluginId =
  SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.SchemaOrgGraph.Organization.Id;

export function plugin({
  graph,
  data,
  page,
}: PluginParams<Sitecore.Components.Seo.OrganizationSchema.OrganizationSchema['fields']>): Thing[] {
  if (!data) {
    return graph;
  }

  const canonicalHostName =
    (page.customProps.siteInfo?.canonicalHostName as string | undefined) ?? '';

  const brandId = `${canonicalHostName}/#/schema/Brand/Andersen_Windows`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getValue = (field: any): string => {
    return typeof field === 'string' ? field : (field?.value ?? '');
  };

  const organization: Organization = {
    '@type': 'Organization',
    '@id': `${canonicalHostName}/#/schema/Organization/Andersen`,
    name: getValue(data.name) || getValue(data.legalName),
    alternateName: getValue(data.alternateName),
    url: canonicalHostName,
    description: getValue(data.description),
    email: getValue(data.email),
    telephone: getValue(data.telephone),
    address: {
      '@type': 'PostalAddress',
      streetAddress: getValue(data.street),
      addressLocality: getValue(data.city),
      addressRegion: getValue(data.state),
      addressCountry: getValue(data.country),
      postalCode: getValue(data.zip),
    },
    brand: { '@id': brandId } as unknown as Brand,
    logo: data.logo?.value?.src ?? '',
    founder: data.founderName
      ? {
          '@type': 'Person',
          '@id': `${canonicalHostName}/#/schema/Person/Founder`,
          name: getValue(data.founderName),
          url: getValue(data.founderNameUrl),
        }
      : undefined,
    foundingDate: getValue(data.foundingDate),
    foundingLocation: data.foundingLocation
      ? ({
          '@type': 'Place',
          name: getValue(data.foundingLocation),
          url: getValue(data.foundingLocationUrl),
        } as unknown as Place)
      : undefined,
    leiCode: getValue(data.leiCode),
    numberOfEmployees: getValue(data.numberOfEmployees)
      ? {
          '@type': 'QuantitativeValue',
          value: getValue(data.numberOfEmployees),
        }
      : undefined,
    sameAs:
      getValue(data.sameAs)
        ?.split(/\r?\n/)
        .map((url) => url.trim())
        .filter(Boolean) ?? [],
    contactPoint:
      data.contactPoint?.map(
        (cp: Sitecore.Elements.Seo.SchemaOrgGraph.ContactPoint) =>
          ({
            '@type': 'ContactPoint',
            name: getValue(cp.fields?.fullName),
            contactType: getValue(cp.fields?.contactType),
            telephone: getValue(cp.fields?.telephone),
            contactOption: getValue(cp.fields?.contactOption),
            areaServed: getValue(cp.fields?.areaServed),
            availableLanguage: getValue(cp.fields?.availableLanguage),
          }) as ContactPoint
      ) ?? [],
  };

  return [...graph, organization];
}
