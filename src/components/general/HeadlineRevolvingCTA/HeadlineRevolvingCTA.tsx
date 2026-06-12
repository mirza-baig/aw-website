'use client';

import classNames from 'classnames';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';

import styles from './helpers/slick.module.css';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeadlineRevolvingCTAProps = ComponentProps &
  Sitecore.Components.General.HeadlineRevolvingCta.HeadlineRevolvingCta;

function HeadlineRevolvingCTA_Default(props: HeadlineRevolvingCTAProps) {
  const { fields } = props;
  const { screenType } = useCurrentScreenType();
  const [slideMaxWidth, setSlideMaxWidth] = useState('');
  const isDesktop = screenType !== 'sm';
  const hasLink2 = !!fields?.link2?.value?.text;
  const hasLink3 = !!fields?.link3?.value?.text;

  useEffect(() => {
    const links = document.querySelectorAll('.headlinerevolvingcta .title');
    let maxWidth = 200;
    links.forEach((link: Element) => {
      const width = link.getBoundingClientRect().width;
      if (width > maxWidth) {
        maxWidth = width;
      }
    });
    maxWidth = maxWidth + 46;
    if (isDesktop && maxWidth > 600) {
      maxWidth = 600;
    }

    if (isDesktop) {
      setSlideMaxWidth(Math.round(maxWidth) + 'px');
    } else {
      setSlideMaxWidth('100%');
    }

    if (hasLink2 || hasLink3) {
      const slickListDiv = document.querySelector(
        '.headlinerevolvingcta .slick-list'
      ) as HTMLElement;

      if (slickListDiv) {
        slickListDiv.classList.add('setgap');
      }
    }
  }, [hasLink2, hasLink3, isDesktop, screenType, slideMaxWidth]);

  if (!fields) {
    return null;
  }

  let NumOfLinks = 1;

  if (hasLink2 && hasLink3) {
    NumOfLinks = 3;
  } else if (hasLink2 || hasLink3) {
    NumOfLinks = 2;
  }

  const settings = {
    dots: false,
    infinite: true,
    arrows: true,
    slidesToShow: isDesktop ? 1 : NumOfLinks,
    slidesToScroll: 1,
    vertical: true,
    verticalSwiping: true,
    swipeToSlide: true,
    autoplay: true,
    adaptiveHeight: false,
    autoplaySpeed: fields.autoScrollTiming?.value ? fields.autoScrollTiming.value * 1000 : 2000,
    initialSlide: isDesktop && NumOfLinks ? NumOfLinks : 1,
  };

  // ✅ Simplified logic to replace nested ternaries
  let linkField1 = fields?.link1;
  let linkField2 = fields?.link2;
  let linkField3 = fields?.link3;

  if (isDesktop) {
    if (hasLink2) {
      linkField1 = fields?.link2;
      linkField2 = fields?.link1;
    } else if (hasLink3) {
      linkField1 = fields?.link3;
      linkField3 = fields?.link1;
    }
  }

  return (
    <Component
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="general/headlinerevolvingcta"
      {...props}
    >
      <div className={classNames(styles.sliderWrapper, 'col-span-12 grid')}>
        <div className="headlinerevolvingcta col-span-12">
          <div className="mx-auto flex flex-col md:flex-row md:items-center md:justify-center">
            <div className="fadeInUp">
              <Headline classes="font-heavy text-m ml:text-xl" {...props} />
            </div>

            <div className="slider-wrapper fadeInUp md:pl-s" style={{ maxWidth: slideMaxWidth }}>
              <div className="block">
                <Slider
                  {...settings}
                  className={`${NumOfLinks === 1 ? 'slick-active slick-current' : ''}`}
                >
                  {/* Link 1 */}
                  <div className="flex cursor-pointer items-center">
                    <LinkWrapper
                      field={linkField1}
                      className="title inline-flex items-center font-sans text-m font-heavy ml:text-xl"
                      ariaLabel={{ value: 'slider wrapper' }}
                    >
                      <SvgIcon icon="arrow" className="icon flex items-center justify-center" />
                    </LinkWrapper>
                  </div>

                  {/* Link 2 */}
                  {hasLink2 && (
                    <div className="flex cursor-pointer items-center">
                      <LinkWrapper
                        field={linkField2}
                        className="title inline-flex items-center font-sans text-m font-heavy ml:text-xl"
                        ariaLabel={{ value: 'hasLink2' }}
                      >
                        <SvgIcon icon="arrow" className="icon flex items-center justify-center" />
                      </LinkWrapper>
                    </div>
                  )}

                  {/* Link 3 */}
                  {hasLink3 && (
                    <div className="flex cursor-pointer items-center">
                      <LinkWrapper
                        field={linkField3}
                        className="title inline-flex items-center font-sans text-m font-heavy ml:text-xl"
                        ariaLabel={{ value: 'hasLink3' }}
                      >
                        <SvgIcon icon="arrow" className="icon flex items-center justify-center" />
                      </LinkWrapper>
                    </div>
                  )}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(HeadlineRevolvingCTA_Default);
