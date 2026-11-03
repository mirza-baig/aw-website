import classNames from 'classnames';
import BodyCopy from 'helpers/BodyCopy/BodyCopy';
import { cta1ToButtonProps, cta2ToButtonProps } from 'helpers/Button/Utils';
import ButtonGroup from 'helpers/ButtonGroup/ButtonGroup';
import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { Subheadline } from 'helpers/Subheadline';
import { ComponentProps } from 'lib/component-props';
import { DataSource } from 'lib/types/data-source';
import { getClientComponentProps } from 'lib/utils/sitecore-utils/get-client-component-props';
import { getHeadingLevel } from 'lib/utils/sitecore-utils/get-heading-level';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { getTheme } from 'lib/website/theme';
import { JSX } from 'react';

import { HeroTwoColumnTheme } from './helpers/HeroTwoColumn.theme';
import { Sitecore } from '.sitecore/AndersenWindows.sitecore';

type HeroTwoColumnProps = ComponentProps &
  DataSource<Sitecore.Components.Hero.HeroTwoColumn.HeroTwoColumn>;

function HeroTwoColumn_Default(props: HeroTwoColumnProps): JSX.Element | null {
  const themeData = getTheme(props.page.customProps.theme, HeroTwoColumnTheme);
  const isEE = !props.page.mode.isNormal;

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
      {...getClientComponentProps(props)}
    >
      <div className="col-span-12 md:col-span-6">
        <Headline
          useTag={getHeadingLevel('h1', props.fields?.headlineLevel)}
          classes={themeData.classes.headlineClass}
          {...getClientComponentProps(props)}
        />
      </div>
      <div className="col-span-12 md:col-span-6">
        <Subheadline
          useTag="h2"
          classes={classNames(themeData.classes.subheadlineClass, {
            'mb-s': !props.fields?.body?.value,
          })}
          {...getClientComponentProps(props)}
        />
        <BodyCopy classes={themeData.classes.bodyClass} {...getClientComponentProps(props)} />
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
