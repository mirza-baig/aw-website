'use client';

import { ComponentRendering, Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import SvgIcon, { IconTypes } from 'helpers/SvgIcon/SvgIcon';
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
import { JSX, ReactNode, useState } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

type AWFooterProps = ComponentProps & Sitecore.Components.Navigation.Footer.Footer;

// --- Helpers ---------------------------------------------------------------

function findMenuByTitle(
  navGroup: AWFooterProps[] | undefined,
  title: string
): AWFooterProps | undefined {
  return navGroup?.find((nav) => nav?.fields?.menuTitle?.value === title);
}

function getMenuChildren(menu: AWFooterProps | undefined): AWFooterProps[] | null {
  const children = menu?.fields?.children;
  return Array.isArray(children) && children.length > 0 ? children : null;
}

function getDesktopNavGroupWidthClass(count: number): string {
  if (count <= 5) {
    return 'ml:w-[20%]';
  }
  if (count === 6) {
    return 'ml:w-[33.333%]';
  }
  return 'ml:w-[25%]';
}

function replaceYearToken(text: string | undefined, year: string): string {
  return text?.replace('{currentYear}', year) ?? '';
}

// --- Subcomponents ---------------------------------------------------------

type AccordionProps = { title: string; children: ReactNode };

function Accordion({ title, children }: Readonly<AccordionProps>): JSX.Element {
  const [isOpen, setOpen] = useState(false);
  const headerClass = isOpen
    ? 'open [&_span]:after:-rotate-90 [&_span]:after:transition-all [&_span]:after:duration-100'
    : '[&_span]:after:rotate-90 [&_span]:after:transition-all [&_span]:after:duration-100';
  const bodyClass = isOpen
    ? 'h-auto max-h-[9999px] overflow-hidden transition-[max-height] duration-300 ease-[cubic-bezier(1,0,1,0)]'
    : 'collapsed max-h-0 transition-[max-height] duration-[0.35s] ease-[cubic-bezier(0,1,0,1)]';

  return (
    <div>
      <div
        className={`border-t border-solid border-t-white py-xs ${headerClass}`}
        onClick={() => setOpen(!isOpen)}
      >
        <span className="flex items-center justify-between text-small font-heavy uppercase leading-[14px] after:text-base after:content-['\276F'] ml:text-xxs ">
          {title}
        </span>
      </div>
      <div className={`accordion-item ${bodyClass}`}>
        <div>{children}</div>
      </div>
    </div>
  );
}

type NavItemProps = { nav: AWFooterProps; linkClassName: string };

function NavItem({ nav, linkClassName }: Readonly<NavItemProps>): JSX.Element | null {
  const link = nav.fields?.navItemLink;
  if (!link) {
    return null;
  }
  return (
    <li className="py-xxxs">
      <LinkWrapper ctaSection="footer" field={link} className={linkClassName}>
        {link.value.target === '_blank' && (
          <SvgIcon icon="new-tab" className="ml-xxxs inline-flex" />
        )}
      </LinkWrapper>
    </li>
  );
}

function navItemKey(nav: AWFooterProps, fallback: string | number): string {
  return (nav.fields?.navItemLink?.value?.href as string) || String(fallback);
}

type NavGroupProps = { menu: AWFooterProps };

function NavGroupDesktop({ menu }: Readonly<NavGroupProps>): JSX.Element {
  const children = menu.fields?.children ?? [];
  return (
    <>
      <div className="mb-xxxs font-sans text-xxs font-heavy uppercase leading-none">
        <Text tag={'span'} field={menu.fields?.navGroupTitle} />
      </div>
      <ul className="flex flex-col">
        {children.map((nav: AWFooterProps, i: number) => (
          <NavItem key={navItemKey(nav, i)} nav={nav} linkClassName="text-body hover:underline" />
        ))}
      </ul>
    </>
  );
}

function NavGroupMobile({ menu }: Readonly<NavGroupProps>): JSX.Element {
  const children = menu.fields?.children ?? [];
  const title = (menu.fields?.navGroupTitle?.value ?? '') as string;
  return (
    <Accordion title={title}>
      {children.length > 0 && (
        <ul className="ease flex flex-col  transition-all duration-1000">
          {children.map((nav: AWFooterProps, i: number) => (
            <NavItem
              key={navItemKey(nav, i)}
              nav={nav}
              linkClassName="text-small hover:underline"
            />
          ))}
        </ul>
      )}
    </Accordion>
  );
}

type SocialLinksProps = { items: AWFooterProps[]; isEE: boolean };

function SocialLinks({ items, isEE }: Readonly<SocialLinksProps>): JSX.Element {
  return (
    <>
      {items.map((menu, i) => {
        const link = menu.fields?.navItemLink;
        const icon = getEnum<IconTypes>(menu.fields?.navItemIcon);
        if (!link?.value || !icon) {
          return null;
        }
        const key = (link.value.href as string) || `social-${i}`;
        return (
          <div key={key} className="mr-xxs mt-xxxs">
            {isEE ? (
              <SvgIcon icon={icon} />
            ) : (
              <LinkWrapper ctaSection="footer" field={link}>
                <SvgIcon icon={icon} />
              </LinkWrapper>
            )}
          </div>
        );
      })}
    </>
  );
}

type PrivacyLinksProps = { items: AWFooterProps[] };

function PrivacyLinks({ items }: Readonly<PrivacyLinksProps>): JSX.Element {
  return (
    <>
      {items.map((menu, i) => {
        const link = menu.fields?.navItemLink;
        if (!link) {
          return null;
        }
        const key = (link.value.href as string) || `privacy-${i}`;
        return (
          <span key={key}>
            <LinkWrapper ctaSection="footer" className="text-body underline" field={link}>
              {link.value.target === '_blank' && (
                <SvgIcon icon="new-tab" className="ml-xxxs inline-flex" />
              )}
            </LinkWrapper>
            {i < items.length - 1 && <span className="inline-flex md:px-xxxs"> | </span>}
          </span>
        );
      })}
    </>
  );
}

function FooterConsentTrigger() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any)?.truste) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).truste.eu.clickListener();
  }
}

// --- Main component --------------------------------------------------------

function AWFooter_Default(props: AWFooterProps): JSX.Element {
  const { fields } = getComponentServerProps(props.rendering) as AWFooterProps;
  const isEE = useExperienceEditor();
  const { screenType } = useCurrentScreenType();
  const isDesktop = screenType !== 'sm' && screenType !== 'md';
  const { page } = useSitecore();
  const trustArcCmId = process.env.NEXT_PUBLIC_AW_TRUSTARC_CMID ?? '';
  const showTrustArc = trustArcCmId && !page?.layout.sitecore.context.pageEditing;

  if (!fields) {
    return <></>;
  }

  const currentYear = new Date().getFullYear().toString();
  const textWithReplacedYear = replaceYearToken(fields?.copyright?.value, currentYear);

  const navGroup = fields?.children;
  const socialMenuArray = getMenuChildren(findMenuByTitle(navGroup, 'socialMenu'));
  const footerMenuArray = getMenuChildren(findMenuByTitle(navGroup, 'footerMenu'));
  const privacyMenuArray = getMenuChildren(findMenuByTitle(navGroup, 'privacyMenu'));

  const isExpandedFooterLayout = FeatureFlags.values.releaseFooterExpandedLayout === true;
  const navGroupCount = footerMenuArray?.length ?? 0;
  const desktopNavGroupWidthClass = getDesktopNavGroupWidthClass(navGroupCount);

  const footerMenuContainerClass = isExpandedFooterLayout
    ? 'flex w-full max-mmd:flex-col max-mmd:border-b max-mmd:border-solid max-mmd:border-b-white mmd:flex-wrap mmd:gap-y-l ml:shrink ml:grow ml:basis-0'
    : 'flex w-full max-ml:flex-col max-ml:border-b max-ml:border-solid max-ml:border-b-white ml:shrink ml:grow ml:basis-0';
  const footerMenuItemClass = isExpandedFooterLayout
    ? `flex flex-col mmd:pr-xxs mmd:max-ml:w-[33.333%] ${desktopNavGroupWidthClass}`
    : 'flex flex-col ml:w-[20%] ml:pr-xxs';

  return (
    <div
      data-component="site/awfooter"
      className="awfooter bg-black py-m text-base text-white ml:py-l"
    >
      <div className="px-m ml:max-w-screen-lg lg:mx-auto">
        <div className="flex flex-col flex-wrap ml:flex-row">
          {/* Left column: tagline, copyright, social */}
          <div className="flex flex-col max-ml:order-4 max-ml:mt-l ml:w-[16.6%] ml:basis-[16.6%] ml:pr-xxs">
            <div className="mb-s font-sans text-xs font-heavy uppercase max-ml:hidden ">
              <Text tag={'h3'} field={fields.tagLine} />
            </div>
            <div className="mb-s text-body max-ml:order-2">
              <Text field={{ value: textWithReplacedYear }} />
            </div>
            <div className="flex flex-wrap max-ml:order-1 max-ml:mb-s">
              {socialMenuArray && <SocialLinks items={socialMenuArray} isEE={isEE} />}
            </div>
          </div>

          {/* Right column: nav groups */}
          <div className="flex flex-col max-ml:order-1 ml:w-[83.4%] ml:basis-[83.4%] ml:pl-xxs">
            <div className="mb-l font-sans text-sm-s font-heavy uppercase ml:hidden">
              <Text tag={'h3'} field={fields.tagLine} />
            </div>
            <div className={footerMenuContainerClass}>
              {footerMenuArray?.map((menu: AWFooterProps, i: number) => {
                const key = (menu.fields?.navGroupTitle?.value as string) || `nav-${i}`;
                return (
                  <div key={key} className={footerMenuItemClass}>
                    {isDesktop ? <NavGroupDesktop menu={menu} /> : <NavGroupMobile menu={menu} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom row: logo */}
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

          {/* Bottom row: privacy caption + legal links */}
          <div className="mt-l flex flex-col max-ml:order-3 ml:w-[83.4%] ml:basis-[83.4%] ml:pl-xxs">
            <div className="mb-s flex w-full text-body ml:mb-xxs">
              <Text tag={'h3'} field={fields.privacyCaption} />
            </div>
            <div className="w-full flex-wrap max-ml:text-body md:flex">
              {privacyMenuArray && <PrivacyLinks items={privacyMenuArray} />}
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

// --- Server props ----------------------------------------------------------

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
