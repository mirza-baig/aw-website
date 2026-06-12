export type BANNER_VISIBILITY_SETTING = 'desktop-mobile' | 'desktop' | 'mobile';

export type BannerType = {
  bannerId: string;
  visibilityType: BANNER_VISIBILITY_SETTING;
};

export type BannerList = {
  mobileBannerList: Array<BannerType>;
  desktopBannerList: Array<BannerType>;
};

export type StickyBannerState = {
  bannerList: BannerList;
};
