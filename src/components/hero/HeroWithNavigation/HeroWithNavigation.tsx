'use client';
import { ComponentRendering, Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Component, { ComponentSpacing } from 'helpers/Component/Component';
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
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import { JSX } from 'react';

import { HeroWithNavigationTheme } from './helpers/HeroWithNavigation.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeroWithNavigationLink = Sitecore.Components.Hero.HeroWithNavigation.HeroWithNavigationLink & {
  id: string;
};

type HeroWithNavigationProps = ComponentProps &
  Sitecore.Components.Hero.HeroWithNavigation.HeroWithNavigation & {
    rendering: ComponentRendering;
    params: Record<string, string>;
    fields: {
      primaryImage?: ImageField;
      primaryImageMobile?: ImageField;
      primaryImageMobileFocusArea?: Record<string, unknown>;
      primaryImageCaption?: Field<string>;
      children: HeroWithNavigationLink[];
    };
  };

function HeroWithNavigation_Default(props: HeroWithNavigationProps): JSX.Element {
  const { fields } = getComponentServerProps(props.rendering) as HeroWithNavigationProps;

  const spacing = getEnum<ComponentSpacing>(fields.componentSpacing) ?? 'standard';
  const spacingValue = spacing === 'standard' ? '8' : '4';
  const { themeData } = useTheme(HeroWithNavigationTheme(spacingValue));

  const { breadcrumbs = [] } = useWebsiteContext();
  return (
    <Component
      variant=""
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="hero/herowithnavigation"
      className={breadcrumbs.length === 1 ? 'relative pt-[55px] ml:pt-0' : 'relative'}
      {...props}
    >
      {/* Headline */}
      <div className="col-span-12">
        {fields?.headlineText?.value && (
          <div className={classNames(themeData.classes.headlineContainer, 'md:grid-cols-12')}>
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
      </div>

      {/* Hero Section */}
      <div className={classNames(themeData.classes.heroContainer, 'col-span-12')}>
        {/* ✅ FINAL FIXED IMAGEPRIMARY */}
        <ImagePrimary
          imageLayout="fill"
          ratio="hero"
          additionalDesktopClasses="h-[280px] ml:h-[422px]"
          additionalMobileClasses="h-[280px]"
          priority
          fields={{
            primaryImage: fields?.primaryImage as ImageField,
            primaryImageMobile: (fields?.primaryImageMobile ?? fields?.primaryImage) as ImageField,
            primaryImageMobileFocusArea: fields?.primaryImageMobileFocusArea,
            primaryImageCaption: fields?.primaryImageCaption as Field<string>,
          }}
        />

        {/* Navigation Links */}
        <div className={themeData.classes.linkContainer}>
          <Subheadline classes={themeData.classes.subheadlineStyle} {...props} fields={fields} />
          {fields?.children?.map((_item: HeroWithNavigationLink) => {
            const _linkField = _item.fields?.navigationLink as LinkField;
            const _icon = getEnum<IconTypes>(_item.fields?.navigationIcon);

            return (
              <div key={_item.id} className={themeData.classes.linkStyle}>
                <LinkWrapper
                  className={themeData.classes.linkWrapperStyle}
                  field={_linkField}
                  ariaLabel={{
                    value: (_item.fields?.navigationIcon?.name as string) ?? 'Navigation Icon',
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
    </Component>
  );
}

export const Default = withDatasourceCheck(HeroWithNavigation_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      id: string;
      fields: ItemFieldResult[];
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering) {
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }
  const fields = rendering.fields as unknown as IntegratedGraphQl;

  return {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => ({
        id: child.id,
        fields: {
          ...mapItemFieldResultsToObject(child.fields),
        },
      })),
    },
  };
}
