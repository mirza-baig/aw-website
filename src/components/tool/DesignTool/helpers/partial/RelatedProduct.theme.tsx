// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type RelatedProductThemeType = {
  [key in ThemeName]: RelatedProductThemeSubType;
};

export type RelatedProductThemeSubType = {
  classes: {
    relatedProduct: string;
    row: string;
    imgSlider: string;
    imgSliderContainer: string;
    imgSlide: string;
    imgSlideImage: string;
    details: string;
    featureCallout: string;
    featureImage: string;
    featureText: string;
    title: string;
    series: string;
    category: string;
    reviewCost: string;
    review: string;
    cost: string;
    costOn: string;
    costOff: string;
    list: string;
    listItem: string;
    buttonContainer: string;
    detailsLink: string;
    secondaryLink: string;
    designLink: string;
  };
};

export const RelatedProductTheme = (): ThemeFile | RelatedProductThemeType => {
  return {
    aw: {
      classes: {
        relatedProduct: ` related-product flex flex-col bg-[#f7f7f7] border border-[#b9b9b9] m-[0_20px_20px] pt-[45px] md:mx-[10px] md:pt-[70px] lg:max-w-[600px] lg:m-[0_auto] `,
        row: `row flex flex-col mb-[20px] md:flex-row md:mb-[50px] md:grow`,
        imgSlider: `img-slider relative flex self-center md:self-start max-w-full md:basis-[50%] md:max-w-[50%] [&_.slick-dots]:m-0`,
        imgSliderContainer: `swiper-container w-full max-w-[220px] m-[0_auto] [&_.slick-active_button:before]:text-primary!`,
        imgSlide: ` md:flex md:items-center `,
        imgSlideImage: `img-zoom`,
        details: `details max-w-full grow md:basis-[50%] md:max-w-[50%] p-[20px] mt-[20px] md:mt-0`,
        featureCallout: `feature-callout flex items-center mb-[10px] uppercase`,
        featureImage: `feature-image mr-[10px]`,
        featureText: `feature-text text-[18px] leading-[1.5em] font-regular inline`,
        title: `title border-b-black border-b inline-block mb-[12px]`,
        series: `series p-[0_40px_0_0] mb-[10px] text-[22px] leading-tight font-demi`,
        category: `category mb-[7px] uppercase text-[18px] leading-[1.5em] font-regular`,
        reviewCost: `review-cost flex`,
        review: `review flex-[0_0_auto]`,
        cost: `cost text-[14px] flex-[0_0_auto]`,
        costOn: `cost-on font-bold`,
        costOff: `cost-off opacity-[0.3]`,
        list: `list list-disc font-light ml-[1em]`,
        listItem: `list-item text-[18px] leading-[1.5em] font-light`,
        buttonContainer: ` buttons flex justify-around items-center p-[0_20px_20px_20px] `,
        detailsLink: `btn first-btn gtm-click text-center uppercase w-full `,
        secondaryLink: ` secondary text-center rounded-0 m-[15px_15px_0_15px] border border-primary p-[12px_16px] text-[18px] leading-1 font-regular hover:bg-darkprimary hover:text-white uppercase bg-white text-primary md:last:mr-0 `,
        designLink: ` btn link-only last-btn gtm-click m-[15px_15px_0_15px] max-w-[400px] uppercase text-center w-full py-[12px] text-[18px] leading-1 text-primary hover:underline `,
      },
    },
    rba: {
      classes: {},
    },
  };
};
