// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type DesignThemeType = {
  [key in ThemeName]: DesignThemeSubType;
};

export type DesignThemeSubType = {
  classes: {
    stepDesign: string;
    stepContainer: string;
    stepHeading: string;
    stepSubhead: string;
    headerMobile: string;
    headerDesktop: string;
    stepWrapper: string;
    stepRow: string;
    hideMobile: string;
    hide: string;
    mobileHeader: string;
    imgSlider: string;
    progressBar: string;
    progressBarMobile: string;
    progressBarDesktop: string;
    progressBarItem: string;
    progressBarItemMobile: string;
    progressBarButton: string;
    progressBarName: string;
    progressBarStep: string;
    progressBarStepLine: string;
    progressBarUnfinished: string;
    progressBarDone: string;
    progressBarActive: string;
    progressBarSummary: string;
    progressBarSummaryMobile: string;
    progressBarOptional: string;
    progressBarRequired: string;
    progressBarOptionalMobile: string;
    progressBarRequiredMobile: string;
    tabButton: string;
    tabActive: string;
    tabInactive: string;
    mobilePreview: {
      button: string;
      buttonHeader: string;
    };
    desktopPreview: {
      wrapper: string;
      wrapperBackground: string;
      swiperWrapper: string;
      sticky: string;
      swiperClose: string;
      swiperCloseIcon: string;
      seriesHeader: string;
      swiper: string;
      swiperPaginationContainer: string;
      swiperPaginationActive: string;
      swiperPaginationActiveFirst: string;
      swiperPaginationActiveSecond: string;
      swiperPaginationBullet: string;
      swiperPaginationLink: string;
      image: string;
      swiperContainer: string;
      previewImageWrapper: string;
      previewImage: string;
      zoom: string;
      zoomIcon: string;
      mobileZoom: string;
      mobileZoomIcon: string;
      arrowUp: string;
      arrowUpIcon: string;
      arrowUpIconRotateUp: string;
      arrowUpIconRotateDown: string;
    };
    zoomedPreview: {
      swiperWrapper: string;
      swiperPaginationContainer: string;
      seriesHeader: string;
      closeIcon: string;
      swiperContainer: string;
      previewImageWrapper: string;
      previewImage: string;
    };
    attributes: {
      attributes: string;
      attributeMenuList: string;
      attributeMenuListItem: string;
      attributeMenuLink: string;
      attributesSection: string;
    };
    ctaSection: {
      ctaSection: string;
      mobileMenuButton: string;
      mobileMenuButtonIcon: string;
      navigationLinkContainer: string;
      navigationLink: string;
      navigationLinkContainerPrimaryButton: string;
      navigationLinkContainerSecondaryButton: string;
      subMenuContainer: string;
      subMenuContainerFinal: string;
      subMenu: string;
      subMenuFinal: string;
      subMenuList: string;
      subMenuListBorder: string;
      subMenuLink: string;
      sectionText: string;
      subMenuLinkImage: string;
      optionsDisclaimer: string;
      pillCTA: string;
      pillCTAActive: string;
      pillCTAInactive: string;
      pillCTATooltip: string;
    };
    mobileMenu: {
      mobileMenu: string;
      closeButton: string;
      closeButtonIcon: string;
      list: string;
      listItem: string;
      listItemLink: string;
      listItemLinkIcon: string;
      listItemStartOver: string;
      listItemStartOverIcon: string;
      options: string;
      optionsText: string;
      optionsList: string;
      optionsListItem: string;
      optionsListItemLink: string;
      optionsListItemLinkImage: string;
    };
    stepCopy: string;
    stepWrapperOptions: string;
    stepWrapperProducts: string;
    mobileResetBtn: string;
    mobileResetBtnIcon: string;
    printDisplay: {
      printDisplay: string;
      header: string;
      previews: string;
      previewSide: string;
      previewSideImage: string;
      figCaption: string;
      subHeader: string;
      summaryTable: string;
      tableRow: string;
      tableData: string;
      tableAsset: string;
      tableAssetValue: string;
    };
    designSummary: {
      containerHidden: string;
    };
  };
};

export const DesignTheme = (): ThemeFile | DesignThemeType => {
  return {
    aw: {
      classes: {
        stepDesign: `step-design py-[30px] px-0 col-span-12 font-futura-pt`,
        stepContainer: `step-container print:hidden m-[0_auto] p-0 relative md:p-[0_40px] md:min-h-auto`,
        stepHeading: `step-heading text-[20px] font-bold md:text-[24px] leading-none`,
        stepSubhead: `step-subhead text-[16px] leading-tight`,
        headerMobile: ``,
        headerDesktop: `max-md:hidden grow`,
        stepWrapper: `step-wrapper `,
        stepRow: `step-row flex flex-col md:flex-row md:flex-wrap`,
        hideMobile: ` max-md:hidden `,
        hide: ` invisible h-0 overflow-hidden md:h-auto md:overflow-visible md:visible `,
        mobileHeader: `md:hidden w-full p-[1em_0]`,
        imgSlider: `img-slider flex flex-col w-full md:shrink-0 md:w-[60%] pb-[18px] md:flex-[0_0_40%] md:min-w-[40%] md:pb-0 md:pr-[20px] `,
        progressBar: ` progress-bar list-none flex z-1 m-[0_0_20px_0] py-[8px] overflow-x-auto relative xl:overflow-x-visible border-y border-y-black
        touch-pan-x
        [-webkit-overflow-scrolling:touch] `,
        progressBarMobile: ` progress-bar--mobile md:hidden m-[0_0_20px] pl-0`,
        progressBarDesktop: ` progress-bar--desktop hidden md:flex md:mb-0 w-full `,
        progressBarItem: `progress-bar--item text-center relative max-w-[30%] flex flex-col items-center xl:max-w-auto xl:flex-1 xl:z-auto first:[& progress-bar__step]:before:hidden pb-[16px]

/* connector */
  after:content-['']
  after:absolute
  after:top-[80%]
  after:h-[2px]
  after:bg-gray-300
  after:z-0

  /* default: full width */
  after:left-0
  after:right-0

  /* first step: only to the right */
  first:after:left-1/2

  /* last step: only to the left */
  last:after:right-1/2
`,
        progressBarItemMobile: `progress-bar--item text-center relative max-w-[30%] flex flex-[0_0_30%] flex-col items-center xl:max-w-auto xl:flex-1 xl:z-auto first:[& progress-bar__step]:before:hidden
        mb-[8px]
    /* connector */
  after:content-['']
  after:absolute
  after:top-[90%]
  after:h-[2px]
  after:bg-gray-300
  after:z-0

  /* default: full width */
  after:left-0
  after:right-0

  /* first step: only to the right */
  first:after:left-1/2

  /* last step: only to the left */
  last:after:right-1/2
`,
        progressBarButton: `progress-bar__button cursor-pointer outline-none p-[1px_6px]`,
        progressBarName: `progress-bar__name block text-center mb-[5px] text-[14px] text-gray grow lg:text-[18px] [&.done]:text-black min-w-[60px]`,
        progressBarStep: `
  progress-bar__step
  relative

  inline-flex
  items-center
  justify-center
  -translate-x-1/2
  -translate-y-1/2

  aspect-square
  rounded-full
  bg-gray-300
  z-20

  flex items-center justify-center
`,
        progressBarStepLine: `
  relative

  before:content-['']
  before:absolute
  before:h-[2px]
  before:w-[200%]
  before:left-[-100%]
  before:top-[50%]
  before:bg-gray-300
  before:z-10
`,
        progressBarUnfinished: `  `,
        progressBarDone: ` bg-primary before:bg-gray `,
        // NEW utility classes (used dynamically)
        progressBarActive: `bg-orange-500`,
        progressBarSummary: `
  w-[15px]
  h-[15px]
  after:hidden
  left-[12%]
  top-[38px]
`,
        progressBarSummaryMobile: `
  w-[15px]
  h-[15px]
  after:hidden
  left-[12%]
  top-[25px]
`,
        progressBarRequired: `
  w-[33px]
  h-[33px]
  after:text-[12px]
  left-[34%]
  top-[26px]
`,
        progressBarOptional: `
  w-[15px]
  h-[15px]
  after:hidden
  left-[15%]
  top-[27px]
`,
        progressBarRequiredMobile: `
  w-[33px]
  h-[33px]
  after:text-[12px]
  left-[20px]
  top-[25px]
`,
        progressBarOptionalMobile: `
  w-[15px]
  h-[15px]
  after:hidden
  left-[20%]
  top-[25px]
`,
        tabButton: ` attribute-options--tabbed__tab-btn cursor-pointer text-[#484848] uppercase h-[30px] mx-[10px] border-b-4 md:ml-0 font-light mb-[15px] md:mr-[30px] px-[6px] text-[14px] md:text-[18px] `,
        tabActive: ` attribute-options--tabbed__tab-btn-active border-b-primary `,
        tabInactive: ` attribute-options--tabbed__tab-btn-inactive border-b-[rgba(0,0,0,0)] `,
        mobilePreview: {
          button: ` preview-btn block md:hidden text-[15px] items-center bg-none border-none cursor-pointer flex justify-end outline-none uppercase px-[6px]`,
          buttonHeader: `preview-btn__series w-full text-left font-regular text-[14px] leading-tight normal-case`,
        },
        desktopPreview: {
          wrapper: `desktop-preview-wrapper collapsible-content relative overflow-hidden`,
          wrapperBackground: `lg:before:absolute lg:before:block lg:before:w-[calc(100%+20px)] lg:before:h-[70%] lg:before:m-[-20px] lg:before:bg-light-gray lg:before:opacity-80`,
          swiperWrapper: `swiper-slider-wrapper relative md:text-center`,
          sticky: ` md:sticky before:content-[' '] before:table after:content-[' '] after:table `,
          swiperClose: `swiper-close hidden`,
          swiperCloseIcon: ``,
          seriesHeader: `series mb-[10px] font-regular text-[14px] leading-tight w-full normal-case`,
          swiper: `swiper`,
          swiperPaginationContainer: `swiper-pagination flex relative my-[20px] mx-auto max-w-[260px] rounded-[34px] border-gray border-[0.5px] w-full flex-row`,
          swiperPaginationActive: `before:transition-all before:duration-400 before:border-primary before:border-4 before:rounded-[18px] before:absolute before:bg-[rgba(0,0,0,0)] before:w-[50%] before:h-full`,
          swiperPaginationActiveFirst: `before:-left-px`,
          swiperPaginationActiveSecond: `before:left-[calc(50%+1px)]`,
          swiperPaginationBullet: ` inline-block m-[0_2%_0_0] cursor-pointer text-black text-center w-[50%] `,
          swiperPaginationLink: ` uppercase px-[7px] md:px-[10px] inline-block leading-[30px] text-[12px] text-bold h-[30px] w-full`,
          image: ``,
          swiperContainer: ` swiper-container `,
          previewImageWrapper: `w-full flex justify-center items-center md:h-[500px] md:max-w-[485px] relative md:mx-auto`,
          previewImage: `max-h-[500px] h-full w-full object-contain`,
          zoom: ` hidden md:block absolute bottom-[20px] right-[-20px] cursor-pointer `,
          zoomIcon: ``,
          mobileZoom: ` md:hidden absolute bottom-0 cursor-pointer right-auto left-[40%]`,
          mobileZoomIcon: ``,
          arrowUp: `arrow-up-icon margin-[0_0_0_auto] flex md:hidden bg-none border-none cursor-pointer absolute right-0 top-[40%] z-2`,
          arrowUpIcon: ` pl-[8px] mx-[10px] h-[40px] flex items-center `,
          arrowUpIconRotateDown: `  `,
          arrowUpIconRotateUp: ` [&>svg]:rotate-180 `,
        },
        zoomedPreview: {
          swiperWrapper: ` bg-white/98 b-0 l-0 w-full max-w-full h-full max-h-full px-[30px] pt-[60px] fixed right-0 top-0 z-100 `,
          swiperPaginationContainer: `swiper-pagination flex justify-center mt-[15px]`,
          seriesHeader: ` text-center `,
          closeIcon: ` swiper-close block absolute top-[20px] right-[20px]`,
          swiperContainer: ` swiper-container pt-[30px] `,
          previewImageWrapper: ` flex justify-center items-center h-[500px] w-full max-w-[485px] mx-auto`,
          previewImage: ` block h-auto m-[0_auto] max-w-full w-full `,
        },
        attributes: {
          attributes: `attributes flex flex-col w-full md:shrink-0 md:w-[60%] pl-0 pr-0 md:pl-[10px]`,
          attributeMenuList: `attribute-menu--list w-full flex list-style-none justify-between max-md:mx-[1em] text-[18px] ml-auto md:p-[15px_0_0_0] basis-[fit-content] `,
          attributeMenuListItem: `attribute-menu--list-item only:w-full only:text-right`,
          attributeMenuLink: `attribute-menu__link gtm-click text-dark-gray`,
          attributesSection: `attributes-sections flex flex-row items-end justify-between mb-[8px]`,
        },
        ctaSection: {
          ctaSection: `cta-section md:mr-0 md:w-full md:static order-2`,
          mobileMenuButton: `cta-section__icon block bg-none border-none m-[0_20px_20px_auto] text-right md:hidden`,
          mobileMenuButtonIcon: `mobile-menu-icon inline-block flex items-center justify-center w-[30px] h-[30px] rounded-[50%] relative text-black text-[35px] cursor-pointer shadow-[0_0_7px_0_hsla(0,0%,71.8%,.5)]`,
          navigationLinkContainer: `cta-section__link-container max-md:bg-[#001722] max-md:bg-opacity-50 max-md:p-[16px] bottom-0 left-0 max-md:fixed w-full z-100 flex flex-row`,
          navigationLink: ` cta-section__link text-center rounded-0 mr-0 p-[12px_16px] text-[18px] leading-1 font-regular bg-white `,
          navigationLinkContainerPrimaryButton: ` ml-auto `,
          navigationLinkContainerSecondaryButton: ` `,
          subMenuContainer: `cta-section__sub-menu-container hidden md:flex md:justify-end md:items-center md:border-t md:border-t-[#b9b9b9] md:mt-[20px]`,
          subMenuContainerFinal: `cta-section__sub-menu-container final flex flex-col w-full -order-2 md:order-0 md:p-[45px_0] md:border-t md:border-t-[#b9b9b9]`,
          subMenu: `cta-section__sub-menu hidden md:list-style-none md:flex md:justify-end md:p-[25px_0_40px] md:m-0`,
          subMenuFinal: `cta-section__sub-menu list-style-none flex justify-end md:p-[25px_0_0] w-full md:w-[65%] my-[18px] md:my-0 mx-auto `,
          subMenuList: `cta-section__sub-menu-list px-[15px] `,
          subMenuListBorder: ` border-r border-r-primary last:border-r-0 `,
          subMenuLink: `cta-section__sub-menu-link gtm-click flex flex-col items-center color-primary text-[18px] text-center transition-all text-primary`,
          sectionText: `cta-section__text mb-[15px] text-black inline-block text-[18px] leading-normal `,
          subMenuLinkImage: `block mb-[12px] h-[100px] overflow-hidden [&_span]:max-h-full`,
          optionsDisclaimer: `attribute-options__disclaimer text-[14px] leading-[1.2] mr-[15px] my-[15px]`,
          pillCTA: `relative inline-flex items-center justify-center px-6 py-2 rounded-full text-white font-medium transition-all duration-300 no-underline cursor-pointer`,
          pillCTAActive: `bg-orange-500 hover:bg-orange-600`,
          pillCTAInactive: `bg-[#9B9B9B] cursor-default`,
          pillCTATooltip: `absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-[#F2F2F2] text-[#484848] text-[14px] py-2 px-4 rounded shadow-lg whitespace-nowrap after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-8 after:border-transparent after:border-b-[#F2F2F2] z-50 pointer-events-none`,
        },
        mobileMenu: {
          mobileMenu: `mobile-menu animate-[slideInFromLeft_.8s_ease-in-out] hidden fixed top-0 right-0 bottom-0 left-0 overflow-y-scroll bg-white/98 z-100 w-full`,
          closeButton: `close-icon absolute right-0 bg-none border-0 cursor-pointer m-[20px_20px_0_auto]`,
          closeButtonIcon: `fal fa-times`,
          list: `mobile-menu__list list-style-none ml-0 flex flex-col items-center my-[120px]`,
          listItem: `mobile-menu__list-item mb-[40px] text-primary text-[18px] uppercase`,
          listItemLink: ` mobile-menu__list-item-link gtm-click flex justify-between items-center `,
          listItemLinkIcon: ` mobile-menu__list-item-link-icon pr-[12px] text-[25px] align-middle -order-1 `,
          listItemStartOver: `mobile-menu__list-item-start-over gtm-click`,
          listItemStartOverIcon: `fal fa-redo`,
          options: `mobile-menu__options max-w-[300px] m-[0_auto]`,
          optionsText: `mobile-menu__options-text text-black text-[18px] text-center`,
          optionsList: `mobile-menu__options-list list-style-none ml-0 flex justify-between my-[40px]`,
          optionsListItem: ``,
          optionsListItemLink: `mobile-menu__options-list-link gtm-click flex flex-col text-center items-center text-black text-[14px] uppercase max-w-[60px] transition-all`,
          optionsListItemLinkImage: ` mobile-menu__options-link-image m-[0_auto_12px_auto] `,
        },
        stepCopy: `step-copy`,
        stepWrapperOptions: `step-wrapper-options`,
        stepWrapperProducts: `step-wrapper-products`,
        mobileResetBtn: `mobile-reset--btn`,
        mobileResetBtnIcon: ``,
        printDisplay: {
          printDisplay: `print-display hidden print:block print:pt-[40px] m-[0_auto] w-[90%]`,
          header: ` text-[34px] leading-tight font-bold mb-[12px] uppercase `,
          previews: `previews flex justify-center`,
          previewSide: `preview-side p-[20px] w-full`,
          previewSideImage: `preview-image block h-auto m-[0_auto] max-h-[25vh] max-w-full`,
          figCaption: `figcaption text-[18px] p-[10px] text-center`,
          subHeader: ` text-[34px] leading-tight mb-[12px] `,
          summaryTable: ` summary__table w-full `,
          tableRow: ` odd:bg-light-gray odd:border-t-[#ccc] odd:border-t odd:border-b-[#ccc] odd:border-b first:border-t-[#aaa] last:border-b-[#aaa] `,
          tableData: ` p-[5px_20px] `,
          tableAsset: ` summary__table-asset text-[14px] font-bold `,
          tableAssetValue: ` summary__table-asset-value text-[18px] `,
        },
        designSummary: {
          containerHidden: `hidden`,
        },
      },
    },
    rba: {
      classes: {},
    },
  };
};
