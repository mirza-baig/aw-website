import { PlaceholderData } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import RichTextWrapper from 'helpers/RichTextWrapper/RichTextWrapper';
import SingleButton from 'helpers/SingleButton/SingleButton';
import { SliderWrapper } from 'helpers/SliderWrapper';
import { SliderRefType, sliderSettings, SliderType } from 'helpers/SliderWrapper/SliderWrapper';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import Image from 'next/image';
import React, { ReactElement, useRef } from 'react';
import { Url } from 'url';

type childItem = {
  url: Url;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any;
  placeholders: PlaceholderData;
};

type RenderingProps = {
  slidesData: childItem[];
  currentSlideIndex: number;
};

type RenderSliderProps = {
  sliderSettings: sliderSettings;
} & RenderingProps;
export const RenderSlider = ({
  currentSlideIndex,
  slidesData,
  sliderSettings,
}: RenderSliderProps): ReactElement => {
  const ref = useRef<SliderType | null>(null);
  return (
    <div>
      <SliderWrapper sliderSettings={sliderSettings} sliderRef={ref as SliderRefType}>
        {slidesData.map((item, idx) => {
          const isActive = idx === currentSlideIndex;

          const handleClick = (e: React.MouseEvent) => {
            if (!isActive && ref.current?.slickGoTo) {
              e.preventDefault();
              ref.current.slickGoTo(idx);
            }
          };

          return (
            <div key={item.fields?.carouselSlideImage?.value?.src ?? `slide-${idx}`}>
              <div className="flex h-full items-center">
                {item.fields.productLink.value.href.length > 0 || item.fields.cta1Link ? (
                  <div className="product-carousel">
                    <button
                      type="button"
                      className={classNames({
                        'w-[300px] border-0 bg-transparent p-0': true,
                        'opacity-50': !isActive,
                      })}
                      onClick={handleClick}
                      disabled={isActive}
                      style={{ cursor: !isActive ? 'pointer' : 'default' }}
                    >
                      {isActive ? (
                        item.fields.productLink.value.href ? (
                          <LinkWrapper
                            field={item.fields.productLink}
                            suppressLinkText
                            ariaLabel={{
                              value: item.fields?.carouselSlideImage?.value?.alt,
                            }}
                          >
                            <div className="mx-[25px] text-center ml:mx-0">
                              <Image
                                src={item.fields?.carouselSlideImage?.value?.src}
                                alt={item.fields?.carouselSlideImage?.value?.alt}
                                width={item.fields?.carouselSlideImage?.value?.width}
                                height={item.fields?.carouselSlideImage?.value?.height}
                                layout="responsive"
                                className="h-auto w-full"
                                unoptimized={isSvgUrl(item.fields?.carouselSlideImage?.value?.src)}
                              />
                            </div>
                          </LinkWrapper>
                        ) : (
                          <div className="mx-[25px] text-center ml:mx-0">
                            <Image
                              src={item.fields?.carouselSlideImage?.value?.src}
                              alt={item.fields?.carouselSlideImage?.value?.alt}
                              width={item.fields?.carouselSlideImage?.value?.width}
                              height={item.fields?.carouselSlideImage?.value?.height}
                              layout="responsive"
                              className="h-auto w-full"
                              unoptimized={isSvgUrl(item.fields?.carouselSlideImage?.value?.src)}
                            />
                          </div>
                        )
                      ) : (
                        <div className="mx-[25px] text-center ml:mx-0">
                          <Image
                            src={item.fields?.carouselSlideImage?.value?.src}
                            alt={item.fields?.carouselSlideImage?.value?.alt}
                            width={item.fields?.carouselSlideImage?.value?.width}
                            height={item.fields?.carouselSlideImage?.value?.height}
                            layout="responsive"
                            className="h-auto w-full"
                          />
                        </div>
                      )}
                    </button>
                    {isActive && (
                      <div className={classNames({ 'mt-4 w-[300px] text-center': true })}>
                        {item.fields?.cta1Link?.value?.href ? (
                          <div className="mt-4 flex w-[300px] flex-col items-center text-center">
                            <SingleButton fields={item.fields} />
                          </div>
                        ) : (
                          item.fields?.productLink?.value?.href && (
                            <LinkWrapper
                              field={item.fields.productLink}
                              suppressLinkText
                              className="font-futura-pt text-[18px] font-bold uppercase leading-7 text-black hover:underline"
                              ariaLabel={{
                                value: item.fields?.productName?.value,
                              }}
                            >
                              {item.fields?.productName?.value}
                            </LinkWrapper>
                          )
                        )}
                        {item.fields.productBodyCopy.value && (
                          <RichTextWrapper
                            field={item.fields.productBodyCopy}
                            classes="mt-2 text-sm"
                          />
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="product-carousel">
                    <button
                      type="button"
                      className={classNames({
                        'w-[300px] border-0 bg-transparent p-0': true,
                        'opacity-50': !isActive,
                      })}
                      onClick={handleClick}
                      disabled={isActive}
                      style={{ cursor: !isActive ? 'pointer' : 'default' }}
                    >
                      <div className="mx-[25px] text-center ml:mx-0">
                        <Image
                          src={item.fields?.carouselSlideImage?.value?.src}
                          alt={item.fields?.carouselSlideImage?.value?.alt}
                          width={item.fields?.carouselSlideImage?.value?.width}
                          height={item.fields?.carouselSlideImage?.value?.height}
                          layout="responsive"
                          className="h-auto w-full"
                        />
                      </div>
                    </button>

                    {isActive && (
                      <div className={classNames({ 'mt-4 w-[300px] px-2 text-center': true })}>
                        <span className="font-futura-pt text-[18px] font-bold uppercase leading-7 text-black hover:underline">
                          {item.fields.productName.value}
                        </span>
                        {item.fields.productBodyCopy.value && (
                          <RichTextWrapper
                            field={item.fields.productBodyCopy}
                            classes="mt-2 text-sm"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </SliderWrapper>
    </div>
  );
};
