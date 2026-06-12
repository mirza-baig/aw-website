'use client';

import { ComponentRendering, LinkField } from '@sitecore-content-sdk/nextjs';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import Subheadline from 'helpers/Subheadline/Subheadline';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getEnum } from 'lib/utils/get-enum';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import { JSX } from 'react';

import { HeadlineWithNavigationTheme } from './helpers/HeadlineWithNavigation.theme';
import { ComponentSpacing } from './helpers/HeadlineWithNavigation.types';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeadlineWithNavigationLinkProps =
  Sitecore.Components.General.HeadlineWithNavigation.HeadlineWithNavigationLink;

type HeadlineWithNavigationProps = ComponentProps &
  Sitecore.Components.General.HeadlineWithNavigation.HeadlineWithNavigation & {
    fields: {
      children: [HeadlineWithNavigationLinkProps];
    };
  };

function HeadlineWithNavigation_Default(props: HeadlineWithNavigationProps): JSX.Element {
  const { fields } = getComponentServerProps(props.rendering);
  const spacing = getEnum<ComponentSpacing>(fields?.componentSpacing) ?? 'standard';
  const spacingValue = spacing === 'standard' ? '8' : '4';

  const { screenType } = useCurrentScreenType();
  const noOfTabs = fields?.children?.length;
  const headlineCheck = fields?.subheadlineText.value;

  const { breadcrumbs = [] } = useWebsiteContext();
  const isForProfessionals = breadcrumbs?.[1]?.name.toLowerCase().includes('for professionals');
  const { themeData } = useTheme(HeadlineWithNavigationTheme(spacingValue, isForProfessionals));
  return (
    <Component
      dataComponent="general/HeadlineWithNavigation"
      variant=""
      backgroundVariant=""
      sectionWrapperClasses=""
      className={breadcrumbs.length === 1 ? 'relative pt-[55px] ml:pt-0' : 'relative'}
      {...props}
      fields={fields}
    >
      <div className="col-span-12">
        {fields?.headlineText?.value && (
          <div className={themeData.classes.headlineContainer}>
            <div className="col-span-12">
              <Headline
                useTag={getHeadingLevel('h1', fields?.headlineLevel)}
                classes={themeData.classes.headline}
                {...props}
                fields={fields}
              />
            </div>
          </div>
        )}
        <div className={themeData.classes.heroContainer}>
          <ImagePrimary
            imageLayout="fill"
            ratio="hero"
            additionalDesktopClasses="h-[280px] ml:h-[422px]"
            additionalMobileClasses="h-[280px]"
            priority
            {...(props as Record<string, unknown>)}
            fields={fields}
          ></ImagePrimary>
          <div className={themeData.classes.linkContainer}>
            <Subheadline classes={themeData.classes.subheadlineStyle} {...props} fields={fields} />
            {fields?.children?.map((_item: HeadlineWithNavigationLinkProps, i: number) => {
              const _linkField = _item.fields?.navigationLink as LinkField;
              const _icon = getEnum<IconTypes>(_item.fields?.navigationIcon);
              return (
                <div
                  key={_linkField.value.title ?? `link-${i}`}
                  className={themeData.classes.linkStyle}
                >
                  <LinkWrapper
                    className={`${themeData.classes.linkWrapperStyle} ${
                      (noOfTabs > 3 && headlineCheck != '' && screenType === 'mml') ||
                      screenType === 'ml'
                        ? 'text-xs'
                        : 'text-s'
                    }`}
                    field={_linkField}
                    ariaLabel={{
                      value: (_item.fields?.navigationIcon?.name as string) || 'Navigation Icon',
                    }}
                  >
                    {_item.fields?.navigationIcon && (
                      <div className={themeData.classes.svgWrapper}>
                        <SvgIcon icon={_icon} className={themeData.classes.svgIconStyle} />
                      </div>
                    )}
                  </LinkWrapper>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(HeadlineWithNavigation_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      template: { name: string };
      fields: ItemFieldResult[];
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering): {
  fields?: HeadlineWithNavigationProps['fields'];
} {
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }

  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => ({
        fields: {
          ...mapItemFieldResultsToObject(child.fields),
        },
      })),
    },
  };
  return result;
}
