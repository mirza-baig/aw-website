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
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { JSX, ReactNode } from 'react';

import { HeroTwoColumnTheme } from './HeroTwoColumn.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeroTwoColumnClientProps = ComponentProps &
  Sitecore.Components.Hero.HeroTwoColumn.HeroTwoColumn & {
    leftPlaceholder?: ReactNode;
    rightPlaceholder?: ReactNode;
  };

export function HeroTwoColumnClient(props: HeroTwoColumnClientProps): JSX.Element {
  const { themeData } = useTheme(HeroTwoColumnTheme);

  return (
    <Component
      variant="lg"
      backgroundVariant=""
      sectionWrapperClasses=""
      dataComponent="hero/herotwocolumn"
      {...props}
    >
      <div className="col-span-12 md:col-span-6">
        <Headline
          useTag={getHeadingLevel('h1', props.fields?.headlineLevel)}
          classes={themeData.classes.headlineClass}
          {...props}
        />
        {props.leftPlaceholder}
      </div>
      <div className="col-span-12 md:col-span-6">
        <Subheadline
          useTag="h2"
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
        {props.rightPlaceholder}
      </div>
    </Component>
  );
}
