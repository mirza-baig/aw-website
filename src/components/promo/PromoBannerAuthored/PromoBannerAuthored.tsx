'use client';

import { Field, RichText } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { ButtonVariants } from 'helpers/Button/types';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component, { ComponentBackgroundVariants } from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { Subheadline } from 'helpers/Subheadline';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX } from 'react';

import { themePromoBannerAuthored } from './helpers/PromoBannerAuthored.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ComponentStyle = 'brand-color-solid' | 'black-outline' | 'black-solid' | 'brand-color-outline';

function LegalCopyPartial(classNames: string, copyField: Field<string>): JSX.Element {
  const isEE = useExperienceEditor();

  if ((!copyField || copyField?.value === '') && !isEE) {
    return <></>;
  }

  return (
    <div className={classNames}>
      <RichText field={copyField} />
    </div>
  );
}

function MapAWComponentStyleToBackgroundVariant(
  componentStyle: ComponentStyle
): ComponentBackgroundVariants {
  switch (componentStyle) {
    case 'brand-color-solid':
      return 'primary';
    case 'black-solid':
      return 'secondary';
  }

  return 'white';
}

type PromoBannerAuthoredProps = ComponentProps &
  Sitecore.Components.Promo.PromoBanner.PromoBannerAuthored;

function PromoBannerAuthored_Default(props: PromoBannerAuthoredProps): JSX.Element {
  const hasImage = !!props.fields?.primaryImage?.value?.src;

  const imagePosition = getEnum<ButtonVariants>(props.fields?.imgPosition) ?? 'right';
  const ctaRightAlign =
    (hasImage && imagePosition === 'right') ||
    (!hasImage && props.fields?.ctaRightAlign?.value === true);
  const componentStyle =
    getEnum<ComponentStyle>(props.fields?.componentStyle) ?? 'brand-color-solid';
  const ctaOneExists = !!props.fields?.cta1Link?.value?.href;
  const ctaTwoExists = !!props.fields?.cta2Link?.value?.href;
  let ctaCount = 0;
  if (ctaOneExists && ctaTwoExists) {
    ctaCount = 2;
  } else if (ctaOneExists || ctaTwoExists) {
    ctaCount = 1;
  }

  const isBlackSolid = componentStyle === 'black-solid';
  const isFullBleed =
    props.fields?.fullBleedOnSolidColor?.value === true &&
    (componentStyle === 'brand-color-solid' || componentStyle === 'black-solid');

  const { themeData } = useTheme(
    themePromoBannerAuthored(componentStyle, ctaRightAlign, hasImage, ctaCount)
  );

  const style = MapAWComponentStyleToBackgroundVariant(componentStyle);

  let sectionWrapperClasses = '';
  if (isFullBleed && !isBlackSolid) {
    sectionWrapperClasses = 'bg-primary';
  } else if (isFullBleed && isBlackSolid) {
    sectionWrapperClasses = 'bg-black';
  }

  return (
    <Component
      variant="lg"
      sectionWrapperClasses={sectionWrapperClasses}
      gap="gap-x-0"
      padding="px-0"
      dataComponent="promo/promobannerauthored"
      backgroundVariant={style}
      {...props}
    >
      <div className={themeData.classes.contentClasses.contentWrapperClass}>
        {hasImage && (
          <div className={themeData.classes.contentClasses.imageContainerClass}>
            <ImagePrimary
              {...props}
              imageLayout="responsive"
              ratio={themeData.classes.contentClasses.imageRatio}
            />
          </div>
        )}
        <div className={themeData.classes.contentClasses.copyContainerClass}>
          <Headline classes={themeData.classes.firstHeadline.headlineContainer} {...props} />
          {props.fields?.subheadlineText && (
            <Subheadline
              classes={themeData.classes.contentClasses?.subHeadlineContainer}
              {...props}
            />
          )}
          {props.fields?.body && (
            <BodyCopy classes={themeData.classes.contentClasses?.body} {...props} />
          )}
          {(hasImage || !ctaRightAlign) && (ctaOneExists || ctaTwoExists) && (
            <ButtonGroup
              cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
              cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
              wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
            />
          )}
          {LegalCopyPartial(
            themeData.classes.contentClasses.legalCopyClass,
            props.fields?.legalCopy
          )}
        </div>
        {!hasImage && ctaRightAlign && (ctaOneExists || ctaTwoExists) && (
          <ButtonGroup
            cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
            cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
            wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
          />
        )}
      </div>
      {LegalCopyPartial(themeData.classes.contentClasses.legalCopyClass, props.fields?.legalCopy)}
    </Component>
  );
}

export const Default = withDatasourceCheck(PromoBannerAuthored_Default);
