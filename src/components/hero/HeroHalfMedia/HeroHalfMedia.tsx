import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { getStaticProps as getMediaPrimaryStaticProps } from 'helpers/Media/MediaPrimary/get-static-props';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { HeroHalfMediaClient } from './helpers/HeroHalfMediaClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeroHalfMediaProps = Sitecore.Components.Hero.HeroHalfMedia.HeroHalfMedia;

async function HeroHalfMedia_Default(props: HeroHalfMediaProps): Promise<JSX.Element> {
  const { mediaPrimary } = await getComponentServerProps(props.rendering);

  return (
    <HeroHalfMediaClient
      fields={props.fields}
      rendering={props.rendering}
      mediaPrimary={mediaPrimary}
    />
  );
}

export const Default = withDatasourceCheck(HeroHalfMedia_Default);

async function getComponentServerProps(rendering: ComponentRendering) {
  const datasource = rendering as unknown as HeroHalfMediaProps;
  const mediaStaticProps: MediaPrimaryStaticProps = {};
  if (!datasource) {
    return mediaStaticProps;
  }
  mediaStaticProps.mediaPrimary = await getMediaPrimaryStaticProps(datasource);

  return mediaStaticProps;
}
