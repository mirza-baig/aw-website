'use client';

import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Component from 'helpers/Component/Component';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import MediaPrimary from 'helpers/Media/MediaPrimary/MediaPrimary';
import { MediaPrimaryStaticProps } from 'helpers/Media/types';
import SwatchCollection, {
  LayoutStyles,
  SwatchCollectionProps,
} from 'helpers/SwatchCollection/SwatchCollection';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { JSX } from 'react';

import { PromoSwatchesTheme } from './PromoSwatches.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type PromoSwatchesProps = Sitecore.Components.Promo.PromoSwatches.PromoSwatches & {
  fields?: {
    children: SwatchCollectionProps[];
  };
} & MediaPrimaryStaticProps;

export function PromoSwatchesClient(props: PromoSwatchesProps): JSX.Element {
  const fields = props.fields;
  const propFields = fields?.data?.item ? fields?.fields : fields;
  const layoutStyle = getEnum<LayoutStyles>(propFields?.layoutStyle) ?? 'side-by-side';
  const { themeData, themeName } = useTheme(PromoSwatchesTheme(layoutStyle));

  let contentColumn;
  let imageColumn;

  switch (layoutStyle) {
    case 'side-by-side':
      contentColumn = 'col-span-12 ml:col-span-6 order-last ml:order-first';
      imageColumn = 'col-span-12 ml:col-span-6';
      break;

    case 'full-width':
      contentColumn = 'col-span-12 order-last';
      imageColumn = 'col-span-12';
      break;
  }

  return (
    <Component
      variant="lg"
      gap={classNames(
        themeName === 'aw' ? 'gap-y-s ml:gap-y-m gap-x-s' : 'gap-y-m ml:gap-y-ml gap-x-s'
      )}
      dataComponent="promo/promoswatches"
      {...props}
      fields={propFields}
    >
      <div className={contentColumn}>
        <Eyebrow {...props} fields={propFields} classes={themeData.classes.eyebrow} />
        <Headline {...props} fields={propFields} classes={themeData.classes.headline} />
        <BodyCopy {...props} fields={propFields} classes={themeData.classes.bodycopy} />
        {propFields?.children?.map((swatchCollection: SwatchCollectionProps, index: number) => {
          return <SwatchCollection {...swatchCollection} key={'swatchcollection-' + index} />;
        })}
      </div>
      <div className={imageColumn}>
        <MediaPrimary {...props} fields={propFields} staticProps={props?.mediaPrimary} />
      </div>
    </Component>
  );
}
