// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type ProductThemeType = {
  [key in ThemeName]: ProductThemeSubType;
};

export type ProductThemeSubType = {
  classes: {
    product: string;
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
    bullet: string;
    cost: string;
    costOn: string;
    costOff: string;
    list: string;
    listItem: string;
    routerLink: string;
    imgSliderMobile: string;
    buttonContainer: string;
    button: string;
  };
};

export const ProductTheme = (): ThemeFile | ProductThemeType => {
  return {
    aw: {
      classes: {
        product: `product bg-light-gray border border-[gray] flex grow flex-col m-[0_20px_20px] pt-[45px] relative md:ml-[10px] md:mr-[10px] pt-[70px] lg:pt-[20px] md:pt-[20px] sm:pt-0 ml:ml-[5px] ml:mr-[5px] lg:basis-[48%] lg:max-w-[48%]`,
        row: `row flex flex-col sm:flex-col-reverse mb-[20px] md:flex-row md:mb-[20px] md:grow`,
        imgSlider: `img-slider relative flex self-center md:self-start max-w-full md:basis-[45%] md:max-w-[50%] p-[20px] hidden md:block`,
        imgSliderMobile: `img-slider relative block flex max-w-full self-center p-[20px] md:hidden md:max-w-[50%] md:basis-[45%] md:self-start`,
        imgSliderContainer: `swiper-container w-full max-w-[220px] m-[0_auto] [&_.slick-active_button:before]:text-primary!`,
        imgSlide: `md:h-[250px] md:flex md:items-center`,
        imgSlideImage: `img-zoom`,
        details: `details max-w-full grow md:basis-[50%] md:max-w-[50%] p-[20px] mt-[20px] md:mt-0 p-20px justify-items-center md:justify-items-start`,
        featureCallout: `feature-callout flex items-center mb-[10px] uppercase  sm:w-[204px] md:justify-self-start`,
        featureImage: `feature-image mr-[10px]`,
        featureText: `feature-text text-[18px] leading-[1.5em] font-regular inline`,
        title: ` w-min title border-b-black border-b inline-block mb-[12px]`,
        series: `series p-[0_40px_0_0] mb-[10px] text-[22px] leading-tight font-demi`,
        category: `category mb-[7px] uppercase text-[18px] leading-[1.5em] font-regular`,
        reviewCost: `review-cost flex`,
        review: `review flex-[0_0_auto]`,
        bullet: `bullet text-[20px] font-bold leading-[0.7] p-[0_10px]`,
        cost: `cost text-[14px] flex-[0_0_auto] mt-[3px]`,
        costOn: `cost-on font-bold`,
        costOff: `cost-off opacity-[0.3]`,
        list: `list list-disc font-light ml-[1em] pb-[20px] justify-self-center lg:justify-self-start`,
        listItem: `list-item text-[18px] leading-[1.5em] font-light`,
        routerLink: `btn primary last-btn gtm-click text-center uppercase w-full p-[12px_16px] border-[1px_solid_primary] bg-primary hover:bg-darkprimary hover:border-[1px_solid_darkprimary] text-white`,
        buttonContainer: 'justify-self-center md:justify-self-start',
        button:
          'inline-block rounded-full border-3 border-orange-500 px-6 py-2 text-base font-bold text-black hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-300',
      },
    },
    rba: {
      classes: {},
    },
  };
};
