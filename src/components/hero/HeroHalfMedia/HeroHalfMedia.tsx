import { ComponentRendering } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { ButtonVariants } from 'helpers/Button/types';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component, { ComponentBackgroundVariants, GapSizes } from 'helpers/Component/Component';
import Eyebrow from 'helpers/Eyebrow/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import { getStaticProps as getMediaPrimaryStaticProps } from 'helpers/Media/MediaPrimary/get-static-props';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import { ComponentProps } from 'lib/component-props';
import { DataSource } from 'lib/types/data-source';
import { getClientComponentProps } from 'lib/utils/sitecore-utils/get-client-component-props';
import { getEnum } from 'lib/utils/sitecore-utils/get-enum';
import { getHeadingLevel } from 'lib/utils/sitecore-utils/get-heading-level';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { getTheme } from 'lib/website/theme';
import { JSX } from 'react';

import { HeroHalfMediaTheme } from './helpers/HeroHalfMedia.theme';
import { Sitecore } from '.sitecore/AndersenWindows.sitecore';

type HeroHalfMediaProps = ComponentProps &
  DataSource<Sitecore.Components.Hero.HeroHalfMedia.HeroHalfMedia>;

async function HeroHalfMedia_Default(props: HeroHalfMediaProps): Promise<JSX.Element> {
  const { mediaPrimary } = await getComponentServerProps(props.rendering);

  const imagePosition = getEnum<ButtonVariants>(props.fields?.imgPosition) ?? 'right';
  const ctaRightAlign = imagePosition === 'right';
  const style = getEnum<ComponentBackgroundVariants>(props.fields?.backgroundColor) ?? 'white';
  const containerWidth =
    getEnum<'full-bleed' | 'full-width'>(props.fields?.containerWidth) ?? 'full-bleed';

  const themeData = getTheme(
    props.page.customProps.theme,
    HeroHalfMediaTheme(ctaRightAlign, !!props.fields?.body?.value)
  );

  const copyContainerClass =
    containerWidth === 'full-bleed'
      ? themeData.classes.contentClasses.copyContainerClass
      : themeData.classes.contentClasses.copyContainerClassWithOutLeftMargin;

  const gapValue = (containerWidth === 'full-bleed' ? 'sm' : 'md') as GapSizes;

  return (
    <Component
      variant={containerWidth === 'full-bleed' ? 'full' : 'lg'}
      sectionWrapperClasses=""
      gap={gapValue}
      padding={'px-0'}
      backgroundVariant={style}
      dataComponent="hero/herohalfmedia"
      {...getClientComponentProps(props)}
    >
      <div className={themeData.classes.contentClasses.imageContainerClass}>
        <MediaPrimary
          maxH={'h-full'}
          {...getClientComponentProps(props)}
          priority
          ratio="hero"
          staticProps={mediaPrimary}
        />
      </div>
      <div className={copyContainerClass}>
        <Eyebrow
          useTag={getHeadingLevel('h2', props.fields?.eyebrowLevel)}
          classes={themeData.classes.eyebrowClass.eyebrowContainer}
          {...getClientComponentProps(props)}
        />
        <Headline
          useTag={getHeadingLevel('h1', props.fields?.headlineLevel)}
          classes={themeData.classes.firstHeadline.headlineContainer}
          {...getClientComponentProps(props)}
        />
        {props.fields?.body && (
          <BodyCopy
            classes={themeData.classes.contentClasses?.body}
            {...getClientComponentProps(props)}
          />
        )}
        {props.fields?.cta1Link?.value?.href && (
          <ButtonGroup
            cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
            cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
            wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
          />
        )}
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(HeroHalfMedia_Default);

async function getComponentServerProps(rendering: ComponentRendering) {
  const datasource = rendering as unknown as HeroHalfMediaProps;
  const mediaStaticProps: MediaPrimaryStaticProps = {};
  if (!datasource) {
    return mediaStaticProps;
  }

  mediaStaticProps.mediaPrimary = await getMediaPrimaryStaticProps(datasource);

  return mediaStaticProps;
}
