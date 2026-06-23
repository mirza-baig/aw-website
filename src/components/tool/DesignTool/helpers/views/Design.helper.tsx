import { event } from '@sitecore-content-sdk/events';
import { Link as Linkfield, Text } from '@sitecore-content-sdk/nextjs';
import LinkWrapper from 'helpers/LinkWrapper/LinkWrapper';
import { SliderRefType, SliderType, SliderWrapper } from 'helpers/SliderWrapper/SliderWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useAsPath } from 'lib/hooks/use-as-path';
import Link from 'next/link';
// Removing for temporary fix of using history: import { useRouter } from 'next/navigation';
import React, { MouseEvent, useContext, useEffect, useState } from 'react';
import TagManager from 'react-gtm-module';
import { ButtonPrimaryClasses } from 'src/helpers/Button/buttons/btn--primary';
import { ButtonTertiaryClasses } from 'src/helpers/Button/buttons/btn--tertiary';
import { useTheme } from 'src/lib/context/ThemeContext';
import { PreviewImage } from 'src/lib/renoworks';
import RenderAttribute from 'src/lib/renoworks/RenderAttribute';

import { rendererMap } from '../attributes/renderMap.helper';
import { DesignToolOptionDataProps, prepareDesignSelectionData } from '../DesignTool.helper';
import { DesignToolProductProps, DesignToolProps } from '../DesignTool.types';
import { DesignToolContext } from '../DesignToolContext.helper';
import { AWViewModelBuilder } from '../js/awviewmodelbuilder';
import { RenoworksProductSide } from '../js/renoworks';
import { useRenoworks } from '../js/renoworks-context';
import { GetUrlParts, shortenUrl } from '../js/utils';
import { PreviewImageThemes } from '../partial/PreviewImage.theme';
import { ShortDesignUrlContext } from '../ShortDesignUrlContext';
import { DesignTheme, DesignThemeSubType } from './Design.theme';

export type DesignToolDesignProps = DesignToolProps;

export type DesignViewProps = {
  product: DesignToolProductProps;
  options: DesignToolOptionDataProps[];
  attributeIndex: number;
  props: DesignToolProps;
};

const requiredStepTitles = new Set<string>([
  'Sizing',
  'Panels',
  'Profile',
  'Interior',
  'Exterior',
  'Glass',
]);

interface PillCTAProps {
  className?: string;
  handlePillCTAClick: (e: React.MouseEvent) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
  requiredStepsCompleted: boolean;
  pillCtaText: string;
  ctaTooltip: string;
  centerButton?: boolean;
  tooltipPosition?: 'right' | 'top' | 'bottom' | 'bottomRight';
  showIcon?: boolean;
}

const PillCTA = ({
  className = '',
  handlePillCTAClick,
  theme,
  requiredStepsCompleted,
  pillCtaText,
  ctaTooltip,
  centerButton,
  tooltipPosition = 'bottom',
  showIcon = true,
}: PillCTAProps) => {
  const getTooltipClasses = () => {
    const base =
      "absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-[#EAEAEA] text-[#484848] text-[13px] leading-[1.3] py-[10px] px-[12px] border border-[#CCCCCC] shadow-md z-50 pointer-events-none w-max max-w-[160px] whitespace-normal text-left font-normal after:content-[''] after:absolute after:border-[6px] after:border-transparent before:content-[''] before:absolute before:border-[7px] before:border-transparent";

    switch (tooltipPosition) {
      case 'right':
        return `${base} left-full top-1/2 -translate-y-1/2 ml-3  after:right-full after:top-1/2 after:-translate-y-1/2 after:border-r-[#EAEAEA] before:right-full before:top-1/2 before:-translate-y-1/2 before:border-r-[#CCCCCC]`;
      case 'top':
        return `${base} bottom-full left-1/2 -translate-x-1/2 mb-3  after:top-full after:left-1/2 after:-translate-x-1/2 after:border-t-[#EAEAEA] before:top-full before:left-1/2 before:-translate-x-1/2 before:border-t-[#CCCCCC]`;
      case 'bottomRight':
        return `${base} top-full right-[-10px] mt-[12px] after:bottom-full after:left-[20px] after:border-b-[#EAEAEA] before:bottom-full before:left-[19px] before:border-b-[#CCCCCC]`;
      case 'bottom':
      default:
        return `${base} top-full left-1/2 -translate-x-1/2 mt-3  after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-b-[#EAEAEA] before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-b-[#CCCCCC]`;
    }
  };

  return (
    <div className={`flex ${centerButton ? 'justify-center' : 'justify-end'} w-full ${className}`}>
      <div className="relative group flex items-center">
        <button
          type="button"
          onClick={handlePillCTAClick}
          className={`${theme.ctaSection.pillCTA} ${
            requiredStepsCompleted
              ? theme.ctaSection.pillCTAActive
              : theme.ctaSection.pillCTAInactive
          }`}
        >
          {pillCtaText}
          {showIcon && <SvgIcon icon="double-arrow-right" size="14" className="ml-2" />}
        </button>
        {!requiredStepsCompleted && <div className={getTooltipClasses()}>{ctaTooltip}</div>}
      </div>
    </div>
  );
};

export const Design = ({ product, options, props }: DesignViewProps) => {
  // Removing for temporary fix of using history: const router = useRouter();
  const asPath = useAsPath();
  const { designToolRouter, routeData } = useContext(DesignToolContext);
  const legacyAWViewModel = routeData.legacyAWViewModel ?? new AWViewModelBuilder();

  const { viewModel } = useRenoworks();
  const progressBar = viewModel?.progressBar;
  const brandProgressBar = viewModel?.brandProgressBar;
  const { themeName, themeData } = useTheme(DesignTheme());
  const theme = (themeData as DesignThemeSubType).classes;

  const [attributeIndex, setAttributeIndex] = useState<number>(0);
  const [pendingRAQOpen, setPendingRAQOpen] = useState(false);
  const pendingRAQOpenRef = React.useRef(false);
  const previewTheme = useTheme(PreviewImageThemes()).themeData;

  const $refs = {
    mobileMenu: React.useRef<HTMLDivElement>(null),
    progressBarMobile: React.useRef<HTMLUListElement>(null),
    progressItemsMobile: React.useRef<HTMLLIElement>(null),
    progressBarDesktop: React.useRef<HTMLUListElement>(null),
    progressItemsDesktop: React.useRef<HTMLLIElement>(null),
    sticky: React.useRef<HTMLDivElement>(null),
    desktopPreview: React.useRef<HTMLDivElement>(null),
    desktopPreviewHeader: React.useRef<HTMLHeadingElement>(null),
    mobilePreview: React.useRef<HTMLButtonElement>(null),
    mobilePreviewHeader: React.useRef<HTMLHeadingElement>(null),
    sliderRef: React.useRef<SliderType | null>(null),
    summaryModal: React.useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    if (!viewModel) {
      return;
    }

    const urlParts = GetUrlParts(asPath);
    let newIndex = Number.parseInt(urlParts.attributeIndex) ?? 0;

    if (newIndex < 0) {
      newIndex = 0;
    }

    if (newIndex >= viewModel.attributes.length) {
      newIndex = viewModel.attributes.length - 1;
    }

    setAttributeIndex(newIndex);
  }, [asPath, viewModel]);

  useEffect(() => {
    const container = $refs.progressBarDesktop.current;
    if (!container) {
      return;
    }
    const active = container.querySelector(`#Tab-${attributeIndex}`) as HTMLElement | null;

    if (!active) {
      return;
    }
    active.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [attributeIndex]);

  useEffect(() => {
    const container = $refs.progressBarMobile.current;
    if (!container) {
      return;
    }
    const active = container.querySelector(`#Tab-${attributeIndex}`) as HTMLElement | null;

    active?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [attributeIndex]);

  /// Attributes
  let mobileMenuIsVisible = false;
  let previewIsCollapsed = false;
  const [previewIsZoomed, setPreviewIsZoomed] = React.useState(false);

  const resetDesign = () => {
    const urlParts = GetUrlParts(asPath);
    const newPath = `${urlParts.pathName}#/${product.id}/0`;

    // Temporary fix for router.replace(newPath, { scroll: false }); not working in 16.2
    globalThis.history.replaceState(null, '', newPath);
  };

  const isFinalStep = () => {
    return attributeIndex === (viewModel?.attributes?.length ?? 0) - 1;
  };

  const mobileMenuStyle = () => {
    return mobileMenuIsVisible ? 'block' : 'none';
  };

  const isBrandHardwareStep = () => {
    const brandProgressBarLength = viewModel?.brandProgressBar?.length ?? 0;

    const returnValue =
      (brandProgressBarLength > 0 &&
        attributeIndex >= viewModel?.brandProgressBar[0]?.startIndex &&
        attributeIndex <= viewModel?.brandProgressBar[brandProgressBarLength - 1]?.startIndex) ||
      false;
    return returnValue;
  };

  const stepHeading = () => {
    return isFinalStep() ? product.summaryHeading : product.designHeading;
  };

  const stepSubhead = () => {
    return isFinalStep() ? product.summarySubhead : product.designSubhead;
  };

  /// Methods
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attributeOptionGroupSelected = (optionGroup: any, collection?: any[]) => {
    collection?.forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (option: any) => {
        option._isSelected = false;
        option._isClicked = false;
      }
    );
    optionGroup._isClicked = true;
    optionGroup._isSelected = true;

    if (
      optionGroup.options &&
      !optionGroup.options.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (option: any) => option.isSelected
      )
    ) {
      optionGroup.options[0]._isSelected = true;
    }

    updateSettings(optionGroup.productSettingChanges);
    updateVisibleImage(optionGroup.imageSide);
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const attributeOptionSelected = (option: any, collection?: any[]) => {
    collection?.forEach((option: any) => {
      /* eslint-enable @typescript-eslint/no-explicit-any */
      option._isSelected = false;
      option._isClicked = false;
    });
    option._isClicked = true;
    option._isSelected = true;
    updateSettings(option.productSettingChanges);
    updateVisibleImage(option.imageSide);
  };

  const updateVisibleImage = (imageSide: number) => {
    if (imageSide != RenoworksProductSide.Both && $refs.sliderRef?.current) {
      switch (imageSide) {
        case RenoworksProductSide.Interior:
          $refs.sliderRef?.current.slickGoTo(0);
          break;
        case RenoworksProductSide.Exterior:
          $refs.sliderRef?.current.slickGoTo(1);
          break;
      }
    }
  };

  const goToStep = (index: number) => {
    if (attributeIndex === 0 && index > 0) {
      fireDesignStart(); // jump from sizing(Step 1)
    } else {
      fireDesignUpdate();
    }
    const urlParts = GetUrlParts(asPath);
    const queryPart = urlParts.query ? `?${urlParts.query}` : '';
    const newPath = `${urlParts.pathName}${queryPart}#/${product.id}/${index ?? 0}`;

    const isSummaryStep = index === (viewModel?.attributes?.length ?? 0) - 1;

    prepareDesignSelectionData(`Jump To Step ${index + 1}`, isSummaryStep, product, viewModel);
    // Step navigation must replace, not push, so the URL history doesn't accumulate
    // one entry per attribute step. Back button should leave the tool entirely.
    globalThis.history.replaceState(null, '', newPath);
  };

  const nextAttribute = () => {
    if (attributeIndex === 0) {
      fireDesignStart(); // leaving sizing(Step 1)
    } else {
      fireDesignUpdate();
    }
    const urlParts = GetUrlParts(asPath);
    const queryPart = urlParts.query ? `?${urlParts.query}` : '';
    const newPath = `${urlParts.pathName}${queryPart}#/${urlParts.option}/${attributeIndex + 1}`;

    const isSummaryStep = attributeIndex + 1 === (viewModel?.attributes?.length || 0) - 1;

    prepareDesignSelectionData('Next Step', isSummaryStep, product, viewModel);

    // Step navigation must replace, not push, so the URL history doesn't accumulate
    // one entry per attribute step. Back button should leave the tool entirely.
    globalThis.history.replaceState(null, '', newPath);
  };

  const previousAttribute = () => {
    fireDesignUpdate();
    const urlParts = GetUrlParts(asPath);
    const queryPart = urlParts.query ? `?${urlParts.query}` : '';

    // previous button pressed always means you are not on the summary step
    prepareDesignSelectionData('Previous Step', false, product, viewModel);

    if (attributeIndex === 0) {
      // Step navigation must replace, not push, so the URL history doesn't accumulate
      // one entry per attribute step. Back button should leave the tool entirely.
      globalThis.history.replaceState(
        null,
        '',
        `${urlParts.pathName}${queryPart}#/${product.parentId}`
      );
    } else {
      // Step navigation must replace, not push, so the URL history doesn't accumulate
      // one entry per attribute step. Back button should leave the tool entirely.
      globalThis.history.replaceState(
        null,
        '',
        `${urlParts.pathName}${queryPart}#/${urlParts.option}/${attributeIndex - 1}`
      );
    }
  };

  const toggleMobileMenu = () => {
    mobileMenuIsVisible = !mobileMenuIsVisible;
    $refs.mobileMenu.current?.style.setProperty('display', mobileMenuStyle());
  };

  const togglePreviewCollapse = () => {
    previewIsCollapsed = !previewIsCollapsed;
    updatePreviewCollapse();
  };

  const updatePreviewCollapse = () => {
    if (previewIsCollapsed) {
      if (!$refs.desktopPreview.current?.className?.includes(theme.hide)) {
        $refs.desktopPreview.current?.setAttribute(
          'class',
          $refs.desktopPreview.current?.className + theme.hide
        );
      }
      if (!$refs.desktopPreviewHeader.current?.className?.includes(theme.hide)) {
        $refs.desktopPreviewHeader.current?.setAttribute(
          'class',
          $refs.desktopPreviewHeader.current?.className + theme.hide
        );
      }
      $refs.mobilePreview.current?.setAttribute(
        'class',
        $refs.mobilePreview.current?.className.replaceAll(theme.hide, '')
      );
      $refs.mobilePreviewHeader.current?.setAttribute(
        'class',
        $refs.mobilePreviewHeader.current?.className.replaceAll(theme.hide, '')
      );
    } else {
      $refs.desktopPreview.current?.setAttribute(
        'class',
        $refs.desktopPreview.current?.className.replaceAll(theme.hide, '')
      );
      $refs.desktopPreviewHeader.current?.setAttribute(
        'class',
        $refs.desktopPreviewHeader.current?.className.replaceAll(theme.hide, '')
      );

      if (!$refs.mobilePreview.current?.className?.includes(theme.hide)) {
        $refs.mobilePreview.current?.setAttribute(
          'class',
          $refs.mobilePreview.current?.className + theme.hide
        );
      }
      if (!$refs.mobilePreviewHeader.current?.className?.includes(theme.hide)) {
        $refs.mobilePreviewHeader.current?.setAttribute(
          'class',
          $refs.mobilePreviewHeader.current?.className + theme.hide
        );
      }
    }
  };

  const togglePreviewZoom = () => {
    setPreviewIsZoomed(!previewIsZoomed);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSettings = (changes: any) => {
    const updatedProductSettingValues = viewModel?.renoworksResult.productSettingValues.clone();
    for (const change of changes) {
      change.apply(updatedProductSettingValues);
    }

    const pathParts = GetUrlParts(asPath);
    const queryString = updatedProductSettingValues?.toURLQueryString();

    const newPath = `${pathParts.pathName}${queryString ? '?' + queryString : ''}#/${
      pathParts.option
    }/${attributeIndex}`;

    // Temporary fix for router.replace(newPath, { scroll: false }); not working in 16.2
    globalThis.history.replaceState(null, '', newPath);
  };

  const pagingText = isBrandHardwareStep() ? ['Closeup', 'Interior'] : ['Interior', 'Exterior'];
  const renderCustomPaging = (index: number) => {
    return (
      <button type="button" className={theme.desktopPreview.swiperPaginationLink}>
        {pagingText[index]}
      </button>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appendDots = (dots: any[]) => {
    return (
      <ul>
        {dots.map((item, index) => {
          const isActiveClass = item?.props?.className?.includes('slick-active')
            ? ' border-primary '
            : previewIsZoomed
              ? ' border-transparent '
              : ' border-gray md:border-transparent ';

          const paginationClass = previewIsZoomed
            ? theme.zoomedPreview.swiperPaginationBullet
            : theme.desktopPreview.swiperPaginationBullet;
          return (
            <li
              className={item?.props?.className + isActiveClass + paginationClass}
              key={pagingText[index]}
            >
              {item.props.children}
            </li>
          );
        })}
      </ul>
    );
  };

  updatePreviewCollapse();

  const sliderSettings = previewIsZoomed
    ? {
        infinite: false,
        className: theme.zoomedPreview.swiper + theme.desktopPreview.sticky,
        prevArrow: undefined,
        nextArrow: undefined,
        appendDots: appendDots,
        dotsClass: theme.zoomedPreview.swiperPaginationContainer,
        customPaging: renderCustomPaging,
      }
    : {
        infinite: false,
        className: theme.desktopPreview.swiper + theme.desktopPreview.sticky,
        prevArrow: undefined,
        nextArrow: undefined,
        appendDots: appendDots,
        dotsClass: theme.desktopPreview.swiperPaginationContainer,
        customPaging: renderCustomPaging,
      };

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

  const handleDesignRequestQuote = () => {
    const _selections = viewModel?._selectedOptions.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (accumulator: any, currentValue: any) => {
        accumulator[currentValue.title] = currentValue.value;
        return accumulator;
      },
      {}
    );

    // Trigger Design tool to RAQ click payload
    fireRequestQuoteClick();

    let hostName = '';
    try {
      const requestAQuoteUrl = props.fields?.getAQuoteLink?.value?.href;
      if (requestAQuoteUrl?.indexOf('://') >= 0) {
        hostName = new URL(requestAQuoteUrl).host;
      } else {
        hostName = window.location.hostname;
      }
    } catch {}

    const destinationURL = props.fields?.getAQuoteLink?.value?.href?.split('?')[0];

    TagManager.dataLayer({
      dataLayer: {
        event: 'design_tool_get_quote',
        link_text: props.fields?.getAQuoteLink?.value?.text,
        link_url: destinationURL != 'undefined' ? destinationURL : '',
        link_domain: destinationURL != 'undefined' ? hostName : '',
        product_name: props.fields?.product?.name,
        product_id: _selections['Product ID#'] ?? '',
        interior_color: _selections['Interior Color'] ?? '',
        exterior_color: _selections['Exterior Color'] ?? '',
      },
    });
  };

  const handleDesignRequestQuoteModalOpen = (
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e?.preventDefault();

    const _selections = viewModel?._selectedOptions.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (accumulator: any, currentValue: any) => {
        accumulator[currentValue.title] = currentValue.value;
        return accumulator;
      },
      {}
    );

    // Trigger Design tool to RAQ click payload
    fireRequestQuoteClick();

    $refs.summaryModal.current?.classList.remove(theme.designSummary.containerHidden);

    TagManager.dataLayer({
      dataLayer: {
        event: 'design_tool_get_quote',
        link_text: props.fields?.getAQuoteLink?.value?.text,
        product_name: props.fields?.product?.name,
        product_id: _selections['Product ID#'] ?? '',
        interior_color: _selections['Interior Color'] ?? '',
        exterior_color: _selections['Exterior Color'] ?? '',
      },
    });
  };

  const hasDesignToolPlaceholder = Object.keys(props.rendering?.placeholders ?? {}).some((key) =>
    key.startsWith('designtool-')
  );
  const lastRequiredStepIndex =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    progressBar?.reduce((maxIndex: number, item: any) => {
      if (requiredStepTitles.has(item?.title)) {
        return Math.max(maxIndex, item.startIndex);
      }
      return maxIndex;
    }, -1) ?? -1;
  const requiredStepsCompleted =
    lastRequiredStepIndex === -1 || attributeIndex >= lastRequiredStepIndex;

  // Resolve pill CTA text from whichever Sitecore field is populated.
  const pillCtaText = props.fields?.skipCtaText?.value?.trim() || undefined;
  const ctaTooltip = props.fields?.ctaToolTip?.value;

  const skipCtaSelect = props.fields?.skipCtaSelect?.value || undefined;
  const ctaDestination = skipCtaSelect === 'Summary' ? 'Summary' : 'Raq';
  const shouldShowPill = !!skipCtaSelect;
  const showPillIcon = ctaDestination !== 'Raq';

  const handlePillCTAClick = (e: React.MouseEvent) => {
    if (!requiredStepsCompleted) {
      e?.preventDefault();
      return;
    }

    if (ctaDestination === 'Raq') {
      if (hasDesignToolPlaceholder) {
        pendingRAQOpenRef.current = true;
        setPendingRAQOpen(true);
        goToStep((viewModel?.attributes?.length || 0) - 1);
      } else {
        handleDesignRequestQuote();
        if (props.fields?.getAQuoteLink?.value?.href) {
          globalThis.location.href = props.fields.getAQuoteLink.value.href;
        }
      }
    } else {
      // Default: skip to summary only
      goToStep((viewModel?.attributes?.length || 0) - 1);
    }
  };
  const summaryCtaText = props.fields?.summaryCtaText?.value || undefined;
  console.log(summaryCtaText);
  const handleSummaryPillCTAClick = (e: React.MouseEvent) => {
    e?.preventDefault();
    // Trigger Design tool to RAQ click payload
    fireRequestQuoteClick();

    if (hasDesignToolPlaceholder) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handleDesignRequestQuoteModalOpen(undefined as any);
    } else {
      handleDesignRequestQuote();
      if (props.fields?.getAQuoteLink?.value?.href) {
        globalThis.location.href = props.fields.getAQuoteLink.value.href;
      }
    }
  };
  // --- Pill CTA Logic End ---

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds max

    const attemptOpen = () => {
      attempts++;
      const finalStep = isFinalStep();
      const hasRef = !!$refs.summaryModal.current;
      const refFlag = pendingRAQOpenRef.current;

      if (!refFlag) {
        return;
      }

      if (finalStep && hasRef) {
        pendingRAQOpenRef.current = false;
        setPendingRAQOpen(false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleDesignRequestQuoteModalOpen(undefined as any);
      } else if (attempts < maxAttempts) {
        timeoutId = setTimeout(attemptOpen, 100);
      } else {
        pendingRAQOpenRef.current = false;
        setPendingRAQOpen(false);
      }
    };

    if (pendingRAQOpenRef.current) {
      attemptOpen();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [attributeIndex, pendingRAQOpen, viewModel]);

  const [shortDesignUrl, setShortDesignUrl] = useState('');
  useEffect(() => {
    let cancelled = false;

    if (asPath) {
      shortenUrl(document.location.href).then((response) => {
        if (cancelled) {
          return;
        }

        setShortDesignUrl(response.shortenedUrl);
      });
    }

    return () => {
      cancelled = true;
    };
  }, [asPath]);

  const optionalTitles = new Set<string>(['Hardware', 'Grilles', 'Blinds', 'Trim']);

  const isOptionalStep = (title: string): boolean => optionalTitles.has(title);

  // ----- Start Personalization Payload ------
  const hasDesignStarted = () => sessionStorage.getItem('awDesignStarted') === 'true';

  const markDesignStarted = () => {
    sessionStorage.setItem('awDesignStarted', 'true');
  };

  const getQueryParams = () => {
    const params = new URLSearchParams(globalThis.location.search);
    return {
      width: params.get('widIn') || '',
      height: params.get('hgtIn') || '',
      frameColor: params.get('frameColor') || '',
      frameColorExt: params.get('frameColorExt') || '',
      glass: params.get('glass') || '',
      hardware: params.get('hardware') || '',
      grille: params.get('grilleStyle') || '',
    };
  };

  // START Event - US #311
  const fireDesignStart = () => {
    if (hasDesignStarted()) {
      return;
    }

    sessionStorage.setItem('awDTGlassReached', 'false');
    const params = getQueryParams();
    const startPayload = {
      type: 'AW:DESIGN_TOOL_START',
      channel: 'WEB',
      language: 'EN',
      ext: {
        timestamp: new Date().toISOString(),
        pageUrl: globalThis.location.href,
        referrer: document.referrer,

        // Product info
        productSeries: product?.series?.value,
        productType: product?.productType?.value,
        productName: product?.name,
        productId: product?.productId,

        // Attribute selections info from URL
        attributeIndex: attributeIndex,
        widthIn: params.width,
        heightIn: params.height,
      },
    };

    event(startPayload)
      .then(() => console.log('[CDP] Design Tool fireStart payload:', startPayload))
      .catch((err) => console.error('[CDP] Design Tool fireStart Event error', err));

    markDesignStarted();
  };

  // SEPARATE GLASS TRACKING
  useEffect(() => {
    const currentStepTitle = progressBar?.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => item.startIndex === attributeIndex
    )?._title;

    if (currentStepTitle === 'Glass') {
      sessionStorage.setItem('awDTGlassReached', 'true');
    }
  }, [attributeIndex, progressBar]);
  // Update EVENT - US #312
  const fireDesignUpdate = (changedAttribute?: string, changedValue?: string) => {
    if (!hasDesignStarted()) {
      return;
    }

    const params = getQueryParams();
    type SelectedOption = { title: string; value: string };
    const getSelectedValue = (title: string) => {
      return (
        viewModel?._selectedOptions?.find((o: SelectedOption) => o.title === title)?.value || ''
      );
    };

    const updatePayload = {
      type: 'AW:DESIGN_TOOL_UPDATE',
      channel: 'WEB',
      language: 'EN',
      ext: {
        timestamp: new Date().toISOString(),
        pageUrl: globalThis.location.href,

        // Product info
        productSeries: product?.series?.value,
        productType: product?.productType?.value,
        productName: product?.name,
        awProductId: product?.productId,

        // Resume link
        resumeUrl: globalThis.location.href,

        // Attribute selections info from URL
        attributeIndex: attributeIndex,
        changedAttribute: changedAttribute || '', //gtmItemHeader
        changedValue: changedValue || '', //gtmItemDetail
        widthIn: getSelectedValue('Unit Width'),
        heightIn: getSelectedValue('Unit Height'),
        frameColor: params.frameColor, // from Query Params as it's not a selected option
        glass: getSelectedValue('Glass'),
        hardware: getSelectedValue('Hardware'),
        grillesStyle: getSelectedValue('Grille Pattern'),
        interiorColor: getSelectedValue('Interior Color'),
        exteriorColor: getSelectedValue('Exterior Door Color'),
      },
    };
    event(updatePayload)
      .then(() => console.log('[CDP] Design Tool fireUpdate payload:', updatePayload))
      .catch((err) => console.error('[CDP] Design Tool fireUpdate Event error', err));
  };

  // Move to RAQ Event - US #315
  const fireRequestQuoteClick = () => {
    const params = getQueryParams();

    const extractColor = (value?: string | null) => {
      if (!value) {
        return '';
      }
      const regex = /color=([^;]+)/;
      const result = regex.exec(value);

      return result ? result[1] : '';
    };

    const fromExperience = sessionStorage.getItem('awDTFromExperience') === 'true';
    const experienceId = sessionStorage.getItem('awDTExperienceId') || '';
    const resumeUrl = sessionStorage.getItem('awDTResumeUrl') || '';

    const payload = {
      type: 'AW:DESIGN_TOOL_REQUEST_QUOTE_CLICK',
      channel: 'WEB',
      language: 'EN',
      ext: {
        timestamp: new Date().toISOString(),
        pageUrl: globalThis.location.href,

        // UC-03 Experience linking
        fromExperience: fromExperience,
        experienceId: experienceId,

        // Product info
        productSeries: product?.series?.value,
        productType: product?.productType?.value,
        productName: product?.name,
        productId: product?.productId,

        // Resume link
        resumeUrl: resumeUrl,

        // Attribute selections info from URL
        widthIn: params.width,
        heightIn: params.height,
        frameColor: params.frameColor,
        glass: params.glass,
        hardware: params.hardware,
        grillesStyle: params.grille,
        interiorColor: extractColor(params.frameColor),
        exteriorColor: extractColor(params.frameColorExt),
      },
    };

    event(payload)
      .then(() => console.log('[CDP] Design tool - RAQ Click payload:', payload))
      .catch((err) => console.error('[CDP] Design tool - RAQ Click error', err));
  };

  // ----- End Personalization Payload --------
  return (
    legacyAWViewModel && (
      <div className={theme.stepDesign}>
        <div className={theme.stepContainer}>
          <h2 className={theme.stepHeading + (!isFinalStep() ? ' max-md:hidden' : '')}>
            <Text field={stepHeading()} encode={false}></Text>
          </h2>
          <h3 className={theme.stepSubhead + (!isFinalStep() ? ' max-md:hidden' : '')}>
            <Text field={stepSubhead()} encode={false}></Text>
          </h3>
          <div className={theme.stepWrapper}>
            <div className={theme.stepRow}>
              <div className={theme.imgSlider}>
                <ul
                  className={theme.progressBar + theme.progressBarMobile}
                  ref={$refs.progressBarMobile}
                >
                  {progressBar?.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (progressBarItem: any, index: number) => {
                      const isActive = attributeIndex >= progressBarItem.startIndex;

                      let stepSizeClass: string;
                      if (progressBarItem.title === 'Summary') {
                        stepSizeClass = theme.progressBarSummaryMobile;
                      } else if (isOptionalStep(progressBarItem.title)) {
                        stepSizeClass = theme.progressBarOptionalMobile;
                      } else {
                        stepSizeClass = theme.progressBarRequiredMobile;
                      }
                      return (
                        <li
                          className={theme.progressBarItemMobile}
                          key={index + progressBarItem?.title}
                          ref={$refs.progressItemsMobile}
                        >
                          <button
                            className={theme.progressBarButton}
                            title={'Move to ' + progressBarItem?.title + ' step'}
                            aria-label={'Move to ' + progressBarItem?.title + ' step'}
                            onClick={() => {
                              goToStep(progressBarItem.startIndex);
                            }}
                          >
                            <span
                              className={
                                theme.progressBarName +
                                (attributeIndex >= progressBarItem.startIndex ? ' done ' : '') +
                                ' h-[40px] lg:h-[48px] flex flex-col justify-start items-center'
                              }
                              id={`Tab-${progressBarItem.startIndex}`}
                            >
                              <div className="font-medium text-[1rem]">{progressBarItem.title}</div>
                              <span className="block text-[12px] font-normal leading-none mt-1">
                                {progressBarItem.title !== 'Summary' &&
                                  (isOptionalStep(progressBarItem.title) ? 'Optional' : 'Required')}
                              </span>
                            </span>
                            <span
                              className={[
                                theme.progressBarStep,
                                isActive ? 'bg-orange-500' : 'bg-gray-300',
                                stepSizeClass,
                              ]
                                .filter(Boolean)
                                .join(' ')}
                            >
                              {/* Show tick - ONLY for required steps */}
                              {!isOptionalStep(progressBarItem.title) &&
                                progressBarItem.title !== 'Summary' && (
                                  <SvgIcon icon={'tick'} className="w-[65%] h-[65%]"></SvgIcon>
                                )}
                            </span>
                          </button>
                        </li>
                      );
                    }
                  )}
                </ul>

                {/* Mobile PillCTA — only rendered when a CTA label is configured in Sitecore */}
                {shouldShowPill && !isFinalStep() && (
                  <PillCTA
                    className="md:hidden mt-1.25 mb-8"
                    handlePillCTAClick={handlePillCTAClick}
                    theme={theme}
                    requiredStepsCompleted={requiredStepsCompleted}
                    pillCtaText={pillCtaText}
                    ctaTooltip={ctaTooltip}
                    centerButton={true}
                    tooltipPosition="bottom"
                    showIcon={showPillIcon}
                  />
                )}

                {/* Mobile Summary Step CTA Pill — final step only */}
                {isFinalStep() && !!summaryCtaText && (
                  <PillCTA
                    className="md:hidden mt-1.25 mb-8"
                    handlePillCTAClick={handleSummaryPillCTAClick}
                    theme={theme}
                    requiredStepsCompleted={true}
                    pillCtaText={summaryCtaText}
                    ctaTooltip={''}
                    centerButton={true}
                    tooltipPosition="bottom"
                    showIcon={false}
                  />
                )}

                <button
                  className={theme.mobilePreview.button}
                  title="Open preview images"
                  aria-label="Open preview images"
                  onClick={togglePreviewCollapse}
                  ref={$refs.mobilePreview}
                >
                  <h3 className={theme.mobilePreview.buttonHeader} ref={$refs.mobilePreviewHeader}>
                    <span>
                      <Text field={product.series}></Text> <Text field={product.category}></Text>
                    </span>
                  </h3>
                  Preview
                  <SvgIcon
                    icon={'dropdown-arrow'}
                    size="20"
                    className={
                      theme.desktopPreview.arrowUpIcon + theme.desktopPreview.arrowUpIconRotateDown
                    }
                  ></SvgIcon>
                </button>
                <div className={theme.desktopPreview.wrapper} ref={$refs.desktopPreview}>
                  <div
                    className={
                      previewIsZoomed
                        ? theme.zoomedPreview.swiperWrapper
                        : theme.desktopPreview.swiperWrapper + theme.desktopPreview.sticky
                    }
                    ref={$refs.sticky}
                  >
                    <button
                      className={
                        previewIsZoomed
                          ? theme.zoomedPreview.closeIcon
                          : theme.desktopPreview.swiperClose
                      }
                      title="Toggle preview zoom"
                      aria-label="Toggle preview zoom"
                      onClick={() => togglePreviewZoom()}
                    >
                      <SvgIcon
                        icon={'close'}
                        size="20"
                        className={theme.desktopPreview.swiperCloseIcon}
                      ></SvgIcon>
                    </button>
                    <h3
                      className={
                        theme.desktopPreview.seriesHeader +
                        (previewIsZoomed ? theme.zoomedPreview.seriesHeader : ' ')
                      }
                      ref={$refs.desktopPreviewHeader}
                    >
                      <span>
                        <Text field={product.series}></Text> <Text field={product.category}></Text>
                      </span>
                    </h3>
                    {viewModel?.interiorImage && viewModel?.exteriorImage ? (
                      <div
                        className={
                          previewIsZoomed
                            ? theme.zoomedPreview.swiperContainer
                            : theme.desktopPreview.swiperContainer
                        }
                      >
                        <SliderWrapper
                          sliderSettings={sliderSettings}
                          theme={themeName}
                          sliderRef={$refs.sliderRef as SliderRefType}
                        >
                          <div
                            className={
                              previewIsZoomed
                                ? theme.zoomedPreview.previewImageWrapper
                                : theme.desktopPreview.previewImageWrapper
                            }
                          >
                            <PreviewImage
                              theme={previewTheme}
                              className={theme.desktopPreview.previewImage}
                              src={viewModel?.interiorImage.src}
                              alt={viewModel?.interiorImage.alt}
                              isBrandHWCloseupImage={isBrandHardwareStep()}
                            ></PreviewImage>
                          </div>
                          <div
                            className={
                              previewIsZoomed
                                ? theme.zoomedPreview.previewImageWrapper
                                : theme.desktopPreview.previewImageWrapper
                            }
                          >
                            <PreviewImage
                              theme={previewTheme}
                              className={theme.desktopPreview.previewImage}
                              src={
                                isBrandHardwareStep()
                                  ? viewModel?.interiorImage.src
                                  : viewModel?.exteriorImage.src
                              }
                              alt={
                                isBrandHardwareStep()
                                  ? viewModel?.interiorImage.alt
                                  : viewModel?.exteriorImage.alt
                              }
                            ></PreviewImage>
                          </div>
                        </SliderWrapper>
                      </div>
                    ) : (
                      <div
                        className={
                          previewIsZoomed
                            ? theme.zoomedPreview.swiperContainer
                            : theme.desktopPreview.swiperContainer
                        }
                      >
                        {viewModel?.interiorImage ? (
                          <div
                            className={
                              previewIsZoomed
                                ? theme.zoomedPreview.previewImageWrapper
                                : theme.desktopPreview.previewImageWrapper
                            }
                          >
                            <PreviewImage
                              theme={previewTheme}
                              className={theme.desktopPreview.previewImage}
                              src={viewModel?.interiorImage.src}
                              alt={viewModel?.interiorImage.alt}
                            ></PreviewImage>
                          </div>
                        ) : (
                          viewModel?.exteriorImage && (
                            <div
                              className={
                                previewIsZoomed
                                  ? theme.zoomedPreview.previewImageWrapper
                                  : theme.desktopPreview.previewImageWrapper
                              }
                            >
                              <PreviewImage
                                theme={previewTheme}
                                className={theme.desktopPreview.previewImage}
                                src={viewModel?.exteriorImage.src}
                                alt={viewModel?.exteriorImage.alt}
                              ></PreviewImage>
                            </div>
                          )
                        )}
                      </div>
                    )}
                    <div
                      className={
                        theme.desktopPreview.mobileZoom + (previewIsZoomed ? ' hidden ' : '')
                      }
                      onClick={togglePreviewZoom}
                    >
                      <SvgIcon
                        icon={'zoom-pinch'}
                        size="20"
                        className={theme.desktopPreview.mobileZoomIcon}
                      ></SvgIcon>
                    </div>
                  </div>
                  <button
                    className={theme.desktopPreview.arrowUp}
                    title="Hide preview images"
                    aria-label="Hide preview images"
                    onClick={togglePreviewCollapse}
                  >
                    {' '}
                    <SvgIcon
                      icon={'dropdown-arrow'}
                      size="20"
                      className={
                        theme.desktopPreview.arrowUpIcon + theme.desktopPreview.arrowUpIconRotateUp
                      }
                    ></SvgIcon>
                  </button>
                </div>
              </div>
              {/* ----Desktop Design ---- */}
              <div className={theme.attributes.attributes}>
                <ul
                  className={theme.progressBar + theme.progressBarDesktop}
                  ref={$refs.progressBarDesktop}
                >
                  {progressBar?.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (progressBarItem: any, index: number) => {
                      const isActive = attributeIndex >= progressBarItem.startIndex;

                      let stepSizeClass: string;
                      if (progressBarItem.title === 'Summary') {
                        stepSizeClass = theme.progressBarSummary;
                      } else if (isOptionalStep(progressBarItem.title)) {
                        stepSizeClass = theme.progressBarOptional;
                      } else {
                        stepSizeClass = theme.progressBarRequired;
                      }

                      return (
                        <li className={theme.progressBarItem} key={index + progressBarItem?.title}>
                          <button
                            className={theme.progressBarButton}
                            title={'Move to ' + progressBarItem.title + ' step.'}
                            aria-label={'Move to ' + progressBarItem.title + ' step.'}
                            onClick={() => {
                              goToStep(progressBarItem.startIndex);
                            }}
                          >
                            <span
                              className={
                                theme.progressBarName +
                                (attributeIndex >= progressBarItem.startIndex ? ' done ' : '') +
                                ' h-[40px] lg:h-[48px] flex flex-col justify-start items-center'
                              }
                              id={`Tab-${progressBarItem.startIndex}`}
                            >
                              <div className="font-medium text-[1rem]">{progressBarItem.title}</div>
                              <span className="block text-[12px] font-normal leading-none mt-1">
                                {progressBarItem.title !== 'Summary' &&
                                  (isOptionalStep(progressBarItem.title) ? 'Optional' : 'Required')}
                              </span>
                              <span
                                className={[
                                  theme.progressBarStep,
                                  isActive ? 'bg-orange-500' : 'bg-gray-300',
                                  stepSizeClass,
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                              >
                                {/* Show tick - ONLY for required steps */}
                                {!isOptionalStep(progressBarItem.title) &&
                                  progressBarItem.title !== 'Summary' && (
                                    <SvgIcon icon={'tick'} className="w-[65%] h-[65%]"></SvgIcon>
                                  )}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    }
                  )}
                </ul>

                {/* Desktop progress-bar PillCTA row — only rendered when a Pill label is configured in Sitecore */}
                {shouldShowPill && !isFinalStep() && (
                  <div className="relative hidden md:flex items-center justify-center w-full mb-6 pt-2.5">
                    <div className="absolute w-full h-0.5 bg-[#D8D8D8] top-1/2 -translate-y-1/2 z-0"></div>
                    <PillCTA
                      className="z-10 relative"
                      handlePillCTAClick={handlePillCTAClick}
                      theme={theme}
                      requiredStepsCompleted={requiredStepsCompleted}
                      pillCtaText={pillCtaText}
                      centerButton={true}
                      ctaTooltip={ctaTooltip}
                      tooltipPosition="bottomRight"
                      showIcon={showPillIcon}
                    />
                  </div>
                )}

                {/* Desktop Summary Step CTA Pill — final step only */}
                {isFinalStep() && !!summaryCtaText && (
                  <div className="relative hidden md:flex items-center justify-center w-[100%] pl-[37px] mb-6 pt-[10px]">
                    <div className="absolute w-full h-[2px] bg-[#D8D8D8] top-1/2 -translate-y-1/2 z-0"></div>
                    <PillCTA
                      className="z-10 relative"
                      handlePillCTAClick={handleSummaryPillCTAClick}
                      theme={theme}
                      requiredStepsCompleted={true}
                      pillCtaText={summaryCtaText}
                      centerButton={true}
                      ctaTooltip={''}
                      tooltipPosition="bottomRight"
                      showIcon={false}
                    />
                  </div>
                )}

                <ul
                  className={
                    theme.attributes.attributeMenuList +
                    (isFinalStep() ? theme.attributes.attributeMenuListFinal : '')
                  }
                >
                  {viewModel?.attributes[attributeIndex]?.tertiaryLinks.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (link: any) => (
                      <li className={theme.attributes.attributeMenuListItem} key={link.value.href}>
                        <Link
                          href={link.value.href}
                          className={theme.attributes.attributeMenuLink}
                          target="_blank"
                        >
                          <span>{link.value.text}</span>
                        </Link>
                      </li>
                    )
                  )}
                  <li className={theme.attributes.attributeMenuListItem + theme.hideMobile}>
                    <button
                      className={theme.attributes.attributeMenuLink}
                      title={'Clear My Choices'}
                      aria-label={'Clear My Choices'}
                      onClick={() => {
                        resetDesign();
                      }}
                    >
                      Clear My Choices{' '}
                      <SvgIcon
                        icon="close"
                        size="16"
                        className="inline-block align-middle"
                      ></SvgIcon>
                    </button>
                  </li>
                </ul>
                {isBrandHardwareStep() && (
                  <div className="mt-8">
                    {brandProgressBar?.map(
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (brandProgressBarItem: any, index: number) => (
                        <span key={'span_group_button_' + index}>
                          <button
                            className={
                              (brandProgressBarItem.startIndex === attributeIndex
                                ? theme.tabActive
                                : theme.tabInactive) + theme.tabButton
                            }
                            onClick={() => {
                              goToStep(brandProgressBarItem.startIndex);
                            }}
                          >
                            {brandProgressBarItem.title}
                          </button>
                        </span>
                      )
                    )}
                  </div>
                )}
                <ShortDesignUrlContext value={shortDesignUrl}>
                  <RenderAttribute
                    props={viewModel?.attributes[attributeIndex]}
                    rendererMap={rendererMap}
                    viewModel={viewModel?.attributes[attributeIndex]}
                    selectedOptions={viewModel?.selectedOptions}
                    onUpdateOption={attributeOptionSelected}
                    onUpdateOptionGroup={attributeOptionGroupSelected}
                    attributeIndex={attributeIndex}
                    maxAttributeIndex={viewModel?.attributes?.length || 20}
                    modalRef={$refs.summaryModal}
                    placeholder={props.placeholder}
                  ></RenderAttribute>
                </ShortDesignUrlContext>
                <div
                  className={theme.ctaSection.ctaSection + (isFinalStep() ? ' final-step' : ' ')}
                >
                  <button
                    className={theme.ctaSection.mobileMenuButton}
                    title="Toggle mobile menu"
                    aria-label="Toggle mobile menu"
                    onClick={toggleMobileMenu}
                  >
                    <SvgIcon
                      icon={'ellipsis'}
                      size="20"
                      className={theme.ctaSection.mobileMenuButtonIcon}
                    ></SvgIcon>
                  </button>
                  <div className="flex w-full flex-col">
                    {/* Top Row: Desktop nav-area PillCTA — only rendered when a Pill label is configured in Sitecore */}
                    {!isFinalStep() && shouldShowPill && (
                      <div className="flex w-full justify-end">
                        <PillCTA
                          className="mb-2 hidden md:flex"
                          handlePillCTAClick={handlePillCTAClick}
                          theme={theme}
                          requiredStepsCompleted={requiredStepsCompleted}
                          pillCtaText={pillCtaText}
                          ctaTooltip={ctaTooltip}
                          tooltipPosition="top"
                          showIcon={showPillIcon}
                        />
                      </div>
                    )}

                    {/* Bottom Row: Previous (left) and Next/Action (right) */}
                    <div className={theme.ctaSection.navigationLinkContainer}>
                      <button
                        className={
                          theme.ctaSection.navigationLink +
                          theme.ctaSection.navigationLinkContainerSecondaryButton +
                          ButtonTertiaryClasses(themeName).btnClass
                        }
                        title="Move to previous step"
                        aria-label="Move to previous step"
                        onClick={previousAttribute}
                      >
                        Previous
                      </button>

                      {!isFinalStep() ? (
                        <button
                          className={
                            theme.ctaSection.navigationLink +
                            theme.ctaSection.navigationLinkContainerPrimaryButton +
                            ButtonPrimaryClasses(themeName).btnClass +
                            ' ml-auto' /* Added ml-auto to push right */
                          }
                          title="Move to next step"
                          aria-label="Move to next step"
                          onClick={nextAttribute}
                        >
                          Next <SvgIcon icon="arrow" size="16" className="ml-[4px]"></SvgIcon>
                        </button>
                      ) : hasDesignToolPlaceholder ? (
                        <button
                          onClick={(e) => handleDesignRequestQuoteModalOpen(e)}
                          className={
                            theme.ctaSection.navigationLink +
                            theme.ctaSection.navigationLinkRAQButton +
                            ButtonPrimaryClasses(themeName).btnClass +
                            ' ml-auto' /* Added ml-auto to push right */
                          }
                          title={props.fields?.getAQuoteLink?.value?.text}
                          id="request_a_quote"
                        >
                          {props.fields?.getAQuoteLink?.value?.text ?? 'Request A Quote'}
                        </button>
                      ) : (
                        shouldShowCTA() &&
                        props.fields?.getAQuoteLink?.value?.href && (
                          <Linkfield
                            onClick={handleDesignRequestQuote}
                            field={props.fields?.getAQuoteLink}
                            className={
                              theme.ctaSection.navigationLink +
                              theme.ctaSection.navigationLinkContainerPrimaryButton +
                              ButtonPrimaryClasses(themeName).btnClass +
                              ' ml-auto' /* Added ml-auto to push right */
                            }
                          ></Linkfield>
                        )
                      )}
                    </div>
                  </div>
                </div>
                <div className={theme.mobileMenu.mobileMenu} ref={$refs.mobileMenu}>
                  <button
                    className={theme.mobileMenu.closeButton}
                    title="Close"
                    aria-label="Close"
                    onClick={toggleMobileMenu}
                  >
                    <SvgIcon
                      icon={'close'}
                      size="25"
                      className={theme.mobileMenu.closeButtonIcon}
                    ></SvgIcon>
                  </button>
                  <ul className={theme.mobileMenu.list}>
                    <li className={theme.mobileMenu.listItem}>
                      <a
                        href="#/"
                        className={
                          theme.mobileMenu.listItemLink + theme.mobileMenu.listItemStartOver
                        }
                        title="Start Over"
                        aria-label="Start Over"
                        onClick={(e) => {
                          e.preventDefault();
                          designToolRouter.goToStart(asPath);
                        }}
                      >
                        <SvgIcon
                          icon={'reset'}
                          size="20"
                          className={
                            theme.mobileMenu.listItemLinkIcon +
                            theme.mobileMenu.listItemStartOverIcon
                          }
                        ></SvgIcon>
                        Start Over
                      </a>
                    </li>
                    <li className={theme.mobileMenu.listItem}>
                      <button
                        className={theme.mobileMenu.listItemLink}
                        title="Clear My Choices"
                        aria-label="Clear My Choices"
                        onClick={() => {
                          toggleMobileMenu();
                          resetDesign();
                        }}
                      >
                        <SvgIcon
                          icon={'close'}
                          size="20"
                          className={theme.mobileMenu.listItemLinkIcon}
                        ></SvgIcon>
                        Clear My Choices
                      </button>
                    </li>
                    <li className={theme.mobileMenu.listItem}>
                      <LinkWrapper
                        field={product.links.detail}
                        className={theme.mobileMenu.listItemLink}
                        ariaLabel={{
                          value: product.links.detail || 'product links detail',
                        }}
                      >
                        <SvgIcon
                          icon={'cube'}
                          size="40"
                          className={theme.mobileMenu.listItemLinkIcon}
                        ></SvgIcon>
                      </LinkWrapper>
                    </li>
                  </ul>
                  <div className={theme.mobileMenu.options}>
                    <p className={theme.mobileMenu.optionsText}>Design a Different</p>
                    <ul className={theme.mobileMenu.optionsList}>
                      {options.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (option: any) => (
                          <li key={option.id} className={theme.mobileMenu.optionsListItem}>
                            <a
                              href={'#/' + option.id}
                              className={theme.mobileMenu.optionsListItemLink}
                              title={option.heading?.value}
                              aria-label={option.heading?.value}
                              onClick={(e) => {
                                e.preventDefault();
                                const urlParts = GetUrlParts(asPath);
                                globalThis.history.replaceState(
                                  null,
                                  '',
                                  `${urlParts.pathName}#/${option.id}`
                                );
                              }}
                            >
                              {option.icon && (
                                <img
                                  className={theme.mobileMenu.optionsListItemLinkImage}
                                  src={option.icon?.src}
                                  alt={option.icon?.title}
                                ></img>
                              )}
                              <Text field={option.heading}></Text>
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
                {viewModel?.attributes[attributeIndex]?.component == 'SizingAttribute' && (
                  <div className={theme.ctaSection.ctaSection}>
                    <p className={theme.ctaSection.optionsDisclaimer}>
                      *Showing height options for selected width
                    </p>
                    <p className={theme.ctaSection.optionsDisclaimer}>
                      *Installer will finalize sizing with you at a later stage
                    </p>
                  </div>
                )}
                {(() => {
                  const seenNotes = new Set<string>();
                  const allNotes: string[] = [];

                  const attrNote = viewModel?.attributes[attributeIndex]?.note;
                  if (attrNote) {
                    attrNote.split('\n').forEach((n: string) => {
                      if (n.trim()) {
                        allNotes.push(n.trim());
                      }
                    });
                  }
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  viewModel?.attributes[attributeIndex]?.groups?.forEach((group: any) => {
                    if (group?.note) {
                      group.note.split('\n').forEach((n: string) => {
                        if (n.trim()) {
                          allNotes.push(n.trim());
                        }
                      });
                    }
                  });

                  // Render only unique notes
                  return allNotes
                    .filter((note) => {
                      if (seenNotes.has(note)) {
                        return false;
                      }
                      seenNotes.add(note);
                      return true;
                    })
                    .map((note) => (
                      <div className={theme.ctaSection.ctaSection} key={note}>
                        <p className={theme.ctaSection.optionsDisclaimer}>{note}</p>
                      </div>
                    ));
                })()}
                <div className={theme.ctaSection.ctaSection + (isFinalStep() ? ' final-step' : '')}>
                  {product.text.disclaimer && (
                    <p className={theme.ctaSection.optionsDisclaimer}>
                      <Text field={product.text.disclaimer} encode={false}></Text>
                    </p>
                  )}
                </div>
                {isFinalStep() && (
                  <div className={theme.ctaSection.subMenuContainer}>
                    <span className={theme.ctaSection.sectionText}>Design a Different:</span>
                    <ul className={theme.ctaSection.subMenu}>
                      {options.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (option: any) => (
                          <li
                            className={
                              theme.ctaSection.subMenuList + theme.ctaSection.subMenuListBorder
                            }
                            key={option.id}
                          >
                            <a
                              href={'#/' + option.id}
                              className={theme.ctaSection.subMenuLink}
                              title={'Design a different ' + option.heading?.value}
                              aria-label={'Design a different ' + option.heading?.value}
                              onClick={(e) => {
                                e.preventDefault();
                                const urlParts = GetUrlParts(asPath);
                                globalThis.history.replaceState(
                                  null,
                                  '',
                                  `${urlParts.pathName}#/${option.id}`
                                );
                              }}
                            >
                              <Text field={option.heading}></Text>
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={theme.printDisplay.printDisplay}>
          <h1 className={theme.printDisplay.header}>
            <Text field={product.series}></Text> <Text field={product.category}></Text>
          </h1>
          <div className={theme.printDisplay.previews}>
            {viewModel?.interiorImage && (
              <figure className={theme.printDisplay.previewSide}>
                <img
                  src={viewModel.interiorImage.src}
                  alt={viewModel.interiorImage.alt}
                  className={theme.printDisplay.previewSideImage}
                ></img>
                <figcaption className={theme.printDisplay.figCaption}>Interior</figcaption>
              </figure>
            )}
            {viewModel?.exteriorImage && (
              <figure className={theme.printDisplay.previewSide}>
                <img
                  src={viewModel.exteriorImage.src}
                  alt={viewModel.exteriorImage.alt}
                  className={theme.printDisplay.previewSideImage}
                ></img>
                <figcaption className={theme.printDisplay.figCaption}>Exterior</figcaption>
              </figure>
            )}
          </div>
          <h2 className={theme.printDisplay.subHeader}>Summary</h2>
          <table className={theme.printDisplay.summaryTable}>
            <tbody>
              {viewModel?.selectedOptions?.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (option: any) => (
                  <tr className={theme.printDisplay.tableRow} key={option.title}>
                    <td className={theme.printDisplay.tableData + theme.printDisplay.tableAsset}>
                      {option.title}
                    </td>
                    <td
                      className={theme.printDisplay.tableData + theme.printDisplay.tableAssetValue}
                    >
                      {option.value}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  );
};
