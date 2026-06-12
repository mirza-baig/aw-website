import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { getStaticProps as getMediaPrimaryStaticProps } from 'helpers/Media/MediaPrimary/get-static-props';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { PromoFeaturedMediaClient } from './helpers/PromoFeaturedMediaClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type PromoFeaturedMediaProps = ComponentProps &
  Sitecore.Components.Promo.PromoFeaturedMedia.PromoFeaturedMedia;

async function getComponentServerProps(rendering: ComponentRendering) {
  const datasource = rendering as PromoFeaturedMediaProps;

  const mediaStaticProps: MediaPrimaryStaticProps = {};

  if (!datasource) {
    return mediaStaticProps;
  }

  mediaStaticProps.mediaPrimary = await getMediaPrimaryStaticProps(datasource);

  return mediaStaticProps;
}

async function PromoFeaturedMedia_Default(props: PromoFeaturedMediaProps) {
  const { mediaPrimary } = await getComponentServerProps(props.rendering);

  return (
    <PromoFeaturedMediaClient
      fields={props.fields}
      rendering={props.rendering}
      mediaPrimary={mediaPrimary}
    />
  );
}

export const Default = withDatasourceCheck(PromoFeaturedMedia_Default);
