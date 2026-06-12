// Lib
import { ThemeFile } from 'lib/context/ThemeContext';

const baseSideScrollStyle = {
  videoCardsList: {
    videoCardsListWrapper:
      'col-span-12 md:[&_.slick-slide]:mr-s md:[&_.slick-slide:last-child]:mr-0',
    videoDetailsWrapper:
      'flex flex-col justify-start cursor-pointer md:m-xxs h-full md:h-[calc(100%-16px)]',
    selectedVideo: 'md:ring-[3px] ring-offset-4 ring-primary',
    thumbnail: 'h-[calc((100vw-48px)/1.778)] md:h-auto',
    videoDescriptionWrapper: 'flex-1 border-b border-gray pb-xxxs',
    eyebrow: 'text-xxs font-bold mt-s mb-xxs uppercase',
    headline: 'font-serif! md:font-sans! text-xs md:text-s font-heavy md:font-medium mb-xxs',
    body: 'text-body text-dark-gray',
  },
  videoPlayer: {
    videoDescriptionWrapper: 'flex flex-col h-full justify-center',
    eyebrow: 'text-xxs font-bold mb-xxs uppercase',
    headline: 'text-s font-medium mb-xxs',
    body: 'text-body text-dark-gray mb-xxs',
  },
};

const minimalSidesSrollStyle = {
  headlineText: 'text-sm-m ml:text-l font-extra-light',
  videoPlayer: {
    videoWrapper: 'col-span-12 ml:col-span-8 px-xxs ml:px-m mt-xxs ml:mt-0 mb-s ml:mb-s',
    videoDetailsWrapper: 'col-span-12 ml:col-span-4 px-xxs ml:px-m',
    ...baseSideScrollStyle.videoPlayer,
  },
  videoCardsList: baseSideScrollStyle.videoCardsList,
};

export const VideoListingTheme: ThemeFile = {
  aw: {
    classes: {
      layouts: {
        list: {
          headlineText: 'text-sm-m ml:text-l font-extra-light',
          videoPlayer: {
            videoWrapper: 'col-span-12 md:col-span-8 px-xxs md:px-0 mt-xxs md:mt-0 mb-s md:mb-0',
            videoDetailsWrapper: 'col-span-12 md:col-span-4 px-xxs md:px-0',
            videoDescriptionWrapper: 'flex flex-col h-full justify-center',
            eyebrow: 'text-xxs font-bold mb-xxs uppercase',
            headline: 'text-s font-medium mb-xxs',
            body: 'text-body text-dark-gray mb-s',
          },
          videoCardsList: {
            videoCardsListWrapper: 'col-span-12',
            videoDetailsWrapper:
              'flex flex-row md:items-center py-s md:pl-s cursor-pointer first:border-t border-b border-gray',
            selectedVideo:
              'relative before:hidden md:before:block before:absolute before:w-full before:h-full before:border-3 before:border-primary before:top-0 before:left-0 md:border-none',
            thumbnail: 'w-[96px] h-[96px] md:w-[250px] md:h-[140px]',
            videoDescriptionWrapper: 'pl-s md:pl-m md:w-full',
            eyebrow: 'text-xxs font-bold mb-xxs uppercase',
            headline: 'font-serif! text-xs font-heavy mb-xxs',
            body: 'text-body text-dark-gray line-clamp-2 md:line-clamp-none',
          },
          pagination: {
            paginationWrapper: 'col-span-12 flex items-center justify-center md:justify-end',
            pageNumber: 'px-xs cursor-pointer text-dark-gray text-body',
            activePageNumber: 'text-black! font-bold',
            navigationArrows: 'cursor-pointer disabled:cursor-not-allowed',
            nextArrow: 'ml-s',
            previousArrow: 'mr-s',
          },
        },
        playlist: {
          headlineText: 'text-sm-m ml:text-l font-extra-light',
          videoPlayer: {
            videoWrapper: 'col-span-5 max-h-[306px] my-auto',
            videoDetailsWrapper: 'col-span-4 max-h-[306px]',
            videoDescriptionWrapper: 'flex flex-col h-full justify-center',
            eyebrow: 'text-xxs font-bold mb-xxs uppercase',
            headline: 'text-s font-medium mb-xxs',
            body: 'text-body text-dark-gray mb-xxs',
          },
          videoCardsList: {
            videoCardsListWrapper:
              'col-span-3 row-start-3 col-start-10 -mt-[16px] -mb-[16px] max-h-[306px] overflow-y-scroll aw-scrollbar',
            videoDetailsWrapper:
              'flex flex-row ml:items-center justify-center p-xxs pr-0 cursor-pointer last:border-none border-b border-gray',
            selectedVideo:
              'relative before:absolute before:w-full before:h-full before:border-3 before:border-primary before:top-0 before:left-0 border-none',
            thumbnail: 'w-[86px] h-[86px]',
            videoDescriptionWrapper: 'pl-s w-full',
            eyebrow: 'text-xxs font-bold mb-xxs uppercase',
            headline: 'font-serif! text-xs font-heavy mb-xxs',
            body: 'text-body text-dark-gray',
          },
        },
        sidescroll: {
          headlineText: 'text-sm-m ml:text-l font-extra-light',
          videoPlayer: {
            videoWrapper: 'col-span-12 ml:col-span-8 px-xxs ml:px-0 mt-xxs ml:mt-0 mb-s ml:mb-0',
            videoDetailsWrapper: 'col-span-12 ml:col-span-4 px-xxs ml:px-0',
            ...baseSideScrollStyle.videoPlayer,
          },
          videoCardsList: baseSideScrollStyle.videoCardsList,
        },
        sidescrollwithoutvideo: minimalSidesSrollStyle,
        sidescrollwithoutvideoandfield: minimalSidesSrollStyle,
      },
    },
  },
  rba: {
    classes: {
      layouts: {
        list: {},
        playlist: {},
        sidescroll: {},
        sidescrollwithoutvideo: {},
        sidescrollwithoutvideoandfield: {},
      },
    },
  },
};
