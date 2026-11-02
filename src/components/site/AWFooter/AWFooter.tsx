import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { cacheLife } from 'next/cache';
import { JSX } from 'react';

import { AWFooterClient } from './helpers/AWFooterClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type AWFooterProps = ComponentProps & Sitecore.Components.Navigation.Footer.Footer;

async function AWFooter_Default(props: AWFooterProps): Promise<JSX.Element> {
  const { fields } = getComponentServerProps(props.rendering) as AWFooterProps;
  return (
    <AWFooterClient
      fields={fields}
      rendering={props.rendering}
      page={props.page}
      currentYear={await getCurrentYear()}
      websiteStaticState={props.websiteStaticState}
    />
  );
}

export const Default = withDatasourceCheck(AWFooter_Default);

// --- Server props ----------------------------------------------------------

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      template: { name: string };
      fields: ItemFieldResult[];
      children: ItemSearchResults<{
        template: { name: string };
        fields: ItemFieldResult[];
        children: ItemSearchResults<{
          template: { name: string };
          fields: ItemFieldResult[];
        }>;
      }>;
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering) {
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }
  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(
        fields.data.item.children,
        (child1) => ({
          fields: {
            ...mapItemFieldResultsToObject(child1.fields),
            children: mapSearchResults(child1.children, (child2) => ({
              fields: {
                ...mapItemFieldResultsToObject(child2.fields),
                children: mapSearchResults(child2.children, (child3) => ({
                  fields: {
                    ...mapItemFieldResultsToObject(child3.fields),
                  },
                })),
              },
            })),
          },
        }),
        []
      ),
    },
  };

  return result;
}

async function getCurrentYear() {
  'use cache';

  cacheLife('max');
  return new Date().getFullYear().toString();
}
