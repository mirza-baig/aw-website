// Global
import classNames from 'classnames';
import { DesignToolContext } from 'components/tool/DesignTool/helpers/DesignToolContext.helper';
import Spinner from 'helpers/Spinner/Spinner';
import React, { JSX, useCallback, useEffect, useState } from 'react';

export type PreviewImageTheme = {
  classes: {
    loaderWrapper: string;
    loader: string;
  };
};

export type PreviewImageProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  theme: PreviewImageTheme;
  isBrandHWCloseupImage?: boolean;
};

export const PreviewImage = (props: PreviewImageProps): JSX.Element => {
  const { theme, ...rest } = props;

  const src = rest.src ?? '';
  const isCloseupImage = rest.isBrandHWCloseupImage ?? false;
  const [isLoading, setIsLoading] = useState(true);
  const { previewImage, setPreviewImage } = React.useContext(DesignToolContext);

  useEffect(() => {
    if (setPreviewImage) {
      setPreviewImage(true);
    }
    setIsLoading(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const onCompleteHandler = useCallback(() => {
    setIsLoading(false);
    if (setPreviewImage) {
      setPreviewImage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPreviewImage, previewImage]);

  return (
    <>
      <div
        className={classNames(
          'relative aspect-picture',
          rest.className,
          isCloseupImage ? 'overflow-hidden ' : ''
        )}
        style={{ opacity: isLoading ? '0.3' : '1' }}
      >
        {/* Do not use NextImage for Renoworks images */}
        <img
          onLoad={onCompleteHandler}
          src={src}
          alt={rest.alt}
          width={485}
          height={500}
          loading="lazy"
          className={
            isCloseupImage
              ? 'h-full max-h-[500px] scale-[3.40] object-contain md:scale-[2.75]'
              : 'h-full max-h-[500px] object-contain'
          }
        ></img>
      </div>
      <div className={theme.classes.loaderWrapper}>
        {isLoading && (
          <div className={theme.classes.loader}>
            <Spinner size={56} />
          </div>
        )}
      </div>
    </>
  );
};
