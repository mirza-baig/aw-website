import { Text } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import Card from 'helpers/Card/Card';
import { StandaloneSearchBox } from 'helpers/Coveo/StandaloneSearchBox/StandaloneSearchBox';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import { RichTextWrapper } from 'helpers/RichTextWrapper';
import SingleButton from 'helpers/SingleButton/SingleButton';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { getEnum } from 'lib/utils/get-enum';
import { getMediaUrl, MediaUrlType } from 'lib/utils/url-utils/get-media-url';
import { isSvgUrl } from 'lib/utils/url-utils/is-svg-url';
import { useWebsiteContext } from 'lib/website/WebsiteContext';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { JSX, useEffect, useRef, useState } from 'react';
import { environment } from 'startup/environment';

import RaqMobileBanner from '../../RaqMobileBanner/RaqMobileBanner';
import GenericCardNav from '../GenericCardNav';
import { Sitecore } from '.sitecore/AndersenWindows.model';
export type AWHeaderProps = Sitecore.Components.Navigation.Header.Header & {
  filterExpression: string;
  boostingExpression: string;
};

// ─── Shared nav-item derivation helpers ──────────────────────────────────────

/** Checks if a nav item is visible on mobile (not desktop-only). */
function isMobileVisible(nav: AWHeaderProps): boolean {
  return (
    !!getEnum(nav?.fields?.displayType) &&
    nav?.fields?.displayType?.fields?.Value?.value !== 'desktop'
  );
}

/**
 * Flattens nav items: any item whose direct children contain AW_GenericCard
 * is treated as a container and its children are spread into the flat list.
 */
function flattenNavItems(items: AWHeaderProps[]): AWHeaderProps[] {
  return items.reduce((acc: AWHeaderProps[], nav: AWHeaderProps) => {
    const isCardContainer = nav?.fields?.children?.some(
      (c: AWHeaderProps) => c.templateName === 'AW_GenericCard'
    );
    if (isCardContainer && nav.fields?.children) {
      return [...acc, ...nav.fields.children];
    }
    return [...acc, nav];
  }, []);
}

/** Splits a flat list into links (non-cards) and cards. */
function splitLinksAndCards(flatItems: AWHeaderProps[]) {
  const links = flatItems.filter((nav) => nav?.templateName !== 'AW_GenericCard');
  const cards = flatItems.filter((nav) => nav?.templateName === 'AW_GenericCard');
  return { links, cards };
}

/** Resolves the li class for a mobile nav item based on image/bold state. */
function getMobileNavLiClass(hasImage: boolean, isBold: boolean): string {
  if (hasImage) {
    return 'w-full mt-m mb-xs';
  }
  if (isBold) {
    return 'mt-m mb-xs';
  }
  return 'my-xs';
}

// ─── Shared sub-components ───────────────────────────────────────────────────

type NavLinkItemsProps = { navItem: AWHeaderProps; additionalMobileClasses?: string };

const NavLinkItems = ({
  navItem,
  additionalMobileClasses,
}: NavLinkItemsProps): JSX.Element | null => {
  const hasNavImage = !!navItem.fields?.navItemImage?.value?.src;
  const hasNavIcon = !hasNavImage && !!getEnum(navItem.fields?.navItemIcon);
  if (!hasNavImage && !hasNavIcon) {
    return null;
  }
  return (
    <div
      className={classNames(
        'flex items-center justify-center shrink-0 overflow-hidden',
        additionalMobileClasses
      )}
    >
      {hasNavImage && (
        <ImageWrapper
          image={navItem.fields?.navItemImage}
          additionalMobileClasses="w-full h-full object-contain !m-0"
          additionalDesktopClasses="w-full h-full object-contain !m-0"
        />
      )}
      {hasNavIcon && (
        <SvgIcon
          icon={getEnum(navItem.fields?.navItemIcon)}
          className="w-full h-full object-contain !m-0"
        />
      )}
    </div>
  );
};

/** Image-style card rendered inline within a nav link slot. */
const NavItemImageCard = ({ nav }: { nav: AWHeaderProps }): JSX.Element => (
  <Card dataComponent="card/generic">
    <div className="cta-box group flex flex-col w-full max-w-[80%] h-auto text-left">
      <div className="relative w-full overflow-hidden shrink-0 aspect-[5/2]">
        <ImageWrapper
          image={nav.fields?.navItemImage}
          additionalDesktopClasses="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          additionalMobileClasses="absolute inset-0 w-full h-full object-contain"
          imageLayout="fill"
        />
        <div className="absolute bottom-[12px] left-0.75 inline-flex items-center justify-center rounded-full  border-4 font-sans text-button font-heavy border-[#f26924] bg-white  tracking-widest text-black whitespace-nowrap px-[14px] py-[7px] transition-all duration-200 group-hover:bg-[#f26924] group-hover:text-white group-hover:shadow-[0_4px_12px_rgba(242,105,36,0.35)] w-fit">
          {nav.fields?.navItemLink?.value?.text}
          <SvgIcon icon="chevron-right-sm" className="ml-xxs" />
        </div>
      </div>
    </div>
  </Card>
);

/** Text-style content row for a nav link (icon/image + label + chevron/external). */
const NavItemTextContent = ({
  nav,
  hasChildren,
  isBold,
  linkTarget,
}: {
  nav: AWHeaderProps;
  hasChildren: boolean;
  isBold: boolean;
  linkTarget?: string;
}): JSX.Element => (
  <div className="inline-flex w-full items-center flex-row justify-start">
    <NavLinkItems
      navItem={nav}
      additionalMobileClasses={isBold ? 'w-[60px] h-[60px] mr-xxs' : 'w-[32px] h-[32px] mr-xxs'}
    />
    {isBold ? (
      <RichTextWrapper
        field={{ value: nav.fields?.navItemLink?.value?.text }}
        classes="text-sm-s font-heavy"
      />
    ) : (
      <Text field={{ value: nav.fields?.navItemLink?.value?.text }} />
    )}
    {hasChildren && <SvgIcon icon="chevron-right-sm" className="ml-s" />}
    {!hasChildren && linkTarget === '_blank' && (
      <SvgIcon icon="new-tab-black" className="ml-xxxs inline-flex" />
    )}
  </div>
);

/** Renders a list of generic nav cards. */
const NavCardList = ({
  cards,
  mobileCtaVariant = false,
}: {
  cards: AWHeaderProps[];
  mobileCtaVariant?: boolean;
}): JSX.Element | null => {
  if (!cards.length) {
    return null;
  }
  const isGrid = cards.length >= 3;
  return (
    <div
      className={classNames(
        'mt-m mb-l pr-s p mr-s',
        isGrid ? 'flex flex-wrap gap-[10px]' : 'flex flex-col gap-[20px]'
      )}
    >
      {cards.map((nav, i) => (
        <div
          key={`card-${nav.id ?? nav.fields?.cta1Link?.value?.href ?? i}`}
          className={isGrid ? 'w-[calc(47%-5px)]' : 'w-full max-w-[260px]'}
        >
          <Card dataComponent="card/generic" classes="w-full">
            <GenericCardNav
              menu={nav}
              fullHeight={isGrid}
              imageRatio="landscape"
              mobileCtaVariant={mobileCtaVariant}
            />
          </Card>
        </div>
      ))}
    </div>
  );
};

// ─── MobileSubMenu ────────────────────────────────────────────────────────────

type MobileSubMenuProps = {
  childrenItems: AWHeaderProps[];
};

const MobileSubMenu = ({ childrenItems }: MobileSubMenuProps): JSX.Element => {
  const rawItems = Array.isArray(childrenItems) ? childrenItems : [];
  const flattenedItems = flattenNavItems(rawItems);
  const { links, cards } = splitLinksAndCards(flattenedItems);

  return (
    <ul className="visible right-0 top-0 ml-s w-full translate-x-0 bg-white opacity-100 transition-all duration-[0.35s] ease-[ease-in-out] max-w-fit">
      {links.map((nav, i) => {
        if (!isMobileVisible(nav)) {
          return null;
        }

        if (nav.templateName === 'AW_Separator') {
          return <hr className="max-w-15.5 border-t border-gray" key={nav.id ?? `sub-sep-${i}`} />;
        }

        const styleValue = nav.fields?.navItemStyle?.fields?.Value?.value;
        const hasImage = !!nav.fields?.cardStyleMobile?.value;
        const isBold = styleValue === 'bold-with-colored-text';
        const linkTarget = nav.fields?.navItemLink?.value?.target;
        const liClass = getMobileNavLiClass(hasImage, isBold);
        const linkClass = classNames(
          'w-full hover:underline',
          hasImage ? 'block text-left' : 'inline-flex items-center',
          !hasImage &&
            !isBold &&
            (styleValue === 'grey'
              ? 'text-sm-s font-medium text-dark-gray'
              : 'text-sm-s font-heavy text-black')
        );

        if (!nav.fields?.navItemLink) {
          return null;
        }

        return (
          <li key={nav.id ?? `sub-link-${i}`} className={liClass}>
            <LinkWrapper
              ctaSection="mobile"
              field={nav.fields.navItemLink}
              suppressLinkText
              className={linkClass}
            >
              {hasImage ? (
                <NavItemImageCard nav={nav} />
              ) : (
                <NavItemTextContent
                  nav={nav}
                  hasChildren={false}
                  isBold={isBold}
                  linkTarget={linkTarget}
                />
              )}
            </LinkWrapper>
          </li>
        );
      })}

      <NavCardList cards={cards} />
    </ul>
  );
};

// ─── MobileMenuNavItem helpers ───────────────────────────────────────────────

/** Resolves the style class for a mobile nav link based on its style and image values. */
function getMobileNavStyleClass(hasImage: boolean): string {
  if (hasImage) {
    return 'block';
  }
  return 'inline-flex items-center';
}

/** Resolves the text style class for a mobile nav item (grey vs bold). */
function getMobileNavTextClass(
  styleValue: string | undefined,
  hasImage: boolean,
  isBold: boolean
): string | false {
  if (hasImage) {
    return false;
  }
  if (isBold) {
    return false;
  }
  return styleValue === 'grey'
    ? 'text-sm-s font-medium text-dark-gray'
    : 'text-sm-s font-heavy text-black';
}

/** Renders a nav item that has children (drills down into a submenu). */
const ParentNavItem = ({
  nav,
  liClass,
  content,
  hasImage,
  isBold,
  styleValue,
  isActiveMob,
  activeSubMenuIdMob,
  onMenuClick,
}: {
  nav: AWHeaderProps;
  liClass: string;
  content: JSX.Element;
  hasImage: boolean;
  isBold: boolean;
  styleValue: string | undefined;
  isActiveMob: boolean;
  activeSubMenuIdMob: string;
  onMenuClick: (children: AWHeaderProps, id: string) => void;
}): JSX.Element => {
  if (isBold && !hasImage) {
    return (
      <li className={liClass}>
        <div className="inline-flex w-full flex-row items-center">{content}</div>
      </li>
    );
  }

  const isActive = isActiveMob && activeSubMenuIdMob === nav.id;
  return (
    <li className={liClass}>
      <button
        type="button"
        className={classNames(
          'w-full text-left hover:underline',
          getMobileNavStyleClass(hasImage),
          !hasImage &&
            (styleValue === 'grey'
              ? 'text-sm-s font-medium text-dark-gray'
              : 'text-sm-s font-heavy text-black'),
          isActive ? 'active-menu' : ''
        )}
        onClick={() => onMenuClick(nav.fields?.children, nav.id)}
      >
        {content}
      </button>
    </li>
  );
};

/** Renders a nav item that is a leaf link (no children). */
const LeafNavItem = ({
  nav,
  liClass,
  content,
  hasImage,
  isBold,
  styleValue,
}: {
  nav: AWHeaderProps;
  liClass: string;
  content: JSX.Element;
  hasImage: boolean;
  isBold: boolean;
  styleValue: string | undefined;
}): JSX.Element | null => {
  if (!nav.fields?.navItemLink) {
    return null;
  }

  return (
    <li className={liClass}>
      <LinkWrapper
        ctaSection="mobile"
        field={nav.fields.navItemLink}
        suppressLinkText
        className={classNames(
          'w-full hover:underline',
          getMobileNavStyleClass(hasImage),
          getMobileNavTextClass(styleValue, hasImage, isBold)
        )}
      >
        {content}
      </LinkWrapper>
    </li>
  );
};

// ─── MobileMenuNavItem ──────────────────────────────────────────────────────

type MobileMenuNavItemProps = {
  nav: AWHeaderProps;
  isActiveMob: boolean;
  activeSubMenuIdMob: string;
  onMenuClick: (children: AWHeaderProps, id: string) => void;
};

const MobileMenuNavItem = ({
  nav,
  isActiveMob,
  activeSubMenuIdMob,
  onMenuClick,
}: MobileMenuNavItemProps): JSX.Element | null => {
  if (nav.templateName === 'AW_Separator') {
    return <hr className="max-w-[62px] border-t border-gray" />;
  }

  const hasChildren = (nav.fields?.children?.length ?? 0) > 0;
  const styleValue = nav.fields?.navItemStyle?.fields?.Value?.value;
  const hasImage = !!nav.fields?.cardStyleMobile?.value;
  const isBold = styleValue === 'bold-with-colored-text';
  const linkTarget = nav.fields?.navItemLink?.value?.target;
  const liClass = getMobileNavLiClass(hasImage, isBold);

  const content = hasImage ? (
    <NavItemImageCard nav={nav} />
  ) : (
    <NavItemTextContent
      nav={nav}
      hasChildren={hasChildren}
      isBold={isBold}
      linkTarget={linkTarget}
    />
  );

  if (hasChildren) {
    return (
      <ParentNavItem
        nav={nav}
        liClass={liClass}
        content={content}
        hasImage={hasImage}
        isBold={isBold}
        styleValue={styleValue}
        isActiveMob={isActiveMob}
        activeSubMenuIdMob={activeSubMenuIdMob}
        onMenuClick={onMenuClick}
      />
    );
  }

  return (
    <LeafNavItem
      nav={nav}
      liClass={liClass}
      content={content}
      hasImage={hasImage}
      isBold={isBold}
      styleValue={styleValue}
    />
  );
};

// ─── MobileMenu ───────────────────────────────────────────────────────────────

type MobileMenuProps = {
  menuItems: AWHeaderProps[];
  isActiveMob: boolean;
  showModalMob: boolean;
  activeSubMenuIdMob: string;
  currentSubMenuMob: AWHeaderProps[];
  onMenuClick: (children: AWHeaderProps, id: string) => void;
};

const MobileMenu = ({
  menuItems,
  isActiveMob,
  showModalMob,
  activeSubMenuIdMob,
  currentSubMenuMob,
  onMenuClick,
}: MobileMenuProps): JSX.Element => {
  const rawItems = Array.isArray(menuItems) ? menuItems : [];
  const flattenedItems = flattenNavItems(rawItems);
  const { links, cards } = splitLinksAndCards(flattenedItems);
  const mobileLinks = links.filter(isMobileVisible);

  return (
    <div className={showModalMob ? 'block' : 'sr-only'}>
      {/* Active submenu — rendered dynamically from the clicked item's children */}
      {isActiveMob && currentSubMenuMob?.length > 0 && (
        <MobileSubMenu childrenItems={currentSubMenuMob} />
      )}

      <ul
        className={classNames(
          'right-0 top-0 ml-s w-full translate-x-0 bg-white opacity-100 transition-all duration-[0.35s] ease-[ease-in-out]',
          isActiveMob ? 'sr-only' : 'block'
        )}
      >
        {mobileLinks.map((nav, i) => (
          <MobileMenuNavItem
            key={
              nav?.id ??
              nav?.fields?.navItemLink?.value?.href ??
              nav?.fields?.cta1Link?.value?.href ??
              `mob-link-${i}`
            }
            nav={nav}
            isActiveMob={isActiveMob}
            activeSubMenuIdMob={activeSubMenuIdMob}
            onMenuClick={onMenuClick}
          />
        ))}

        <NavCardList cards={cards} mobileCtaVariant />
      </ul>
    </div>
  );
};

// ─── AWMobileHeader ───────────────────────────────────────────────────────────

const AWMobileHeader = (props: AWHeaderProps) => {
  const fields = props.fields;
  const coveoAccessToken = props.coveoAccessToken;
  const favoriteProductsCount = props.favoriteProductsCount;
  const favoriteProductsCountText = `(${favoriteProductsCount})`;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showModalMob, setShowModalMob] = useState(false);
  const [currentMenuMob, setCurrentMenuMob] = useState([]);
  const [isActiveMob, setIsActiveMob] = useState(false);
  const [currentSubMenuMob, setCurrentSubMenuMob] = useState([]);
  const [activeSubMenuIdMob, setActiveSubMenuIdMob] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const wrapperMHRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // (Optional) If your flow changes only the hash, track it too:
  const [hash, setHash] = useState('');
  useEffect(() => {
    const update = () => setHash(window.location.hash ?? '');
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const { siteInfo } = useWebsiteContext();

  useEffect(() => {
    document.body.style.overflow = showMobileMenu ? 'hidden' : '';
  }, [showMobileMenu]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node | null;
      if (wrapperMHRef.current && !wrapperMHRef.current.contains(target)) {
        setShowModalMob(false);
        setShowSearchBox(false);
        setIsActiveMob(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperMHRef]);

  useEffect(() => {
    // This runs whenever pathname or query string changes (and hash if you include it)
    setShowModalMob(false);
    setShowSearchBox(false);
    setIsActiveMob(false);
    setShowMobileMenu(false);
  }, [pathname, searchParams, hash]);

  if (!fields) {
    return null;
  }

  const navGroup = fields.children;

  const utilityMenuArray =
    navGroup.find((nav: AWHeaderProps) => nav?.fields?.menuTitle?.value === 'utilityMenu')?.fields
      ?.children ?? [];

  const mainMenuArray =
    navGroup.find((nav: AWHeaderProps) => nav?.fields?.menuTitle?.value === 'mainMenu')?.fields
      ?.children ?? [];

  const otherMenuArray =
    navGroup.find(
      (nav: AWHeaderProps) =>
        nav?.fields?.menuTitle?.value !== 'utilityMenu' &&
        nav?.fields?.menuTitle?.value !== 'mainMenu'
    )?.fields?.children ?? [];

  const raqItem = mainMenuArray.find(
    (item: AWHeaderProps) => item.templateId === '153EC69EDE9346489E011C654B32593C'
  );

  const handleShowSearchBox = () => {
    setShowSearchBox(showModalMob || !showSearchBox);
    setShowModalMob(false);
    setIsActiveMob(false);
  };

  const handleMobileMegaMenu = (childrenNavMob: AWHeaderProps) => {
    setShowSearchBox(false);
    setIsActiveMob(false);
    setActiveSubMenuIdMob('');
    setCurrentMenuMob(childrenNavMob);
    setShowModalMob(true);
  };

  const handleMenuClick = (children: AWHeaderProps, menuId: string) => {
    setShowSearchBox(false);
    if (activeSubMenuIdMob === menuId && isActiveMob) {
      setIsActiveMob(false);
      setActiveSubMenuIdMob('');
    } else {
      setIsActiveMob(true);
      setActiveSubMenuIdMob(menuId);
      setCurrentSubMenuMob(children);
    }
  };

  const handleMenuDisplay = () => {
    setShowMobileMenu(!showMobileMenu);
    setShowSearchBox(false);
  };

  const mobileHeaderClass = classNames(
    'mobile-header headerBottomPosElement fixed right-0 top-0 z-10000 block w-full bg-black font-sans ml:hidden',
    showMobileMenu && 'overflow-auto w-full h-full'
  );

  return (
    <>
      {showSearchBox && (
        <div className="fixed left-0 top-0 z-40 h-full w-full bg-black opacity-60" />
      )}

      <div ref={wrapperMHRef} className={mobileHeaderClass} id="awHeaderMobile">
        {raqItem && <RaqMobileBanner props={raqItem} />}

        <div className="h-[55px]">
          {/* ── Top bar ── */}
          <div
            className={classNames(
              'nav-bar relative flex h-[55px] items-center justify-between border-b border-solid bg-white px-5 py-0',
              showMobileMenu ? 'border-black' : 'border-b-gray'
            )}
          >
            {/* Hamburger */}
            <button
              type="button"
              className={classNames(
                'cursor-pointer z-10 order-1 mr-s ml-0',
                showMobileMenu ? 'hidden' : 'block'
              )}
              onClick={handleMenuDisplay}
            >
              <div className="relative h-[15px] w-[15px] cursor-pointer transition-[0.2s] duration-[cubic-bezier(0.42,0,0.58,1)]">
                <span
                  className={classNames(
                    'absolute top-0 left-0 h-[2px] rotate-0 bg-black opacity-100 transition-[0.2s] duration-[cubic-bezier(0.42,0,0.58,1)]',
                    showMobileMenu ? 'w-0' : 'w-full'
                  )}
                />
                <span
                  className={classNames(
                    'absolute top-[6px] left-0 h-[2px] w-full bg-black opacity-100 transition-[0.2s] duration-[cubic-bezier(0.42,0,0.58,1)]',
                    showMobileMenu ? 'rotate-45' : 'rotate-0'
                  )}
                />
                <span
                  className={classNames(
                    'absolute top-[6px] left-0 h-[2px] w-full bg-black opacity-100 transition-[0.2s] duration-[cubic-bezier(0.42,0,0.58,1)]',
                    showMobileMenu ? '-rotate-45' : 'rotate-0'
                  )}
                />
                <span
                  className={classNames(
                    'absolute bottom-0 left-0 h-[2px] rotate-0 bg-black opacity-100 transition-[0.2s] duration-[cubic-bezier(0.42,0,0.58,1)]',
                    showMobileMenu ? 'w-0' : 'w-full'
                  )}
                />
              </div>
            </button>

            {/* Logo */}
            <div className="rbaConsultRequest_headerLogo_container order-2 mr-auto max-w-[144px]">
              <LinkWrapper
                ctaSection="mobile"
                className="flex"
                field={fields.logoCTA}
                suppressLinkText
              >
                <Image
                  src={getMediaUrl(
                    fields.logo?.value.src,
                    MediaUrlType.Cdn,
                    siteInfo!,
                    environment
                  )}
                  alt={(fields.logo?.value?.alt as string) ?? ''}
                  height={fields.logo?.value?.height ? Number(fields.logo.value.height) : undefined}
                  width={fields.logo?.value?.width ? Number(fields.logo.value.width) : undefined}
                  unoptimized={isSvgUrl(fields.logo?.value?.src)}
                />
              </LinkWrapper>
            </div>

            {/* Other menu (icon links) */}
            {otherMenuArray.length > 0 && (
              <ul className="order-3 flex flex-row">
                {otherMenuArray.map((item: AWHeaderProps, i: number) => {
                  const showMobile =
                    getEnum(item.fields.displayType) &&
                    item.fields.displayType.fields.Value.value !== 'desktop';
                  if (!showMobile || !item.fields?.navItemLink) {
                    return null;
                  }
                  return (
                    <li key={item.id ?? `other-mob-${i}`} className="inline-flex py-xxs pr-xxs">
                      <LinkWrapper
                        ctaSection="mobile"
                        field={item.fields.navItemLink}
                        className={classNames(
                          'flex',
                          item.fields.navItemLink.value.target === '_blank'
                            ? 'flex-row items-start'
                            : 'flex-row-reverse items-center'
                        )}
                      >
                        <NavLinkItems
                          navItem={item}
                          additionalMobileClasses="w-[20px] h-[20px] mr-xxs"
                        />
                        {item.fields.navItemLink.value.target === '_blank' && (
                          <SvgIcon icon="new-tab-black" className="ml-xxxs inline-flex" />
                        )}
                      </LinkWrapper>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Utility logo */}
            {fields.utilityLogo?.value?.src && (
              <div className="order-5 ml-s mr-8 min-w-[35px]">
                <LinkWrapper ctaSection="utility" field={fields.utilityLogoCTA} suppressLinkText>
                  <ImageWrapper
                    image={fields.utilityLogo}
                    additionalMobileClasses="max-w-[35px]"
                    ratio="auto"
                  />
                </LinkWrapper>
              </div>
            )}

            {/* Search */}
            {props.fields.globalSearchBox && (
              <button
                type="button"
                className="order-6 cursor-pointer items-center transition-[fill] duration-200 ease-[cubic-bezier(0,0,0.58,1)]"
                onClick={handleShowSearchBox}
              >
                <SvgIcon icon="search" size="xl" />
              </button>
            )}
          </div>

          {/* ── Slide-out nav drawer ── */}
          <nav
            className={classNames(
              showMobileMenu ? '' : 'sr-only',
              'absolute top-0 left-[5vw] w-screen bg-white shadow-[-180px_0_50px_10px_rgba(0,0,0,0.75)] z-50'
            )}
          >
            {/* Drawer header: Back + Close */}
            <div className="flex w-[95vw] justify-between items-center pr-[20px] pl-[20px] pt-[15px] pb-[10px]">
              <div>
                {showModalMob && (
                  <button
                    type="button"
                    className="flex cursor-pointer items-center text-sm-xs font-heavy hover:underline"
                    onClick={() => {
                      if (isActiveMob) {
                        setIsActiveMob(false);
                        setActiveSubMenuIdMob('');
                      } else {
                        setShowModalMob(false);
                      }
                    }}
                  >
                    <SvgIcon icon="chevron-left-sm" className="mr-xxs" /> Back
                  </button>
                )}
              </div>
              <button
                type="button"
                className="flex cursor-pointer items-center p-s mr-[-10px]"
                onClick={handleMenuDisplay}
              >
                <div className="relative h-[15px] w-[15px] cursor-pointer">
                  <span className="absolute top-[6px] left-0 h-[2px] w-full bg-black rotate-45" />
                  <span className="absolute top-[6px] left-0 h-[2px] w-full bg-black -rotate-45" />
                </div>
              </button>
            </div>

            <hr className="w-[95vw] border-t border-black opacity-20 mb-s" />

            <div>
              {/* Per-group MobileMenu panels */}
              {mainMenuArray.map((menuGroup: AWHeaderProps, i: number) => {
                const showGroup = showModalMob && menuGroup.fields?.children === currentMenuMob;
                return (
                  <div
                    key={`mobgroup-${menuGroup.id ?? menuGroup.fields?.navGroupTitle?.value ?? i}`}
                    className={showGroup ? 'block' : 'sr-only'}
                  >
                    <MobileMenu
                      menuItems={menuGroup.fields?.children ?? []}
                      isActiveMob={isActiveMob}
                      showModalMob={showModalMob}
                      activeSubMenuIdMob={activeSubMenuIdMob}
                      currentSubMenuMob={currentSubMenuMob}
                      onMenuClick={handleMenuClick}
                    />
                  </div>
                );
              })}

              {/* Top-level main-menu list */}
              <ul className={classNames('ml-s py-5', showModalMob ? 'sr-only' : 'block')}>
                {mainMenuArray.map((menu: AWHeaderProps, i: number) => {
                  const showMobile =
                    getEnum(menu.fields.displayType) &&
                    menu.fields.displayType.fields.Value.value !== 'desktop';
                  if (!showMobile) {
                    return null;
                  }

                  const showNavGroupTitle = !!menu.fields?.navGroupTitle;
                  const showCta1Link =
                    menu.fields?.cta1Link &&
                    menu.fields?.cta1Style?.fields?.Value?.value !== 'link';
                  const showNavLink =
                    menu.fields?.cta1Link &&
                    menu.fields?.cta1Style?.fields?.Value?.value === 'link';

                  return (
                    <li key={menu.id ?? `mob-main-${i}`} className="my-xs">
                      <button
                        type="button"
                        className="inline-flex cursor-pointer items-center"
                        onClick={() => handleMobileMegaMenu(menu.fields?.children)}
                      >
                        {showNavGroupTitle && (
                          <Text
                            tag="span"
                            field={menu.fields.navGroupTitle}
                            className="cursor-pointer text-sm-s font-heavy"
                          />
                        )}
                        {showCta1Link && (
                          <SingleButton classes={{ wrapper: 'mb-0' }} fields={menu.fields} />
                        )}
                        {showNavLink && (
                          <span className="cursor-pointer text-xxs font-heavy hover:shadow-[0_3px_0_0_#f26924]">
                            <LinkWrapper
                              className="text-sm-s font-heavy hover:no-underline focus:no-underline active:focus:no-underline ml:text-xxs"
                              field={menu.fields.cta1Link}
                            />
                          </span>
                        )}
                        {menu.fields?.children?.length > 0 && (
                          <SvgIcon icon="chevron-right-sm" className="ml-xxs" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Utility menu */}
              <div className="h-screen bg-black p-5 text-white">
                <ul className="flex flex-col">
                  {utilityMenuArray.map((menu: AWHeaderProps, i: number) => {
                    if (menu.templateName === 'AW_Separator') {
                      return null;
                    }

                    const showMobile =
                      getEnum(menu.fields.displayType) &&
                      menu.fields.displayType.fields.Value.value !== 'desktop';
                    if (!showMobile) {
                      return null;
                    }

                    const isMyFavoritesLink =
                      menu.fields?.navItemLink?.value?.class === 'MyFavorites';
                    const liClass = menu.fields.mobileSortOrder?.value
                      ? `order-${menu.fields.mobileSortOrder.value} py-xxs`
                      : 'order-0 py-xxs';

                    return (
                      <li key={menu.id ?? `util-mob-${i}`} className={liClass}>
                        {menu.fields.cta1Link?.value?.text && menu.fields.cta1Link?.value?.href ? (
                          <LinkWrapper
                            ctaSection="utility"
                            className="text-sm-xxs capitalize"
                            field={menu.fields.cta1Link}
                          />
                        ) : (
                          menu.fields?.navItemLink && (
                            <LinkWrapper
                              ctaSection="utility"
                              className={classNames(
                                'inline-flex text-sm-xxs capitalize',
                                menu.fields.navItemLink.value.target === '_blank'
                                  ? 'flex-row items-start'
                                  : 'flex-row-reverse items-center',
                                menu.fields.navItemLink.value.class
                              )}
                              field={{
                                href: menu.fields.navItemLink.value.href,
                                text:
                                  isMyFavoritesLink && favoriteProductsCountText
                                    ? `${menu.fields.navItemLink.value.text} ${favoriteProductsCountText}`
                                    : menu.fields.navItemLink.value.text,
                              }}
                            >
                              <NavLinkItems
                                navItem={menu}
                                additionalMobileClasses="w-[20px] h-[20px] mr-xxs"
                              />
                              {menu.fields.navItemLink.value.target === '_blank' && (
                                <SvgIcon icon="new-tab" className="ml-xxxs inline-flex" />
                              )}
                            </LinkWrapper>
                          )
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </nav>
        </div>

        {/* Search box overlay */}
        {showSearchBox && coveoAccessToken && (
          <div className="absolute h-[70px] w-screen bg-white px-m ml:px-0">
            <StandaloneSearchBox
              coveoAccessToken={coveoAccessToken}
              redirectionUrl={props.fields?.globalSearchBox?.fields.redirectionUrl}
              showSuggestions={props.fields?.globalSearchBox?.fields.showSuggestions}
              numberOfSuggestions={props.fields?.globalSearchBox?.fields.numberOfSuggestions}
              queryPipeline={props.fields?.globalSearchBox?.fields.queryPipeline}
              searchHub={props.fields?.globalSearchBox?.fields.searchHub}
              filterExpression={props.filterExpression}
              boostingExpression={props.boostingExpression}
              suggestedResultsLabel={props.fields?.globalSearchBox?.fields.suggestedResultsLabel}
              placeholderText={props.fields?.globalSearchBox?.fields.placeholderText}
              toggleSearchBoxVisibility={setShowSearchBox}
              minQueryLength={props.fields?.globalSearchBox?.fields.minQueryLength}
              minQuerySuggestionsLength={
                props.fields?.globalSearchBox?.fields.minQuerySuggestionsLength
              }
            />
          </div>
        )}
      </div>
    </>
  );
};

export default AWMobileHeader;
