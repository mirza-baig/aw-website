import { Field, ImageField, Item } from '@sitecore-content-sdk/nextjs';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { guidEquals } from 'lib/utils/string-utils/guid-equals';
import { VideoObject } from 'schema-dts';

type VideoItemFields = {
  _AW_TemplateId?: Field<string>;
  videoId?: Field<string>;
  videoName?: Field<string>;
  videoDescription?: Field<string>;
  videoThumbnailImage?: ImageField;
  // Vimeo-only field used as fallback type discriminator
  vimeoVideoHash?: Field<string>;
};

const { YouTubeVideo, VimeoVideo } =
  SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media;

export function extractVideoNode(videoItem: Item | undefined): VideoObject | null {
  if (!videoItem) {
    return null;
  }

  const f = videoItem.fields as VideoItemFields | undefined;
  const videoId = f?.videoId?.value;
  if (!videoId) {
    return null;
  }

  const templateId = f?._AW_TemplateId?.value ?? '';
  const isYouTube = guidEquals(templateId, YouTubeVideo.Id);
  const isVimeo = guidEquals(templateId, VimeoVideo.Id) || !!f?.vimeoVideoHash?.value;

  if (!isYouTube && !isVimeo) {
    return null;
  }

  const thumbnailSrc = f?.videoThumbnailImage?.value?.src;
  const thumbnailUrl =
    thumbnailSrc ?? (isYouTube ? `https://i.ytimg.com/vi/${videoId}/sddefault.jpg` : undefined);

  const contentUrl = isYouTube
    ? `https://www.youtube.com/watch?v=${videoId}`
    : `https://vimeo.com/${videoId}`;

  return {
    '@type': 'VideoObject',
    '@id': contentUrl,
    name: f?.videoName?.value || undefined,
    description: f?.videoDescription?.value || undefined,
    contentUrl,
    embedUrl: isYouTube
      ? `https://www.youtube.com/embed/${videoId}`
      : `https://player.vimeo.com/video/${videoId}`,
    thumbnailUrl: thumbnailUrl || undefined,
  };
}
