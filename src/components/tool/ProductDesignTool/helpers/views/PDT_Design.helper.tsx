import { Link as Linkfield, Text } from '@sitecore-content-sdk/nextjs';
import { ButtonPrimaryClasses } from 'helpers/Button/buttons/btn--primary';
import { ButtonTertiaryClasses } from 'helpers/Button/buttons/btn--tertiary';
import { SliderWrapper } from 'helpers/SliderWrapper';
import { SliderRefType } from 'helpers/SliderWrapper/SliderWrapper';
import SvgIcon from 'helpers/SvgIcon/SvgIcon';
import { useTheme } from 'lib/context/ThemeContext';
import { useAsPath } from 'lib/hooks/use-as-path';
import { PreviewImage, RenderAttribute, useRenoworks } from 'lib/renoworks';
// Removing for temporary fix of using history: import { useRouter } from 'next/navigation';
import { MouseEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import TagManager from 'react-gtm-module';
import Slider from 'react-slick';
import { DesignToolStepName } from 'src/lib/renoworks/designtool';
import { RenoworksKeys, RenoworksProductSide } from 'src/lib/renoworks/renoworks';

import { rendererMap } from '../attributes/PDT_renderMap.helper';
import { PreviewImageThemes } from '../partial/PDT_PreviewImage.theme';
import { DesignTheme, DesignThemeSubType } from './PDT_Design.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

function getUrlParts(url: string) {
  const urlParsed = new URL(url, 'https://server');

  const pathRegex = new RegExp(/([^#?]*)(?:#\/(\d+))?(?:\?(.*))?/g);
  const matches = pathRegex.exec(urlParsed?.hash || '') ?? [];

  return {
    pathName: urlParsed?.pathname,
    attributeIndex: Number.parseInt(matches[2]) || 0,
    query: urlParsed?.search?.replace('?', ''),
  };
}

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
      <div className="relative group flex items-center px-2">
        <button
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
        {!requiredStepsCompleted && ctaTooltip && (
          <div className={getTooltipClasses()}>{ctaTooltip}</div>
        )}
      </div>
    </div>
  );
};

type ProductDesignToolProps = Sitecore.Components.Tool.ProductDesignTool.ProductDesignTool & {
  placeholder: ReactNode;
};

function RenderNavButtonElements(
  props: Readonly<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    theme: any;
    isFinalStep: () => boolean;
    themeName: string;
    previousAttribute: () => void;
    nextAttribute: () => void;
    isFirstStep: () => boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    RenderRAQElementProps: any;
  }>
) {
  const {
    theme,
    isFinalStep,
    themeName,
    previousAttribute,
    nextAttribute,
    isFirstStep,
    RenderRAQElementProps,
  } = props;
  const {
    requiredStepsCompleted,
    handlePillCTAClick,
    pillCtaText,
    ctaTooltip,
    shouldShowPill,
    showPillIcon,
  } = RenderRAQElementProps;

  return (
    <div className={theme.ctaSection.ctaSection + (isFinalStep() ? ' final-step' : ' ')}>
      <div className="flex w-full flex-col">
        {/* Top Row: Pill CTA on the right */}
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

        <div className={theme.ctaSection.navigationLinkContainer}>
          <RenderNavPrevButtonElement
            isFirstStep={isFirstStep}
            theme={theme}
            themeName={themeName}
            previousAttribute={previousAttribute}
          />
          <RenderNavNextButtonElement
            isFinalStep={isFinalStep}
            theme={theme}
            themeName={themeName}
            nextAttribute={nextAttribute}
            RenderRAQElementProps={RenderRAQElementProps}
          />
        </div>
      </div>
    </div>
  );
}

function RenderNavPrevButtonElement(props: {
  isFirstStep: () => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
  themeName: string;
  previousAttribute: () => void;
}) {
  const { isFirstStep, theme, themeName, previousAttribute } = props;

  return (
    !isFirstStep() && (
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
    )
  );
}

function RenderNavNextButtonElement(props: {
  isFinalStep: () => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
  themeName: string;
  nextAttribute: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RenderRAQElementProps: any;
}) {
  const { isFinalStep, theme, themeName, nextAttribute, RenderRAQElementProps } = props;
  return !isFinalStep() ? (
    <button
      className={
        theme.ctaSection.navigationLink +
        theme.ctaSection.navigationLinkContainerPrimaryButton +
        ButtonPrimaryClasses(themeName).btnClass
      }
      title="Move to next step"
      aria-label="Move to next step"
      onClick={nextAttribute}
    >
      Next <SvgIcon icon="arrow" size="16" className="ml-[4px]"></SvgIcon>
    </button>
  ) : (
    <RenderRAQElement {...RenderRAQElementProps} />
  );
}

function RenderRAQElement({
  props,
  shouldShowCTA,
  handleDesignRequestQuoteModalOpen,
  theme,
  themeName,
  ButtonPrimaryClasses,
  Linkfield,
  handleDesignRequestQuote,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  return props?.rendering?.placeholders['designtool-{*}'][0]?.placeholders?.['form-{*}'][0] ? (
    <button
      onClick={(e) => handleDesignRequestQuoteModalOpen(e)}
      className={
        theme.ctaSection.navigationLink +
        theme.ctaSection.navigationLinkContainerPrimaryButton +
        ButtonPrimaryClasses(themeName).btnClass
      }
      title={props.fields?.getAQuoteLink?.value?.text}
      id="request_a_quote"
    >
      {props.fields?.getAQuoteLink?.value?.text ?? 'Request A Quote'}
    </button>
  ) : (
    shouldShowCTA() && props.fields?.getAQuoteLink?.value?.href && (
      <Linkfield
        onClick={handleDesignRequestQuote}
        field={props.fields?.getAQuoteLink}
        className={
          theme.ctaSection.navigationLink +
          theme.ctaSection.navigationLinkContainerPrimaryButton +
          ButtonPrimaryClasses(themeName).btnClass
        }
      ></Linkfield>
    )
  );
}

export const Design = (props: ProductDesignToolProps) => {
  const { viewModel } = useRenoworks();
  // Removing for temporary fix of using history: const router = useRouter();
  const asPath = useAsPath();
  const { themeName, themeData } = useTheme(DesignTheme());
  const theme = (themeData as DesignThemeSubType).classes;
  const [isRAQ, setisRAQ] = useState(false);

  const [attributeIndex, setAttributeIndex] = useState<number>(0);

  const $refs = {
    mobileMenu: useRef<HTMLDivElement>(null),
    progressBarMobile: useRef<HTMLUListElement>(null),
    progressItemsMobile: useRef<HTMLLIElement>(null),
    progressBarDesktop: useRef<HTMLUListElement>(null),
    progressItemsDesktop: useRef<HTMLLIElement>(null),
    sticky: useRef<HTMLDivElement>(null),
    desktopPreview: useRef<HTMLDivElement>(null),
    desktopPreviewHeader: useRef<HTMLHeadingElement>(null),
    mobilePreview: useRef<HTMLButtonElement>(null),
    mobilePreviewHeader: useRef<HTMLHeadingElement>(null),
    sliderRef: useRef<Slider | null>(null),
    summaryModal: useRef<HTMLDivElement>(null),
  };

  const previewTheme = useTheme(PreviewImageThemes()).themeData;

  interface DataItem {
    _title: string;
    _startIndex: number;
  }

  const getStartIndex = useCallback((title: string, data: DataItem[]): number => {
    for (const item of data) {
      if (item._title === title) {
        return item._startIndex;
      }
    }

    return 0;
    // Return null if title is not found in the data
  }, []);
  const scrollTopAfterChange = useCallback(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollIntoViewHorizontally = useCallback(() => {
    const container = $refs.progressBarMobile.current;
    if (!container) {
      return;
    }
    const items = Array.from(container.querySelectorAll<HTMLLIElement>('.progress-bar--item'));

    if (!items.length || attributeIndex < 0 || attributeIndex >= items.length) {
      return;
    }

    const activeItem = items[attributeIndex];

    activeItem.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [$refs.progressBarMobile, attributeIndex]);
  const goToStep = useCallback(
    (index: number) => {
      const urlParts = getUrlParts(asPath);
      const queryPart = urlParts.query ? `?${urlParts.query}` : '';
      const newPath = `${urlParts.pathName}${queryPart}#/${index}`;

      // prepareDesignSelectionData(`Jump To Step ${index + 1}`, product, viewModel); GTM
      // Temporary fix for router.push(newPath); not working in 16.2, was router.push here
      globalThis.history.pushState(null, '', newPath);
      scrollTopAfterChange();
    },
    [
      asPath, // uses router.push and router.asPath
      scrollTopAfterChange,
    ]
  );

  useEffect(() => {
    // Let DOM paint first
    requestAnimationFrame(() => {
      scrollIntoViewHorizontally();
    });
  }, [attributeIndex, scrollIntoViewHorizontally]);

  useEffect(() => {
    if (!viewModel) {
      return;
    }

    const urlParts = getUrlParts(asPath);
    let newIndex = urlParts.attributeIndex;

    if (newIndex < 0) {
      newIndex = 0;
    }

    if (newIndex >= viewModel.attributes.length) {
      newIndex = viewModel.attributes.length - 1;
    }

    setAttributeIndex(newIndex);

    const SummaryIndex = getStartIndex('Summary', viewModel.progressBar || []);

    const getRAQurl = asPath;
    const fragmentIndex = getRAQurl.indexOf('#'); // Get the index of the "#" character
    const fragment = fragmentIndex !== -1 ? getRAQurl.substring(fragmentIndex) : ''; // Extract the fragment if present

    if (fragment == '#request_a_quote') {
      goToStep(SummaryIndex);
      setisRAQ(true);
    }
  }, [asPath, viewModel, getStartIndex, goToStep]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max

    const attemptOpen = () => {
      attempts++;
      const SummaryIndex = getStartIndex('Summary', viewModel?.progressBar || []);
      const onSummaryStep = attributeIndex === SummaryIndex;
      const hasModalOrButton =
        !!$refs.summaryModal.current || !!document.getElementById('request_a_quote');

      if (!isRAQ) {
        return;
      }

      if (onSummaryStep && hasModalOrButton) {
        // Try calling the function directly first
        handleDesignRequestQuoteModalOpen();

        // Fallback: search for button and click it to be extra sure
        const btn = document.getElementById('request_a_quote');
        if (btn) {
          btn.click();
        }

        setisRAQ(false);
      } else if (attempts < maxAttempts) {
        timeoutId = setTimeout(attemptOpen, 100);
      } else {
        console.warn('[RAQ] Timeout waiting for summary step components');
        setisRAQ(false);
      }
    };

    if (isRAQ) {
      attemptOpen();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRAQ, attributeIndex, viewModel]);

  const hasRAQPlaceholder =
    !!props?.rendering?.placeholders?.['designtool-{*}']?.[0]?.placeholders?.['form-{*}']?.[0];

  const requiredStepTitles = new Set<string>([
    'Sizing',
    'Panels',
    'Profile',
    'Interior',
    'Exterior',
    'Glass',
  ]);

  const lastRequiredStepIndex =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    viewModel?.progressBar?.reduce((maxIndex: number, item: any) => {
      if (requiredStepTitles.has(item?.title)) {
        return Math.max(maxIndex, item.startIndex);
      }
      return maxIndex;
    }, -1) ?? -1;

  const requiredStepsCompleted =
    lastRequiredStepIndex === -1 || attributeIndex >= lastRequiredStepIndex;

  const pillCtaText = props.fields?.skipCtaText?.value?.trim() || undefined;
  const ctaTooltip = props.fields?.ctaToolTip?.value;

  const skipCtaSelect = props.fields?.skipCtaSelect?.value || undefined;
  const ctaDestination = skipCtaSelect === 'Summary' ? 'Summary' : 'Raq';
  const shouldShowPill = !!skipCtaSelect;
  const showPillIcon = ctaDestination !== 'Raq';
  // Summary Step CTA — new authorable field; independent of skip-ahead pill
  const summaryCtaText = props?.fields?.summaryCtaText?.value || undefined;

  const handlePillCTAClick = (e: React.MouseEvent) => {
    if (!requiredStepsCompleted) {
      e?.preventDefault();
      return;
    }

    const SummaryIndex = getStartIndex('Summary', viewModel?.progressBar || []);

    if (ctaDestination === 'Raq' && hasRAQPlaceholder) {
      // Jump to summary step and let setisRAQ handle the modal trigger
      setisRAQ(true);
      goToStep(SummaryIndex);
    } else {
      // Default: skip to summary only (or RAQ via link)
      if (ctaDestination === 'Raq' && !hasRAQPlaceholder) {
        handleDesignRequestQuote();
        if (props.fields?.getAQuoteLink?.value?.href) {
          globalThis.location.href = props.fields.getAQuoteLink.value.href;
          return;
        }
      }
      goToStep(SummaryIndex);
    }
  };

  // Summary Step CTA click — user is already on the summary step so no step guard needed
  const handleSummaryPillCTAClick = (e: React.MouseEvent) => {
    e?.preventDefault();
    if (hasRAQPlaceholder) {
      handleDesignRequestQuoteModalOpen();
    } else {
      handleDesignRequestQuote();
      if (props.fields?.getAQuoteLink?.value?.href) {
        globalThis.location.href = props.fields.getAQuoteLink.value.href;
      }
    }
  };

  if (!viewModel) {
    return null;
  }

  const isFirstStep = () => {
    return (attributeIndex || 0) === 0;
  };

  const isFinalStep = () => {
    return attributeIndex === (viewModel.attributes.length || 0) - 1;
  };

  const isBrandHardwareStep = () => {
    const brandProgressBarLength = viewModel?.brandProgressBar?.length || 0;

    const returnValue =
      (brandProgressBarLength > 0 &&
        attributeIndex >= viewModel?.brandProgressBar[0]?.startIndex &&
        attributeIndex <= viewModel?.brandProgressBar[brandProgressBarLength - 1]?.startIndex) ||
      false;
    return returnValue;
  };

  const previousAttribute = () => {
    goToStep(attributeIndex - 1);
    scrollTopAfterChange();
  };

  const nextAttribute = () => {
    goToStep(attributeIndex + 1);
    scrollTopAfterChange();
  };

  const resetDesign = () => {
    const urlParts = getUrlParts(asPath);
    const newPath = `${urlParts.pathName}#/0`;

    // Temporary fix for router.replace(newPath, { scroll: false }); not working in 16.2
    globalThis.history.replaceState(null, '', newPath);
    scrollTopAfterChange();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attributeOptionGroupSelected = (optionGroup: any) => {
    updateSettings(optionGroup.productSettingChanges);
    updateVisibleImage(optionGroup.imageSide);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateSettings = (changes: any) => {
    const urlParts = getUrlParts(asPath);
    const updatedProductSettingValues = viewModel.renoworksResult.productSettingValues.clone();
    for (const change of changes) {
      change.apply(updatedProductSettingValues);
    }

    const queryString = updatedProductSettingValues.toURLQueryString();

    const newPath = `${urlParts.pathName}?${queryString}#/${attributeIndex}`;

    // Temporary fix for router.replace(newPath, undefined); not working in 16.2
    globalThis.history.replaceState(null, '', newPath);
    scrollTopAfterChange();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const attributeOptionSelected = (option: any) => {
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

  // Swiper Start
  const pagingText = isBrandHardwareStep() ? ['Closeup', 'Interior'] : ['Interior', 'Exterior'];
  const renderCustomPaging = (index: number) => {
    return <a className={theme.desktopPreview.swiperPaginationLink}>{pagingText[index]}</a>;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const appendDots = (dots: any[]) => {
    return (
      <div>
        <ul
          className={`${theme.desktopPreview.swiperPaginationContainer} ${
            theme.desktopPreview.swiperPaginationActive
          } ${
            dots[0]?.props?.className?.includes('slick-active')
              ? theme.desktopPreview.swiperPaginationActiveFirst
              : theme.desktopPreview.swiperPaginationActiveSecond
          }`}
        >
          {dots.map((item, index) => {
            return (
              <li
                className={`${item?.props?.className} ${theme.desktopPreview.swiperPaginationBullet}`}
                key={`${item?.key}-${index}`}
              >
                {item.props.children}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  const sliderSettings = {
    infinite: false,
    className: theme.desktopPreview.swiper + theme.desktopPreview.sticky,
    prevArrow: undefined,
    nextArrow: undefined,
    appendDots: appendDots,
    dotsClass: ``,
    customPaging: renderCustomPaging,
  };

  // Swiper End
  const getHeaders = (renoworksKey: string, productSide: number) => {
    switch (renoworksKey) {
      case DesignToolStepName.Sizing:
        return {
          heading: "Let's get started",
          subheading: 'Start by choosing your size',
        };
      case RenoworksKeys.FrameColor.name:
        switch (productSide) {
          case RenoworksProductSide.Interior:
            return {
              heading: 'Start adding design touches',
              subheading: 'Choose a painted option or a natural pine interior',
            };
          case RenoworksProductSide.Exterior:
            return {
              heading: 'Almost there',
              subheading: 'Now, choose the options for your window',
            };
          default:
            return {
              heading: '',
              subheading: '',
            };
        }
      case RenoworksKeys.HardwareOptions.name:
        return {
          heading: 'Up next: Hardware',
          subheading: 'Choose your favorite hardware style and finish',
        };
      case RenoworksKeys.GrilleStyle.name:
        return {
          heading: 'Next, grilles',
          subheading: 'Choose a grille pattern or no grilles at all',
        };
      case RenoworksKeys.ExteriorTrimProfile.name:
        return {
          heading: 'One last exterior choice',
          subheading: 'Select an exterior trim option and color or no trim at all',
        };
      case RenoworksKeys.GlassOptions.name:
        return {
          heading: 'Final step',
          subheading: 'Select a glass option',
        };
      case DesignToolStepName.Summary:
        return {
          heading: 'Excellent choice',
          subheading: 'We like your style',
        };
      default:
        return {};
    }
  };

  const headers = getHeaders(
    viewModel?.attributes[attributeIndex]?.renoworksKeyName,
    viewModel?.attributes[attributeIndex]?.productSide
  );

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

  function handleDesignRequestQuoteModalOpen(
    e?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) {
    e?.preventDefault();

    const _selections = viewModel?._selectedOptions.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (accumulator: any, currentValue: any) => {
        accumulator[currentValue.title] = currentValue.value;
        return accumulator;
      },
      {}
    );

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
  }

  const optionalTitles = new Set<string>(['Hardware', 'Grilles', 'Blinds', 'Trim']);

  const isOptionalStep = (title: string): boolean => optionalTitles.has(title);
  return (
    <div className={theme.stepDesign}>
      <div className={theme.stepContainer}>
        <div className={`${theme.stepWrapper} ${isFinalStep() ? 'max-md:pt-[20px]' : ''}`}>
          <div className={theme.stepRow}>
            <div className={theme.imgSlider}>
              <div className={theme.mobileHeader}>
                {headers?.heading && <h2 className={theme.stepHeading}>{headers.heading}</h2>}
                {headers?.subheading && <h3 className={theme.stepSubhead}>{headers.subheading}</h3>}
                <button
                  className={theme.attributes.attributeMenuLink}
                  title={'Clear My Choices'}
                  aria-label={'Clear My Choices'}
                  onClick={() => {
                    resetDesign();
                  }}
                >
                  Clear My Choices{' '}
                  <SvgIcon icon="close" size="16" className="inline-block align-middle"></SvgIcon>
                </button>
              </div>
              <ul
                className={theme.progressBar + theme.progressBarMobile}
                ref={$refs.progressBarMobile}
                id="progressBarMobile"
              >
                {viewModel.progressBar?.map(
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
                        key={`${progressBarItem?.title}-${index}`}
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
              {!isFinalStep() && shouldShowPill && (
                <div className="relative flex md:hidden items-center justify-center w-full mb-4 mt-[10px]">
                  <PillCTA
                    handlePillCTAClick={handlePillCTAClick}
                    theme={theme}
                    requiredStepsCompleted={requiredStepsCompleted}
                    pillCtaText={pillCtaText}
                    centerButton={true}
                    ctaTooltip={ctaTooltip}
                    tooltipPosition="bottom"
                    showIcon={showPillIcon}
                  />
                </div>
              )}
              {isFinalStep() && !!summaryCtaText && (
                <div className="relative flex md:hidden items-center justify-center w-full mb-4 mt-2.5">
                  <PillCTA
                    handlePillCTAClick={handleSummaryPillCTAClick}
                    theme={theme}
                    requiredStepsCompleted={true}
                    pillCtaText={summaryCtaText}
                    centerButton={true}
                    ctaTooltip={''}
                    tooltipPosition="bottom"
                    showIcon={false}
                  />
                </div>
              )}
              <div
                className={`${theme.desktopPreview.wrapper} ${theme.desktopPreview.wrapperBackground}`}
                ref={$refs.desktopPreview}
              >
                <div
                  className={theme.desktopPreview.swiperWrapper + theme.desktopPreview.sticky}
                  ref={$refs.sticky}
                >
                  {viewModel?.interiorImage && viewModel?.exteriorImage ? (
                    <div className={theme.desktopPreview.swiperContainer}>
                      <SliderWrapper
                        sliderSettings={sliderSettings}
                        theme={themeName}
                        sliderRef={$refs.sliderRef as SliderRefType}
                      >
                        <div className={theme.desktopPreview.previewImageWrapper}>
                          <PreviewImage
                            theme={previewTheme}
                            className={theme.desktopPreview.previewImage}
                            src={viewModel?.interiorImage.src}
                            alt={viewModel?.interiorImage.alt}
                            isBrandHWCloseupImage={isBrandHardwareStep()}
                          ></PreviewImage>
                        </div>
                        <div className={theme.desktopPreview.previewImageWrapper}>
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
                    <div className={theme.desktopPreview.swiperContainer}>
                      {viewModel?.interiorImage ? (
                        <div className={theme.desktopPreview.previewImageWrapper}>
                          <PreviewImage
                            theme={previewTheme}
                            className={theme.desktopPreview.previewImage}
                            src={viewModel?.interiorImage.src}
                            alt={viewModel?.interiorImage.alt}
                          ></PreviewImage>
                        </div>
                      ) : (
                        viewModel?.exteriorImage && (
                          <div className={theme.desktopPreview.previewImageWrapper}>
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
                </div>
              </div>
            </div>
            <div className={theme.attributes.attributes}>
              <div className={theme.attributes.attributesSection}>
                {(headers?.heading || headers?.subheading || shouldShowCTA()) && (
                  <div className={theme.headerDesktop}>
                    {headers?.heading && <h2 className={theme.stepHeading}>{headers.heading}</h2>}
                    {headers?.subheading && (
                      <h3 className={theme.stepSubhead}>{headers.subheading}</h3>
                    )}
                  </div>
                )}
                <ul className={theme.attributes.attributeMenuList}>
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
              </div>
              <ul
                className={theme.progressBar + theme.progressBarDesktop}
                ref={$refs.progressBarDesktop}
              >
                {viewModel.progressBar?.map(
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
                      <li
                        className={theme.progressBarItem}
                        key={`${progressBarItem?.title}-${index}`}
                        ref={$refs.progressItemsDesktop}
                      >
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
                              ' h-[40px] md:h-[60px] flex flex-col justify-start items-center'
                            }
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
              {!isFinalStep() && shouldShowPill && (
                <div className="relative hidden md:flex items-center justify-center w-full mb-6 pt-[10px] mt-[15px]">
                  <div className="absolute w-full h-[2px] bg-[#D8D8D8] top-1/2 -translate-y-1/2 z-0"></div>
                  <div className="relative z-10 px-4">
                    <PillCTA
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
                </div>
              )}
              {isFinalStep() && !!summaryCtaText && (
                <div className="relative hidden md:flex items-center justify-center w-full mb-6 pt-2.5 mt-3.75">
                  <div className="absolute w-full h-0.5 bg-[#D8D8D8] top-1/2 -translate-y-1/2 z-0"></div>
                  <div className="relative z-10 px-4">
                    <PillCTA
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
                </div>
              )}
              {isBrandHardwareStep() && (
                <div className="mt-8">
                  {viewModel?.brandProgressBar?.map(
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
              <RenderAttribute
                props={props}
                rendererMap={rendererMap}
                viewModel={viewModel.attributes[attributeIndex]}
                selectedOptions={viewModel.selectedOptions}
                onUpdateOption={attributeOptionSelected}
                onUpdateOptionGroup={attributeOptionGroupSelected}
                attributeIndex={attributeIndex}
                maxAttributeIndex={viewModel?.attributes?.length || 20}
                modalRef={$refs.summaryModal}
                placeholder={props.placeholder}
              ></RenderAttribute>
              <div className={theme.ctaSection.ctaSection + (isFinalStep() ? ' final-step' : '')}>
                {props.fields?.disclaimerText && (
                  <p className={theme.ctaSection.optionsDisclaimer}>
                    <Text field={props.fields?.disclaimerText} encode={false}></Text>
                  </p>
                )}
              </div>
              <RenderNavButtonElements
                theme={theme}
                isFinalStep={isFinalStep}
                themeName={themeName}
                previousAttribute={previousAttribute}
                isFirstStep={isFirstStep}
                nextAttribute={nextAttribute}
                RenderRAQElementProps={{
                  props,
                  shouldShowCTA,
                  handleDesignRequestQuoteModalOpen,
                  theme,
                  themeName,
                  ButtonPrimaryClasses,
                  Linkfield,
                  handleDesignRequestQuote,
                  handlePillCTAClick,
                  requiredStepsCompleted,
                  pillCtaText,
                  ctaTooltip,
                  shouldShowPill,
                  showPillIcon,
                  summaryCtaText,
                  handleSummaryPillCTAClick,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className={theme.printDisplay.printDisplay}>
        <h1 className={theme.printDisplay.header}>
          {props.fields?.product?.fields?.productFullName && (
            <Text field={props.fields?.product?.fields?.productFullName} />
          )}
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
              (option: any, index: number) => (
                <tr className={theme.printDisplay.tableRow} key={`${option?.title}-${index}`}>
                  <td className={theme.printDisplay.tableData + theme.printDisplay.tableAsset}>
                    {option.title}
                  </td>
                  <td className={theme.printDisplay.tableData + theme.printDisplay.tableAssetValue}>
                    {option.value}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
