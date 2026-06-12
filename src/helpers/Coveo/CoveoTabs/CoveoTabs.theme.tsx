export const CoveoTabsTheme = {
  aw: {
    classes: {},
  },
  rba: {
    classes: {
      tabsContainer: 'col-span-12 relative',
      tabsList:
        'no-scrollbar flex text-body md:text-xs md:font-bold text-light-black border-b border-gray mx-[calc(50%-50vw)] md:mx-0 pl-m md:pl-0 overflow-x-auto [&_li:nth-last-child(2)]:before:hidden!',
      tab: 'w-[100px] min-w-[100px] md:min-w-[200px] md:w-[200px] py-[9px] px-[14px] md:relative before:hidden md:before:inline-block before:absolute before:content-[""] before:top-1/2 before:-translate-y-1/2 before:left-full before:w-px before:h-[calc(100%-8px)] before:bg-gray flex items-center',
      activeTab: 'bg-black text-white! font-bold',
      tabButton: 'w-full',
      tabButtonTextWrapper: 'text-center pb-[2px] wrap-break-word',
      activeTabButtonTextWrapper: 'inline-block border-b-3 border-primary',
      arrows:
        'absolute top-1/2 -translate-y-1/2 text-black cursor-pointer hidden h-full items-center w-[59px] z-10',
      leftArrow: '-left-m md:left-0 bg-linear-to-r from-white',
      rightArrow: '-right-m md:right-0 bg-linear-to-l from-white',
    },
  },
};
