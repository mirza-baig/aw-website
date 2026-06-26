'use client';

import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { ComponentProps } from 'lib/component-props';
import { useTheme } from 'lib/context/ThemeContext';
import { getEnum } from 'lib/utils/get-enum';
import { getHeadingLevel } from 'lib/utils/get-heading-level';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import useExperienceEditor from 'lib/utils/use-experience-editor';
import { JSX } from 'react';

import { BackgroundColor, HeroSimpleTheme } from './helpers/HeroSimple.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeroSimpleProps = ComponentProps & Sitecore.Components.Hero.HeroSimple.HeroSimple;

function HeroSimple_Default(props: HeroSimpleProps): JSX.Element {
  const { fields } = props;
  const backgroundColor = getEnum<BackgroundColor>(fields?.backgroundColor) ?? 'white';
  const { themeData } = useTheme(HeroSimpleTheme(backgroundColor));
  const isEE = useExperienceEditor();

  // Always render in edit mode so Sitecore field editors appear
  if (!fields && !isEE) {
    return <></>;
  }

  return (
    <Component
      variant="full"
      backgroundVariant={backgroundColor}
      sectionWrapperClasses=""
      padding={'px-0'}
      dataComponent="general/herosimple"
      {...props}
    >
      <div className="col-span-12">
        <div className="px-m md:max-w-(--breakpoint-lg) lg:mx-auto">
          <Headline
            useTag={getHeadingLevel('h1', fields?.headlineLevel)}
            classes={themeData.classes.heroContainer}
            {...props}
          />
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(HeroSimple_Default);
