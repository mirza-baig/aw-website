// Global
import { LinkField } from '@sitecore-content-sdk/nextjs';
import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Button from 'helpers/Button/Button';
import { Caption } from 'helpers/Caption';
import { Eyebrow } from 'helpers/Eyebrow';
// Components
import Headline from 'helpers/Headline/Headline';
import ImagePrimary from 'helpers/Media/ImagePrimary';
import { Subheadline } from 'helpers/Subheadline';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';

import { Sitecore } from '.sitecore/AndersenWindows.model';

export type PromoProps = Sitecore.Components.Tabs.TabsFeaturedPromo.TabContent & {
  classes: { [key: string]: string };
};

const Promo = (props: PromoProps) => {
  const { fields, classes } = props;

  const { themeName } = useTheme();

  if (!fields) {
    return null;
  }

  return (
    <div
      className={classNames(
        themeName === 'rba' && getEnum(fields.backgroundColor) === 'black'
          ? 'theme-black'
          : 'theme-gray',
        classes.promoContainer
      )}
    >
      <div className={classes.promoImageWrapper}>
        <ImagePrimary hideCaption={true} {...props} />
        {themeName === 'rba' && fields.primaryImageCaption.value && (
          <div className={classes.promoImageCaptionWrapper}>
            <div className={classes.promoImageCaption}>
              <Caption italic={false} isImageCaption={false} caption={fields.primaryImageCaption} />
            </div>
          </div>
        )}
      </div>
      <div className={classes.promoContentWrapper}>
        {themeName === 'rba' && <Eyebrow classes={classes.promoEyebrow} fields={fields} />}
        <Headline classes={classes.promoHeadline} fields={fields} />
        <Subheadline classes={classes.promoSubheadline} fields={fields} />
        <BodyCopy classes={classes.promoBody} fields={fields} />
        <Button
          field={fields?.cta1Link as LinkField | undefined}
          variant={fields?.cta1Style}
          icon={fields?.cta1Icon}
          classes=""
        />
        {fields?.cta2Link ? (
          <Button
            field={fields?.cta2Link as LinkField | undefined}
            variant={fields?.cta2Style}
            icon={fields?.cta2Icon}
            classes="mt-[16px]"
          />
        ) : null}
      </div>
    </div>
  );
};

export default Promo;
