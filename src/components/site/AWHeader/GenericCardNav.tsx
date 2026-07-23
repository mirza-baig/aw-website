import { Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import ButtonPrimary from 'helpers/Button/buttons/btn--primary';
import { CTASection } from 'helpers/LinkWrapper/LinkWrapper';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type ImageRatio = 'landscape' | 'portrait' | 'square';

export type GenericCardNav = Sitecore.Components.Navigation.Header.Header & {
  filterExpression: string;
  boostingExpression: string;
};
type GenericCardNavProps = {
  menu: GenericCardNav;
  fullHeight?: boolean;
  imageRatio?: ImageRatio;
  mobileCtaVariant?: boolean;
  ctaSection?: CTASection;
};

const ASPECT_MAP: Record<ImageRatio, string> = {
  landscape: 'aspect-[4/3]',
  portrait: 'aspect-[3/4]',
  square: 'aspect-square',
};

const ctaClasses = [
  '[&_a]:inline-flex [&_a]:items-center [&_a]:justify-center',
  '[&_a]:whitespace-nowrap [&_a]:px-[14px] [&_a]:py-[7px]',
].join(' ');

const GenericCardNav = ({
  menu,
  fullHeight,
  imageRatio = 'landscape',
  mobileCtaVariant = false,
  ctaSection,
}: GenericCardNavProps): JSX.Element | null => {
  const image = menu.fields?.image?.value?.src ? menu.fields.image : undefined;
  const link = menu.fields?.cta1Link;
  const title = menu.fields?.headlineText;
  const description = menu.fields?.body;

  const hasImage = !!image?.value?.src;
  const hasLink = !!link?.value?.href;
  const hasTitle = !!title?.value;
  const hasDescription = !!description?.value;
  const hasText = hasTitle || hasDescription;

  // Image card with CTA but no text → button overlaid on image (as per design)
  const isImageOnlyWithCta = hasImage && hasLink && !hasText;

  if (!hasTitle && !hasDescription && !hasImage && !hasLink) {
    return null;
  }

  const aspectClass = ASPECT_MAP[imageRatio];

  return (
    <div
      className={classNames('cta-box group flex flex-col w-full', fullHeight ? 'h-full' : 'h-auto')}
    >
      {hasImage && (
        <div className={classNames('relative w-full overflow-hidden shrink-0', aspectClass)}>
          <ImageWrapper
            image={image}
            additionalDesktopClasses="w-full"
            additionalMobileClasses="w-full"
          />
        </div>
      )}

      {isImageOnlyWithCta && (
        <div
          className={classNames('flex justify-center -mb-4 relative z-10', ctaClasses)}
          style={{
            transform: mobileCtaVariant
              ? 'translateY(calc(calc(1 / 2 * 76%) * -3))'
              : 'translateY(calc(calc(1 / 2 * 50%) * -5))',
          }}
        >
          <ButtonPrimary
            field={link}
            classes="cta-button w-fit justify-center"
            ctaSection={ctaSection}
          />
        </div>
      )}

      {/* ── Text + CTA (renders if title, description, or fallback CTA present) ── */}
      {(hasText || (hasLink && !isImageOnlyWithCta)) && (
        <div className="flex flex-col flex-1 pt-3">
          {hasTitle && (
            <Text
              tag="h3"
              field={title}
              className="text-[16px] font-bold leading-snug tracking-tight text-gray-900 mb-1"
            />
          )}

          {hasDescription && (
            <RichTextWrapper
              field={description}
              classes="text-[13px] font-normal leading-relaxed text-gray-600 flex-1"
            />
          )}

          {!hasDescription && <div className="flex-1" />}

          {hasLink && !isImageOnlyWithCta && (
            <div className={classNames('mt-4 shrink-0', ctaClasses)}>
              <ButtonPrimary
                field={link}
                classes="cta-button w-fit justify-center"
                ctaSection={ctaSection}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenericCardNav;
