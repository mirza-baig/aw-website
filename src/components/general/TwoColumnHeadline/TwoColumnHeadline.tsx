'use client';

import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { Subheadline } from 'helpers/Subheadline';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';

import { TwoColumnHeadlineTheme } from './helpers/TwoColumnHeadline.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type TwoColumnHeadlineProps = ComponentProps &
  Sitecore.Components.General.TwoColumnHeadline.TwoColumnHeadline;

function TwoColumnHeadline_Default(props: TwoColumnHeadlineProps) {
  const { themeData } = useTheme(TwoColumnHeadlineTheme);

  if (!props.fields) {
    return null;
  }

  return (
    <Component variant="lg" dataComponent="general/twocolumnheadline" {...props}>
      <div className="col-span-12 md:col-span-6">
        <Headline classes={themeData.classes.headlineClass} {...props} />
      </div>
      <div className="col-span-12 md:col-span-6">
        <Subheadline
          classes={classNames(themeData.classes.subheadlineClass, {
            'mb-s': !props.fields?.body?.value,
          })}
          {...props}
        />
        <BodyCopy classes={themeData.classes.bodyClass} {...props} />
        <ButtonGroup
          cta1={cta1ToButtonProps(props, themeData.classes.buttonGroupClass.cta1Classes)}
          cta2={cta2ToButtonProps(props, themeData.classes.buttonGroupClass.cta2Classes)}
          wrapperClasses={themeData.classes.buttonGroupClass.wrapper}
        />
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(TwoColumnHeadline_Default);
