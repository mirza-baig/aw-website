import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { getStaticProps as getMediaPrimaryStaticProps } from 'helpers/Media/MediaPrimary/get-static-props';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { PromoReviewContentAuthoredClient } from './helpers/PromoReviewContentAuthoredClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type PromoReviewContentAuthoredProps = ComponentProps &
  Sitecore.Components.Promo.PromoReviewContentAuthored.PromoReviewContentAuthored;

async function PromoReviewContentAuthored_Default(props: PromoReviewContentAuthoredProps) {
  const { mediaPrimary } = await getComponentServerProps(props.rendering);

  return (
    <PromoReviewContentAuthoredClient
      fields={props.fields}
      rendering={props.rendering}
      mediaPrimary={mediaPrimary}
    />
  );
}

export const Default = withDatasourceCheck(PromoReviewContentAuthored_Default);

async function getComponentServerProps(rendering: ComponentRendering) {
  const datasource = rendering as PromoReviewContentAuthoredProps;

  const mediaStaticProps: MediaPrimaryStaticProps = {};

  if (!datasource) {
    return mediaStaticProps;
  }

  mediaStaticProps.mediaPrimary = await getMediaPrimaryStaticProps(datasource);

  return mediaStaticProps;
}
