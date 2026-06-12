import { BannerType } from 'lib/website/sticky-banner';
import { useWebsiteContext } from 'lib/website/WebsiteContext';

// Custom hook to access the StickyBannerContext
export const useStickyBanner = () => {
  const { bannerList, dispatch } = useWebsiteContext();

  const addBanner = (banner: BannerType) => {
    dispatch(({ bannerList }) => {
      switch (banner.visibilityType) {
        case 'desktop':
          bannerList.desktopBannerList.push(banner);
          break;
        case 'mobile':
          bannerList.mobileBannerList.push(banner);
          break;
        default:
          bannerList.desktopBannerList.push(banner);
          bannerList.mobileBannerList.push(banner);
      }
      return { bannerList };
    });
  };

  const removeBanner = (banner: BannerType) => {
    const filterBanners = (bannerList: Array<BannerType>): Array<BannerType> =>
      bannerList.filter((item) => item.bannerId !== banner.bannerId);

    dispatch(({ bannerList }) => {
      switch (banner.visibilityType) {
        case 'desktop':
          bannerList.desktopBannerList = filterBanners(bannerList.desktopBannerList);
          break;
        case 'mobile':
          bannerList.mobileBannerList = filterBanners(bannerList.mobileBannerList);
          break;
        default:
          bannerList.desktopBannerList = filterBanners(bannerList.desktopBannerList);
          bannerList.mobileBannerList = filterBanners(bannerList.mobileBannerList);
      }
      return { bannerList };
    });
  };

  return {
    addBanner,
    removeBanner,
    bannerList,
  };
};

export type { BANNER_VISIBILITY_SETTING } from 'lib/website/sticky-banner';
