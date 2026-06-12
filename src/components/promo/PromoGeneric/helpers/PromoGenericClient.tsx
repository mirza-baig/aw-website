'use client';

import { LinkField } from '@sitecore-content-sdk/nextjs';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Button from 'helpers/Button/Button';
import Component, { ComponentBackgroundVariants } from 'helpers/Component/Component';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import PriceLevel from 'helpers/PriceLevel/PriceLevel';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { JSX, PropsWithChildren } from 'react';

import { PromoGenericTheme } from './PromoGeneric.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type PromoGenericProps = Sitecore.Components.Promo.PromoGeneric.PromoGeneric &
  MediaPrimaryStaticProps;

// Define the CTALinkWrapper outside of the main component
function CTALinkWrapper({ children, link }: PropsWithChildren<{ link?: LinkField }>) {
  return link?.value?.href ? (
    <LinkWrapper
      field={link?.value}
      ariaLabel={{ value: link?.value?.text ?? 'CTA Link' }}
      suppressLinkText
    >
      {children}
    </LinkWrapper>
  ) : (
    <>{children}</>
  );
}

export function PromoGenericClient(props: PromoGenericProps): JSX.Element {
  const { themeData } = useTheme(
    PromoGenericTheme(
      props?.fields?.imgPosition,
      props?.fields?.imageRatio,
      props?.fields?.useLegalCopyFont?.value ?? false
    )
  );
  const priceLevel = Number.parseInt(props.fields?.priceLevel?.fields.priceLevelText?.value ?? '');

  const hasCta1Link =
    !!props?.fields?.cta1Link?.value?.href?.trim() ||
    !!props?.fields?.cta1ModalLinkText?.value?.trim();

  const hasCta2Link =
    !!props?.fields?.cta2Link?.value?.href?.trim() ||
    !!props?.fields?.cta2ModalLinkText?.value?.trim();

  const style = getEnum<ComponentBackgroundVariants>(props.fields?.backgroundColor) ?? 'white';

  return (
    <Component
      variant="full"
      gap="gap-x-0"
      padding="px-0"
      backgroundVariant={style}
      dataComponent="general/promogeneric"
      {...props}
    >
      <div className="col-span-12">
        <div className="md:max-w-(--breakpoint-lg) lg:mx-auto">
          <div className={themeData.classes.wrapperClass}>
            <div className={themeData.classes.txtDivClass}>
              <div>
                <Eyebrow classes={themeData.classes.eyebrowClass} {...props} />
                <Headline classes={themeData.classes.headlineClass} {...props} />
                {priceLevel ? (
                  <div className={themeData.classes.priceLevelWrapper}>
                    <PriceLevel
                      priceLevel={priceLevel}
                      priceClasses={themeData.classes.priceTextClasses}
                      priceLevelClasses={themeData.classes.priceLevelClasses}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <BodyCopy classes={themeData.classes.bodyClass} {...props} />
                {(hasCta1Link ?? hasCta2Link) && (
                  <div className="flex flex-col space-y-2 md:mb-5 md:flex-row md:items-baseline md:space-x-5">
                    {hasCta1Link && (
                      <Button
                        field={props?.fields?.cta1Link}
                        variant={props?.fields?.cta1Style}
                        icon={props?.fields?.cta1Icon}
                        modalId={
                          (
                            props?.fields
                              ?.cta1Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal
                          )?.fields?.modalId?.value
                        }
                        modalLinkText={props?.fields?.cta1ModalLinkText}
                        classes=""
                      />
                    )}
                    {hasCta2Link && (
                      <Button
                        field={props?.fields?.cta2Link}
                        variant={props?.fields?.cta2Style}
                        icon={props?.fields?.cta2Icon}
                        modalId={
                          (
                            props?.fields
                              ?.cta2Modal as unknown as Sitecore.Components.Modal.GenericModal.GenericModal
                          )?.fields?.modalId?.value
                        }
                        modalLinkText={props?.fields?.cta2ModalLinkText}
                        classes=""
                      />
                    )}
                  </div>
                )}
                {(props.fields?.bottomCaptionHeadline?.value ??
                props.fields?.bottomCaptionDescription?.value) ? (
                  <div className="items-bottom">
                    <RichTextWrapper
                      classes={themeData.classes.bottomHeadingClass}
                      field={props.fields?.bottomCaptionHeadline}
                    />
                    <RichTextWrapper
                      classes={themeData.classes.bottomDescriptionClass}
                      field={props.fields?.bottomCaptionDescription}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className={themeData.classes.imageDivClass}>
              <CTALinkWrapper link={props.fields?.primaryImageLink}>
                <MediaPrimary
                  {...props}
                  imageLayout="intrinsic"
                  maxH={'h-full'}
                  staticProps={props?.mediaPrimary}
                />
              </CTALinkWrapper>
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}
