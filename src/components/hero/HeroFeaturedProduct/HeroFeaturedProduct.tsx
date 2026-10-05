import { Field } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { Subheadline } from 'helpers/Subheadline';
import { ComponentProps } from 'lib/component-props';
import { DataSource } from 'lib/types/data-source';
import { getClientComponentProps } from 'lib/utils/sitecore-utils/get-client-component-props';
import { getHeadingLevel } from 'lib/utils/sitecore-utils/get-heading-level';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { getTheme } from 'lib/website/theme';
import { JSX } from 'react';

import { HeroFeaturedProductTheme } from './helpers/HeroFeaturedProduct.theme';
import { Sitecore } from '.sitecore/AndersenWindows.sitecore';

type HeroFeaturedProductProps = ComponentProps &
  DataSource<Sitecore.Components.Hero.HeroFeaturedProduct.HeroFeaturedProduct>;

type SubheadingData = {
  [key: string]: Field<string>;
};

function HeroFeaturedProduct_Default(props: HeroFeaturedProductProps): JSX.Element | null {
  const { fields } = props;

  const themeData = getTheme(props.page.customProps.theme, HeroFeaturedProductTheme);
  const subheadingData: SubheadingData = {};
  const isEE = !props.page.mode.isNormal;

  // Always render in edit mode so Sitecore field editors appear
  if (!fields && !isEE) {
    return null;
  }

  if (fields) {
    Object.keys(fields).forEach((key) => {
      const typedKey = key as keyof typeof fields;
      const field = fields?.[typedKey];
      if (
        key.startsWith('subheading') &&
        field &&
        'value' in field &&
        typeof field.value === 'string'
      ) {
        subheadingData[key] = field as Field<string>;
      }
    });
  }

  const primaryImageCaption: Field<string> =
    fields && 'primaryImageCaption' in fields && fields.primaryImageCaption
      ? (fields.primaryImageCaption as Field<string>)
      : { value: '' };

  const mediaFields = props.fields
    ? {
        primaryImage: props.fields?.primaryImage,
        primaryImageMobile: props.fields?.primaryImageMobile,
        primaryImageMobileFocusArea: props.fields?.primaryImageMobileFocusArea,
        primaryImageCaption,
      }
    : undefined;

  return (
    <>
      <Component
        variant="lg"
        backgroundVariant=""
        sectionWrapperClasses=""
        dataComponent="hero/herofeaturedproduct"
        {...getClientComponentProps(props)}
      >
        <div className={classNames('col-span-12', themeData.classes.productWrapper)}>
          <div className={themeData.classes.headingsWrapper}>
            <Subheadline
              classes={themeData.classes.smallHeadline}
              useTag="h2"
              {...getClientComponentProps(props)}
            />
            <Headline
              classes={themeData.classes.largeHeadline}
              useTag={getHeadingLevel('h1', fields?.headlineLevel)}
              {...getClientComponentProps(props)}
            />
          </div>
          <div className={themeData.classes.imageWrapper}>
            <ImagePrimary
              fields={mediaFields}
              maxW="max-w-[592px]"
              additionalDesktopClasses={themeData.classes.additionalDesktopClasses}
              additionalMobileClasses={themeData.classes.additionalMobileClasses}
              priority
            />
          </div>
        </div>
      </Component>

      <Component
        variant="lg"
        backgroundVariant=""
        sectionWrapperClasses=""
        {...getClientComponentProps(props)}
      >
        <div className={`col-span-12 ${themeData.classes.subheadingsList}`}>
          {Object.keys(subheadingData)
            .sort(
              (a, b) =>
                Number.parseInt(a.replace('subheading', '')) -
                Number.parseInt(b.replace('subheading', ''))
            )
            .map((key) => (
              <div key={key} className={classNames(themeData.classes.subheadingItem)}>
                <RichTextWrapper
                  field={subheadingData[key]}
                  classes={themeData.classes.rteClasses}
                />
              </div>
            ))}
        </div>
      </Component>
    </>
  );
}

export const Default = withDatasourceCheck(HeroFeaturedProduct_Default);
