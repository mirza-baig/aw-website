/**
 * The layout behavior of the image as the viewport changes size.
 */
export type LayoutValue = 'fill' | 'responsive' | 'intrinsic' | undefined;

/**
 * The focus area of the image when layout is 'fill'.
 */
export type FocusAreaValue =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'center'
  | 'left top'
  | 'right top'
  | 'left bottom'
  | 'right bottom'
  | undefined;

export type RatioTypes =
  | 'hero'
  | 'video'
  | 'picture'
  | 'snapshot'
  | 'square'
  | 'portrait'
  | 'auto'
  | undefined;

export type maxwTypes =
  | 'max-w-lg'
  | 'max-w-xl'
  | 'max-w-2xl'
  | 'max-w-3xl'
  | 'max-w-4xl'
  | 'max-w-5xl'
  | 'max-w-6xl'
  | 'max-w-7xl'
  | 'max-w-[543px]'
  | 'max-w-[592px]'
  | 'w-full'
  | ''
  | undefined;

export type maxhTypes =
  | 'max-h-96'
  | 'max-h-80'
  | 'max-h-72'
  | 'max-h-64'
  | 'max-h-60'
  | 'max-h-56'
  | 'max-h-[543px]'
  | 'max-h-[592px]'
  | 'h-full'
  | ''
  | undefined;

export type MediaStaticProps = {
  videoStaticProps?: VideoStaticProps;
};

export type VideoStaticProps = {
  vimeoStaticProps?: VimeoVideoStaticProps;
};

export type VimeoVideoStaticProps = {
  videoThumbnailUrl?: string;
};

export type MediaPrimaryStaticProps = {
  mediaPrimary?: MediaStaticProps;
};

export type MediaSecondaryStaticProps = {
  mediaSecondary?: MediaStaticProps;
};

export type MediaPrimaryStaticPropsArray = {
  mediaPrimary: MediaSecondaryStaticPropsWithId[];
};

export type MediaSecondaryStaticPropsWithId = {
  mediaPrimary?: MediaStaticProps;
  videoId?: string;
};
