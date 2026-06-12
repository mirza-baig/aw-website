import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { getStaticProps as getMediaPrimaryStaticProps } from 'helpers/Media/MediaPrimary/get-static-props';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import { SwatchCollectionProps } from 'helpers/SwatchCollection/SwatchCollection';
import { ComponentProps } from 'lib/component-props';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { PromoSwatchesClient } from './helpers/PromoSwatchesClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type PromoSwatchesProps = ComponentProps &
  Sitecore.Components.Promo.PromoSwatches.PromoSwatches & {
    fields?: {
      children: SwatchCollectionProps[];
    };
  };

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      fields: ItemFieldResult[];
    }>;
  };
}>;

function mapFields(fieldData: IntegratedGraphQl) {
  return {
    fields: {
      ...mapItemFieldResultsToObject(fieldData.data.item.fields),
      children: mapSearchResults(fieldData.data.item.children, (child) => {
        return {
          fields: {
            ...mapItemFieldResultsToObject(child.fields),
          },
        };
      }),
    },
  };
}

async function getComponentServerProps(rendering: ComponentRendering) {
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }

  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = mapFields(fields);

  const datasource = result as PromoSwatchesProps;

  const mediaStaticProps: MediaPrimaryStaticProps = {};

  if (!datasource) {
    return { ...result, ...mediaStaticProps };
  }

  mediaStaticProps.mediaPrimary = await getMediaPrimaryStaticProps(datasource);

  return { ...result, ...mediaStaticProps };
}

async function PromoSwatches_Default(props: PromoSwatchesProps) {
  const { fields, mediaStaticProps } = (await getComponentServerProps(
    props.rendering
  )) as PromoSwatchesProps;
  return (
    <PromoSwatchesClient
      fields={fields}
      rendering={props.rendering}
      mediaStaticProps={mediaStaticProps}
    />
  );
}

export const Default = withDatasourceCheck(PromoSwatches_Default);
