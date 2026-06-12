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
    headerWrapper: string;
    tableWrapper: string;
    table: string;
    trow: string;
    tdAsset: string;
    tdValue: string;
    linkContainer: string;
    linkContainerLeft: string;
    linkContainerRight: string;
    subMenu: string;
    subMenuListItem: string;
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
        attributeOption: ` step-final `,
        earmark: `before:absolute before:left-0 before:top-[3px] before:border-l-14 before:border-b-14 before:border-y-[rgba(0,0,0,0)] before:border-l-primary`,
        summaryHeader: ` attribute-options__name headline-xs mb-[15px] pl-[20px] text-[20px] leading-none font-bold relative `,
        headerWrapper: `flex flex-col md:flex-row`,
        tableWrapper: ` summary p-[20px_0] border-b border-b-black `,
        table: ` summary__table w-full `,
        trow: ` mt-[16px] flex flex-row `,
        tdAsset: ` summary__table-asset text-[#484848] block md:table-cell font-bold text-[14px] leading-normal max-w-[160px] basis-1/2 `,
        tdValue: ` summary__table-asset-value text-[#484848] block md:table-cell text-[18px] leading-normal max-w-[160px] basis-1/2 `,
        linkContainer: ` cta-summary-section__link-container flex flex-row md:ml-auto `,
        linkContainerLeft: ` cta-summary-section__link-container-left md:flex flex-row justify-start md:mb-[15px] md:ml-auto`,
        linkContainerRight: ` cta-summary-section__link-container-right flex flex-row md:pl-[15px] md:pb-[15px] items-center justify-start w-full fixed bottom-0 left-0 md:relative z-100 `,
        subMenu: ` cta-summary-section__sub-menu flex `,
        subMenuListItem: ` cta-summary-section__sub-menu-list ml-[16px] first:ml-0 `,
        subMenuListLink: ` cta-summary-section__sub-menu-link gtm-click cursor-pointer text-[18px] leading-normal flex flex-row items-center `,
        primaryLink: ` primary w-[50%] text-center rounded-0 mr-0 border border-primary p-[12px_16px] text-[18px] leading-1 font-regular hover:bg-darkprimary hover:text-white uppercase bg-primary text-white! md:mr-[15px] md:last:mr-0`,
        secondaryLink: ` secondary w-[50%] text-center rounded-0 mr-0 border border-primary p-[12px_16px] text-[18px] leading-1 font-regular hover:bg-darkprimary hover:text-white uppercase  bg-white text-primary md:mr-[15px] md:last:mr-0 `,
        sectionLink: ` cta-section__link `,
        favoriteContainer: ` cta-summary-section__link-favorite-container flex flex-row -order-1 max-md:absolute max-md:top-[10px]`,
        favoriteLink: ` favorite-link gtm-click text-[16px] leading-normal flex flex-row items-center cursor-pointer `,
        favoriteLinkIcon: ` inline-block my-auto mr-[6px] cursor-pointer`,
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
