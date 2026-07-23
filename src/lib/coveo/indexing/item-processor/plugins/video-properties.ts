import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { checkHostNameInMediaURL } from 'lib/coveo/utils';
import { getLastModifiedDate } from 'lib/coveo/utils/get-lastmod';

import {
  getCheckboxField,
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
    if (!this.isVideoItem(indexableItem)) {
      return siteMapItem;
    }

    this.setBasicMetadata(siteMapItem, indexableItem);
    this.addTextFieldMeta(indexableItem, siteMapItem, ['eyebrowText', 'headlineText']);
    this.addBody(indexableItem, siteMapItem);
    this.addImageFieldMeta(indexableItem, siteMapItem, ['videoThumbnail', 'videoThumbnailMobile']);
    this.addLookupFieldMeta(indexableItem, siteMapItem, ['videoThumbnailMobileFocusArea']);
    this.processPrimaryVideo(indexableItem, siteMapItem);
    this.addExcludeFromSearch(indexableItem, siteMapItem);

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

  private isVideoItem(indexableItem: IndexableItem): boolean {
    const templateId =
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.BaseTemplates._BaseGalleryVideo.Id.replaceAll(
        '-',
        ''
      );

    return indexableItem.allTemplateIds.includes(templateId);
  }

  private setBasicMetadata(siteMapItem: SitemapItem, indexableItem: IndexableItem) {
    siteMapItem.loc = siteMapItem.itemUri;
    siteMapItem.metaData['siteLanguage'] = indexableItem.language;
    siteMapItem.metaData['siteName'] = indexableItem.siteName;
    siteMapItem.metaData['sitesearchtopic'] = 'Videos';
  }
  private addBody(indexableItem: IndexableItem, siteMapItem: SitemapItem) {
    const body = getRichTextField(indexableItem.fields, 'body');
    if (body) {
      siteMapItem.metaData[`video_${body.name}`] = body.value;
    }
  }
  private processPrimaryVideo(indexableItem: IndexableItem, siteMapItem: SitemapItem) {
    const primaryVideo = getLookupField(indexableItem.fields, 'primaryVideo');

    if (!primaryVideo?.targetItem) {
      return;
    }
    this.addPrimaryVideoMetadata(primaryVideo.targetItem, siteMapItem);
    this.setLastModified(indexableItem, siteMapItem);
    this.handleVideoType(primaryVideo.targetItem, siteMapItem);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private addPrimaryVideoMetadata(targetItem: any, siteMapItem: SitemapItem) {
    const fields = ['videoId', 'videoName', 'videoDescription'];

    fields.forEach((name) => {
      const field = getTextField(targetItem.fields, name);
      if (field?.value) {
        siteMapItem.metaData[field.name] = field.value;
      }
    });
  }
  private setLastModified(indexableItem: IndexableItem, siteMapItem: SitemapItem) {
    const lastmod = getLastModifiedDate(indexableItem);
    if (lastmod) {
      siteMapItem.lastmod = lastmod;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleVideoType(targetItem: any, siteMapItem: SitemapItem) {
    const templateId = targetItem.template?.id?.toLowerCase();

    siteMapItem.metaData['videotype'] = templateId;

    if (!templateId) {
      return;
    }
    if (this.isYouTube(templateId)) {
      this.handleYouTube(targetItem, siteMapItem);
      return;
    }

    if (this.isFacebook(templateId)) {
      this.handleFacebook(targetItem, siteMapItem);
    }
  }
  private isYouTube(templateId: string): boolean {
    return (
      templateId ===
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.YouTubeVideo.Id.replaceAll(
        '-',
        ''
      )
    );
  }

  private isFacebook(templateId: string): boolean {
    return (
      templateId ===
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Elements.Media.FacebookVideo.Id.replaceAll(
        '-',
        ''
      )
    );
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleYouTube(targetItem: any, siteMapItem: SitemapItem) {
    const fields = [
      'youTubeAutoLoop',
      'youTubeClosedCaptions',
      'youTubeShowControls',
      'youTubeMute',
    ];

    this.addCheckboxFields(targetItem, siteMapItem, fields);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleFacebook(targetItem: any, siteMapItem: SitemapItem) {
    const fields = ['facebookShowCaptions', 'facebookShowText'];
    this.addCheckboxFields(targetItem, siteMapItem, fields);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private addCheckboxFields(targetItem: any, siteMapItem: SitemapItem, fieldNames: string[]) {
    fieldNames.forEach((name) => {
      const field = getCheckboxField(targetItem.fields, name);
      if (field) {
        siteMapItem.metaData[`video_${name}`] = field.boolValue ? 'true' : 'false';
      }
    });
  }
  private addExcludeFromSearch(indexableItem: IndexableItem, siteMapItem: SitemapItem) {
    const exclude = getCheckboxField(indexableItem.fields, 'excludeFromSearch');
    if (exclude) {
      siteMapItem.metaData[exclude.name] = exclude.boolValue ? 'true' : 'false';
    }
  }
}

export const videoPropertiesPlugin = new VideoProperties();
