import { ImageField, Item } from '@sitecore-content-sdk/nextjs';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { itemInheritsBaseItem } from 'lib/utils/sitecore-utils/item-inherits-base-item';
import { itemIsTemplate } from 'lib/utils/sitecore-utils/item-is-template';

import { VideoStaticProps } from './types';
import {
  getJsonLD as vimeo_getJsonLD,
  playStopVideo as videmo_playStopVideo,
} from './Vimeo/VimeoWrapper';
import {
  getJsonLD as youTube_getJsonLD,
  playStopVideo as youTube_playStopVideo,
} from './YouTubeWrapper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type VideoItemTypes =
  | Sitecore.Elements.Media.VimeoVideo
  | Sitecore.Elements.Media.YouTubeVideo
  | Sitecore.Elements.Media.FacebookVideo;

export const isVideoItem = (item: Item | undefined): item is VideoItemTypes => {
  if (!itemInheritsBaseItem(item)) {
    return false;
  }

  return (
    itemIsTemplate<Sitecore.Elements.Media.FacebookVideo>(
      item,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.FacebookVideo
        .Id
    ) ||
    itemIsTemplate<Sitecore.Elements.Media.VimeoVideo>(
      item,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.VimeoVideo.Id
    ) ||
    itemIsTemplate<Sitecore.Elements.Media.YouTubeVideo>(
      item,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.YouTubeVideo
        .Id
    )
  );
};
export const getJsonLD = (
  video: Item | undefined,
  thumbnail?: ImageField,
  staticProps?: VideoStaticProps
): Record<string, unknown> | undefined => {
  if (!isVideoItem(video)) {
    return undefined;
  }

  if (
    itemIsTemplate<Sitecore.Elements.Media.VimeoVideo>(
      video as unknown as Sitecore.BaseTemplates.BaseItem,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.VimeoVideo.Id
    )
  ) {
    return vimeo_getJsonLD(video as Sitecore.Elements.Media.VimeoVideo, thumbnail, staticProps);
  }

  if (
    itemIsTemplate<Sitecore.Elements.Media.YouTubeVideo>(
      video as unknown as Sitecore.BaseTemplates.BaseItem,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.YouTubeVideo
        .Id
    )
  ) {
    return youTube_getJsonLD(video as Sitecore.Elements.Media.YouTubeVideo, thumbnail, staticProps);
  }

  return undefined;
};

export const playStopVideo = (
  video: VideoItemTypes,
  action: 'playVideo' | 'stopVideo' | 'pauseVideo'
): void => {
  if (
    itemIsTemplate<Sitecore.Elements.Media.YouTubeVideo>(
      video,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.YouTubeVideo
        .Id
    )
  ) {
    youTube_playStopVideo(video, action);
  }

  if (
    itemIsTemplate<Sitecore.Elements.Media.VimeoVideo>(
      video,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.VimeoVideo.Id
    )
  ) {
    videmo_playStopVideo(video, action);
  }
};
