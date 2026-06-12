import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { getStaticProps as getMediaPrimaryStaticProps } from 'helpers/Media/MediaPrimary/get-static-props';
import { getStaticProps as getMediaSecondaryStaticProps } from 'helpers/Media/MediaSecondary';
import { MediaPrimaryStaticProps, MediaSecondaryStaticProps } from 'helpers/Media/types';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { ContentBlockWithMediaClient } from './helpers/ContentBlockWithMediaClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

async function getComponentServerProps(rendering: ComponentRendering) {
  const datasource = rendering as unknown as ContentBlockWithMediaProps;
  const mediaStaticProps: MediaPrimaryStaticProps & MediaSecondaryStaticProps = {};

  if (!datasource) {
    return mediaStaticProps;
  }

  mediaStaticProps.mediaPrimary = await getMediaPrimaryStaticProps(datasource);
  mediaStaticProps.mediaSecondary = await getMediaSecondaryStaticProps(datasource);
  return mediaStaticProps;
}

type ContentBlockWithMediaProps = ComponentProps &
  Sitecore.Components.General.ContentBlockWithMedia.ContentBlockWithMedia;

async function ContentBlockWithMedia_Default(props: ContentBlockWithMediaProps) {
  const mediaProps = await getComponentServerProps(props.rendering);

  return (
    <ContentBlockWithMediaClient
      fields={props.fields}
      rendering={props.rendering}
      mediaPrimary={mediaProps.mediaPrimary}
      mediaSecondary={mediaProps.mediaSecondary}
    />
  );
}

export const Default = withDatasourceCheck(ContentBlockWithMedia_Default);
