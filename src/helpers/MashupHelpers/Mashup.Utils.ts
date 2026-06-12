import { ImagePrimaryProps } from 'helpers/Media/ImagePrimary';
import { SitecoreIds } from 'lib/constants/sitecore-ids';
import { extractURLParts } from 'lib/coveo';
import { itemInheritsBaseItem } from 'lib/utils/sitecore-utils/item-inherits-base-item';
import { guidEquals } from 'lib/utils/string-utils/guid-equals';

import { ItemData, MashupStyle, PageStyle, ResultItem } from './Mashup.Types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

const getPageStyle = (page: ResultItem): PageStyle => {
  if (!itemInheritsBaseItem(page)) {
    return 'standard-page';
  }

  if (
    guidEquals(
      page.fields._AW_TemplateId.value,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Pages.ArticlePage.Id
    )
  ) {
    return 'article-page';
  }

  if (
    guidEquals(
      page.fields._AW_TemplateId.value,
      SitecoreIds.Templates.Project.AndersenCorporation.AndersenWindows.Pages.ProjectShowcasePage.Id
    )
  ) {
    return 'project-showcase-page';
  }

  return 'standard-page';
};

export const getItemData = (
  props: ResultItem,
  mashupStyle: MashupStyle,
  isFeaturedItem = false
): ItemData => {
  const { fields, url } = props;

  const pageType = getPageStyle(props);

  const imageProps = {
    primaryImageCaption: {
      value: '',
    },
    primaryImage: isFeaturedItem
      ? (fields?.featuredImage?.value?.hasOwnProperty('src') && fields?.featuredImage) ||
        fields?.primaryImage
      : fields?.primaryImage,
    primaryImageMobile: isFeaturedItem
      ? (fields?.featuredImage?.value?.hasOwnProperty('src') && fields?.featuredImage) ||
        fields?.primaryImageMobile
      : fields?.primaryImageMobile,
    primaryImageMobileFocusArea: fields.primaryImageMobileFocusArea,
  };

  const ctaProps = {
    cta1Link: {
      value: {
        ...extractURLParts(url),
        text: 'Read More',
        class: '',
        title: '',
        target: '',
        id: '{7FB335D2-8E99-458E-9EF9-562A78CCB821}',
      },
    },
    cta1AriaLabel: {
      value: '',
    },
    cta1ModalLinkText: {
      value: '',
    },
    cta1Style: {
      id: '',
      url: '',
      name: 'Primary',
      displayName: 'Primary',
      fields: {
        Value: {
          value: mashupStyle !== 'feature-image-only' && isFeaturedItem ? 'primary' : 'link',
        },
      },
      templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
      templateName: 'Enum',
    },
    cta1Icon: {
      id: '',
      url: '',
      name: 'Arrow',
      displayName: 'Arrow',
      fields: {
        Value: {
          value: 'arrow',
        },
      },
      templateId: 'd2923fee-da4e-49be-830c-e27764dfa269',
      templateName: 'Enum',
    },
  };

  const lookupObject = {
    eyebrow: {
      'standard-page': fields.siteSearchEyebrow?.value,
      'article-page': fields.articleCategory?.[0]?.fields?.title.value,
      'project-showcase-page': fields.siteSearchEyebrow?.value,
    },
    headline: {
      'standard-page': fields.openGraphTitle?.value ?? fields.siteSearchHeadline?.value,
      'article-page': fields.articleTitle?.value,
      'project-showcase-page': fields.projectShowcaseTitle?.value,
    },
    description: {
      'standard-page': fields.openGraphDescription?.value ?? fields.siteSearchDescription?.value,
      'article-page': fields.articleDescription?.value,
      'project-showcase-page': fields.projectShowcaseDescription?.value,
    },
  };

  return {
    eyebrow: lookupObject.eyebrow[pageType] ?? '',
    headline: lookupObject.headline[pageType] ?? '',
    description: lookupObject.description[pageType] ?? '',
    image: { fields: imageProps } as ImagePrimaryProps,
    cta: { fields: ctaProps } as Sitecore.FieldSets.Cta1,
  };
};
