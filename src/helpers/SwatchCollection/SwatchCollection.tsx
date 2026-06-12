import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Disclaimer from 'helpers/DisclaimerText/DisclaimerText';
import Headline from 'helpers/Headline/Headline';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import RichTextWrapper from 'helpers/RichTextWrapper/RichTextWrapper';
import { useTheme } from 'lib/context/ThemeContext';
import { EnumField, getEnum } from 'lib/utils/get-enum';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { useState } from 'react';

import BodyCopy from '../BodyCopy/BodyCopy';
import Button from '../Button/Button';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import SvgIcon from '../SvgIcon/SvgIcon';
import { SwatchCollectionTheme } from './SwatchCollection.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

export type SwatchStyles = 'small-circles' | 'large-circles' | 'square';
export type LayoutStyles = 'full-width' | 'side-by-side';
export type SwatchModal = 'true' | 'false';

export type SwatchCollectionProps = Sitecore.FieldSets.Products.SwatchCollections & {
  fields?: {
    swatchCollection?: Sitecore.Elements.Swatches.SwatchCollection & {
      fields?: {
        swatches: Sitecore.Elements.Swatches.Swatch[];
      };
    };
    swatchStyle?: EnumField<SwatchStyles>;
    swatchModal?: EnumField<SwatchModal>;
  };
};
const SwatchCollection = (props: SwatchCollectionProps) => {
  const swatchModal = getEnum(props.fields?.swatchModal) ?? 'false';
  const swatchStyle = getEnum(props.fields?.swatchStyle) ?? 'large-circles';
  const [activeSwatch, setActiveSwatch] = useState<Sitecore.Elements.Swatches.Swatch | null>(null);
  const { themeData } = useTheme(SwatchCollectionTheme());

  let swatchImgClasses = '';
  let swatchesGap = '';
  let swatchWidth = '';
  const { currentScreenWidth } = useCurrentScreenType();
  const modalStyle = currentScreenWidth > getBreakpoint('md') ? 'swatch-modal' : '';
  const modalSize = currentScreenWidth > getBreakpoint('md') ? 'fluid' : 'large';

  switch (swatchStyle) {
    case 'small-circles':
      swatchImgClasses =
        'h-[64px] ml:h-[86px] w-[64px] ml:w-[86px] rounded-full [&_img]:rounded-full';
      swatchWidth = 'w-[82px] ml:w-[86px] ';
      swatchesGap = classNames(
        'gap-y-m gap-x-[25px] ml:gap-x-[62px] ml:justify-start ml:pl-xxs justify-evenly',
        'ml:gap-y-m ml:pl-0'
      );
      break;
    case 'large-circles':
      swatchImgClasses = 'h-xxl w-xxl ml:h-[160px] ml:w-[160px] rounded-full [&_img]:rounded-full';
      swatchWidth = 'w-xxl ml:w-[160px] ml:pl-0';
      swatchesGap = classNames(
        'gap-x-[52px] gap-y-m ml:gap-x-[38px] ml:justify-start justify-evenly ml:pl-0'
      );
      break;
    case 'square':
      swatchImgClasses = 'h-[156px] w-[156px] ml:h-[160px] ml:w-[160px]';
      swatchWidth = 'w-[156px] ml:w-[160px] ';
      swatchesGap = classNames(
        'gap-x-[15px] gap-y-m ml:justify-start justify-evenly',
        'ml:gap-x-[43px]'
      );
      break;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleModal = (swatch: any) => {
    setActiveSwatch(swatch);
  };

  return (
    <div>
      <Headline
        useTag="h3"
        classes={themeData.classes.swatchTitle}
        fields={{
          headlineText: props.fields?.swatchCollection?.fields.swatchCollectionName ?? {
            value: '',
          },
        }}
      />
      <BodyCopy
        classes={themeData.classes.swatchCollectionDescription}
        fields={{
          body: props.fields?.swatchCollection?.fields.swatchCollectionDescription ?? { value: '' },
        }}
      />
      <div className={classNames('flex flex-wrap [&>*:last-child]:justify-start', swatchesGap)}>
        {props.fields?.swatchCollection?.fields.swatches.map(
          (swatch: Sitecore.Elements.Swatches.Swatch, index: number) => {
            const swatchKey =
              (swatch.fields?.swatchName as Field<string>)?.value || `swatch-${index}`;
            return (
              <div key={swatchKey} className={classNames(swatchWidth, 'flex flex-col')}>
                <button
                  onClick={() => handleModal(swatch)}
                  className={classNames(swatchImgClasses, 'mx-auto mb-xxs', {
                    'cursor-pointer':
                      swatchModal &&
                      (swatch.fields?.largerImage as ImageField)?.value?.src &&
                      (swatch.fields?.productOrHardwareImage as ImageField)?.value?.src,
                  })}
                  type="button"
                  aria-label={`View ${(swatch.fields?.swatchName as Field<string>)?.value || 'swatch'} details`}
                >
                  <ImageWrapper
                    imageLayout="responsive"
                    image={swatch.fields.swatchImage as ImageField}
                  />
                </button>
                <Headline
                  useTag="h4"
                  classes={themeData.classes.swatchLabel}
                  fields={{
                    headlineText: (swatch.fields.swatchName as Field<string>) ?? { value: '' },
                  }}
                />
                <RichTextWrapper
                  classes={themeData.classes.swatchDescription}
                  field={(swatch.fields.swatchDescription as Field<string>) ?? { value: '' }}
                />
              </div>
            );
          }
        )}
      </div>
      <RichTextWrapper
        classes={themeData.classes.swatchFooterCopy}
        field={props.fields?.swatchCollection?.fields.swatchCollectionFooterCopy ?? { value: '' }}
      />
      {swatchModal &&
        (activeSwatch?.fields?.largerImage as ImageField)?.value?.src &&
        (activeSwatch?.fields?.productOrHardwareImage as ImageField)?.value?.src && (
          <ModalWrapper
            size={modalSize}
            handleClose={() => setActiveSwatch(null)}
            isModalOpen={!!activeSwatch}
            customOverlayclass=""
            customContentWrapperclass={modalStyle}
            showCloseButton={false}
          >
            <div className="grid grid-cols-3">
              {/* First Image: Full Bleed */}
              <div className="col-span-3">
                <ImageWrapper
                  image={activeSwatch?.fields?.largerImage as ImageField}
                  additionalDesktopClasses="content-center aspect-16/10 h-[145px]! pb-[16px] w-full"
                  additionalMobileClasses="aspect-15/6! col-span-3 pb-[16px] h-[145px]!"
                  imageLayout="fill"
                />
                <button
                  onClick={() => setActiveSwatch(null)}
                  className="absolute top-0 right-0 p-4"
                >
                  <SvgIcon icon="close" size="md" />
                </button>
              </div>

              {/* Second Image, Button, and Rich Text Wrapper */}
              <div className="col-span-3 flex justify-center px-5 pt-4 md:flex-col">
                {/* Second Image */}
                <ImageWrapper
                  image={activeSwatch?.fields.productOrHardwareImage as ImageField}
                  additionalDesktopClasses="h-[145px] w-[135px] hidden! md:flex! items-center! justify-center! content-center justify-self-center self-center overflow-hidden aspect-square"
                  additionalMobileClasses="w-[135px] h-[145px] flex! md:hidden! items-center! justify-center! object-contain content-center justify-self-center self-center overflow-hidden"
                  imageLayout="intrinsic"
                />

                {/* Button and Rich Text */}
                <div className="flex flex-col items-center pl-4 md:pl-0">
                  <RichTextWrapper
                    field={activeSwatch?.fields.productHardwareCaption as Field<string>}
                    classes="items-top font-sans [&_a:hover]:underline text-theme-text text-sm-xs ml:text-xs font-medium mb-[1rem] mt-7 md:mt-[1rem] inline  max-w-[300px] wrap-break-word text-center"
                  />
                  {/* @ts-ignore cutom button */}
                  <Button
                    field={activeSwatch?.fields.link as LinkField}
                    icon={{
                      id: 'arrow-icon-id',
                      url: '#',
                      name: 'Arrow',
                      displayName: 'Arrow',
                      fields: {
                        Value: {
                          value: 'arrow',
                        },
                      },
                    }}
                    classes="mb-[16px]"
                  />
                </div>
              </div>

              {/* Disclaimer */}
              <div className="col-span-3 justify-items-center ">
                <Disclaimer
                  disclaimerClasses="opacity-50 pb-[20px] pr-[20px] pl-[20px] text-center max-w-[200px] wrap-break-word"
                  fields={
                    {
                      disclaimerText: (activeSwatch?.fields?.disclaimer as Field<string>) ?? {
                        value: '',
                      },
                      hideFieldOnLoad: (activeSwatch?.fields
                        ?.hideFieldOnLoad as Field<boolean>) ?? {
                        value: false,
                      },
                    } as Parameters<typeof Disclaimer>[0]['fields']
                  }
                />
              </div>
            </div>
          </ModalWrapper>
        )}
    </div>
  );
};

export default SwatchCollection;
