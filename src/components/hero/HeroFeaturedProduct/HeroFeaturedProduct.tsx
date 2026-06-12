'use client';

import { Field } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { Subheadline } from 'helpers/Subheadline';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { HeroFeaturedProductTheme } from './helpers/HeroFeaturedProduct.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeroFeaturedProductProps = ComponentProps &
  Sitecore.Components.Hero.HeroFeaturedProduct.HeroFeaturedProduct;

type SubheadingData = {
  [key: string]: Field<string>;
};

function HeroFeaturedProduct_Default(props: HeroFeaturedProductProps): JSX.Element {
  const { fields } = props;

  const { themeData } = useTheme(HeroFeaturedProductTheme);
  const subheadingData: SubheadingData = {};

  if (!fields) {
    return <></>;
  }

  Object.keys(fields).forEach((key) => {
    const typedKey = key as keyof typeof fields;
    const field = fields[typedKey];
    if (
      key.startsWith('subheading') &&
      field &&
      'value' in field &&
      typeof field.value === 'string'
    ) {
      subheadingData[key] = field;
    }
  });

  const primaryImageCaption: Field<string> =
    'primaryImageCaption' in fields && fields.primaryImageCaption
      ? (fields.primaryImageCaption as Field<string>)
      : { value: '' };

  return (
    <>
      <Component
        variant="lg"
        backgroundVariant=""
        sectionWrapperClasses=""
        dataComponent="hero/herofeaturedproduct"
        {...props}
      >
        <div className={classNames('col-span-12', themeData.classes.productWrapper)}>
          <div className={themeData.classes.headingsWrapper}>
            <Subheadline classes={themeData.classes.smallHeadline} useTag="h2" {...props} />
            <Headline
              classes={themeData.classes.largeHeadline}
              useTag={getHeadingLevel('h1', fields?.headlineLevel)}
              {...props}
            />
          </div>
          <div className={themeData.classes.imageWrapper}>
            <ImagePrimary
              fields={{
                primaryImage: fields.primaryImage,
                primaryImageMobile: fields.primaryImageMobile,
                primaryImageMobileFocusArea: fields.primaryImageMobileFocusArea,
                primaryImageCaption: primaryImageCaption,
              }}
              maxW="max-w-[592px]"
              additionalDesktopClasses={themeData.classes.additionalDesktopClasses}
              additionalMobileClasses={themeData.classes.additionalMobileClasses}
              priority
            />
          </div>
        </div>
      </Component>

      <Component variant="lg" backgroundVariant="" sectionWrapperClasses="" {...props}>
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
