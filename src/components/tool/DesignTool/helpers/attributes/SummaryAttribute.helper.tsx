import { Item, Link, useSitecore } from '@sitecore-content-sdk/nextjs';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { useAsPath } from 'lib/hooks/use-as-path';
import { AttributeRendererProps } from 'lib/renoworks';
import { shareServicesToExclude, useA2AScript } from 'lib/utils/use-a2a-script';
import { useBVScript } from 'lib/utils/use-bv-script';
import { useFavoriteDesigns } from 'lib/website/favorite-designs/use-favorite-designs';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DesignToolQueryItem } from 'src/app/api/aw/design-tool/design-tool-option-by-id/get-option-by-id';
import { environment } from 'startup/environment';

import { FilterForProduct, MapProduct, prepareDesignSelectionData } from '../DesignTool.helper';
import { DesignToolProductProps } from '../DesignTool.types';
import { SummaryViewModel } from '../js/designtool';
import { shortenUrl } from '../js/utils';
import { RelatedProduct } from '../partial/RelatedProduct.helper';
import { SummaryAttributeTheme, SummaryAttributeThemeSubType } from './SummaryAttribute.theme';

const SummaryAttribute = ({
  props,
  modalRef,
  placeholder,
}: AttributeRendererProps<SummaryViewModel>) => {
  const asPath = useAsPath();
  const { themeName, themeData } = useTheme(SummaryAttributeTheme());
  const theme = (themeData as SummaryAttributeThemeSubType).classes;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { page } = useSitecore();
  const language = page.layout.sitecore.context.language ?? 'en';

  const $refs = {
    favoritesButton: useRef<HTMLAnchorElement>(null),
  };

  const [shortDesignUrl, setShortDesignUrl] = useState('');
  const { favoriteDesigns, addFavoriteDesign, removeFavoriteDesign } = useFavoriteDesigns();

  const getFavoriteText = useCallback(
    (shortUrl?: string) => {
      const designs = Array.isArray(favoriteDesigns) ? favoriteDesigns : [];
      if (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        designs.find((design: any) => design?.shareUrl === (shortUrl ?? shortDesignUrl ?? 'zzz'))
      ) {
        return 'Remove From My Favorites';
      }
      return 'Add To My Favorites';
    },
    [favoriteDesigns, shortDesignUrl]
  );

  const [favoriteText, setFavoriteText] = useState<string>(() => getFavoriteText());
  const [relatedProduct, setRelatedProduct] = useState<DesignToolProductProps>();
  const a2aScriptState = useA2AScript();

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
  }, [asPath]);

  useEffect(() => {
    if (window.a2a && a2aScriptState === 'ready') {
      window.a2a.init('page');
    }
  }, [a2aScriptState]);
  const productSeries = props.product?.series?.value;
  const productCategory = props.product?.category?.value;

  const a2aSubjectText = useCallback(() => {
    return 'Check out this ' + productSeries + ' ' + productCategory + ' from Andersen Windows.';
  }, [productSeries, productCategory]);

  const a2aBodyText = useCallback(() => {
    return (
      'Here is a ' +
      productSeries +
      ' ' +
      productCategory +
      ' that I designed on AndersenWindows.com.'
    );
  }, [productSeries, productCategory]);

  const shouldShowCTA = () => {
    try {
      const regExp = /nocta=([^?&#]*)/g;
      const matches = regExp.exec(location.search);

      if (matches != null && (matches[1].toLowerCase() === 'true' || matches[1] === '1')) {
        return false;
      }
    } catch {}

    return true;
  };

  const favoriteDesign = () => {
    const design = {
      url: window.location.href,
      seriesCategory: props?._product.series.value,
      interiorImage: props?._interiorImage,
      exteriorImage: props?._exteriorImage,
      selections: props?._selectedOptions,
      shareUrl: shortDesignUrl,
      productDetailUrl: props?._product.links.detail.value.href,
      requestAQuoteUrl: props?._requestAQuote?.value.href,
      findADealerUrl: props?._product?.links?.findADealer?.value.href,
      createdDate: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const existing = Array.isArray(favoriteDesigns)
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        favoriteDesigns.find((d: any) => d?.shareUrl === (shortDesignUrl ?? 'zzz'))
      : undefined;
    if (existing) {
      // guard and cast to avoid "unknown" type compile error
      if (typeof removeFavoriteDesign === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (removeFavoriteDesign as any)(existing.createdDate);
      } else {
        console.warn('removeFavoriteDesign is not a function', removeFavoriteDesign);
      }
    } else if (typeof addFavoriteDesign === 'function') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (addFavoriteDesign as any)(design);
    } else {
      console.warn('addFavoriteDesign is not a function', addFavoriteDesign);
    }

    setFavoriteText(getFavoriteText());

    // keep compatibility with any listeners that watch localStorage changes
    const storageEvent = new StorageEvent('storage', {
      key: 'aw_favoritedesigns',
      newValue: JSON.stringify(favoriteDesigns),
    });
    window.dispatchEvent(storageEvent);
  };

  useEffect(() => {
    if (window.a2a_config) {
      window.a2a_config.onclick = 1;
      window.a2a_config.num_services = 8;
      window.a2a_config.exclude_services = shareServicesToExclude;
      window.a2a_config.templates = window.a2a_config.templates ?? {};
      window.a2a_config.callbacks = window.a2a_config.callbacks ?? [];

      window.a2a_config.callbacks.push({
        share: () => prepareDesignSelectionData('Share My Design', props.product, props),
      } as never);

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
  }, [a2aScriptState, a2aSubjectText, a2aBodyText, props]);

  useEffect(() => {
    async function getProductById() {
      const itemId = props?.relatedProduct?.id;
      if (!itemId) {
        return;
      }

      try {
        const response = await fetch('/api/aw/design-tool/design-tool-product-by-id', {
          method: 'POST',
          body: JSON.stringify({ itemId: itemId, language }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const queryResultItem = (await response.json()) as Item & DesignToolQueryItem;
          if (FilterForProduct(queryResultItem)) {
            const mappedProduct = MapProduct([], queryResultItem);
            setRelatedProduct(mappedProduct);
          }
        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    }
    getProductById();
  }, [props, props?.relatedProduct?.id, language, pathname, searchParams]);

  const handleDesignRequestQuoteModalClose = () => {
    modalRef?.current?.classList.add(theme.designSummary.containerHidden);
  };
  return (
    <div className={theme.attributeOption}>
      <div className={theme.summaryHeaderContainer}>
        <p className={`${theme.summaryHeader} ${theme.earmark}`}>All of your window details</p>
        <div className={theme.summaryHeaderRight}>
          <ul className={theme.summaryHeaderMenu}>
            <li className={theme.summaryHeaderListItem}>
              {/*<!-- AddToAny BEGIN -->*/}
              <a
                className={theme.subMenuListLink + ' a2a_dd gtm-click '}
                href={`https://www.addtoany.com/share#url=${shortDesignUrl}`}
                data-a2a-url={shortDesignUrl}
              >
                <SvgIcon icon="share" className="mr-[2px]" /> Share My Design
              </a>
              {/*<!-- AddToAny END -->*/}
            </li>
            <li className={theme.summaryHeaderListItem}>
              <a
                className={theme.subMenuListLink}
                onClick={() => {
                  prepareDesignSelectionData('Print', props.product, props);
                  window.print();
                }}
              >
                <SvgIcon icon="print" className="mr-[2px]" /> Print
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className={theme.tableWrapper}>
        <table className={theme.table}>
          <tbody>
            {props.selectedOptions.map(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (option: any, index: number) => (
                <tr key={index} className={theme.trow}>
                  <td className={theme.tdAsset}>{option.title}</td>
                  <td className={theme.tdValue}>{option.value}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      <div className={theme.linkContainer}>
        <div className={theme.linkContainerRight}>
          {shouldShowCTA() && props.product.links.findADealer?.value?.url && (
            <Link
              field={props.product.links.findADealer}
              className={theme.subMenuListLink + theme.primaryLink + theme.sectionLink}
              target="_blank"
            ></Link>
          )}
        </div>
      </div>
      {shouldShowCTA() && props.favoritesLink && (
        <div className={theme.favoriteContainer}>
          <a
            className={theme.favoriteLink}
            onClick={favoriteDesign}
            ref={$refs.favoritesButton}
            data-product-id={props.product.productId}
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
      {relatedProduct?.id && (
        <div className={theme.relatedContainer}>
          <h3 className={theme.relatedHeader}>You may also like</h3>
          <RelatedProduct {...relatedProduct} />
        </div>
      )}
      <div
        className={theme.designSummary.container + theme.designSummary.containerHidden}
        ref={modalRef}
      >
        <div
          className={theme.designSummary.closeButton}
          onClick={handleDesignRequestQuoteModalClose}
        >
          <SvgIcon icon="close" size="24" className={theme.designSummary.closeButtonIcon}></SvgIcon>
        </div>
        {placeholder}
      </div>
    </div>
  );
};

SummaryAttribute.nameString = 'SummaryAttribute';

export default SummaryAttribute;
