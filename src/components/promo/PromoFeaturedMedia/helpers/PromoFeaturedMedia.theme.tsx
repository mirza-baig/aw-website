import classNames from 'classnames';
import { ThemeFile } from 'lib/context/ThemeContext';

export const PromoFeaturedMediaTheme: ThemeFile = {
  aw: {
    classes: {
      imageDivClass: 'order-first col-span-12',
      containerClass: 'col-span-12 flex flex-col lg:flex-row',
      leftContainerClass:
        'my-auto mx-l mt-0 flex flex-col pt-s pb-xs lg:mx-xl lg:mr-xxl lg:w-3/4 lg:pb-s lg:pr-xl',
      leftContainerClassNoHighlights: 'my-auto mx-l mt-0 flex flex-col pt-s pb-xs',
      subheadlineContainerClass: '',
      subheadlineClass: 'text-theme-text text-small uppercase font-heavy mb-2',
      captionClass: 'text-theme-body mb-6',
      headlineClass: 'text-theme-text text-sm-xs lg:text-xs font-medium mb-2',
      bodyClass: 'text-theme-body mb-3',
      buttonGroupClass: {
        wrapper: classNames(
          'col-span-12',
          'flex',
          'flex-col',
          'lg:flex-row',
          'items-start',
          'text-xs',
          'font-heavy'
        ),
        cta1Classes: classNames('lg:mr-3 lg:first:ml-0 lg:last:mr-0', 'bg-theme-bg'),
        cta2Classes: '',
      },
      rightContainerClass: 'lg:w-1/4 mx-l lg:mx-0 pb-xs lg:pb-0',
      rightPaddingClass: '',
      highlightGroupClass: 'my-auto mt-0 flex flex-col px-l pl-0 lg:pt-s lg:pr-xl pb-0',
      highlightContainerClass: '',
      highlightTitleClass:
        'text-theme-text text-small uppercase font-heavy font-sans py-2 border-gray border-t',
      highlightDescriptionClass: 'text-theme-body text-small mb-s',
    },
  },
  rba: {
    classes: {
      imageDivClass: 'order-first col-span-12',
      containerClass: 'col-span-12 flex flex-col lg:flex-row',
      leftContainerClass:
        'col-span-6 lg:w-1/2 my-auto mt-0 ml-l lg:ml-xl mr-m lg:mr-l flex flex-col py-s pt-xxs',
      leftContainerClassNoHighlights:
        'my-auto mt-0 ml-l lg:ml-xl mr-m lg:mr-l flex flex-col py-s pt-xxs',
      subheadlineContainerClass:
        'flex flex-row before:bg-theme-btn-bg-hover mb-5 before:block before:self-center before:mr-1 before:h-5 before:w-1',
      subheadlineClass:
        'text-theme-text text-small uppercase font-bold font-serif! self-center mr-2',
      captionClass: 'text-theme-body',
      headlineClass: 'text-theme-text text-xs font-bold font-sans lg:font-serif! mb-2',
      bodyClass: 'text-theme-body',
      buttonGroupClass: {
        wrapper: classNames(
          'col-span-6',
          'flex',
          'flex-col',
          'lg:flex-row',
          'items-start',
          'text-xs',
          'font-heavy',
          'mt-4'
        ),
        cta1Classes: classNames('lg:mr-3 lg:first:ml-0 lg:last:mr-0', 'bg-theme-bg'),
        cta2Classes: 'my-s md:my-0',
      },
      rightContainerClass: 'col-span-6 lg:w-1/2',
      rightPaddingClass: 'lg:pt-ml lg:pb-ml',
      highlightGroupClass:
        'my-auto mb-3 lg:mb-auto ml-l lg:ml-s mr-m lg:mr-xl flex flex-col lg:flex-row justify-end',
      highlightContainerClass: 'mr-s lg:w-1/3 mb-xs lg:mt-xs',
      highlightTitleClass:
        'text-theme-body text-small font-heavy uppercase before:bg-theme-btn-bg-hover before:block before:mb-2 before:h-1 before:w-5',
      highlightDescriptionClass: 'text-theme-text font-bold',
    },
  },
};
