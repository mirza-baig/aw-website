'use client';

import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { JSX } from 'react';

import { ToggleBannerTheme } from './helpers/ToggleBanner.theme';
import HelperButton from './helpers/ToggleBannerHelper';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type ToggleBannerProps = ComponentProps & Sitecore.Components.General.ToggleBanner.ToggleBanner;

function ToggleBanner_Default(props: ToggleBannerProps): JSX.Element {
  const headlineLevel = getEnum<string>(props.fields?.headlineLevel);
  const LeftButton = {
    ...props?.fields?.LeftToggleLink,
    value: { ...props?.fields?.LeftToggleLink?.value, text: props?.fields?.LeftToggleText?.value },
  };
  const RightButton = {
    ...props?.fields?.RightToggleLink,
    value: {
      ...props?.fields?.RightToggleLink?.value,
      text: props?.fields?.RightToggleText?.value,
    },
  };
  const { themeData } = useTheme(ToggleBannerTheme);
  const containerWidth =
    getEnum<'fullBleed' | 'fullWidth'>(props.fields?.containerWidth) ?? 'fullWidth';
  const defaultHover = getEnum<string>(props.fields?.ToggleChkSelection) === 'rightToggle' ? 2 : 1;

  const iconReverse = defaultHover === 1 ? 'flex-row-reverse' : '';
  return (
    <Component
      dataComponent="general/togglebanner"
      variant="lg"
      sectionWrapperClasses={containerWidth === 'fullBleed' ? 'bg-primary' : ''}
      gap="gap-x-0"
      padding="px-0"
      backgroundVariant="primary"
      grid="section-grid grid grid-cols-2 md:grid-cols-12 bg-primary"
      {...props}
    >
      <div className={themeData.classes.mainWrapper}>
        <div className={themeData.classes.headlineWrapper}>
          <Headline useTag={headlineLevel} {...props} />
          <BodyCopy {...props} />
        </div>
        <div className={themeData.classes.buttonWrappers}>
          <HelperButton
            icon={
              defaultHover === 2
                ? { fields: { Value: { value: 'checkround' } }, name: 'checkround' }
                : props?.fields?.RightToggleIcon
            }
            field={RightButton}
            classes={classNames(
              themeData.classes.buttonRightClass,
              themeData.classes.buttonHoverClass
            )}
          />
          <HelperButton
            icon={
              defaultHover === 1
                ? { fields: { Value: { value: 'checkround' } }, name: 'checkround' }
                : props?.fields?.LeftToggleIcon
            }
            classes={classNames(
              `-order-1 flex relative gap-2 pl-0 text-center ${iconReverse}`,
              themeData.classes.buttonLeftClass
            )}
            field={LeftButton}
          />
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(ToggleBanner_Default);
