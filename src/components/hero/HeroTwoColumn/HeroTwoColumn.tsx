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
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import useExperienceEditor from 'lib/utils/use-experience-editor';

import { HeroTwoColumnTheme } from './helpers/HeroTwoColumn.theme';
import { Sitecore } from '.sitecore/AndersenWindows.model';

type HeroTwoColumnProps = ComponentProps & Sitecore.Components.Hero.HeroTwoColumn.HeroTwoColumn;

function HeroTwoColumn_Default(props: HeroTwoColumnProps) {
  const { themeData } = useTheme(HeroTwoColumnTheme);
  const isEE = useExperienceEditor();

  // Always render in edit mode so Sitecore field editors appear
  if (!props.fields && !isEE) {
    return null;
  }

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
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(HeroTwoColumn_Default);
