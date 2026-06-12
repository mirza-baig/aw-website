'use client';

import classNames from 'classnames';
import Headline from 'helpers/Headline/Headline';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { getEnum } from 'lib/utils/get-enum';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type LeftBarProps = Sitecore.Components.Forms.FormContainer.FormContainer;

export function LeftBar(props: LeftBarProps): JSX.Element {
  if (!props.fields) {
    return <></>;
  }

  const widthDimension = getEnum<string>(props?.fields?.width);
  const headlineText = props?.fields?.headlineText?.value ?? '';
  const headlineLevel = getEnum<string>(props?.fields.headlineLevel);
  const richTextContent = props?.fields?.body?.value ?? '';
  const containerWidth = props?.fields?.edgeToEdgeContainer?.value === true ? 'full' : 'lg';
  const displayImage = props?.fields?.primaryImage?.value?.src;

  return (
    <>
      <div
        className={classNames(
          richTextContent && 'py-s',
          containerWidth === 'full' && headlineText && 'px-m',
          widthDimension === 'half' && headlineText && 'px-m',
          widthDimension === 'one-third' && headlineText && 'px-m'
        )}
      >
        <Headline defaultTag={headlineLevel} {...props} />
        <RichTextWrapper
          classes="-mt-xxs mb-s text-body font-regular text-dark-gray"
          field={props?.fields?.body}
        />
      </div>
      {displayImage && (
        <div className="h-full">
          <MediaPrimary
            {...props}
            imageLayout="responsive"
            additionalDesktopClasses="w-full h-full"
            additionalMobileClasses="max-ml:h-[376px]"
          />
        </div>
      )}
    </>
  );
}
