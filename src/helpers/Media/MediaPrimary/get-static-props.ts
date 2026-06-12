import { MediaStaticProps } from '../types';
import { getStaticPropsFromVideoItem as getVideoStaticProps } from '../Video/get-static-props';
import { isVideoItem } from '../VideoUtils';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type MediaPrimaryProps = Sitecore.FieldSets.ImagePrimary &
  Sitecore.FieldSets.ImagePrimaryCaption &
  Sitecore.FieldSets.VideoPrimary;

export async function getStaticProps(props: MediaPrimaryProps): Promise<MediaStaticProps> {
  const result: MediaStaticProps = {};

  if (props.fields?.primaryVideo && isVideoItem(props.fields.primaryVideo)) {
    result.videoStaticProps = await getVideoStaticProps(props.fields?.primaryVideo);
  }

  return result;
}
