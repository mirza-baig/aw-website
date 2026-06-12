import type { ComponentRendering } from '@sitecore-content-sdk/nextjs';

import type { VimeoVideoStaticProps } from '../types';
import type { Sitecore } from '.sitecore/AndersenWindows.model';

export async function getStaticProps(
  // props: Sitecore.Elements.Media.VimeoVideo
  rendering: ComponentRendering
): Promise<VimeoVideoStaticProps> {
  const result: VimeoVideoStaticProps = {};
  const ds = rendering as unknown as Sitecore.Elements.Media.VimeoVideo;

  const id = ds?.fields?.videoId?.value;

  if (!id) {
    return result;
  }
  try {
    const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${id}`);
    const data = await response.json();
    result.videoThumbnailUrl = data.thumbnail_url;
  } catch (error) {
    console.error('Error fetching Vimeo thumbnail:', error);
  }

  return result;
}
