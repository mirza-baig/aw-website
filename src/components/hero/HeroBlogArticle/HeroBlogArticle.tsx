'use client';

import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { cta1ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import { Caption } from 'helpers/Caption';
import Component, { ComponentBackgroundVariants } from 'helpers/Component/Component';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { HeroBlogArticleTheme } from './helpers/HeroBlogArticle.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeroBlogArticleProps = ComponentProps &
  Sitecore.Components.Hero.HeroBlogArticle.HeroBlogArticle;

function HeroBlogArticle_Default(props: HeroBlogArticleProps) {
  const style = getEnum<ComponentBackgroundVariants>(props.fields?.backgroundColor) ?? 'white';
  const topBorder = style === 'white';
  const bottomBorder = style === 'white';
  const showImage = !!props.fields?.primaryImage?.value?.src;
  const styleVariation = showImage ? 'with image' : '';
  const componentVariant = showImage ? 'lg' : 'full';
  const paddingSize = showImage ? 'relative' : 'relative lg:mx-auto md:max-w-(--breakpoint-lg)';
  const hasCaption = props?.fields?.primaryImageCaption?.value != '';

  const { themeData } = useTheme(
    HeroBlogArticleTheme(styleVariation, topBorder, bottomBorder, showImage, hasCaption)
  );

  return (
    <Component
      variant={componentVariant}
      gap="gap-x-0"
      padding={paddingSize}
      sectionWrapperClasses={themeData.classes.contentClasses.sectionWrapperClasses}
      backgroundVariant={style}
      dataComponent="hero/heroblogarticle"
      {...props}
    >
      <div className={themeData.classes.contentClasses.copyContainerClass}>
        <Eyebrow
          useTag="h2"
          classes={themeData.classes.contentClasses?.eyebrowContainer}
          {...props}
        />
        <Headline
          useTag={getHeadingLevel('h1', props.fields?.headlineLevel)}
          classes={themeData.classes.contentClasses.headlineContainer}
          {...props}
        />
        <BodyCopy classes={themeData.classes.contentClasses?.body} {...props} />
        {props.fields?.cta1Link?.value.href && (
          <ButtonGroup
            cta1={cta1ToButtonProps(
              props,
              themeData.classes.contentClasses.buttonGroupClass.cta1Classes
            )}
            wrapperClasses={themeData.classes.contentClasses.buttonGroupClass.wrapper}
          />
        )}
        {showImage && (
          <Caption
            caption={props?.fields?.primaryImageCaption}
            classes={themeData.classes.contentClasses.captionClass}
            italic={false}
            isImageCaption={false}
          ></Caption>
        )}
      </div>
      {showImage && (
        <div className={themeData.classes.contentClasses.imageContainerClass}>
          <ImagePrimary {...props} hideCaption={true} priority ratio="picture" />
        </div>
      )}
    </Component>
  );
}

export const Default = withDatasourceCheck(HeroBlogArticle_Default);
