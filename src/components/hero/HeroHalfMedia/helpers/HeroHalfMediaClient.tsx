'use client';

import { Field, Item } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { ButtonVariants } from 'helpers/Button/types';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component, { ComponentBackgroundVariants, GapSizes } from 'helpers/Component/Component';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { getHeadingLevel } from 'lib/utils/get-heading-level';

import { HeroHalfMediaTheme } from './HeroHalfMedia.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeroHalfMediaProps = Sitecore.Components.Hero.HeroHalfMedia.HeroHalfMedia &
  MediaPrimaryStaticProps;

export function HeroHalfMediaClient(props: HeroHalfMediaProps) {
  const imagePosition = getEnum<ButtonVariants>(props.fields?.imgPosition) ?? 'right';
  const ctaRightAlign = imagePosition === 'right';
  const style = getEnum<ComponentBackgroundVariants>(props.fields?.backgroundColor) ?? 'white';
  const containerWidth =
    getEnum<'full-bleed' | 'full-width'>(props.fields?.containerWidth) ?? 'full-bleed';

  const { themeData } = useTheme(HeroHalfMediaTheme(ctaRightAlign, !!props.fields?.body?.value));
  // const componentProps = useComponentProps<MediaPrimaryStaticProps>(props.rendering.uid);

  const copyContainerClass =
    containerWidth === 'full-bleed'
      ? themeData.classes.contentClasses.copyContainerClass
      : themeData.classes.contentClasses.copyContainerClassWithOutLeftMargin;

  const gapValue = (containerWidth === 'full-bleed' ? 'sm' : 'md') as GapSizes;
  const eyebrowItem: Item | undefined = props.fields?.eyebrow
    ? { name: 'eyebrow', fields: { value: { value: props.fields.eyebrow.value } as Field<string> } }
    : undefined;

  const headlineItem: Item | undefined = props.fields?.headlineLevel
    ? {
        name: 'headlineLevel',
        fields: { value: { value: props.fields.headlineLevel.value } as Field<string> },
      }
    : undefined;

  const cta1Fields = props.fields.cta1Link
    ? {
        fields: {
          cta1Link: props.fields.cta1Link,
          cta1AriaLabel: props.fields.cta1AriaLabel ?? { value: '' },
          cta1ModalLinkText: props.fields.cta1ModalLinkText ?? { value: '' },
          cta1Modal: props.fields.cta1Modal,
          cta1Icon: props.fields.cta1Icon?.value?.src
            ? ({
                name: 'cta1Icon',
                fields: {
                  value: { value: props.fields.cta1Icon.value.src } as Field<string>,
                },
              } as Item)
            : undefined,
          cta1Style: props.fields.cta1Style
            ? ({
                name: 'cta1Style',
                fields: { value: { value: props.fields.cta1Style.value } as Field<string> },
              } as Item)
            : undefined,
        },
      }
    : undefined;

  const cta2Fields = props.fields.cta2Link
    ? {
        fields: {
          cta2Link: props.fields.cta2Link,
          cta2AriaLabel: props.fields.cta2AriaLabel ?? { value: '' },
          cta2ModalLinkText: props.fields.cta2ModalLinkText ?? { value: '' },
          cta2Modal: props.fields.cta2Modal,
          cta2Icon: props.fields.cta2Icon?.value?.src
            ? ({
                name: 'cta2Icon',
                fields: {
                  value: { value: props.fields.cta2Icon.value.src } as Field<string>,
                },
              } as Item)
            : undefined,
          cta2Style: props.fields.cta2Style
            ? ({
                name: 'cta2Style',
                fields: { value: { value: props.fields.cta2Style.value } as Field<string> },
              } as Item)
            : undefined,
        },
      }
    : undefined;
  return (
    <Component
      variant={containerWidth === 'full-bleed' ? 'full' : 'lg'}
      sectionWrapperClasses=""
      gap={gapValue}
      padding={'px-0'}
      backgroundVariant={style}
      dataComponent="hero/herohalfmedia"
      {...props}
    >
      <div className={themeData.classes.contentClasses.imageContainerClass}>
        <MediaPrimary
          maxH={'w-full'}
          {...props}
          priority
          ratio="hero"
          staticProps={props?.mediaPrimary}
        />
      </div>
      <div className={copyContainerClass}>
        <Eyebrow
          useTag={getHeadingLevel('h2', eyebrowItem)}
          classes={themeData.classes.eyebrowClass.eyebrowContainer}
          {...props}
        />
        <Headline
          useTag={getHeadingLevel('h1', headlineItem)}
          classes={themeData.classes.firstHeadline.headlineContainer}
          {...props}
        />
        {props.fields?.body && (
          <BodyCopy classes={themeData.classes.contentClasses?.body} {...props} />
        )}
        {props.fields?.cta1Link?.value?.href && (
          <ButtonGroup
            cta1={
              cta1Fields
                ? cta1ToButtonProps(cta1Fields, themeData.classes.buttonGroupClass.cta1Classes)
                : undefined
            }
            cta2={
              cta2Fields
                ? cta2ToButtonProps(cta2Fields, themeData.classes.buttonGroupClass.cta2Classes)
                : undefined
            }
            wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
          />
        )}
      </div>
    </Component>
  );
}
