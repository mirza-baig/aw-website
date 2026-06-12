'use client';

import { LinkField } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import { DesktopVideoDisplayStyleType } from 'components/listing/XupCardCollection/helpers/XupCardCollection.types';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Button from 'helpers/Button/Button';
import Card from 'helpers/Card/Card';
import Eyebrow from 'helpers/Eyebrow/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import Image from 'helpers/Media/Image';
import SvgIcon from 'helpers/Media/SvgIcon';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import Subheadline from 'helpers/Subheadline/Subheadline';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import Link from 'next/link';
import { JSX } from 'react';

import { GenericCardTheme } from './GenericCard.theme';
import { TextAlignment } from './GenericCard.types';
import VideoCard from './GenericCardVideo.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type GenericCardProps = Sitecore.Cards.GenericCard.GenericCard &
  MediaPrimaryStaticProps & {
    desktopVideoDisplayStyle: DesktopVideoDisplayStyleType;
  };

export function GenericCardClient(props: GenericCardProps): JSX.Element {
  const alignment = getEnum<TextAlignment>(props.fields?.alignment) ?? 'left';
  const { themeData } = useTheme(GenericCardTheme(alignment));

  const showVideo = !!props.fields?.primaryVideo;

  const showEyebrowLink = !!props.fields?.eyebrowLink?.value?.href;
  const showIcon = !!props.fields?.icon?.value?.src;
  const showImage = !!props.fields?.image?.value?.src;

  const getImageCTAObject = (data: GenericCardProps['fields']): LinkField | undefined => {
    const imageCTAMap: Record<'CTA 1' | 'CTA 2', LinkField | undefined> = {
      'CTA 1': data?.cta1Link,
      'CTA 2': data?.cta2Link,
    };
    return (
      imageCTAMap[data?.ImageCTA?.value as unknown as keyof typeof imageCTAMap] || data?.cta1Link
    );
  };
  const imageCTAObject = getImageCTAObject(props.fields);
  const CTAUrlExist = imageCTAObject?.value.href && imageCTAObject.value.href.length > 0;
  return (
    <Card dataComponent="card/generic" {...props}>
      <div className={themeData.classes.cardWrapper}>
        {showVideo && (
          <VideoCard
            {...props}
            desktopVideoDisplayStyle={props.desktopVideoDisplayStyle}
            staticProps={props.mediaPrimary}
          />
        )}

        {!showVideo && showIcon && imageCTAObject && CTAUrlExist && (
          <LinkWrapper
            field={imageCTAObject?.value}
            suppressLinkText={true}
            className="text-center"
          >
            <SvgIcon
              image={props.fields.icon}
              className={classNames(
                themeData.classes.iconClass,
                'h-[80px]! min-h-0! w-[80px]! min-w-0!'
              )}
            />
          </LinkWrapper>
        )}
        {!showVideo && showIcon && !CTAUrlExist && (
          <SvgIcon
            image={props.fields.icon}
            className={classNames(
              themeData.classes.iconClass,
              'h-[80px]! min-h-0! w-[80px]! min-w-0!'
            )}
          />
        )}
        {!showIcon && !showVideo && showImage && imageCTAObject && CTAUrlExist && (
          <LinkWrapper
            field={imageCTAObject?.value}
            ariaLabel={{ value: imageCTAObject.value?.text ?? 'CTA Image' }}
            suppressLinkText={true}
          >
            <Image image={props.fields?.image} />
          </LinkWrapper>
        )}
        {!showIcon && !showVideo && showImage && !CTAUrlExist && (
          <Image image={props.fields?.image} />
        )}

        <div className="flex grow flex-col">
          <div className={themeData.classes.copyWrapper}>
            {showEyebrowLink && (
              <Link
                className={themeData.classes.eyebrowLink}
                href={props.fields?.eyebrowLink.value.href}
              >
                <Eyebrow classes={themeData.classes.eyebrow} {...props} />
              </Link>
            )}
            {!showEyebrowLink && <Eyebrow classes={themeData.classes.eyebrow} {...props} />}
            <Headline defaultTag="h3" classes={themeData.classes.headline} {...props} />
            <Subheadline classes={themeData.classes.subheadline} {...props}></Subheadline>
            <BodyCopy classes={themeData.classes.body} {...props} />
          </div>
          <div className={themeData.classes.buttonGroupClass.wrapper}>
            <Button
              field={props.fields?.cta1Link}
              variant={props.fields?.cta1Style}
              icon={props.fields?.cta1Icon}
              modalId={
                (
                  props.fields
                    ?.cta1Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal
                )?.fields?.modalId?.value
              }
              modalLinkText={props.fields?.cta1ModalLinkText}
              classes={classNames(props.fields?.cta1Style, 'md:whitespace-pre-wrap')}
            ></Button>
            <Button
              field={props.fields?.cta2Link}
              variant={props.fields?.cta2Style}
              icon={props.fields?.cta2Icon}
              modalId={
                (
                  props.fields
                    ?.cta2Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal
                )?.fields?.modalId?.value
              }
              modalLinkText={props.fields?.cta2ModalLinkText}
              classes={classNames(props.fields?.cta2Style, 'md:whitespace-pre-wrap')}
            ></Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
