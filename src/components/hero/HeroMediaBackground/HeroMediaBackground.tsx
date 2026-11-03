import classNames from 'classnames';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import { Eyebrow } from 'helpers/Eyebrow';
import Headline from 'helpers/Headline/Headline';
import RichTextWrapper from 'helpers/RichTextWrapper/RichTextWrapper';
import { getClientComponentProps } from 'lib/utils/sitecore-utils/get-client-component-props';
import { getEnum } from 'lib/utils/sitecore-utils/get-enum';
import { getHeadingLevel } from 'lib/utils/sitecore-utils/get-heading-level';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { getTheme } from 'lib/website/theme';

import { HeroMediaBackgroundTheme } from './helpers/HeroMediaBackground.theme';
import { MediaClient } from './helpers/MediaClient';
import { HeroMediaBackgroundProps } from './helpers/types';
import { getField } from './helpers/utils';
import { WrapperClient } from './helpers/WrapperClient';

function HeroMediaBackground_Default(props: HeroMediaBackgroundProps) {
  const { fields } = props;
  const themeData = getTheme(props.page.customProps.theme, HeroMediaBackgroundTheme);
  const isEE = !props.page.mode.isNormal;

  if (!fields && !isEE) {
    return null;
  }

  const hasOverlay = !!getEnum(fields?.overlay);
  let fontColorClass = '';

  if (hasOverlay) {
    fontColorClass = 'md:text-white';
  } else {
    switch (getEnum(fields?.fontColor)) {
      case 'gray':
        fontColorClass = 'md:text-dark-gray';
        break;
      case 'white':
        fontColorClass = 'md:text-white';
        break;
      default:
        fontColorClass = 'md:text-black';
        break;
    }
  }

  return (
    <WrapperClient {...getClientComponentProps(props)}>
      <MediaClient {...getClientComponentProps(props)} />

      <div className={classNames(themeData.classes.contentWrapper, fontColorClass)}>
        <div className={classNames(themeData.classes.contentContainer, fontColorClass)}>
          <Eyebrow
            classes={classNames(themeData.classes.eyebrow, fontColorClass)}
            {...getClientComponentProps(props)}
          />

          <Headline
            useTag={getHeadingLevel('h1', fields?.headlineLevel)}
            classes={classNames(themeData.classes.headline, fontColorClass)}
            {...getClientComponentProps(props)}
          />

          <RichTextWrapper
            classes={classNames(themeData.classes.bodyClass, fontColorClass)}
            field={getField(fields, 'body', { value: '' })}
          />

          {fields?.cta1Link && (
            <ButtonGroup
              cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
              cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
              wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
            />
          )}
        </div>
      </div>
    </WrapperClient>
  );
}

export const Default = withDatasourceCheck(HeroMediaBackground_Default);
