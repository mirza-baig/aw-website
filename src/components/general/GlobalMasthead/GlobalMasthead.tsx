'use client';

import { ComponentRendering, Item } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getEnum } from 'lib/utils/get-enum';
import { getBreakpoint, useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX, useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';

import { GlobalMastheadTheme } from './helpers/GlobalMasthead.theme';
import SocialIcons from './helpers/SocialIcons.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type BackgroundColor = 'gray' | 'primary' | 'white';

type GlobalMastheadProps = ComponentProps &
  Sitecore.Components.General.GlobalMasthead.GlobalMasthead;

function GlobalMasthead_Default(props: GlobalMastheadProps): JSX.Element {
  const { fields } = getComponentServerProps(props) as GlobalMastheadProps;
  const selectedBackgroundColor = getEnum<BackgroundColor>(fields?.backgroundColor) ?? 'white';

  const { themeData } = useTheme(GlobalMastheadTheme);
  const { currentScreenWidth } = useCurrentScreenType();
  const mastheadRef = useRef<HTMLDivElement>(null);

  const isDesktop = currentScreenWidth >= getBreakpoint('ml');
  const mobileWidthStyle = currentScreenWidth <= 405 ? 'w-max' : '';

  const DesktopLogoImage = fields?.desktopLogo;
  const MobileLogoImage = fields?.mobileLogo?.value?.src ? fields.mobileLogo : fields?.desktopLogo;

  const backgroundColorStyle = useMemo(() => {
    if (selectedBackgroundColor === 'gray') {
      return 'bg-dark-gray';
    } else if (selectedBackgroundColor === 'primary') {
      return 'bg-primary';
    } else {
      return 'bg-white';
    }
  }, [selectedBackgroundColor]);

  const fontTextStyle = useMemo(() => {
    if (selectedBackgroundColor === 'white') {
      return 'text-black';
    } else {
      return 'text-white';
    }
  }, [selectedBackgroundColor]);

  const iconColorStyle = useMemo(() => {
    if (selectedBackgroundColor?.toLowerCase() === 'white') {
      return 'black';
    } else {
      return 'white';
    }
  }, [selectedBackgroundColor]);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementsByTagName('main')[0];

      if (el.getBoundingClientRect().top < 345) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setIsShow(isDesktop);
  }, [isDesktop]);

  return (
    <div
      data-component="general/globalmasthead"
      className={classNames(
        themeData.classes.mastheadWrapper,
        backgroundColorStyle,
        { '': isScrolled },
        mobileWidthStyle
      )}
      style={{ height: 'auto' }}
      ref={mastheadRef}
    >
      <div className={themeData.classes.headWrapper}>
        <div className={classNames(themeData.classes.headLogoWrapper, fontTextStyle)}>
          <button
            onClick={() => setIsShow(!isShow)}
            className={themeData.classes.menuIcon}
            title={isShow ? 'Collapse' : 'Expand'}
          >
            {!isShow ? <IoIosArrowDropdown size={36} /> : <IoIosArrowDropup size={36} />}
          </button>
          <div className={themeData.classes.headLogo}>
            <LinkWrapper
              field={fields?.linkLogo}
              suppressLinkText
              ariaLabel={{
                value: isDesktop
                  ? DesktopLogoImage?.value?.text
                  : (MobileLogoImage?.value?.text ?? 'global masthead Logo Image'),
              }}
            >
              {isDesktop ? (
                <>
                  {DesktopLogoImage?.value?.src ? (
                    <div
                      className={classNames('h-[60px] w-[550px] object-cover', {
                        'h-[26px] w-[334px]': isScrolled,
                      })}
                    >
                      <ImageWrapper
                        image={DesktopLogoImage}
                        mobileImage={MobileLogoImage}
                        additionalDesktopClasses="h-full w-full cursor-pointer"
                      />
                    </div>
                  ) : (
                    <span className={themeData.classes.headline}>{fields?.headlineText.value}</span>
                  )}
                </>
              ) : (
                <>
                  {MobileLogoImage?.value?.src ? (
                    <div className={`h-[30px] w-[300px] object-cover`}>
                      <ImageWrapper
                        image={MobileLogoImage}
                        mobileImage={MobileLogoImage}
                        additionalDesktopClasses="h-full w-full cursor-pointer"
                      />
                    </div>
                  ) : (
                    <span className={themeData.classes.headline1}>
                      {fields?.headlineText.value}
                    </span>
                  )}
                </>
              )}
            </LinkWrapper>
          </div>
        </div>
        {isShow && (
          <div className={themeData.classes.anchorWrapper}>
            <div className="hidden ml:block">
              <SocialIcons icons={fields?.socialIcons} iconColor={iconColorStyle} />
            </div>
            <div className={themeData.classes.anchors}>
              {fields?.children?.map((link: Item & Sitecore.FieldSets.GeneralLink) => (
                <LinkWrapper
                  field={link?.fields?.Link}
                  key={link?.id ?? (link?.fields?.Link?.value?.id as string)}
                  suppressLinkText
                  ariaLabel={{ value: (link.fields.Link.value.text as string) ?? 'General Link' }}
                >
                  <span className={classNames(themeData.classes.linkTitle, fontTextStyle)}>
                    {link.fields.Link.value.text}
                  </span>
                </LinkWrapper>
              ))}
            </div>
            <div className="mt-2 py-5 pb-2 mmd:py-2 ml:mt-0">
              <LinkWrapper
                field={fields?.rightSideLink}
                suppressLinkText
                className={classNames('flex items-center', fontTextStyle)}
                ariaLabel={{ value: fields?.rightSideLink.value.text ?? 'Right Side Link' }}
              >
                <span className="font-sans text-[18px] font-bold">
                  {fields?.rightSideLink.value.text}
                </span>
                <FiArrowRight size={16} />
              </LinkWrapper>
            </div>
            <div className="block ml:hidden">
              <SocialIcons icons={fields?.socialIcons} iconColor={iconColorStyle} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const Default = withDatasourceCheck(GlobalMasthead_Default);

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      fields: ItemFieldResult[];
    }>;
  };
}>;

function getComponentServerProps(rendering: ComponentRendering) {
  if (rendering.fields === undefined || !('data' in rendering.fields)) {
    return {};
  }

  const fields = rendering.fields as unknown as IntegratedGraphQl;

  const result = {
    fields: {
      ...mapItemFieldResultsToObject(fields.data.item.fields),
      children: mapSearchResults(fields.data.item.children, (child) => {
        return {
          fields: {
            ...mapItemFieldResultsToObject(child.fields),
          },
        };
      }),
    },
  };
  return result;
}
