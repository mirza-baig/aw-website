import Component from 'helpers/Component/Component';
import Headline from 'helpers/Headline/Headline';
import { ComponentProps } from 'lib/component-props';
import { DataSource } from 'lib/types/data-source';
import { getClientComponentProps } from 'lib/utils/sitecore-utils/get-client-component-props';
import { getEnum } from 'lib/utils/sitecore-utils/get-enum';
import { getHeadingLevel } from 'lib/utils/sitecore-utils/get-heading-level';
import { withDatasourceCheck } from 'lib/utils/sitecore-utils/with-datasource-check';
import { getTheme } from 'lib/website/theme';
import { JSX } from 'react';

import { BackgroundColor, HeroSimpleTheme } from './helpers/HeroSimple.theme';
import { Sitecore } from '.sitecore/AndersenWindows.sitecore';

type HeroSimpleProps = ComponentProps & DataSource<Sitecore.Components.Hero.HeroSimple.HeroSimple>;

function HeroSimple_Default(props: HeroSimpleProps): JSX.Element | null {
  const { fields } = props;
  const backgroundColor = getEnum<BackgroundColor>(fields?.backgroundColor) ?? 'white';
  const themeData = getTheme(props.page.customProps.theme, HeroSimpleTheme(backgroundColor));
  const isEE = !props.page.mode.isNormal;

  // Always render in edit mode so Sitecore field editors appear
  if (!fields && !isEE) {
    return null;
  }

  return (
    <Component
      variant="full"
      backgroundVariant={backgroundColor}
      sectionWrapperClasses=""
      padding={'px-0'}
      dataComponent="general/herosimple"
      {...getClientComponentProps(props)}
    >
      <div className="col-span-12">
        <div className="px-m md:max-w-(--breakpoint-lg) lg:mx-auto">
          <Headline
            useTag={getHeadingLevel('h1', fields?.headlineLevel)}
            classes={themeData.classes.heroContainer}
            {...getClientComponentProps(props)}
          />
        </div>
      </div>
    </Component>
  );
}

export const Default = withDatasourceCheck(HeroSimple_Default);
