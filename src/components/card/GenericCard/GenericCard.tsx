import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { DesktopVideoDisplayStyleType } from 'components/listing/XupCardCollection/helpers/XupCardCollection.types';
import { getStaticProps as getMediaPrimaryStaticProps } from 'helpers/Media/MediaPrimary/get-static-props';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import { ComponentProps } from 'lib/component-props';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { GenericCardClient } from './helpers/GenericCardClient';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type GenericCardProps = ComponentProps &
  Sitecore.Cards.GenericCard.GenericCard & {
    desktopVideoDisplayStyle: DesktopVideoDisplayStyleType;
  };

async function GenericCard_Default(props: GenericCardProps): Promise<JSX.Element> {
  const { mediaPrimary } = await getComponentServerProps(props.rendering);

  return <GenericCardClient fields={props.fields} mediaPrimary={mediaPrimary} />;
}

export const Default = withDatasourceCheck(GenericCard_Default);

async function getComponentServerProps(
  rendering: ComponentRendering
): Promise<MediaPrimaryStaticProps> {
  const datasource = rendering as unknown as GenericCardProps;

  const mediaStaticProps: MediaPrimaryStaticProps = {};
  if (!datasource) {
    return mediaStaticProps;
  }

  mediaStaticProps.mediaPrimary = await getMediaPrimaryStaticProps(datasource);
  return mediaStaticProps;
}
