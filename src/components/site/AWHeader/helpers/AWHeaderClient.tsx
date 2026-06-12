'use client';

import { Text } from '@sitecore-content-sdk/nextjs';
import config from 'aw.config.client';
import classNames from 'classnames';
import Card from 'helpers/Card/Card';
import { StandaloneSearchBox } from 'helpers/Coveo/StandaloneSearchBox/StandaloneSearchBox';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import ImageWrapper from 'helpers/Media/ImageWrapper';
import RichTextWrapper from 'helpers/RichTextWrapper/RichTextWrapper';
import SingleButton from 'helpers/SingleButton/SingleButton';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { currentAccessToken } from 'lib/coveo/access-token';
import { getEnum } from 'lib/utils/get-enum';
import { useCurrentScreenType } from 'lib/utils/get-screen-type';
import { useFavoriteProducts } from 'lib/website/favorite-products/use-favorite-products';
import { useRouter } from 'next/compat/router';
import { JSX, Suspense, useEffect, useRef, useState } from 'react';

import GenericCardNav, { ImageRatio } from '../GenericCardNav';
import AWMobileHeader from './AWMobileHeader.helper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

const organizationId = config.coveo.organizationId;

type AWHeaderProps = Sitecore.Components.Navigation.Header.Header & {
  filterExpression: string;
  boostingExpression: string;
};

/** Returns true when a column contains card-type items (directly or in children). */
function columnHasCards(col: AWHeaderProps[]): boolean {
  return col.some(
    (menu) =>
      menu.templateName === 'AW_GenericCard' ||
      menu.templateName === 'AWHeaderImageCTA' ||
      menu.fields?.children?.some(
        (child: AWHeaderProps) =>
          child.templateName === 'AW_GenericCard' || child.templateName === 'AWHeaderImageCTA'
      )
  );
}

/**
 * Splits a flat children array into columns.
 * AW_Column items act as column separators; all other items go into the current column.
 */
function buildColumns(children: AWHeaderProps[]): AWHeaderProps[][] {
  const columns: AWHeaderProps[][] = [[]];
  let idx = 0;
  children.forEach((child) => {
    if (child.templateName === 'AW_Column') {
      columns.push([]);
      idx++;
    } else {
      columns[idx].push(child);
    }
  });
  return columns;
}

// ─── Shared sub-components ────────────────────────────────────────────────────

/** Renders the icon/image portion of a nav link. */
const NavLinkIcon = ({
  navItem,
}: {
  navItem: AWHeaderProps;
  additionalDesktopClasses: string;
}): JSX.Element => (
  <>
    {navItem.fields?.navItemImage?.value?.src && (
      <div
        style={{
          width: '30px',
          height: '30px',
          maxWidth: '30px',
          maxHeight: '30px',
          flexShrink: 0,
          marginRight: '0.5rem',
          marginTop: '0.2rem',
          marginBottom: '0.2rem',
        }}
      >
        <ImageWrapper
          image={navItem.fields.navItemImage}
          additionalDesktopClasses="w-full h-full object-contain"
        />
      </div>
    )}
    {!navItem.fields?.navItemImage?.value?.src && getEnum(navItem.fields?.navItemIcon) && (
      <SvgIcon icon={getEnum(navItem.fields.navItemIcon)} className="mr-xxs" />
    )}
  </>
);

/** Renders a single desktop nav link (bold or normal style). */
const DesktopMenuLink = ({ menu }: { menu: AWHeaderProps }): JSX.Element | null => {
  if (menu.templateName === 'AW_Separator') {
    return <hr className="max-w-[62px] border-t border-gray my-[0.5rem]" />;
  }

  const isGenericCard = menu.templateName === 'AW_GenericCard';
  const style = menu.fields?.navItemStyle?.fields?.Value?.value;
  const navItemLink = menu.fields?.navItemLink;
  const genericLink = menu.fields?.cta1Link;
  const linkToUse = isGenericCard ? genericLink : navItemLink;

  if (!linkToUse) {
    return null;
  }

  const isBold = style === 'bold-with-colored-text' || style === 'bold-black';
  const isBlank = linkToUse.value.target === '_blank';
  const isSeeAll = linkToUse.value.class === 'see-all';

  const linkClass = classNames(
    'flex items-center text-[0.9rem] text-[#333] no-underline hover:underline',
    {
      'flex-row items-start': isBlank,
      'items-center': isSeeAll,
      'flex-row-reverse': !isBlank && !isSeeAll && !isBold,
      'see-all underline font-bold text-black': isSeeAll,
    }
  );

  return isBold ? (
    <LinkWrapper ctaSection="header" field={linkToUse} suppressLinkText className={`${linkClass}`}>
      <NavLinkIcon
        navItem={menu}
        additionalDesktopClasses="w-[25px] h-[25px] mr-[0.5rem] aspect-square"
      />
      <RichTextWrapper
        field={{ value: linkToUse.value.text }}
        classes="inline-flex hover:underline font-heavy text-black  items-center"
      />
      {isBlank && <SvgIcon icon="new-tab-black" className="ml-xxs mt-xxxs inline-flex" />}
    </LinkWrapper>
  ) : (
    <LinkWrapper ctaSection="header" field={linkToUse} className={`${linkClass}  items-center`}>
      <NavLinkIcon navItem={menu} additionalDesktopClasses="w-[25px] h-[25px] mr-[0.5rem]" />
      {isBlank && <SvgIcon icon="new-tab-black" className="ml-xxs mt-xxxs inline-flex" />}
    </LinkWrapper>
  );
};

/** Renders menu content — handles separators, generic cards, containers with children, and plain links. */
const MenuContent = ({
  menu,
  options,
}: {
  menu: AWHeaderProps;
  options?: { fullHeight?: boolean; imageRatio?: ImageRatio };
}): JSX.Element | null => {
  if (menu.templateName === 'AW_Separator') {
    return <hr className="max-w-[62px] border-t border-gray" />;
  }

  const isGenericCard = menu.templateName === 'AW_GenericCard';
  const style = menu.fields?.navItemStyle?.fields?.Value?.value;
  const hasChildren = (menu.fields?.children?.length ?? 0) > 0;
  const navItemLink = menu.fields?.navItemLink;
  const genericLink = menu.fields?.cta1Link;
  const linkToUse = isGenericCard ? genericLink : navItemLink;

  if (isGenericCard) {
    return (
      <Card dataComponent="card/generic" classes="w-full">
        <GenericCardNav
          menu={menu}
          fullHeight={options?.fullHeight}
          imageRatio={options?.imageRatio}
        />
      </Card>
    );
  }

  if (hasChildren) {
    const isCardContainer = menu.fields.children.some(
      (c: AWHeaderProps) =>
        c.templateName === 'AW_GenericCard' || c.templateName === 'AWHeaderImageCTA'
    );

    if (isCardContainer) {
      const cardCount = menu.fields.children.length;
      const isTwoCards = cardCount === 2;
      return (
        <div
          className={classNames(
            'flex flex-wrap gap-[20px] w-full max-w-[500px]',
            isTwoCards && 'items-stretch'
          )}
        >
          {menu.fields.children.map((childMenu: AWHeaderProps, i: number) => (
            <div
              key={
                childMenu.id ??
                childMenu.fields?.navItemLink?.value?.href ??
                childMenu.fields?.cta1Link?.value?.href ??
                i
              }
              className={classNames('flex flex-col', 'w-[calc(50%-15px)]', isTwoCards && 'h-full')}
            >
              <MenuContent
                menu={childMenu}
                options={{ fullHeight: isTwoCards, imageRatio: 'landscape' }}
              />
            </div>
          ))}
        </div>
      );
    }

    if (style === 'bold-with-colored-text') {
      return (
        <>
          <RichTextWrapper
            field={{ value: linkToUse?.value.text ?? '' }}
            classes="text-[1rem] font-bold mb-[0.5rem]"
          />
          <SvgIcon icon="chevron-right" className="ml-s" />
        </>
      );
    }

    const columns = buildColumns(menu.fields.children);
    const hasText = !!linkToUse?.value?.text;
    return (
      <>
        <Text
          tag="h3"
          field={hasText ? { value: linkToUse.value.text } : { value: '' }}
          className={`text-[1rem] font-bold mb-[0.5rem] flex items-center gap-2.5 ${
            !hasText ? 'opacity-0 pointer-events-none' : ''
          }`}
        />
        <div className="flex gap-5">
          {columns.map((col, i) =>
            col.length > 0 ? (
              <ul
                key={`col-${col[0]?.id ?? col[0]?.fields?.navItemLink?.value?.href ?? col[0]?.fields?.cta1Link?.value?.href ?? i}`}
                className="list-none p-0 m-0 min-w-max"
              >
                {col.map((childMenu: AWHeaderProps, j: number) => (
                  <li
                    key={
                      childMenu.id ??
                      childMenu.fields?.navItemLink?.value?.href ??
                      childMenu.fields?.cta1Link?.value?.href ??
                      j
                    }
                    className="mb-[0.3rem] w-max"
                  >
                    <DesktopMenuLink menu={childMenu} />
                  </li>
                ))}
              </ul>
            ) : null
          )}
        </div>
      </>
    );
  }

  if (linkToUse) {
    return (
      <ul>
        <li className="mb-[0.3rem] w-max">
          <DesktopMenuLink menu={menu} />
        </li>
      </ul>
    );
  }

  return null;
};

/** Checks whether a single menu item should be visible on desktop. */
function isDesktopVisible(menu: AWHeaderProps): boolean {
  return (
    menu.templateName === 'AW_GenericCard' ||
    menu.templateName === 'AWHeaderImageCTA' ||
    (!!getEnum(menu.fields?.displayType) && menu.fields.displayType.fields.Value.value !== 'mobile')
  );
}

/** A single column section rendered inside the megamenu. */
const MegaMenuColumn = ({ col }: { col: AWHeaderProps[] }): JSX.Element | null => {
  if (!col.length) {
    return null;
  }
  return (
    <div className="megamenu-section flex-1 flex flex-col">
      {col.map((menu, i) => {
        if (!isDesktopVisible(menu)) {
          return null;
        }

        const isLinks =
          menu.templateName !== 'AWHeaderImageCTA' && menu.templateName !== 'AW_GenericCard';
        const isCard = menu.templateName === 'AW_GenericCard';

        return (
          <div
            key={
              menu.id ??
              menu.fields?.navItemLink?.value?.href ??
              menu.fields?.cta1Link?.value?.href ??
              i
            }
            className={classNames('text-s break-inside-avoid w-full', isLinks ? 'links' : 'cta')}
          >
            <div
              className={classNames(
                isCard ? 'w-[500px]' : isLinks && 'category',
                !isLinks && 'cta-box'
              )}
            >
              <MenuContent menu={menu} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Renders the full megamenu panel for one nav group. */
const MegaMenuGroup = ({
  mainGroup,
  showModal,
  currentMenuTitle,
  wrapperRef,
}: {
  mainGroup: AWHeaderProps;
  showModal: boolean;
  currentMenuTitle: string;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
}): JSX.Element => {
  const children: AWHeaderProps[] = mainGroup.fields?.children ?? [];
  const isGroupActive = showModal && mainGroup.fields?.navGroupTitle?.value === currentMenuTitle;
  const columns = buildColumns(children);
  const linkCols = columns.filter((col) => !columnHasCards(col));
  const cardCols = columns.filter(columnHasCards);

  return (
    <div
      className={classNames('megamenu', isGroupActive ? 'flex' : 'sr-only')}
      aria-hidden={!isGroupActive}
    >
      <div ref={wrapperRef} className="megamenu-content flex w-full gap-[20px] px-l">
        {linkCols.length > 0 && (
          <div className="flex flex-1 gap-[20px]">
            {linkCols.map((col, i) => (
              <MegaMenuColumn
                key={`link-col-${col[0]?.id ?? col[0]?.fields?.navItemLink?.value?.href ?? col[0]?.fields?.cta1Link?.value?.href ?? i}`}
                col={col}
              />
            ))}
          </div>
        )}
        {cardCols.length > 0 && (
          <div className="flex gap-[20px] pl-[10px]">
            {cardCols.map((col, i) => (
              <MegaMenuColumn
                key={`card-col-${col[0]?.id ?? col[0]?.fields?.navItemLink?.value?.href ?? col[0]?.fields?.cta1Link?.value?.href ?? i}`}
                col={col}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── AWHeader_Default ─────────────────────────────────────────────────────────

export function AWHeaderClient(props: AWHeaderProps): JSX.Element {
  const { fields } = props;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentMenuTitle, setCurrentMenuTitle] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const listref = useRef<HTMLUListElement | null>(null);
  const [listWidth, setlistWidth] = useState('');
  const [listOverlayWidth, setlistOverlayWidth] = useState('');
  const { screenType } = useCurrentScreenType();
  const router = useRouter();

  const [totalFavoritesCount, setTotalFavoritesCount] = useState(0);
  const { favoriteProductsCount } = useFavoriteProducts();
  const [coveoAccessToken, setCoveoAccessToken] = useState<string>();
  useEffect(() => {
    (async () => {
      setCoveoAccessToken(await currentAccessToken(organizationId));
    })();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => {
      setShowModal(false);
      setCurrentMenuTitle('');
      setShowSearchBox(false);
    };
    const handleLocalStorageChange = () => {
      const favoriteDesigns = JSON.parse(localStorage.getItem('aw_favoritedesigns') ?? '[]');
      setTotalFavoritesCount(
        favoriteProductsCount === 0 && favoriteDesigns.length === 0
          ? 0
          : favoriteProductsCount + favoriteDesigns.length
      );
    };

    const favoriteDesignsCount = JSON.parse(
      localStorage.getItem('aw_favoritedesigns') ?? '[]'
    ).length;
    setTotalFavoritesCount(favoriteProductsCount + favoriteDesignsCount);

    globalThis.addEventListener('storage', handleLocalStorageChange);
    router?.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      globalThis.removeEventListener('storage', handleLocalStorageChange);
      router?.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [favoriteProductsCount, router]);

  const favoriteProductsCountText = `(${totalFavoritesCount})`;

  useEffect(() => {
    setlistWidth((listref.current && listref.current.clientWidth + 20) + 'px');
    setlistOverlayWidth(screenType === 'xl' ? '50%' : `calc(100% - ${listWidth})`);
  }, [listWidth, screenType]);

  // Sticky header
  useEffect(() => {
    const isSticky = () => {
      const utilityNav = document.querySelector('.utility-nav') as HTMLElement;
      const mainNav = document.querySelector('.main-nav') as HTMLElement;
      if (!utilityNav) {
        return;
      }
      if (!utilityNav.classList.contains('fixed')) {
        utilityNav.classList.add('fixed', 'top-0');
      }
      if (!mainNav.classList.contains('static')) {
        if (!mainNav.classList.contains('fixed')) {
          mainNav.classList.add('fixed');
        }
        if (!mainNav.classList.contains('top-14')) {
          mainNav.classList.add('top-14');
        }
      }
    };
    window.addEventListener('scroll', isSticky);
    return () => window.removeEventListener('scroll', isSticky);
  }, []);

  // Click-outside: close modal/search when clicking outside both the nav wrapper and search wrapper
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        wrapperRef.current?.contains(target) ||
        searchWrapperRef.current?.contains(target) ||
        listref.current?.contains(target)
      ) {
        return;
      }
      setShowModal(false);
      setCurrentMenuTitle('');
      setShowSearchBox(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef, searchWrapperRef]);

  if (!fields) {
    return <></>;
  }

  const navGroup = fields.children ?? [];

  const utilityMenuArray =
    navGroup.find((nav: AWHeaderProps) => nav?.fields?.menuTitle?.value === 'utilityMenu')?.fields
      ?.children ?? [];

  const mainMenuArray =
    navGroup.find((nav: AWHeaderProps) => nav?.fields?.menuTitle?.value === 'mainMenu')?.fields
      ?.children ?? [];

  const otherMenuArray =
    navGroup.find((nav: AWHeaderProps) => {
      const v = nav?.fields?.menuTitle?.value;
      return v && v !== 'utilityMenu' && v !== 'mainMenu' && v !== 'search-bar';
    })?.fields?.children ?? [];

  const handleShowSearchBox = () => {
    setShowSearchBox(showModal || !showSearchBox);
    setShowModal(false);
  };

  const handleMegaMenu = (title: string) => {
    if (title === currentMenuTitle && showModal) {
      setShowModal(false);
      setCurrentMenuTitle('');
      return;
    }
    setCurrentMenuTitle(title);
    setShowSearchBox(false);
    setShowModal(true);

    //--Force layout recalculation so megamenu opens fully without scroll
    setTimeout(() => {
      window.dispatchEvent(new Event('scroll'));
    }, 0);
  };
  return (
    <>
      {showSearchBox && (
        <div className="fixed left-0 top-0 z-20 block h-full w-full bg-black opacity-60" />
      )}
      {showModal && <div className="fixed inset-0 z-40 bg-black opacity-40" />}

      <div
        data-component="site/awheader"
        className="relative z-999 block font-sans max-ml:hidden ml:min-h-[122px]"
        id="awHeader"
      >
        {/* ── Utility Nav ── */}
        <div className="utility-nav h-14 w-full bg-secondary text-white">
          <div className="flex h-14 items-center justify-end max-[1480px]:px-s ml:max-w-screen-xl xl:mx-auto">
            <ul className="z-50 flex items-center">
              {utilityMenuArray.map((menu: AWHeaderProps, i: number) => {
                const showDesktop =
                  getEnum(menu.fields.displayType) &&
                  menu.fields.displayType.fields.Value.value !== 'mobile';
                if (!showDesktop) {
                  return null;
                }

                const isMyFavoritesLink = menu.fields?.navItemLink?.value?.class === 'MyFavorites';

                if (menu.templateName === 'AW_Separator') {
                  return <li key={menu.id ?? `util-sep-${i}`}>|</li>;
                }
                return (
                  <li
                    key={menu.id ?? `util-${i}`}
                    className="px-5 last-of-type:pr-0 hover:underline"
                  >
                    {menu.fields.cta1Link?.value?.text && menu.fields.cta1Link?.value?.href ? (
                      <LinkWrapper
                        ctaSection="utility"
                        className="text-xxs font-heavy capitalize"
                        field={menu.fields.cta1Link}
                      />
                    ) : (
                      menu.fields?.navItemLink && (
                        <LinkWrapper
                          ctaSection="utility"
                          field={{
                            href: menu.fields.navItemLink.value.href,
                            text: `${menu.fields.navItemLink.value.text} ${isMyFavoritesLink ? favoriteProductsCountText : ''}`,
                          }}
                          className={classNames(
                            'flex items-center text-xxs',
                            menu.fields.navItemLink.value.target === '_blank'
                              ? 'flex-row items-start'
                              : 'flex-row-reverse items-center'
                          )}
                        >
                          {menu.fields.navItemLink.value.target === '_blank' && (
                            <SvgIcon icon="new-tab" className="ml-xxxs inline-flex" />
                          )}
                          <NavLinkIcon
                            navItem={menu}
                            additionalDesktopClasses="max-w-[20px] max-h-[20px] mr-xxs"
                          />
                        </LinkWrapper>
                      )
                    )}
                  </li>
                );
              })}
            </ul>

            {fields.utilityLogo?.value?.src && (
              <div className="ml-s min-w-[35px]">
                <LinkWrapper ctaSection="utility" field={fields.utilityLogoCTA}>
                  <ImageWrapper
                    image={fields.utilityLogo}
                    additionalDesktopClasses="max-w-[35px]"
                  />
                </LinkWrapper>
                {totalFavoritesCount}
              </div>
            )}
          </div>
        </div>

        {/* ── Main Nav ── */}
        <nav
          ref={searchWrapperRef}
          className="main-nav mx-auto w-full border-b border-solid border-b-gray bg-white"
        >
          {showModal && (
            <div
              style={{ width: listOverlayWidth }}
              className="min-w-6/12 absolute left-0 top-0 z-40 h-full bg-black opacity-0"
            />
          )}

          <div
            className={classNames(
              'headerBottomPosElement main-nav relative flex w-full items-center justify-center border-t-0 bg-white max-[1480px]:pl-l ml:max-w-screen-xl xl:mx-auto',
              showModal ? 'z-50' : 'z-20'
            )}
          >
            {/* Logo */}
            <div className="rbaConsultRequest_headerLogo_container min-w-[197px]">
              <LinkWrapper ctaSection="header" field={fields.logoCTA} suppressLinkText>
                <ImageWrapper
                  image={fields.logo}
                  additionalDesktopClasses="max-w-[197px]"
                  additionalMobileClasses="max-w-[197px]"
                  priority
                  ratio="auto"
                />
              </LinkWrapper>
            </div>

            {/* Secondary logo */}
            {fields.secondaryLogo?.value?.src && (
              <div className="ml-s min-w-[197px] max-ml:hidden">
                <LinkWrapper ctaSection="header" field={fields.secondaryLogoCTA} suppressLinkText>
                  <ImageWrapper
                    image={fields.secondaryLogo}
                    additionalDesktopClasses="max-w-[197px]"
                    additionalMobileClasses="max-w-[197px]"
                    priority
                    ratio="auto"
                  />
                </LinkWrapper>
              </div>
            )}

            <div
              className={classNames(
                'relative flex w-full items-center justify-center',
                showModal && 'z-50 bg-white'
              )}
            >
              {/* Main menu list */}
              <ul
                ref={listref}
                className="z-20 flex h-[65px] max-w-[1239px] items-center bg-white pl-[3.5%]"
              >
                {mainMenuArray.map((menu: AWHeaderProps, i: number) => {
                  const showDesktop =
                    getEnum(menu.fields.displayType) &&
                    menu.fields.displayType.fields.Value.value !== 'mobile';
                  if (!showDesktop) {
                    return null;
                  }

                  const showNavGroupTitle = !!menu.fields?.navGroupTitle;
                  const showCta1Link =
                    menu.fields?.cta1Link &&
                    menu.fields?.cta1Style?.fields?.Value?.value !== 'link';
                  const showNavLink =
                    menu.fields?.cta1Link &&
                    menu.fields?.cta1Style?.fields?.Value?.value === 'link';
                  const isActive = currentMenuTitle === menu.fields?.navGroupTitle?.value;

                  return (
                    <li
                      key={menu.id ?? `main-menu-${i}`}
                      className="mx-[15px] my-[10px] flex items-center bg-white capitalize"
                    >
                      {showNavGroupTitle && (
                        <Text
                          tag="span"
                          field={menu.fields.navGroupTitle}
                          className={classNames(
                            'cursor-pointer text-xxs font-heavy',
                            isActive
                              ? 'shadow-[0_3px_0_0_#f26924]'
                              : 'hover:shadow-[0_3px_0_0_#f26924]'
                          )}
                          onClick={() => handleMegaMenu(menu.fields.navGroupTitle.value)}
                        />
                      )}
                      {showCta1Link && (
                        <SingleButton classes={{ wrapper: 'mb-0!' }} fields={menu.fields} />
                      )}
                      {showNavLink && (
                        <span className="cursor-pointer text-xxs font-heavy hover:shadow-[0_3px_0_0_#f26924]">
                          <LinkWrapper
                            className="text-sm-s font-heavy hover:no-underline focus:no-underline active:focus:no-underline ml:text-xxs"
                            field={menu.fields.cta1Link}
                          />
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* Other menu (icon links) */}
              {otherMenuArray.length > 0 && (
                <ul className="flex flex-row">
                  {otherMenuArray.map((item: AWHeaderProps, i: number) => {
                    const showDesktop =
                      getEnum(item.fields.displayType) &&
                      item.fields.displayType.fields.Value.value !== 'mobile';
                    if (!showDesktop || !item.fields?.navItemLink) {
                      return null;
                    }
                    return (
                      <li key={item.id ?? `other-${i}`} className="flex py-xxs pr-xxs">
                        <LinkWrapper
                          ctaSection="header"
                          field={item.fields.navItemLink}
                          className={classNames(
                            'flex items-center',
                            item.fields.navItemLink.value.target === '_blank'
                              ? 'flex-row items-start'
                              : 'flex-row-reverse items-center'
                          )}
                        >
                          <NavLinkIcon
                            navItem={item}
                            additionalDesktopClasses="max-w-[20px] max-h-[20px] mr-xxs"
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

              {/* Search toggle */}
              {props.fields.globalSearchBox && (
                <button
                  type="button"
                  className={classNames(
                    'z-9999 mr-0 flex h-l w-l cursor-pointer items-center justify-center rounded-[50%] transition-[fill] duration-200 ease-[cubic-bezier(0,0,0.58,1)]',
                    showSearchBox ? 'bg-primary' : 'bg-light-gray'
                  )}
                  onClick={handleShowSearchBox}
                >
                  <SvgIcon
                    icon="search"
                    className={classNames(showSearchBox ? '[&_path]:fill-white' : '')}
                    size="xl"
                  />
                </button>
              )}
            </div>
          </div>

          {/* Search box */}
          {showSearchBox && coveoAccessToken && (
            <div className="h-[70px] w-screen">
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

          {/* Megamenu panel — consistent width across all tabs */}
          <div className="relative w-full">
            <div
              className={classNames(
                'bg-white absolute left-1/2 -translate-x-1/2 w-[900px] max-w-[calc(100vw-2rem)] transition-[height] duration-150 ease-[cubic-bezier(0,0,0.58,1)] origin-top shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-40'
              )}
            >
              <div
                className={classNames(
                  'modal-content py-l overflow-auto',
                  showModal ? 'block' : 'sr-only'
                )}
              >
                <div className="mx-auto max-w-[1220px]">
                  {mainMenuArray.map((mainGroup: AWHeaderProps, i: number) => (
                    <MegaMenuGroup
                      key={mainGroup.id ?? `mega-group-${i}`}
                      mainGroup={mainGroup}
                      showModal={showModal}
                      currentMenuTitle={currentMenuTitle}
                      wrapperRef={wrapperRef}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile header — always in DOM for SEO/SSR. Visually hidden on desktop via ml:hidden inside AWMobileHeader */}
      <Suspense>
        <AWMobileHeader
          fields={fields}
          favoriteProductsCount={totalFavoritesCount}
          coveoAccessToken={coveoAccessToken}
          filterExpression={props.filterExpression}
          boostingExpression={props.boostingExpression}
        />
      </Suspense>
    </>
  );
}
