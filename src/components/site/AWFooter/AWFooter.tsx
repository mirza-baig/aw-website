'use client';

import { ComponentRendering, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { ComponentProps } from 'lib/component-props';
import { FeatureFlags } from 'lib/feature-flags/feature-flags';
import { mapItemFieldResultsToObject } from 'lib/graphql/mappers/map-item-field-results-to-object';
import { mapSearchResults } from 'lib/graphql/mappers/map-search-results';
import { IntegratedGraphQlResult } from 'lib/graphql/types/integrated-graphql-result';
import { ItemFieldResult } from 'lib/graphql/types/item-field-result';
import { ItemSearchResults } from 'lib/graphql/types/item-search-results';
import { getEnum } from 'lib/utils/get-enum';
import { useCurrentScreenType } from 'lib/utils/get-screen-type';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX, useState } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type AWFooterProps = ComponentProps & Sitecore.Components.Navigation.Footer.Footer;

function AWFooter_Default(props: AWFooterProps): JSX.Element {
  const { fields } = getComponentServerProps(props.rendering) as AWFooterProps;
  const isEE = useExperienceEditor();
  const { screenType } = useCurrentScreenType();
  const isDesktop = screenType !== 'sm' && screenType !== 'md';
  const { page } = useSitecore();
  const trustArcCmId = process.env.NEXT_PUBLIC_AW_TRUSTARC_CMID ?? '';
  const showTrustArc = trustArcCmId && !page?.layout.sitecore.context.pageEditing;

  const currentYear = new Date().getFullYear().toString();
  const copyrightText = fields?.copyright?.value;
  let textWithReplacedYear = copyrightText;
  if (copyrightText?.includes('{currentYear}')) {
    textWithReplacedYear = copyrightText.replace('{currentYear}', currentYear);
  }

  const navGroup = fields?.children;
  const socialMenu =
    navGroup?.length &&
    navGroup.filter(function (nav: AWFooterProps) {
      return nav?.fields?.menuTitle?.value === 'socialMenu';
    });
  const footerMenu =
    navGroup?.length &&
    navGroup.filter(function (nav: AWFooterProps) {
      return nav.fields?.menuTitle?.value === 'footerMenu';
    });
  const privacyMenu =
    navGroup?.length &&
    navGroup.filter(function (nav: AWFooterProps) {
      return nav.fields?.menuTitle?.value === 'privacyMenu';
    });
  let privacyMenuArray = privacyMenu?.length && privacyMenu[0].fields.children;
  let socialMenuArray = socialMenu?.length && socialMenu[0].fields.children;
  const footerMenuArray = footerMenu?.length && footerMenu[0].fields.children;
  if (socialMenuArray == 0) {
    socialMenuArray = null;
  }
  if (privacyMenuArray == 0) {
    privacyMenuArray = null;
  }

  const isExpandedFooterLayout = FeatureFlags.values.releaseFooterExpandedLayout === true;
  const navGroupCount = Array.isArray(footerMenuArray) ? footerMenuArray.length : 0;
  let desktopNavGroupWidthClass = 'ml:w-[25%]';
  if (navGroupCount <= 5) {
    desktopNavGroupWidthClass = 'ml:w-[20%]';
  } else if (navGroupCount === 6) {
    desktopNavGroupWidthClass = 'ml:w-[33.333%]';
  }
  const footerMenuContainerClass = isExpandedFooterLayout
    ? 'flex w-full max-mmd:flex-col max-mmd:border-b max-mmd:border-solid max-mmd:border-b-white mmd:flex-wrap mmd:gap-y-l ml:shrink ml:grow ml:basis-0'
    : 'flex w-full max-ml:flex-col max-ml:border-b max-ml:border-solid max-ml:border-b-white ml:shrink ml:grow ml:basis-0';
  const footerMenuItemClass = isExpandedFooterLayout
    ? `flex flex-col mmd:pr-xxs mmd:max-ml:w-[33.333%] ${desktopNavGroupWidthClass}`
    : 'flex flex-col ml:w-[20%] ml:pr-xxs';
  const Accordion = ({ title, children }: AWFooterProps) => {
    const [isOpen, setOpen] = useState(false);
    return (
      <div>
        <div
          className={`border-t border-solid border-t-white py-xs ${
            isOpen
              ? 'open [&_span]:after:-rotate-90 [&_span]:after:transition-all [&_span]:after:duration-100'
              : '[&_span]:after:rotate-90 [&_span]:after:transition-all [&_span]:after:duration-100'
          }`}
          onClick={() => setOpen(!isOpen)}
        >
          <span className="flex items-center justify-between text-small font-heavy uppercase leading-[14px] after:text-base after:content-['\276F'] ml:text-xxs ">
            {title}
          </span>
        </div>
        <div
          className={`accordion-item ${
            !isOpen
              ? 'collapsed max-h-0 transition-[max-height] duration-[0.35s] ease-[cubic-bezier(0,1,0,1)]'
              : 'h-auto max-h-[9999px] overflow-hidden transition-[max-height] duration-300 ease-[cubic-bezier(1,0,1,0)]'
          }`}
        >
          <div>{children}</div>
        </div>
      </div>
    );
  };

  if (!fields) {
    return <></>;
  }

  return (
    <div
      data-component="site/awfooter"
      className="awfooter bg-black py-m text-base text-white ml:py-l"
    >
      <div className="px-m ml:max-w-screen-lg lg:mx-auto">
        <div className="flex flex-col flex-wrap ml:flex-row">
          <div className="flex flex-col max-ml:order-4 max-ml:mt-l ml:w-[16.6%] ml:basis-[16.6%] ml:pr-xxs">
            <div className="mb-s font-sans text-xs font-heavy uppercase max-ml:hidden ">
              <Text tag={'h3'} field={fields.tagLine} />
            </div>
            <div className="mb-s text-body max-ml:order-2">
              <Text field={{ value: textWithReplacedYear }} />
            </div>
            <div className="flex flex-wrap max-ml:order-1 max-ml:mb-s">
              {socialMenuArray &&
                socialMenuArray.map((menu: AWFooterProps, index: number) => {
                  return (
                    menu.fields?.navItemLink.value &&
                    getEnum(menu.fields?.navItemIcon) && (
                      <div key={index} className="mr-xxs mt-xxxs">
                        {isEE ? (
                          <SvgIcon icon={getEnum(menu.fields?.navItemIcon)} />
                        ) : (
                          <LinkWrapper ctaSection="footer" field={menu.fields?.navItemLink}>
                            <SvgIcon icon={getEnum(menu.fields?.navItemIcon)} />
                          </LinkWrapper>
                        )}
                      </div>
                    )
                  );
                })}
            </div>
          </div>
          <div className="flex flex-col max-ml:order-1 ml:w-[83.4%] ml:basis-[83.4%] ml:pl-xxs">
            <div className="mb-l font-sans text-sm-s font-heavy uppercase ml:hidden">
              <Text tag={'h3'} field={fields.tagLine} />
            </div>
            <div className={footerMenuContainerClass}>
              {footerMenuArray &&
                footerMenuArray.map((menu: AWFooterProps, index: number) => {
                  return (
                    <div key={index} className={footerMenuItemClass}>
                      {isDesktop ? (
                        <>
                          <div className="mb-xxxs font-sans text-xxs font-heavy uppercase leading-none">
                            <Text tag={'span'} field={menu.fields?.navGroupTitle} />
                          </div>
                          <ul className={`flex flex-col`}>
                            {menu.fields?.children.map((nav: AWFooterProps, index: number) => {
                              return (
                                nav.fields?.navItemLink && (
                                  <li key={index} className="py-xxxs">
                                    <LinkWrapper
                                      ctaSection="footer"
                                      field={nav.fields?.navItemLink}
                                      className="text-body hover:underline"
                                    >
                                      {nav.fields?.navItemLink.value.target === '_blank' && (
                                        <SvgIcon icon="new-tab" className="ml-xxxs inline-flex" />
                                      )}
                                    </LinkWrapper>
                                  </li>
                                )
                              );
                            })}
                          </ul>
                        </>
                      ) : (
                        <Accordion title={menu.fields?.navGroupTitle.value as string}>
                          {menu.fields && menu.fields.children.length && (
                            <ul className={`ease flex flex-col  transition-all duration-1000`}>
                              {menu.fields?.children.map((nav: AWFooterProps, index: number) => {
                                return (
                                  nav.fields?.navItemLink && (
                                    <li key={index} className="py-xxxs ">
                                      <LinkWrapper
                                        ctaSection="footer"
                                        field={nav.fields?.navItemLink}
                                        className="text-small hover:underline"
                                      >
                                        {nav.fields?.navItemLink.value.target === '_blank' && (
                                          <SvgIcon icon="new-tab" className="ml-xxxs inline-flex" />
                                        )}
                                      </LinkWrapper>
                                    </li>
                                  )
                                );
                              })}
                            </ul>
                          )}
                        </Accordion>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="mt-l flex flex-col max-ml:order-3 max-ml:mb-l ml:w-[16.6%] ml:basis-[16.6%] ml:pr-xxs">
            {fields?.logoCTA?.value?.href !== '' ? (
              <LinkWrapper ctaSection="footer" field={fields.logoCTA}>
                <ImageWrapper
                  image={fields.logo}
                  additionalMobileClasses="max-w-[120px]"
                  additionalDesktopClasses="max-w-[120px]"
                />
              </LinkWrapper>
            ) : (
              <ImageWrapper
                image={fields.logo}
                additionalMobileClasses="max-w-[120px]"
                additionalDesktopClasses="max-w-[120px]"
              />
            )}
          </div>
          <div className="mt-l flex flex-col max-ml:order-3 ml:w-[83.4%] ml:basis-[83.4%] ml:pl-xxs">
            <div className="mb-s flex w-full text-body ml:mb-xxs">
              <Text tag={'h3'} field={fields.privacyCaption} />
            </div>
            <div className="w-full flex-wrap max-ml:text-body md:flex">
              {privacyMenuArray &&
                privacyMenuArray.map((menu: AWFooterProps, index: number) => {
                  return (
                    menu.fields?.navItemLink && (
                      <span key={index}>
                        <LinkWrapper
                          ctaSection="footer"
                          className="text-body underline"
                          field={menu.fields?.navItemLink}
                        >
                          {menu.fields?.navItemLink.value.target === '_blank' && (
                            <SvgIcon icon="new-tab" className="ml-xxxs inline-flex" />
                          )}
                        </LinkWrapper>
                        {index < privacyMenuArray.length - 1 && (
                          <span className="inline-flex md:px-xxxs"> | </span>
                        )}
                      </span>
                    )
                  );
                })}
            </div>
          </div>
          {showTrustArc && (
            <button className="flex underline" onClick={FooterConsentTrigger}>
              Cookie Preferences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const Default = withDatasourceCheck(AWFooter_Default);

function FooterConsentTrigger() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any)?.truste) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).truste.eu.clickListener();
  }
}

type IntegratedGraphQl = IntegratedGraphQlResult<{
  item: {
    fields: ItemFieldResult[];
    children: ItemSearchResults<{
      template: { name: string };
      fields: ItemFieldResult[];
      children: ItemSearchResults<{
        template: { name: string };
        fields: ItemFieldResult[];
        children: ItemSearchResults<{
          template: { name: string };
          fields: ItemFieldResult[];
        }>;
      }>;
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
      children: mapSearchResults(
        fields.data.item.children,
        (child1) => ({
          fields: {
            ...mapItemFieldResultsToObject(child1.fields),
            children: mapSearchResults(child1.children, (child2) => ({
              fields: {
                ...mapItemFieldResultsToObject(child2.fields),
                children: mapSearchResults(child2.children, (child3) => ({
                  fields: {
                    ...mapItemFieldResultsToObject(child3.fields),
                  },
                })),
              },
            })),
          },
        }),
        []
      ),
    },
  };

  return result;
}
