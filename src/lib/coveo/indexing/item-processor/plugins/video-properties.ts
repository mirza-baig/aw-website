import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { checkHostNameInMediaURL } from 'lib/coveo/utils';
import { normalizeSitecoreDateString } from 'lib/utils/string-utils/normalize-sitecore-date-string';

import {
  getCheckboxField,
  getDateField,
  getImageField,
  getLookupField,
  getRichTextField,
  getTextField,
  IndexableItem,
  SitemapItem,
} from '../..';

export class VideoProperties {
  order = 70;

  async exec(siteMapItem: SitemapItem, indexableItem: IndexableItem) {
    const baseGalleryVideoTemplateId =
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.BaseTemplates._BaseGalleryVideo.Id.replace(
        /-/g,
        ''
      );

    if (indexableItem.allTemplateIds.indexOf(baseGalleryVideoTemplateId) == -1) {
      return siteMapItem;
    }

    siteMapItem.loc = siteMapItem.itemUri;

    const lastUpdated = getDateField(indexableItem.fields, 'lastUpdated');
    if (lastUpdated && lastUpdated.value) {
      const normalized = normalizeSitecoreDateString(lastUpdated.value);
      siteMapItem.lastmod = new Date(normalized);
    }

    siteMapItem.metaData['siteLanguage'] = indexableItem.language;

    siteMapItem.metaData['siteName'] = indexableItem.siteName;

    siteMapItem.metaData['sitesearchtopic'] = 'Videos';

    this.addTextFieldMeta(indexableItem, siteMapItem, ['eyebrowText', 'headlineText']);

    const body = getRichTextField(indexableItem.fields, 'body');
    if (body) {
      siteMapItem.metaData[`video_${body.name}`] = body.value;
    }

    this.addImageFieldMeta(indexableItem, siteMapItem, ['videoThumbnail', 'videoThumbnailMobile']);

    this.addLookupFieldMeta(indexableItem, siteMapItem, ['videoThumbnailMobileFocusArea']);

    const primaryVideo = getLookupField(indexableItem.fields, 'primaryVideo');
    if (primaryVideo && primaryVideo.targetItem) {
      const videoId = getTextField(primaryVideo.targetItem.fields, 'videoId');

      if (videoId) {
        siteMapItem.metaData[videoId.name] = videoId.value;

        const videoName = getTextField(primaryVideo.targetItem.fields, 'videoName');
        if (videoName) {
          siteMapItem.metaData[videoName.name] = videoName.value;
        }

        const videoDescription = getTextField(primaryVideo.targetItem.fields, 'videoDescription');
        if (videoDescription) {
          siteMapItem.metaData[videoDescription.name] = videoDescription.value;
        }

        const lastUpdated = getDateField(primaryVideo.targetItem.fields, 'lastUpdated');
        if (lastUpdated && lastUpdated.value) {
          const normalized = normalizeSitecoreDateString(lastUpdated.value);
          siteMapItem.metaData[lastUpdated.name] = new Date(normalized);
        }

        siteMapItem.metaData['videotype'] = primaryVideo.targetItem.template?.id;

        if (
          primaryVideo.targetItem.template?.id?.toLowerCase() ===
          SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.YouTubeVideo.Id.replace(
            /-/g,
            ''
          )
        ) {
          const youTubeAutoLoop = getCheckboxField(
            primaryVideo.targetItem.fields,
            'youTubeAutoLoop'
          );
          if (youTubeAutoLoop) {
            siteMapItem.metaData[`video_${youTubeAutoLoop.name}`] = youTubeAutoLoop.boolValue
              ? 'true'
              : 'false';
          }

          const youTubeClosedCaptions = getCheckboxField(
            primaryVideo.targetItem.fields,
            'youTubeClosedCaptions'
          );
          if (youTubeClosedCaptions) {
            siteMapItem.metaData[`video_${youTubeClosedCaptions.name}`] =
              youTubeClosedCaptions.boolValue ? 'true' : 'false';
          }

          const youTubeShowControls = getCheckboxField(
            primaryVideo.targetItem.fields,
            'youTubeShowControls'
          );
          if (youTubeShowControls) {
            siteMapItem.metaData[`video_${youTubeShowControls.name}`] =
              youTubeShowControls.boolValue ? 'true' : 'false';
          }

          const youTubeMute = getCheckboxField(primaryVideo.targetItem.fields, 'youTubeMute');
          if (youTubeMute) {
            siteMapItem.metaData[`video_${youTubeMute.name}`] = youTubeMute.boolValue
              ? 'true'
              : 'false';
          }
        } else if (
          primaryVideo.targetItem.template?.id?.toLowerCase() ===
          SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.FacebookVideo.Id.replace(
            /-/g,
            ''
          )
        ) {
          const facebookShowCaptions = getCheckboxField(
            primaryVideo.targetItem.fields,
            'facebookShowCaptions'
          );
          if (facebookShowCaptions) {
            siteMapItem.metaData[`video_${facebookShowCaptions.name}`] =
              facebookShowCaptions.boolValue ? 'true' : 'false';
          }

          const facebookShowText = getCheckboxField(
            primaryVideo.targetItem.fields,
            'facebookShowText'
          );
          if (facebookShowText) {
            siteMapItem.metaData[`video_${facebookShowText.name}`] = facebookShowText.boolValue
              ? 'true'
              : 'false';
          }
        }
      }
    }

    const excludeFromSearch = getCheckboxField(indexableItem.fields, 'excludeFromSearch');
    if (excludeFromSearch) {
      siteMapItem.metaData[excludeFromSearch.name] = excludeFromSearch.boolValue ? 'true' : 'false';
    }

    return siteMapItem;
  }

  private addImageFieldMeta(
    indexableItem: IndexableItem,
    siteMapItem: SitemapItem,
    fieldNames: string[]
  ) {
    fieldNames.forEach((name) => {
      const field = getImageField(indexableItem.fields, name);
      if (field?.src) {
        const src = checkHostNameInMediaURL(field.src);
        siteMapItem.metaData[field.name] = src;
        siteMapItem.metaData[`${field.name}_alt`] = field.alt;
        siteMapItem.metaData[`${field.name}_height`] = field.height;
        siteMapItem.metaData[`${field.name}_width`] = field.width;
      }
    });
  }

  private addLookupFieldMeta(
    indexableItem: IndexableItem,
    siteMapItem: SitemapItem,
    fieldNames: string[]
  ) {
    fieldNames.forEach((name) => {
      const field = getLookupField(indexableItem.fields, name);
      if (field) {
        const value = getTextField(field.targetItem?.fields, 'title')?.value;
        if (value) {
          siteMapItem.metaData[field.name] = value;
        }
      }
    });
  }

  private addTextFieldMeta(
    indexableItem: IndexableItem,
    siteMapItem: SitemapItem,
    fieldNames: string[]
  ) {
    fieldNames.forEach((name) => {
      const field = getTextField(indexableItem.fields, name);
      if (field) {
        siteMapItem.metaData[`video_${field.name}`] = field.value;
      }
    });
  }
}

export const videoPropertiesPlugin = new VideoProperties();
