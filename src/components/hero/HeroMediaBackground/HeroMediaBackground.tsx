'use client';

import classNames from 'classnames';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useEffect, useState } from 'react';
import { cta1ToButtonProps, cta2ToButtonProps } from 'src/helpers/Button/Utils';
import ButtonGroup from 'src/helpers/ButtonGroup/ButtonGroup';
import { ComponentPadding, ComponentSpacing } from 'src/helpers/Component/Component';
import { Eyebrow } from 'src/helpers/Eyebrow';
import Headline from 'src/helpers/Headline/Headline';
import MediaPrimary from 'src/helpers/Media/MediaPrimary/MediaPrimary';
import RichTextWrapper from 'src/helpers/RichTextWrapper/RichTextWrapper';
import SvgIcon from 'src/helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'src/lib/component-props';
import { useTheme } from 'src/lib/context/ThemeContext';
import { EnumField, getEnum } from 'src/lib/utils/get-enum';
import { getHeadingLevel } from 'src/lib/utils/get-heading-level';
import { useCurrentScreenType } from 'src/lib/utils/get-screen-type';

import { HeroMediaBackgroundTheme } from './helpers/HeroMediaBackground.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type HeroMediaBackgroundProps =
  Sitecore.Components.Hero.HeroMediaBackground.HeroMediaBackground & ComponentProps;

type SitecoreItem = {
  fields?: Record<string, { value?: unknown }>;
};

const asEnumField = <T,>(field?: unknown): EnumField<T> | undefined => {
  if (!field) {
    return undefined;
  }
  if (typeof field !== 'object') {
    return field as EnumField<T>;
  }
  if ('fields' in field && (field as SitecoreItem).fields) {
    const item = field as SitecoreItem;
    const val = item.fields?.Value?.value ?? item.fields?.value?.value;
    return val === undefined ? undefined : (val as EnumField<T>);
  }
  return undefined;
};

const getSpacingClass = (
  spacing?: EnumField<ComponentSpacing>,
  padding?: EnumField<ComponentPadding>,
  margin?: EnumField<ComponentPadding>
) => {
  const getValue = (field?: EnumField<unknown>): string => {
    if (!field) {
      return '';
    }

    if (typeof field === 'string' || typeof field === 'number' || typeof field === 'boolean') {
      return String(field);
    }

    if (typeof field === 'object' && 'value' in field) {
      const val = field.value;
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return String(val);
      }
      return '';
    }

    return '';
  };

  return [getValue(spacing), getValue(padding), getValue(margin)]
    .filter((val) => val.trim() !== '')
    .join(' ');
};

const getField = <T,>(obj: unknown, key: string, fallback: T): T => {
  return typeof obj === 'object' && obj !== null && key in obj
    ? (obj as Record<string, T>)[key]
    : fallback;
};

function HeroMediaBackground_Default(props: HeroMediaBackgroundProps) {
  const { fields } = props;
  const { themeName, themeData } = useTheme(HeroMediaBackgroundTheme);
  const { screenType, currentScreenWidth } = useCurrentScreenType();
  const [stepFixed, setStepFixed] = useState('');
  const [isVideoPaused, setIsVideoPaused] = useState(true);

  useEffect(() => {
    const raqBanner = document.getElementById('raqbanner');

    if (raqBanner && currentScreenWidth <= 1007 && props?.fields?.componentSpacing) {
      setStepFixed('my-28');
    } else {
      setStepFixed('');
    }

    const autoPlayField = fields?.primaryVideo?.fields?.youTubeAutoPlay;
    const isAutoPlay = autoPlayField && 'value' in autoPlayField ? autoPlayField.value : false;

    setIsVideoPaused(!isAutoPlay);
  }, [
    currentScreenWidth,
    props?.fields?.componentSpacing,
    fields?.primaryVideo?.fields?.youTubeAutoPlay,
  ]);

  if (!fields) {
    return null;
  }

  const isDesktop = screenType !== 'sm';
  let hasOverlay = !!getEnum(fields.overlay);
  let fontColorClass = '';

  if (hasOverlay) {
    fontColorClass = 'md:text-white';
  } else {
    switch (getEnum(fields.fontColor)) {
      case 'gray':
        fontColorClass = 'md:text-dark-gray';
        break;
      case 'white':
        fontColorClass = 'md:text-white';
        break;
      default:
        fontColorClass = 'md:text-black';
        break;
    }
  }

  if (themeName === 'rba' && fields.overlay === null) {
    hasOverlay = true;
  }

  const togglePlayPause = () => {
    const videoId = (props.fields?.primaryVideo as Sitecore.Elements.Media.YouTubeVideo)?.fields
      .videoId.value;

    const iframeContentWindow = (document.getElementById(videoId) as HTMLIFrameElement)
      ?.contentWindow;

    if (iframeContentWindow) {
      iframeContentWindow.postMessage(
        `{"event":"command","func":"${isVideoPaused ? 'playVideo' : 'pauseVideo'}","args":""}`,
        '*'
      );
      setIsVideoPaused(!isVideoPaused);
    }
  };

  const spacingField = asEnumField<ComponentSpacing>(fields.componentSpacing);
  const paddingField = asEnumField<ComponentPadding>(fields.componentPadding);
  const marginField = asEnumField<ComponentPadding>(fields.componentMargin);

  const componentSpacing = getSpacingClass(spacingField, paddingField, marginField);

  const getHasPaddingInValue = (field?: EnumField<ComponentPadding>) =>
    getEnum<ComponentPadding>(field)?.toLowerCase().includes('padding');

  const componentPadding = getSpacingClass(
    undefined,
    getHasPaddingInValue(paddingField) ? paddingField : undefined,
    getHasPaddingInValue(marginField) ? marginField : undefined
  );

  const mediaFields = {
    primaryImage: fields.primaryImage,
    primaryImageMobile: fields.primaryImageMobile,
    primaryImageMobileFocusArea: fields.primaryImageMobileFocusArea,
    primaryImageCaption: getField(fields, 'primaryImageCaption', { value: '' }),
  };

  return (
    <div
      data-component="hero/heromediabackground"
      className={classNames('relative', componentSpacing, stepFixed)}
    >
      <div className={themeData.classes.mediaContainer}>
        <MediaPrimary
          imageLayout="responsive"
          ratio="auto"
          priority
          rendering={props.rendering}
          fields={mediaFields}
          {...props}
        />

        {fields.primaryVideo && (
          <button
            className={classNames(
              'absolute right-0 bottom-0 z-10 cursor-pointer rounded-full bg-black',
              themeData.classes.iconWrapper
            )}
            onClick={togglePlayPause}
            aria-label={isVideoPaused ? 'Play video' : 'Pause video'}
            type="button"
          >
            {isVideoPaused ? <SvgIcon icon="play" size="40" /> : <SvgIcon icon="pause" size="40" />}
          </button>
        )}
      </div>

      {hasOverlay && isDesktop && (
        <div
          className={classNames(
            themeData.classes.overlay,
            themeName === 'aw' ? componentPadding : ''
          )}
        ></div>
      )}

      <div className={classNames(themeData.classes.contentWrapper, fontColorClass)}>
        <div className={classNames(themeData.classes.contentContainer, fontColorClass)}>
          <Eyebrow classes={classNames(themeData.classes.eyebrow, fontColorClass)} {...props} />

          <Headline
            useTag={getHeadingLevel('h1', fields?.headlineLevel)}
            classes={classNames(themeData.classes.headline, fontColorClass)}
            {...props}
          />

          <RichTextWrapper
            classes={classNames(themeData.classes.bodyClass, fontColorClass)}
            field={getField(fields, 'body', { value: '' })}
          />

          {fields.cta1Link && (
            <ButtonGroup
              cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
              cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
              wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export const Default = withDatasourceCheck(HeroMediaBackground_Default);
