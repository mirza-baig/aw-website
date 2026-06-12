// Lib
import { ThemeFile, ThemeName } from 'lib/context/ThemeContext';

type BouncyCardThemeType = {
  [key in ThemeName]: BouncyCardThemeSubType;
};

export type BouncyCardThemeSubType = {
  classes: {
    optionMain: string;
    optionBtn: string;
    optionTop: string;
    optionImgWrapper: string;
    optionImage: string;
    optionHeading: string;
    optionBottom: string;
    optionHelp: string;
    optionCta: string;
    help: {
      helpContainer: string;
      helpOverlay: string;
      helpWrapper: string;
      helpContent: string;
      closeWrapper: string;
      closeButton: string;
      closeButtonIcon: string;
      mobileDisplay: {
        mobileDisplay: string;
        richTextContent: string;
        carousel: string;
        carouselImageWrapper: string;
        carouselImage: string;
        buttonContainer: string;
        button: string;
      };
      desktopDisplay: {
        desktopDisplay: string;
        row60: string;
        row40: string;
        column66: string;
        column40: string;
        column33: string;
        column20: string;
        image: string;
        richTextContent: string;
        buttonContainer: string;
        button: string;
      };
    };
  };
};

export const BouncyCardTheme = (
  mobileFullWidth = false,
  cardWidth = '',
  bounce = true,
  additionalButtonClassName = '',
  ctaAlwaysVisible = false,
  noBottomCTA = false
): ThemeFile | BouncyCardThemeType => {
  return {
    aw: {
      classes: {
        optionMain:
          `bouncyCard cursor-pointer option-main flex text-center hover:no-underline md:transition-all m-[10px_5px_10px_5px] md:m-[0_15px_40px_15px] ` +
          (mobileFullWidth ? ` max-md:w-full ` : ` `) +
          (cardWidth ? cardWidth : ` md:max-w-[360px] basis-[44%] md:basis-1/3 `),
        optionBtn:
          `option-btn group flex flex-col justify-between h-full w-full text-center hover:no-underline bg-white md:bg-white/80 md:hover:bg-white/90 md:outline-none md:transition-all md:shadow-[0px_0px_30px_1px_rgba(0,0,0,0.2)] ` +
          (bounce ? ' md:hover:scale-[1.1] ' : ' ') +
          additionalButtonClassName,
        optionTop: `option-top md:transition-all bg-white/0`,
        optionImgWrapper: `option-img-wrapper`,
        optionImage: `img [&_img]:m-auto`,
        optionHeading: `text-black text-[14px] font-normal leading-[1.2] mb-[15px] p-[15px_15px_0_15px] uppercase md:text-[22px]`,
        optionBottom:
          `option-bottom md:transition-all group-hover:visible ` +
          (ctaAlwaysVisible ? '' : ' md:invisible ') +
          (noBottomCTA ? ' hidden ' : ''),
        optionHelp: `option-help text-[14px] text-primary mb-[10px] p-[0_5px] md:mb-[20px] md:invisible group-hover:visible min-h-[1.5em]`,
        optionCta: `option-cta text-[16px] bg-primary md:bg-primary/50 group-hover:bg-primary text-white p-[10px] uppercase`,
        help: {
          helpContainer: `help-container w-full h-[calc(100%+210px)] left-0 absolute top-0 transition-[opacity_0.3s_ease] cursor-auto z-1002 `,
          helpOverlay: `w-full h-full absolute top-0 lg:h-auto bg-white/98 `,
          helpWrapper: `h-full max-w-full mx-auto`,
          helpContent: `w-[84%] h-full mx-auto relative py-[30px] overflow-hidden`,
          closeWrapper: `text-right absolute right-0 top-[5px] lg:top-[10px]`,
          closeButton: `text-primary hover:text-primary`,
          closeBUttonIcon: ``,
          mobileDisplay: {
            mobileDisplay: `mobile-display flex flex-col md:hidden h-[calc(100vh-210px)] max-w-full`,
            richTextContent: `shrink-0 mb-[20px] text-[18px] leading-normal font-light [&_strong]:font-bold text-left`,
            carousel: `flex grow shrink`,
            carouselImageWrapper: ``,
            carouselImage: ``,
            buttonContainer: `flex-[0_0_84px]`,
            button: `block text-center uppercase w-full p-[12px_16px] border-[1px_solid_primary] bg-primary hover:bg-darkprimary hover:border-[1px_solid_darkprimary] text-white`,
          },
          desktopDisplay: {
            desktopDisplay: `hidden md:flex flex-col h-full justify-between overflow-hidden `,
            row60: `flex justify-between h-[60%]`,
            row40: `flex justify-between h-[40%]`,
            column66: `flex flex-col justify-between m-[10px] overflow-hidden w-[66%]`,
            column40: `flex flex-col justify-between m-[10px] overflow-hidden w-[40%]`,
            column33: `flex flex-col justify-between m-[10px] overflow-hidden w-[33%]`,
            column20: `flex flex-col justify-between m-[10px] overflow-hidden w-[20%]`,
            image: `w-full h-full`,
            richTextContent: `shrink-0 text-[18px] leading-normal font-light [&_strong]:font-bold text-left`,
            buttonContainer: `shrink-0 m-[20px_0]`,
            button: `block text-center uppercase w-full p-[12px_16px] border-[1px_solid_primary] bg-primary hover:bg-darkprimary hover:border-[1px_solid_darkprimary] text-white`,
          },
        },
      },
    },
    rba: {
      classes: {},
    },
  };
};
