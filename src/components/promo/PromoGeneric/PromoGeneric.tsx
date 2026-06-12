import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { getStaticProps as getMediaPrimaryStaticProps } from 'helpers/Media/MediaPrimary/get-static-props';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { PromoGenericClient } from './helpers/PromoGenericClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type PromoGenericProps = ComponentProps & Sitecore.Components.Promo.PromoGeneric.PromoGeneric;

async function getComponentServerProps(rendering: ComponentRendering) {
  const datasource = rendering as PromoGenericProps;

  const mediaStaticProps: MediaPrimaryStaticProps = {};

  if (!datasource) {
    return mediaStaticProps;
  }

  mediaStaticProps.mediaPrimary = await getMediaPrimaryStaticProps(datasource);

  return mediaStaticProps;
}

async function PromoGeneric_Default(props: PromoGenericProps) {
  const { mediaPrimary } = await getComponentServerProps(props.rendering);

  return (
    <PromoGenericClient
      fields={props.fields}
      rendering={props.rendering}
      mediaPrimary={mediaPrimary}
    />
  );
}

export const Default = withDatasourceCheck(PromoGeneric_Default);
