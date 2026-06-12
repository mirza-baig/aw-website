import { CSSProperties, JSX } from 'react';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type FacebookProps = Sitecore.Elements.Media.FacebookVideo;

const FacebookWrapper = (videoItem: FacebookProps): JSX.Element => {
  // If the video has no value, return nothing - not sure if videoId is the best way to check this currently
  if (!videoItem?.fields?.videoId) {
    return <></>;
  }

  const container: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    paddingTop: '56.25%',
  };

  const iframestyle: CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    width: '100%',
    height: '100%',
  };

  const {
    videoHeight,
    videoWidth,
    videoId,
    // videoLazyLoad, // @TODO: implement this
    //facebookAutoPlay, // Not working currently
    facebookShowCaptions, // This can be controlled by the video author
    facebookShowText,
  } = videoItem.fields;

  // Note the URL parameter separators in this URL
  const videoUrl = `https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D${videoId.value}%26ref%3Dsharing&width=${videoWidth.value}&show_text=${facebookShowText.value}&height=${videoHeight.value}&show_captions=${facebookShowCaptions.value}&appId`;

  return (
    <div style={container}>
      <iframe
        style={iframestyle}
        src={videoUrl}
        width={videoWidth.value}
        height={videoHeight.value}
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      ></iframe>
    </div>
  );
};

export default FacebookWrapper;
