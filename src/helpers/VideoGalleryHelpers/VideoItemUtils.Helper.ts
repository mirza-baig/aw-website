import { Result, ResultListState } from '@coveo/headless';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { getResultItemIndex } from 'lib/coveo';
import { ResultEntities } from 'lib/coveo/utils';
import { EnumField } from 'lib/utils/get-enum';
import { guidEquals } from 'lib/utils/string-utils/guid-equals';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type VideoType = 'FacebookVideo' | 'VimeoVideo' | 'YouTubeVideo';

/**
 * Get video template details based on the template ID.
 * @param templateId - Template ID of the video.
 * @returns Video template name and id or null if no match is found.
 */
const getVideoTemplateDetails = (
  templateId: string
): { templateId: string; templateName: VideoType } | null => {
  for (const [videoType, template] of Object.entries(
    SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media
  )) {
    if (guidEquals(template.Id, templateId)) {
      return { templateId: template.Id, templateName: videoType as VideoType };
    }
  }
  return null;
};

/**
 * Get primary video properties based on the video template type.
 * @param result - Coveo Result item.
 * @returns Primary video props.
 */
const getPrimaryVideoProps = (result: Result) => {
  const videoTemplate = getVideoTemplateDetails((result.raw['aw_xmc_videotype'] as string) || '');

  const primaryVideo = {
    id: '',
    url: '',
    name: '',
    displayName: '',
    fields: {},
    ...(videoTemplate || {}),
  };

  switch (videoTemplate?.templateName ?? 'YouTubeVideo') {
    case 'YouTubeVideo':
      primaryVideo.fields = {
        youTubeAutoLoop: { value: result.raw['aw_xmc_video_youtubeautoloop'] },
        youTubeAutoPlay: { value: false },
        youTubeClosedCaptions: {
          value: result.raw['aw_xmc_video_youtubeclosedcaptions'],
        },
        youTubeDisableKeyboard: { value: false },
        youTubeModestBranding: { value: false },
        youTubeMute: { value: result.raw['aw_xmc_video_youtubemute'] },
        youTubeShowControls: {
          value: result.raw['aw_xmc_video_youtubeshowcontrols'],
        },
        videoHeight: { value: result.raw['aw_xmc_videothumbnail_height'] ?? 338 },
        videoId: { value: result.raw['aw_xmc_videoid'] },
        videoLazyLoad: { value: false },
        videoWidth: { value: result.raw['aw_xmc_videothumbnail_width'] ?? 600 },
        videoName: { value: result.raw['aw_xmc_videoname'] },
        videoDescription: { value: result.raw['aw_xmc_videodescription'] },
        lastUpdated: { value: result.raw['aw_xmc_lastupdated'] },
      };
      break;

    case 'FacebookVideo':
      primaryVideo.fields = {
        facebookAutoPlay: {
          value: false,
        },
        facebookShowCaptions: {
          value: result.raw['aw_xmc_video_facebookshowcaptions'],
        },
        facebookShowText: {
          value: result.raw['aw_xmc_video_facebookshowtext'],
        },
        videoHeight: {
          value: result.raw['aw_xmc_videothumbnail_height'] ?? 338,
        },
        videoId: {
          value: result.raw['aw_xmc_videoid'],
        },
        videoLazyLoad: {
          value: false,
        },
        videoWidth: {
          value: result.raw['aw_xmc_videothumbnail_width'] ?? 600,
        },
      };
      break;

    case 'VimeoVideo':
      primaryVideo.fields = {
        vimeoAutoPause: {
          value: false,
        },
        vimeoAutoPlay: {
          value: false,
        },
        vimeoBackground: {
          value: false,
        },
        vimeoByline: {
          value: false,
        },
        vimeoColor: {
          value: '00adef',
        },
        vimeoControls: {
          value: true,
        },
        vimeoDNT: {
          value: false,
        },
        vimeoKeyboard: {
          value: true,
        },
        vimeoLoop: {
          value: true,
        },
        vimeoMuted: {
          value: false,
        },
        vimeoPictureInPicture: {
          value: false,
        },
        vimeoPlaysInline: {
          value: true,
        },
        videoHeight: {
          value: result.raw['aw_xmc_videothumbnail_height'] ?? 338,
        },
        videoId: {
          value: result.raw['aw_xmc_videoid'],
        },
        videoLazyLoad: {
          value: false,
        },
        videoWidth: {
          value: result.raw['aw_xmc_videothumbnail_width'] ?? 600,
        },
        videoName: { value: result.raw['aw_xmc_videoname'] },
        videoDescription: { value: result.raw['aw_xmc_videodescription'] },
        lastUpdated: { value: result.raw['aw_xmc_lastupdated'] },
      };
  }

  return primaryVideo;
};

/**
 * Get properties for a video item.
 * @param result - Coveo Result item.
 * @param resultItemToConsider - ResultEntity item to consider for field mapping.
 * @returns Video item props.
 */
export const getVideoItemProps = (
  result: Result,
  resultItemToConsider: Sitecore.Elements.Search.VideoResultItem
) => {
  return {
    id: '',
    url: '',
    name: '',
    displayName: '',
    fields: {
      videoThumbnail: {
        value: {
          src: result.raw[
            (resultItemToConsider?.fields?.thumbnailImageDesktopField as EnumField<string>)?.fields
              ?.Value?.value as keyof typeof result.raw
          ],
          alt: result.raw['aw_xmc_videothumbnail_alt'],
          width: result.raw['aw_xmc_videothumbnail_width'],
          height: result.raw['aw_xmc_videothumbnail_height'],
        },
      },
      videoThumbnailMobile: {
        value: {
          src: result.raw[
            (resultItemToConsider?.fields?.thumbnailImageMobileField as EnumField<string>)?.fields
              ?.Value?.value as keyof typeof result.raw
          ],
          alt: result.raw['aw_xmc_videothumbnailmobile_alt'],
          width: result.raw['aw_xmc_videothumbnailmobile_width'] ?? 600,
          height: result.raw['aw_xmc_videothumbnailmobile_height'] ?? 338,
        },
      },
      videoThumbnailMobileFocusArea: {
        id: '',
        url: '',
        name: 'Center',
        templateId: '',
        displayName: 'Center',
        fields: {
          Value: {
            value:
              result.raw[
                (
                  resultItemToConsider?.fields
                    ?.thumbnailImageMobileFocusAreaField as EnumField<string>
                )?.fields?.Value?.value as keyof typeof result.raw
              ] ?? 'center',
          },
        },
      },
      eyebrowLevel: {
        id: '',
        url: '',
        name: '',
        displayName: '',
        fields: {
          Value: {
            value: 'h4',
          },
        },
        templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
        templateName: 'Enum',
      },
      eyebrowText: {
        value:
          result.raw[
            (resultItemToConsider?.fields?.eyebrowField as EnumField<string>)?.fields?.Value
              ?.value as keyof typeof result.raw
          ],
      },
      headlineLevel: {
        id: '7f10288a-beb1-4d95-a139-32df40094441',
        url: 'http://localhost/sitecore/login/sitecore/system/Settings/Foundation/EnterpriseWeb/Enums/Headline-Levels/Heading-3',
        name: 'Heading 3',
        displayName: 'Heading 3',
        fields: {
          Value: {
            value: 'h3',
          },
        },
        templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
        templateName: 'Enum',
      },
      headlineText: {
        value:
          result.raw[
            (resultItemToConsider?.fields?.headingField as EnumField<string>)?.fields?.Value
              ?.value as keyof typeof result.raw
          ],
      },
      body: {
        value:
          result.raw[
            (resultItemToConsider?.fields?.descriptionField as EnumField<string>)?.fields?.Value
              ?.value as keyof typeof result.raw
          ],
      },
      primaryVideo: getPrimaryVideoProps(result),
    },
    templateId: '5dabd9c5-9c73-46b0-a2f1-41a0491a322e',
    templateName: 'Gallery Video',
  };
};

/**
 * Get video item list properties.
 * @param resultListState - Coveo Resultlist state.
 * @param resultItems - Result entities for coveo field mapping.
 * @returns List of video items.
 */
export const getVideoItemListProps = (
  resultListState: ResultListState,
  resultItems: ResultEntities
) => {
  const videos = resultListState?.results.map((result) => {
    const resultItemIndex = resultListState?.results
      ? getResultItemIndex(resultItems, result.raw.sc_templateid as string)
      : 0;

    const resultItemToConsider = resultItems[
      resultItemIndex
    ] as Sitecore.Elements.Search.VideoResultItem;

    return getVideoItemProps(result, resultItemToConsider);
  });

  return videos || [];
};

export const defaultVideoFieldsToInclude = [
  'aw_xmc_video_youtubeautoloop',
  'aw_xmc_video_youtubeclosedcaptions',
  'aw_xmc_video_youtubeshowcontrols',
  'aw_xmc_video_youtubemute',
  'aw_xmc_video_facebookshowcaptions',
  'aw_xmc_video_facebookshowtext',
  'aw_xmc_videoid',
  'aw_xmc_videothumbnail_height',
  'aw_xmc_videothumbnail_width',
  'aw_xmc_videothumbnail_alt',
  'aw_xmc_videothumbnailmobile_height',
  'aw_xmc_videothumbnailmobile_width',
  'aw_xmc_videothumbnailmobile_alt',
  'aw_xmc_videotype',
];
