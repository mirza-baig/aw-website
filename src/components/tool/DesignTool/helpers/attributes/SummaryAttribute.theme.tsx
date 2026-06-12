// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type SummaryAttributeThemeType = {
  [key in ThemeName]: SummaryAttributeThemeSubType;
};

export type SummaryAttributeThemeSubType = {
  classes: {
    attributeOption: string;
    earmark: string;
    summaryHeader: string;
    summaryHeaderContainer: string;
    tableWrapper: string;
    table: string;
    trow: string;
    tdAsset: string;
    tdValue: string;
    linkContainer: string;
    summaryHeaderRight: string;
    summaryHeaderMenu: string;
    summaryHeaderListItem: string;
    linkContainerRight: string;
    subMenu: string;
    subMenuListItem: string;
    subMenuShareItem: string;
    subMenuListLink: string;
    primaryLink: string;
    secondaryLink: string;
    sectionLink: string;
    favoriteContainer: string;
    favoriteLink: string;
    favoriteLinkIcon: string;
    relatedContainer: string;
    relatedHeader: string;
    designSummary: {
      container: string;
      containerHidden: string;
      closeButton: string;
      closeButtonIcon: string;
      content: string;
      header: string;
      imagesOuterContainer: string;
      imageWrapper: string;
      image: string;
      imageDescription: string;
      selections: {
        container: string;
        table: string;
        tbody: string;
        tr: string;
        tdAsset: string;
        tdAssetValue: string;
      };
    };
  };
};

export const SummaryAttributeTheme = (): ThemeFile | SummaryAttributeThemeType => {
  return {
    aw: {
      classes: {
        attributeOption: ` step-final md:mb-[60px] `,
        earmark: `before:absolute before:left-0 before:top-[3px] before:border-l-14 before:border-b-14 before:border-y-[rgba(0,0,0,0)] before:border-l-primary`,
        summaryHeader: ` attribute-options__name headline-xs md:ml-[16px] mb-[15px] pl-[20px] text-[20px] leading-none font-bold relative `,
        summaryHeaderContainer: ` flex flex-col md:flex-row `,
        tableWrapper: ` summary md:ml-[16px] `,
        table: ` summary__table w-full `,
        trow: ` `,
        tdAsset: ` summary__table-asset p-[18px_0_0_20px] md:p-[8px_20px] text-[#484848] md:table-cell font-bold text-[14px] leading-normal `,
        tdValue: ` summary__table-asset-value p-[18px_0_0_20px] md:p-[8px_20px] text-[#484848] md:table-cell text-[18px] leading-normal `,
        linkContainer: ` cta-summary-section__link-container flex flex-row pl-[20px] pt-[15px] `,
        summaryHeaderRight: ` cta-summary-section__summary-header-right md:flex flex-row md:pb-[15px] md:ml-auto`,
        summaryHeaderMenu: ` cta-summary-section__summary-header-menu flex m-0 `,
        summaryHeaderListItem: ` cta-summary-section__summary-header-list-item px-[15px] `,
        linkContainerRight: ` cta-summary-section__link-container-right flex flex-row md:pl-[15px] md:pb-[15px] items-center justify-start w-full fixed bottom-0 left-0 md:relative z-100 `,
        subMenu: ` cta-summary-section__sub-menu flex m-0 `,
        subMenuListItem: ` cta-summary-section__sub-menu-list border-r border-r-primary px-[15px] last:border-r-[rgba(0,0,0,0)] `,
        subMenuShareItem: `  cta-summary-section__sub-menu-share-item gtm-click cursor-pointer text-[18px] leading-normal flex flex-row items-center `,
        subMenuListLink: ` cta-summary-section__sub-menu-link gtm-click cursor-pointer text-[18px] leading-normal flex flex-row items-center `,
        primaryLink: ` primary w-[50%] text-center rounded-0 mr-0 border border-primary p-[12px_16px] text-[18px] leading-1 font-regular hover:bg-darkprimary hover:text-white uppercase bg-primary text-white! md:mr-[15px] md:last:mr-0`,
        secondaryLink: ` secondary w-[50%] text-center rounded-0 mr-0 border border-primary p-[12px_16px] text-[18px] leading-1 font-regular hover:bg-darkprimary hover:text-white uppercase  bg-white md:mr-[15px] md:last:mr-0 `,
        sectionLink: ` cta-section__link `,
        favoriteContainer: ` cta-summary-section__link-favorite-container flex flex-row md:pl-[35px] md:pt-[15px] `,
        favoriteLink: ` favorite-link gtm-click flex text-[18px] leading-normal cursor-pointer `,
        favoriteLinkIcon: ` text-primary inline-block my-auto mr-[6px] cursor-pointer`,
        relatedContainer: ` related mt-[20px] md:mt-[40px] `,
        relatedHeader: ` also-like text-center text-[22px] leading-tight mb-[10px] `,
        designSummary: {
          container: ` fixed top-0 left-0 w-full h-full bg-white z-10000 overflow-auto `,
          containerHidden: `hidden`,
          closeButton: ` absolute top-[10px] md:top-[20px] right-[10px] md:right-[20px] cursor-pointer w-[35px] md:w-[50px] h-[35px] md:h-[50px] text-white bg-dark-gray rounded-[50%] flex flex-row items-center `,
          closeButtonIcon: ` flex flex-col items-center w-full `,
          content: ` design-summary-content md:mr-s `,
          header: ` m-[10px_50px] md:m-[10px_75px_10px_40px] text-left text-[22px] leading-tight font-demi text-black `,
          imagesOuterContainer: ` design-summary-images flex items-center flex-wrap `,
          imageWrapper: ` design-summary-image flex flex-col flex-auto items-center text-center p-[10px] `,
          image: ` max-w-[150px] `,
          imageDescription: `  `,
          selections: {
            container: ` design-summary-selections p-[10px] `,
            table: ` design-summary-table w-full mt-[15px] md:mt-[20px] `,
            tbody: `  `,
            tr: ` odd:border-t odd:border-t-dark-gray odd:bg-white border-b border-b-dark-gray border-l border-l-dark-gray text-[16px] leading-none `,
            tdAsset: ` w-asset w-[50%] border-r border-r-dark-gray p-[7px_7px_7px_10px] md:p-[10px_10px_10px_20px] text-[16px] leading-none `,
            tdAssetValue: ` w-asset-value w-[50%] border-r border-r-dark-gray p-[7px_7px_7px_10px] md:p-[10px_10px_10px_20px] text-[16px] leading-none `,
          },
        },
      },
    },
    rba: {
      classes: {},
    },
  };
};
