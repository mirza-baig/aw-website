/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShortDesignUrlContext } from 'components/tool/DesignTool/helpers/ShortDesignUrlContext';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useAsPath } from 'lib/hooks/use-as-path';
import { AttributeRendererProps, shortenUrl, SummaryViewModel } from 'lib/renoworks';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from 'src/lib/context/ThemeContext';
import { shareServicesToExclude, useA2AScript } from 'src/lib/utils/use-a2a-script';
import { useBVScript } from 'src/lib/utils/use-bv-script';
import { useFavoriteDesigns } from 'src/lib/website/favorite-designs/use-favorite-designs';
import { environment } from 'startup/environment';

import { SummaryAttributeTheme, SummaryAttributeThemeSubType } from './PDT_SummaryAttribute.theme';

const SummaryAttribute = ({
  viewModel,
  selectedOptions,
  props,
  modalRef,
  placeholder,
}: AttributeRendererProps<SummaryViewModel>) => {
  const { themeName, themeData } = useTheme(SummaryAttributeTheme());
  const theme = (themeData as SummaryAttributeThemeSubType).classes;
  const asPath = useAsPath();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const $refs = {
    favoritesButton: useRef<HTMLAnchorElement>(null),
    favoritesButtonMobile: useRef<HTMLAnchorElement>(null),
  };

  const [shortDesignUrl, setShortDesignUrl] = useState('');
  const { favoriteDesigns, addFavoriteDesign, removeFavoriteDesign } = useFavoriteDesigns();

  const getFavoriteText = useCallback(
    (shortUrl?: string) => {
      const designs = Array.isArray(favoriteDesigns) ? favoriteDesigns : [];

      if (
        designs.find((design: any) => design?.shareUrl === (shortUrl ?? shortDesignUrl ?? 'zzz'))
      ) {
        return 'Remove From My Favorites';
      }
      return 'Add To My Favorites';
    },
    [favoriteDesigns, shortDesignUrl]
  );

  const [favoriteText, setFavoriteText] = useState<string>(() => getFavoriteText());
  const a2aScriptState = useA2AScript();

  const productSeries = useCallback(() => {
    return props.fields?.product?.fields?.productSeries?.fields?.productTypeName?.value;
  }, [props.fields?.product?.fields?.productSeries?.fields?.productTypeName?.value]);

  const productCategory = useCallback(() => {
    return props.fields?.product?.fields?.productName?.value;
  }, [props.fields?.product?.fields?.productName?.value]);

  useBVScript({ environment, theme: themeName });

  useEffect(() => {
    let cancelled = false;

    if (asPath) {
      shortenUrl(document.location.href).then((response) => {
        if (cancelled) {
          return;
        }

        setShortDesignUrl(response.shortenedUrl);
        setFavoriteText(getFavoriteText(response.shortenedUrl));
      });
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asPath, pathname, searchParams]);

  useEffect(() => {
    if (window.a2a && a2aScriptState === 'ready') {
      window.a2a.init('page');
    }
  }, [a2aScriptState]);

  const a2aSubjectText = useCallback(() => {
    return (
      'Check out this ' + productSeries() + ' ' + productCategory() + ' from Andersen Windows.'
    );
  }, [productCategory, productSeries]);

  const a2aBodyText = useCallback(() => {
    return (
      'Here is a ' +
      productSeries() +
      ' ' +
      productCategory() +
      ' that I designed on AndersenWindows.com.'
    );
  }, [productCategory, productSeries]);

  useEffect(() => {
    if (window.a2a_config) {
      window.a2a_config.onclick = 1;
      window.a2a_config.num_services = 8;
      window.a2a_config.exclude_services = shareServicesToExclude;
      window.a2a_config.templates = window.a2a_config.templates ?? {};
      window.a2a_config.callbacks = window.a2a_config.callbacks ?? [];

      window.a2a_config.templates = {
        email: {
          subject: a2aSubjectText(),
          body: a2aBodyText() + '\n${link}',
        },
        sms: {
          body: a2aBodyText() + '\n${link}',
        },
      };
    }
  }, [a2aScriptState, a2aBodyText, a2aSubjectText]);

  const favoriteDesign = () => {
    const design = {
      url: window.location.href,
      seriesCategory: productCategory(),
      interiorImage: viewModel?._interiorImage,
      exteriorImage: viewModel?._exteriorImage,
      selections: viewModel?._selectedOptions,
      shareUrl: shortDesignUrl,
      productDetailUrl: props.fields?.productDetailLink?.value.href,
      findADealerUrl: props.fields?.findADealerLink?.value.href,
      createdDate: new Date().toISOString(),
    } as any;

    const existing = (Array.isArray(favoriteDesigns) ? favoriteDesigns : []).find(
      (d: any) => d?.shareUrl === (shortDesignUrl || 'zzz')
    );
    if (existing) {
      if (typeof removeFavoriteDesign === 'function') {
        (removeFavoriteDesign as (createdDate: string) => void)(existing.createdDate);
      }
    } else if (typeof addFavoriteDesign === 'function') {
      (addFavoriteDesign as (design: any) => void)(design);
    }

    setFavoriteText(getFavoriteText());

    const storageEvent = new StorageEvent('storage', {
      key: 'aw_favoritedesigns',
      newValue: JSON.stringify(favoriteDesigns),
    });
    window.dispatchEvent(storageEvent);
  };

  useEffect(() => {
    setFavoriteText(getFavoriteText());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favoriteDesigns, shortDesignUrl]);

  const handleDesignRequestQuoteModalClose = () => {
    modalRef?.current?.classList.add(theme.designSummary.containerHidden);
  };

  return (
    <>
      {props.fields?.favoritesLink && (
        <div className={theme.favoriteContainer}>
          <a
            className={theme.favoriteLink}
            onClick={favoriteDesign}
            ref={$refs.favoritesButton}
            data-product-id={viewModel?.product?.productId}
          >
            <SvgIcon
              icon={'favorite'}
              size="20"
              fillId="currentColor"
              className={theme.favoriteLinkIcon}
            ></SvgIcon>
            {favoriteText}
          </a>
        </div>
      )}
      <div className={theme.attributeOption}>
        <div className={theme.tableWrapper}>
          <div className={theme.headerWrapper}>
            <p className={`${theme.summaryHeader} ${theme.earmark}`}>All of your window details</p>
            <div className={theme.linkContainer}>
              <div className={theme.linkContainerLeft}>
                <ul className={theme.subMenu}>
                  <li className={theme.subMenuListItem}>
                    {/*<!-- AddToAny BEGIN -->*/}
                    <a
                      className={theme.subMenuListLink + ' a2a_dd gtm-click '}
                      href={`https://www.addtoany.com/share#url=${shortDesignUrl}`}
                      data-a2a-url={shortDesignUrl}
                    >
                      <SvgIcon icon="share" className="mr-[2px]"></SvgIcon> Share My Design
                    </a>
                    {/*<!-- AddToAny END -->*/}
                  </li>
                  <li className={theme.subMenuListItem}>
                    <a
                      className={theme.subMenuListLink}
                      onClick={() => {
                        window.print();
                      }}
                    >
                      Print
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <table className={theme.table}>
            <tbody>
              {selectedOptions?.map((option: any, index: number) => (
                <tr key={`${option?.title}-${index}`} className={theme.trow}>
                  <td className={theme.tdAsset}>{option.title}</td>
                  <td className={theme.tdValue}>{option.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className={theme.designSummary.container + theme.designSummary.containerHidden}
          ref={modalRef}
        >
          <div
            className={theme.designSummary.closeButton}
            onClick={handleDesignRequestQuoteModalClose}
          >
            <SvgIcon
              icon="close"
              size="24"
              className={theme.designSummary.closeButtonIcon}
            ></SvgIcon>
          </div>
          <ShortDesignUrlContext value={shortDesignUrl}>{placeholder}</ShortDesignUrlContext>
        </div>
      </div>
    </>
  );
};

SummaryAttribute.nameString = 'SummaryAttribute';

export default SummaryAttribute;
