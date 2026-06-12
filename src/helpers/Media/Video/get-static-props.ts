import { ComponentRendering, Item } from '@sitecore-content-sdk/nextjs';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { itemIsTemplate } from 'lib/utils/sitecore-utils/item-is-template';

import { VideoStaticProps } from '../types';
import { isVideoItem, VideoItemTypes } from '../VideoUtils';
import { getStaticProps as getVimeoStaticProps } from '../Vimeo/get-static-props';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type VideoItemType = Item & VideoItemTypes;

export async function getStaticProps(rendering: ComponentRendering): Promise<VideoStaticProps> {
  // Cast the rendering to your union datasource type; downstream guards will refine
  const ds = rendering as unknown as VideoItemType;
  const result: VideoStaticProps = {};

  if (!isVideoItem(ds)) {
    return result;
  }

  if (
    itemIsTemplate<Sitecore.Elements.Media.VimeoVideo>(
      ds,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.VimeoVideo.Id
    )
  ) {
    result.vimeoStaticProps = await getVimeoStaticProps(rendering);
  }

  return result;
}

/**
 * New: item-based API (used by callers that only have the video item).
 */
export async function getStaticPropsFromVideoItem(videoItem: Item): Promise<VideoStaticProps> {
  const result: VideoStaticProps = {};
  if (!isVideoItem(videoItem)) {
    return result;
  }

  if (
    itemIsTemplate<Sitecore.Elements.Media.VimeoVideo>(
      videoItem,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.VimeoVideo.Id
    )
  ) {
    // Reuse the Vimeo-specific static props helper, but it expects a rendering or item?
    // If your '../Vimeo/get-static-props' accepts a Vimeo Item, prefer that overload.
    // If it only accepts a rendering, create a minimal faux rendering adapter (shown below).
    const fauxRendering = {
      // Only include what the vimeo get-static-props implementation reads
      componentName: 'VimeoWrapper', // any name—only if used
      fields: {
        // If the vimeo helper reads `rendering.fields.video` or similar, adjust here accordingly
        video: videoItem,
      },
    } as unknown as ComponentRendering;

    result.vimeoStaticProps = await getVimeoStaticProps(fauxRendering);
  }

  // Add YouTube/Facebook branches here if you later implement static props for those
  return result;
}
